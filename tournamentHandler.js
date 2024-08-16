const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import all relevant consts from the consts file
const consts = require('./consts')
const GAME_CONFIGURATIONS = consts.GAME_CONFIGURATIONS;

// // Returns the player with the highest rating
exports.getWinningPlayer = function getWinningPlayer(playersRatings) {
  let maxKey = '';
  let maxValue = -Infinity;

  for (const [key, value] of Object.entries(PLAYER_RATINGS)) {
    if (value > maxValue) {
      maxKey = key;
      maxValue = value;
    }
  }

  return { playerName: maxKey, rating: maxValue }
}

// // Returns the table of the player ratings
// exports.getPlayerRatings = function getPlayerRatings() {
//   return PLAYER_RATINGS
// }

// Goes over all relevant games and allocates the ratings to each player
exports.allocateScoresToPlayers = function allocateScoresToPlayers(gameData, PLAYER_RATINGS) {
  console.log(gameData)
  const gameTitle = gameData.gameTitle

  function isPlayerOnWinningTeam(team, teamScores) {
    const otherTeamScore = Object.values(teamScores).reduce((max, score) => Math.max(max, score), 0);
    return teamScores[team] > otherTeamScore;
  }

  function calculateTeamScores() {
    const teamScores = {
    }
    const { playersData } = gameData;
    for (const playerName in playersData) {
      const player = playersData[playerName];
      // Insert player into ratings map
      if (!(playerName in PLAYER_RATINGS)) {
        PLAYER_RATINGS[playerName] = 0;
      }
      // Insert team into teamScores map
      if(!(player.playerTeam in teamScores)){
        teamScores[player.playerTeam] = 0
      }
      console.log(teamScores)
      teamScores[player.playerTeam] += GAME_CONFIGURATIONS[gameTitle].handleIncrementTeamScore(player)
    }
    return teamScores
  }

  function calculateAllPlayerRatings(teamScores, playersRatings) {
    const { playersData } = gameData;
  
    for (const playerName in playersData) {
      const player = playersData[playerName];
      const playerRating = GAME_CONFIGURATIONS[gameTitle].handleCalculatePlayerRating(player);
      if(isPlayerOnWinningTeam(player.playerTeam, teamScores)){
        playersRatings[playerName] += GAME_CONFIGURATIONS.generalRatingCalculation['team_win'];
      }
      playersRatings[playerName] += playerRating;
    }
    return playersRatings
  }

  const teamScores = calculateTeamScores()
  console.log(teamScores)
  playersRatings = calculateAllPlayerRatings(teamScores, PLAYER_RATINGS)

  return playersRatings

}

// Reads the data from CSV files
exports.readData = async function readData() {
  const currentDirectory = __dirname;
  const files = fs.readdirSync(currentDirectory);
  const csvFiles = files.filter(file => path.extname(file) === '.csv');

  const dataArray = [];

  for (const file of csvFiles) {
    const filePath = path.join(currentDirectory, file);
    const fileData = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      fileData.push(line.split(';'));
    }

    rl.close();
    dataArray.push(fileData);
  }

  return dataArray;
}

// Parses the data gotten from the CSV files
exports.parseData = function parseData(data) {
  const dataIsValid = validateData(data)
  if (!dataIsValid) {
    return false
  }

  return transformData(data)
}

function transformData(data) {
  const gameTitle = data[0][0];
  const fields = GAME_CONFIGURATIONS[gameTitle].fields
  const numberedFields = GAME_CONFIGURATIONS[gameTitle].numberedFields
  const playersData = {};

  for (let i = 1; i < data.length; i++) {
    const player = {};
    const playerName = data[i][fields.playerName];

    for (const fieldIndex of Object.values(fields)) {
      player[Object.keys(fields)[fieldIndex]] = data[i][fieldIndex];
    }

    for (const fieldIndex of numberedFields) {
      const fieldName = Object.keys(fields)[fieldIndex];
      player[fieldName] = parseInt(player[fieldName], 10);
    }

    playersData[playerName] = player;
  }

  return { gameTitle, playersData };
}


// We need 11 elements in array: 0 should be title name, 1-10 should be of players
// Each player line should have 6 elements if is handball, 7 elements if is basketball
// For basketball: elements 2, 4, 5, 6 should be numbers. Elements 0, 1 should be string, element 3 should be team.
// For handball: elements 2, 4, 5 should be numbers. Elements 0, 1 should be string, element 3 should be team.
// Player names are unique
function validateData(data) {
  try {
    let gameTitle = data[0][0]
    if (!(gameTitle in GAME_CONFIGURATIONS)) {
      return false;
    }

    let playersInGame = {

    }
    for (let i = 1; i < data.length; i++) {
      const fields = data[i]
      const playerName = fields[1]
      
      if (fields.length !== Object.keys(GAME_CONFIGURATIONS[gameTitle].fields).length) {
        console.error("File incorrect, wrong number of fields");
        return false;
      }

      if (!validateNumberFieldsAreCorrect(gameTitle, fields)) {
        console.error("Corrupt file, number fields are incorrect")
        return false
      }

      if (playerName in playersInGame) {
        console.error("Player already in game, can't appear twice")
        return false
      }
      playersInGame[playerName] = true
    }
    return true;
  } catch (err) {
    console.error('Error reading file:', err);
    return false;
  }
}

// Validates the numbered fields in the data
function validateNumberFieldsAreCorrect(gameTitle, fields) {

  const requiredFieldIndexes = GAME_CONFIGURATIONS[gameTitle].numberedFields
  return requiredFieldIndexes.every(index => !isNaN(parseInt(fields[index])));
}