const fs = require('fs');
const path = require('path');

// Import all relevant consts from the consts file
const consts = require('./consts')
const CORRECT_NUMBER_OF_FIELDS = consts.CORRECT_NUMBER_OF_FIELDS;
const GAME_TITLES = consts.GAME_TITLES;
const RATING_CALCULATION = consts.RATING_CALCULATION;

// Our "Database" for this project
const PLAYER_RATINGS = {

}

function main() {
  const allData = readData();
  const parsedData = allData.map(data => parseData(data))
  for (const data of parsedData) {
    if (!data) {
      continue
    }
    const gameTitle = data[0]
    data.shift() // Remove the first element - game title
    allocateScoresToPlayers(gameTitle, data)
  }

  const winningPlayer = getWinningPlayer()
  console.log("Here are the ratings of each player in the tournament:")
  console.log(PLAYER_RATINGS)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}

function getWinningPlayer() {
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

function allocateScoresToPlayers(gameTitle, gameData) {

  const teamScores = {
    'Team_A': 0,
    'Team_B': 0
  }

  const ratingCalculation = RATING_CALCULATION[gameTitle]

  function isPlayerOnWinningTeam(team) {
    return teamScores[team] > teamScores[Object.keys(teamScores).find(key => key !== team)];
  }

  function calculatePlayerRating(playerData) {
    let playerRating = 0;
    if (gameTitle === GAME_TITLES.BASKETBALL) {
      const playerTeam = playerData[3]
      const scores = playerData[4]
      const rebounds = playerData[5]
      const assists = playerData[6]
      playerRating = ratingCalculation['score'] * scores + ratingCalculation['rebound'] * rebounds + ratingCalculation['assist'] * assists
      if (isPlayerOnWinningTeam(playerTeam)) {
        playerRating += 10
      }
    } else if (gameTitle === GAME_TITLES.HANDBALL) {
      const goalsMade = playerData[4]
      const goalsReceived = playerData[5]
      playerRating = ratingCalculation['initial'] + ratingCalculation['goal_made'] * goalsMade + ratingCalculation['goal_received'] * goalsReceived
    }
    return playerRating
  }

  function calculateWinningTeam() {
    for (const playerData of gameData) {
      const playerName = playerData[1]
      // Insert player into ratings map
      if (!(playerName in PLAYER_RATINGS)) {
        PLAYER_RATINGS[playerName] = 0;
      }
      const playerTeam = playerData[3]
      const score = playerData[4]
      teamScores[playerTeam] += score
    }
  }

  function calculateAllPlayerRatings() {
    for (const playerData of gameData) {
      const playerRating = calculatePlayerRating(playerData)
      const playerName = playerData[1]
      PLAYER_RATINGS[playerName] += playerRating
    }
  }

  calculateWinningTeam()
  calculateAllPlayerRatings()

}

function readData() {

  // const basketballData = fs.readFileSync('Basketball.csv', 'utf8')
  // const handballData = fs.readFileSync('Handball.csv', 'utf8')

  // return [basketballData, handballData]
  const currentDirectory = __dirname;
  const files = fs.readdirSync(currentDirectory);
  const csvFiles = files.filter(file => path.extname(file) === '.csv');

  const dataArray = csvFiles.map(file => {
    const filePath = path.join(currentDirectory, file);
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  });

  return dataArray;
}

function parseData(data) {
  const dataIsValid = validateData(data)
  if (!dataIsValid) {
    return false
  }
  const dataLines = data.split('\n') // We divide the data into arrays of each player
  for (let i = 1; i < dataLines.length; i++) {
    dataLines[i] = dataLines[i].split(';')
  }
  dataLines[0] = dataLines[0].replace(/\r/g, '')
  return dataLines;
}

// We need 11 elements in array: 0 should be title name, 1-10 should be of players
// Each player line should have 6 elements if is handball, 7 elements if is basketball
// First 5 should be team A, second 5 should be team B 
// For basketball: elements 2, 4, 5, 6 should be numbers. Elements 0, 1 should be string, element 3 should be team.
// For handball: elements 2, 4, 5 should be numbers. Elements 0, 1 should be string, element 3 should be team.
// Player names are unique:
function validateData(data) {
  try {
    const dataLines = data.split('\n') // We divide the data into arrays of each player
    let gameTitle = dataLines[0].replace(/\r/g, '')
    if (!(gameTitle in GAME_TITLES)) {
      return false;
    }
    let playerCount = {
      'Team_A': 0,
      'Team_B': 0
    }
    let playersInGame = {

    }
    for (let i = 1; i < dataLines.length; i++) {
      const fields = dataLines[i].split(';')
      const playerName = fields[1]

      // Remove '\r' from last input, if it exists.
      fields[fields.length - 1] = fields[fields.length - 1].replace(/\r/g, '')
      if (fields.length !== CORRECT_NUMBER_OF_FIELDS[gameTitle]) {
        console.error("File incorrect, wrong number of fields");
        return false;
      }

      if (fields[3] !== 'Team_A' && fields[3] !== 'Team_B') {
        console.error("Corrupt file, fourth field isn't Team_A or Team_B")
        return false;
      }

      playerCount[fields[3]]++;

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

function validateNumberFieldsAreCorrect(gameTitle, fields) {
  if (gameTitle === GAME_TITLES.BASKETBALL) {
    if (isNaN(parseInt(fields[2])) || isNaN(parseInt(fields[4])) || isNaN(parseInt(fields[5])) || isNaN(parseInt(fields[6]))) {
      return false;
    }
  }

  if (gameTitle === GAME_TITLES.HANDBALL) {
    if (isNaN(parseInt(fields[2])) || isNaN(parseInt(fields[4])) || isNaN(parseInt(fields[5]))) {
      return false;
    }
  }
  return true
}

main()
