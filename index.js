const fs = require('fs');
const path = require('path');

const handlerFunctions = require('./tournamentHandler')

async function main() {
  const allData = await handlerFunctions.readData();
  const parsedData = allData.map(data => handlerFunctions.parseData(data)).filter(data => data)
  const playersRatings = parsedData.reduce(handlerFunctions.allocateScoresToPlayers, {})

  const winningPlayer = handlerFunctions.getWinningPlayer(playersRatings)
  console.log("Here are the ratings of each player in the tournament:")
  console.log(playersRatings)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}


main()
