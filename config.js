exports.GAME_CONFIGURATIONS = {
  'BASKETBALL': {
    ratingCalculation: {
      'score': 2,
      'rebound': 3,
      'assist': 1
    },
    fields: ['playerId', 'playerName', 'playerNumber', 'playerTeam', 'score', 'rebound', 'assist'],
    numberedFields: ['playerNumber', 'score', 'rebound', 'assist'],
    handleCalculatePlayerRating: function (player) {
      return player.score * this.ratingCalculation.score + player.rebound * this.ratingCalculation.rebound + player.assist * this.ratingCalculation.assist
    },
    handleIncrementTeamScore: function (player) {
      return player.score
    }

  },
  'HANDBALL': {
    ratingCalculation: {
      'initial': 20,
      'goalMade': 2,
      'goalReceived': -1,
    },
    fields: ['playerId', 'playerName', 'playerNumber', 'playerTeam', 'goalsMade', 'goalsReceived'],
    numberedFields: ['playerNumber', 'goalsMade', 'goalsReceived'],
    handleCalculatePlayerRating: function (player) {
      return this.ratingCalculation.initial + player.goalsMade * this.ratingCalculation.goalMade + player.goalsReceived * this.ratingCalculation.goalReceived
    },
    handleIncrementTeamScore: function (player) {
      return player.goalsMade
    }
  },
  generalRatingCalculation: {
    'team_win': 10
  }
}