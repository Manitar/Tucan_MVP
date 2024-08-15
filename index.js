const fs = require('fs');
const path = require('path');

const handlerFunctions = require('./tournamentHandler')

// Our "Database" for this project
function main() {
  const allData = handlerFunctions.readData();
  const parsedData = allData.map(data => handlerFunctions.parseData(data))
  for (const data of parsedData) {
    if (!data) {
      continue
    }
    const gameTitle = data[0]
    data.shift() // Remove the first element - game title
    handlerFunctions.allocateScoresToPlayers(gameTitle, data)
  }

  const winningPlayer = handlerFunctions.getWinningPlayer()
  const playerRatings = handlerFunctions.getPlayerRatings()
  console.log("Here are the ratings of each player in the tournament:")
  console.log(playerRatings)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}


main()
