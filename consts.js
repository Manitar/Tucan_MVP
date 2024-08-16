exports.CORRECT_NUMBER_OF_FIELDS = {
  'BASKETBALL': 7,
  'HANDBALL': 6
}

exports.GAME_TITLES = {
  'BASKETBALL': 'BASKETBALL',
  'HANDBALL': 'HANDBALL'
}

exports.RATING_CALCULATION = {
  'BASKETBALL': {
    'score': 2,
    'rebound': 3,
    'assist': 1,
  },
  'HANDBALL': {
    'initial': 20,
    'goal_made': 2,
    'goal_received': -1
  }
}

exports.GAME_CONFIGURATIONS = {
  'BASKETBALL': {
    title: 'BASKETBALL',
    ratingCalculation: {
      'score': 2,
      'rebound': 3,
      'assist': 1
    },
    fields: {
      playerId: 0,
      playerName: 1,
      playerNumber: 2,
      playerTeam: 3,
      score: 4,
      rebound: 5,
      assist: 6
    },
    numberedFields: [2, 4, 5, 6],
    handleCalculatePlayerRating: function(playerData){
      return playerData.score * this.ratingCalculation.score + playerData.rebound * this.ratingCalculation.rebound + playerData.assist * this.ratingCalculation.assist
    },
    handleIncrementTeamScore: function(player){
      return player.score
    }

  },
  'HANDBALL': {
    title: 'HANDBALL',
    ratingCalculation: {
      'initial': 20,
      'goal_made': 2,
      'goal_received': -1,
    },
    fields: {
      playerId: 0,
      playerName: 1,
      playerNumber: 2,
      playerTeam: 3,
      goal_made: 4,
      goal_received: 5,
    },
    numberedFields: [2, 4, 5],
    handleCalculatePlayerRating: function(playerData){
      return this.ratingCalculation.initial + playerData.goal_made * this.ratingCalculation.goal_made + playerData.goal_received * this.ratingCalculation.goal_received
    },
    handleIncrementTeamScore: function(player){
      return player.goal_made
    }
  },
  generalRatingCalculation: {
    'team_win': 10
  }
}