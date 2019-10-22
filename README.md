# RPS-Multiplayer

## Description
This game can be used by two people (or two instances on one machine). It uses Firebase to track each player's selection. It will keep a running score as well. 

Beyond the assignment's requirements I've added a few things.

### 1 - Player's Name
The ability to give each player a name. This appears on both screens and makes it clear who you are playing against. 

### 2 - Status
As each player is making a selection the status is relayed to the other player. In other words you will know if your opponent is waiting on you or if you are waiting on them.

### 3 - Control Panel 
Admittedly this is used more for my own debugging but it does offer a place where user name can be entered. Control panel is accessable by clicking on the gear icon in the upper left.

#### Bugs:
There is an issue where at times the both instances appear as 'Player 2'. To work around this I've added the ability to 'Force this to be Player 1' in the control panel. 


## Technoligies: 
* Firebase Database
* JQuery
