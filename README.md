# Dungeons and Dragons Initiative Tracker
This app helps Dungeons and Dragons parties keep track of their initiative order when they are in combat. It uses Firebase as the backend hosting and database which requires user authentication and once authenticated, it allows users to update their characters, view other player's characters, and see all changes in real time. This application also supports multiple simultaneous lobbies without overlapping any of the data contained within each unique lobby. All data input into each lobby will persist after each game session into the next session that way players don't have to input all their information each time they play. It also keeps track of which characters are associated with each account so any player will only be able to edit their own characters. During the game, there is a two minute turn timer. At the end of the turn, this timer will automatically check which player's turn is next and change the styling of their player card. This will continue every two minutes until the Dungeon Master pauses or resets the timer.

# Link to the hosted app
https://dnd-initiative-5b4cf.web.app/

# Instructions

From the main screen after logging in, click on the "Home" button in the top right corner. This will take you to a screen with three options, "Join most recent game", "Join an existing game", and "Create new game".

The "Join most recent game" option will check your browser for cookies with the saved lobby number and will automatically log you into that game lobby. This is to make it easier and faster to get into your game and start playing.

The "Join an existing game" option allows users to input a lobby code that their Dungeon Master has already created and hop into that lobby. On their next visit, users only need to click on the "Join most recent game" option to log back into the lobby. 

The "Create a new game" option allows users to open a new lobby with a custom lobby number, and the application keeps track of who created that lobby and will automatically give that user Dungeon Master privileges. 

The Dungeon Master privileges include editing other players information, starting, stopping, and resetting the turn timer, and approving new characters any player wants to add. To test out these features, upon logging into a lobby, input lobby number 999. This lobby is a special one I created to toggle Dungeon Master mode on and off.

On the game screen players can add their own character (pending Dungeon Master review), edit their character card, and rearrange the sorting of each player card based on each statistic option (Initiative, Hit Points, Damage, and Armor Class). Changing these sorting options will not effect the initiative order and if the turn timer is counting down it will continue moving through the players in the correct order.
