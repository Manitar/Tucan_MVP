exports.GAME_CONFIGURATIONS = {
  'BASKETBALL': {
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
    fields: {
      playerId: 0,
      playerName: 1,
      playerNumber: 2,
      playerTeam: 3,
      goal_made: 4,
      goal_received: 5,
    },
    numberedFields: [2, 4, 5],
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