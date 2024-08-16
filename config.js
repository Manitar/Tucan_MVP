exports.GAME_CONFIGURATIONS = {
  'BASKETBALL': {
    ratingCalculation: {
      'score': 2,
      'rebound': 3,
      'assist': 1
    },
    fields: ['playerId', 'playerName', 'playerNumber', 'playerTeam', 'score', 'rebound', 'assist'],
    numberedFields: ['playerNumber', 'score', 'rebound', 'assist'],
    handleCalculatePlayerRating: function(player){
      return player.score * this.ratingCalculation.score + player.rebound * this.ratingCalculation.rebound + player.assist * this.ratingCalculation.assist
    },
    handleIncrementTeamScore: function(player){
      return player.score
    }

  },
  'HANDBALL': {
    ratingCalculation: {
      'initial': 20,
      'goal_made': 2,
      'goal_received': -1,
    },
    fields: ['playerId', 'playerName', 'playerNumber', 'playerTeam', 'goal_made', 'goal_received'],
    numberedFields: ['playerNumber', 'goal_made', 'goal_received'],
    handleCalculatePlayerRating: function(player){
      return this.ratingCalculation.initial + player.goal_made * this.ratingCalculation.goal_made + player.goal_received * this.ratingCalculation.goal_received
    },
    handleIncrementTeamScore: function(player){
      return player.goal_made
    }
  },
  generalRatingCalculation: {
    'team_win': 10
  }
}