const fs = require('fs');
const path = require('path');

const handlerFunctions = require('./tournamentHandler')

async function main() {
  const allData = await handlerFunctions.readData();
  const parsedData = allData.map(data => handlerFunctions.parseData(data)).filter(data => data)
  if (parsedData.length === 0) {
    console.log("There are no legitimate games played, exiting program")
    return
  }
  const playersRatings = parsedData.reduce(handlerFunctions.allocateScoresToPlayers, {})

  const winningPlayer = handlerFunctions.getMVP(playersRatings)
  console.log("Here are the ratings of each player in the tournament:")
  console.log(playersRatings)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}


main()
