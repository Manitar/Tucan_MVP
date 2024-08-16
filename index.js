const fs = require('fs');
const path = require('path');

const handlerFunctions = require('./tournamentHandler')

async function main() {
  let PLAYER_RATINGS = {}
  const allData = await handlerFunctions.readData();
  const parsedData = allData.map(data => handlerFunctions.parseData(data))
  let playerRatings
  for (const data of parsedData) {
    if (!data) {
      continue
    }
    PLAYER_RATINGS = handlerFunctions.allocateScoresToPlayers(data, PLAYER_RATINGS)
  }

  const winningPlayer = handlerFunctions.getWinningPlayer(PLAYER_RATINGS)
  console.log("Here are the ratings of each player in the tournament:")
  console.log(PLAYER_RATINGS)
  console.log(`The winner of the tournament is ${winningPlayer.playerName}, with a rating of ${winningPlayer.rating}!`);
}


main()
