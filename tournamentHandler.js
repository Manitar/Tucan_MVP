const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import all relevant consts from the consts file
const config = require('./config')
const GAME_CONFIGURATIONS = config.GAME_CONFIGURATIONS;

// // Returns the player with the highest rating
exports.getWinningPlayer = function getWinningPlayer(playersRatings) {
  let maxKey = '';
  let maxValue = -Infinity;

  for (const [key, value] of Object.entries(playersRatings)) {
    if (value > maxValue) {
      maxKey = key;
      maxValue = value;
    }
  }

  return { playerName: maxKey, rating: maxValue }
}

// Goes over all relevant games and allocates the ratings to each player
exports.allocateScoresToPlayers = function allocateScoresToPlayers(gameData, PLAYER_RATINGS) {
  const gameTitle = gameData.gameTitle

  function isPlayerOnWinningTeam(team, teamScores) {
    const otherTeamScores = Object.entries(teamScores)
    .filter(([otherTeam, score]) =>  otherTeam !== team)
    .map(([otherTeam, score]) => score)

    const highestOtherTeamScore = otherTeamScores.reduce((max, score) => Math.max(score, 0), 0)
    
    return teamScores[team] > highestOtherTeamScore;
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
        playersRatings[playerName] += GAME_CONFIGURATIONS.generalRatingCalculation.team_win;
      }
      playersRatings[playerName] += playerRating;
    }
    return playersRatings
  }

  const teamScores = calculateTeamScores()
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


// Elements in the data array: Element 0 should be array with 1 element: game title, 1 and higher should be arrays of player data
// Each player line will have player_id, playerName, playerNumber, playerTeam, and additional data according to the game.
// The numbered fields must be 0 or higher (A player can't score -5 goals, for example)
// Player names are unique
function validateData(data) {
  try {
    let gameTitle = data[0][0]
    if (!(gameTitle in GAME_CONFIGURATIONS)) {
      console.error(`Game ${gameTitle} does not exist in the Tucan Tournament`)
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
  return requiredFieldIndexes.every(index => /^\d+$/.test(fields[index])
  );
}