# Casino

## Getting Started

The easiest way to run this program is to open it in WebStorm, which was the IDE I used to create it. You can download WebStorm from https://www.jetbrains.com/webstorm/download and get a free 30 day trial.

When WebStorm starts, select the Open option and choose the "casino" folder for your local clone of this repo.

## Running the Software

Once the folder has been opened in WebStorm, right click on the casino.html file in the file list and select either "Run casino.html" or "Debug casino.html" depending on which you prefer. Debugging with WebStorm uses the Google Chrome browser and will require installation of a WebStorm browser extension.

When the application launches, select the Sign In tab and enter a user name and an amount of credit, then click the Sign In button. If your sign in was successful, the Sign In button will turn into a Sign Out button and the user name and credit amount boxes will be disabled. You may then click the Blackjack tab to play blackjack.

The operation of the blackjack game is straightforward. You may enter any amount that you wish to bet prior to pressing deal, once you have pressed deal you cannot change the bet amount. The balance text box shows how much credit yu have remaining. Pressing cash out ends your blackjack game and you may then visit another game (although at this time only blackjack has been constructed).

## Inspirations

Inspirations for this project came from the following sources:

1. http://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript

2. https://github.com/jakesgordon/javascript-state-machine/blob/master/README.md

3. https://mypages.valdosta.edu/dgibson/courses/cs4321/topics/uml/stateDiagrams.docx

Item 3 above contained a nice state machine diagram I used to build the state machine using the excellent Javascript state machine library from item 2. Item 1 provided the basic blackjack GUI used in this project.

## Architecture and Technology Stack

In order to complete this project in a reasonable timeframe with a serviacble simple GUI I opted to go with Javascript and HTML, basing my implementation off what was developed at That Software Dude's blog. This is my first project in Javascript and HTML. I love Scala but implementing an equivalent GUI would require using a Scala wrapper around Swing 🤮 or JavaFX, both of which would be much more work than using HTML with Javascript.

Most casino games are excellent candidates implementation via a finite state machine (FSM), so I chose to base the architecture of the micro casino around FSMs hosted within their own tabs on the casino page. I examined several FSM libraries that are out there for Javascript and settled for the one in item 2 above.

## Saving the Game State

Right now the micro casino implementation does not save the game state, but there are several ways it could be modified to do so. Perhaps one of the easiest is simply to invoke Javascript's built-in JSON stringify operator on the game's FSM and thus get a complete JSON representation of the entire game. This could then be persisted as a JSONB column in Postgres for example (or any other JSON-capable database), with the primary key column perhaps being a GUID generated for the user at sign in. Other attributes of the player object (e.g. player name, date and time of play, etc.) could be used to build secondary index columns to aid in searching the database to find the game state to restore. 

The game coud be restored by presenting the user with a query dialog to select the desired saved state to restore, and then using Javascript's built-in parser to turn the stringified JSON back into an actual JSON object in the application. 