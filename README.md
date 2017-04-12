# Demo
### [Click here for Demo!](https://glowing-fire-9042.firebaseapp.com "Demo")
# Summary
A Tic Tac Toe web app that was developed using React and Firebase along with Webpack. You can play either locally in one browser window or online across two browser windows.

### Things To Do
- Have hosting players enter a name for the game to be hosted
- Allow players to see available sessions
- Add Flash Messages

#Usage

### 1. Select a Game Mode
![Missing image for Game Modes](https://s30.postimg.org/lvootrq5d/game_modes.png)
### 2. Local Game
- Follow the **Game Status** which indicates if it is X's turn or O's turn
<br>
![Missing Imagte for Game Status](https://s18.postimg.org/ix7hbbfsp/turn_game_status.png)
- You can **Quit** from the **Game Mode** at any time during the game
<br>
![Missing Image for Quit](https://s8.postimg.org/6k2861ja9/quit_game_mode.png)
- You can also choose to **Restart** the game when finished
<br>
![Missing Image for Restart](http://s14.postimg.org/chndh9i8t/restart_game.png)

### 3. Host Game
- Once this game mode has been selected you will have to wait for a player to join your game
<br>
**NOTE:** You will need to provide the **Session ID** to the player that is to join your game
<br>
![Missing Image for Hosting Game](https://s8.postimg.org/4boi82t45/hosting_game.png)
- Once a player has joined, the **Game Status** will indicates if it is X's turn or O's turn
<br>
![Missing Image for Game Status](https://s18.postimg.org/ix7hbbfsp/turn_game_status.png)
- You can **Quit** from the **Game Mode** at any time before or after the game has started
<br>
**NOTE:** This will quit the game for the other player as well
<br>
![Missing Image for Quit](https://s8.postimg.org/6k2861ja9/quit_game_mode.png)
- You can also choose to **Restart** the game when you are finished, being the **Host**
<br>
**NOTE:** This will restart the game for the other player as well
<br>
![Missing Image for Restart](https://s14.postimg.org/chndh9i8t/restart_game.png)

### 4. Join Game
- Once this game mode has been selected, use a **Session ID** that has been provided by another player to join a game
<br>
**NOTE:** You must enter a valid **Session ID** otherwise you will receive an alert indicating that it was incorrect
<br>
![Missing Image for Joining Game](https://s22.postimg.org/4y5fyv2q9/joining_game.png)
- Once you have joined a game, the **Game Status** will indicates if it is X's turn or O's turn
<br>
![Missing Image for Game Status](https://s18.postimg.org/ix7hbbfsp/turn_game_status.png)
- You can **Quit** from the **Game Mode** at any time once the game has started
<br>
**NOTE:** This will quit the game for the other player as well
<br>
![Alt Text](http://s8.postimg.org/6k2861ja9/quit_game_mode.png "Missing Image for Quit")
