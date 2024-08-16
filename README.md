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
```

Change the corresponding fields according to the game type:

```
'BASKETBALL' -> new game name

ratingCalculation -> To fit the new game

fields -> According to the format the CSV lines appear in

numberedFields -> All fields that are supposed to be numbers

handleCalculatePlayerRating -> Handler that calculates player score

handleIncrementTeamScore -> Handler that returns how much the team score increments by according to the player score
```

**EXAMPLE OF GAME ADDED**

Added the following to GAME_CONFIGURATIONS:

```
  'FOOTBALL': {
    ratingCalculation: {
      'initial': 10,
      'goal_made': 2,
      'foul': -1
    },
    fields: ['playerId', 'playerName', 'playerNumber', 'playerTeam', 'goal_made', 'foul'],
    numberedFields: ['playerNumber', 'goal_made', 'foul'],
    handleCalculatePlayerRating: function(player){
      return this.ratingCalculation.initial + player.goal_made * this.ratingCalculation.goal_made + player.foul * this.ratingCalculation.foul
    },
    handleIncrementTeamScore: function(player){
      return player.goal_made
    }
  },
```

Then created a new Football.csv file, like so:

```
FOOTBALL
player_1;Shakill;4;Team_A;1;32
player_2;Labron;8;Team_A;10;32
player_3;Martin;15;Team_A;15;32
player_4;Robert;16;Team_A;20;32
player_5;Peter;23;Team_A;4;32
player_6;Parker;42;Team_B;5;50
player_7;Steve;13;Team_B;10;50
player_8;Rogers;17;Team_B;10;50
player_9;Tony;22;Team_B;0;50
player_10;Stark;11;Team_B;7;50
```

And the new ratings were calculated correctly.

**VERSIONS**:

```node v18.16.0```
