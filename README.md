# Tucan_MVP

This project is for the Tucan Tournament assignment.

**In order to run this project, open the terminal in the root folder (where index.js is located) and type in:**

```node index.js```

This project was created with the ability to be expanded on in mind, so in case more types of games are added, and more files are added, the changes needed are minimal.

Read data reads every single CSV file in the directory it is in, so more games of type BASKETBALL/HANDBALL can be added.

I assumed that for every game that'll be added, the following format will be of the following:

```
GAME_TITLE
player_X;playerName;number;teamName;.....
Where ... are specific stats to the specific game.
```

**In order to add more games:**

**config.js**

Add new game to the GAME_CONFIGURATIONS, here is an example:

```
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
      return player.score * this.ratingCalculation.score + player.rebound * this.ratingCalculation.rebound + player.assist * this.ratingCalculation.assist
    },
    handleIncrementTeamScore: function(player){
      return player.goal_made
    }
  },
```

Change the corresponding fields according to the game type:

'HANDBALL' -> new game name

ratingCalculation -> To fit the new game

fields -> According to the format the CSV lines appear in

numberedFields -> All fields that are supposed to be numbers

handleCalculatePlayerRating -> Handler that calculates player score

handleIncrementTeamScore -> Handler that returns how much the score increments by according to the player score


**VERSIONS**:

```node v18.16.0```
