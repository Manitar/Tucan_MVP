const fs = require('fs');


const CORRECT_NUMBER_OF_FIELDS = {
  'BASKETBALL': 7,
  'HANDBALL': 6
}

const GAME_TITLES = {
  'BASKETBALL': 'BASKETBALL',
  'HANDBALL': 'HANDBALL'
}

const PLAYER_RATINGS = {

}

function main() {
  const allData = readData();
  const parsedData = allData.map(data => parseData(data))
}

function allocateScoresToPlayers(gameData) {
  const teamScores = {
    'Team_A': 0,
    'Team_B': 0
  }

  // Calculate the winning team
  for (const playerData of gameData) {
    const playerTeam = playerData[3]
    const score = playerData[4]
    teamScores[playerTeam] += score
  }

  // Calculate score for each team
}

function readData() {

  const basketballData = fs.readFileSync('Basketball.csv', 'utf8')
  const handballData = fs.readFileSync('Handball.csv', 'utf8')

  return [basketballData, handballData]
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
  dataLines.shift()
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
    const gameTitle = dataLines[0]
    let playerCount = {
      'Team_A': 0,
      'Team_B': 0
    }
    let playersInGame = {

    }
    for (let i = 1; i < dataLines.length; i++) {
      const fields = line.split(';')
      const playerName = fields[1]
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
      return true;
    }

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
}

main()
