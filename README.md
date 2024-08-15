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

**consts.js**

```
Add new field to CORRECT_NUMBER_OF_FIELDS
Add new field to GAME_TITLES
Add new field and corresponding values to RATING_CALCULATION
```

**index.js**

```
validateNumberFieldsAreCorrect -> Add new "if" block that checks number of fields for the new game type
calculatePlayerRating -> Add new "if" block that calculates the new player rating, according to the game rules
```

**VERSIONS**:

```node v18.16.0```
