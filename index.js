const fs = require('fs');
const path = require('path');

const handlerFunctions = require('./tournamentHandler')

async function main() {
  const allData = await handlerFunctions.readData();
  console.log(allData)
  const parsedData = allData.map(data => handlerFunctions.parseData(data))
  let playerRatings
  for (const data of parsedData) {
    if (!data) {
      continue
    }
    const gameTitle = data[0]
    data.shift() // Remove the first element - game title
    playerRatings = handlerFunctions.allocateScoresToPlayers(gameTitle, data)
  }

  const winningPlayer = handlerFunctions.getWinningPlayer()
  console.log("Here are the ratings of each player in the tournament:")
  console.log(playerRatings)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}


main()
