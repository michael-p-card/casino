/**
 * This class contains functions called by the finiste state machine (FSM) for blackjack. It also contains the
 * following state information:
 *
 * GameDeck - deck of cards built at the start of every hand
 * Bet - amount of bet entered in game panel
 * Player - reference to the player created from the info at the sign in screen
 */

class BlackjackGameFunctions {

    constructor() {
        this.GameDeck = Card.buildDeck();
        this.Bet = 0;
        this.Player = null;
    }

    /**
     * This function sets up the game space by creating the two players, dealing their first 2 cards, and
     * if the bet box contains a valid amount transitioning into the player1turn state. If anything is wrong
     * the game will remain in the deal state until it is fixed.
     *
     * @returns {string} - state to move to
     */
    startblackjack()
    {

        this.GameDeck = Card.buildDeck();
        Card.shuffleDeck(this.GameDeck);

        document.getElementById("status").style.display="none";

        if (this.Players == null) {

            // Initialize top-level container
            document.getElementById('players').innerHTML = '';

            this.Players = new Array();

            this.Players.push(this.Player);
            this.Players[0].joinGame(new BlackjackPlayerState(this.GameDeck, 5, 1, this.Player.Name));

            this.Players.push(new Player(2, Number.MAX_SAFE_INTEGER));
            this.Players[1].joinGame(new BlackjackPlayerState(this.GameDeck, 5, 2, 'Dealer'));
        } else {
            this.Players[0].GameState.clearHand();
            this.Players[1].GameState.clearHand();
        }

        this.Players[0].GameState.Bet = this.Bet;
        this.Players[0].GameState.playHand();

        // validate the bet
        if (this.Players[0].GameState.Bet > 0 && this.Players[0].Credit - this.Players[0].GameState.Bet >= 0) {

            // Deal each player 2 cards
            this.Players[0].GameState.hit(this.GameDeck);
            this.Players[0].GameState.hit(this.GameDeck);

            // Deal each player 2 cards
            this.Players[1].GameState.hit(this.GameDeck);
            this.Players[1].GameState.hit(this.GameDeck);

            document.getElementById('player_1').classList.add('active');
            document.getElementById('player_2').classList.remove('active');
            document.getElementById('balanceBox').value = this.Players[0].Credit;

            return 'player1turn';

        } else {
            document.getElementById('balanceBox').value = this.Players[0].Credit;
            if (this.Players[0].GameState.Bet <= 0) {
                alert("Bet must be > 0");
            } else {
                alert("Bet is too large for balance");
            }
            return 'deal';
        }

    }

    /**
     * Function to draw a card and add it to a player's hand. Returns next state
     *
     * @param state - either player1turn or player2turn, player 2 = dealer
     * @returns {string} - next state
     */
    hitMe(state)
    {
        if (state === 'player1turn') {
            this.Players[0].GameState.hit(this.GameDeck);
        } else {
            this.Players[1].GameState.hit(this.GameDeck);
        }
        return this.check(state);
    }

    /**
     * Function to pass the turn to teh next player, for player 1 this will cause an auto play to execute for the
     * dealer. For player 2 (the dealer) the resulting state will be player1won, player2won, or push (the 3 possible
     * end states of a round)
     *
     * @param state - either player1turn or player2turn, player 2 = dealer
     * @returns {*} - next state
     */
    stand(state)
    {

        if (state === 'player1turn') {

            document.getElementById('player_1').classList.remove('active');
            document.getElementById('player_2').classList.add('active');

            console.log(this.Players[0].Name + ' stands at ' + this.Players[0].GameState.getPoints());
            console.log("stand() returning autoPlay()");
            return this.autoPlay();

        } else {

            if (this.Players[0].GameState.getPoints() < 22 && this.Players[0].GameState.getPoints() === this.Players[1].GameState.getPoints()) {
                console.log("stand() returning push");
                this.end('push');
                return 'push';
            } else if (this.Players[1].GameState.getPoints() > 21 || (this.Players[0].GameState.getPoints() <= 21 && this.Players[0].GameState.getPoints() > this.Players[1].GameState.getPoints())) {
                console.log("stand() returning player1won");
                this.end('player1won');
                return 'player1won';
            } else {
                console.log("stand() returning player2won");
                this.end('player2won');
                return 'player2won';
            }
        }
    }

    /**
     * Function which performs side effects (ew!) to set GUI elements and adjust player balance and win/loss stats
     * @param state - either player1won, player2won, or push
     * @returns {*} - same state as passed in
     */
    end(state)
    {
        if (state === 'push') {
            document.getElementById('status').innerHTML = 'PUSH';
        } else if (state === 'player1won') {
            document.getElementById('status').innerHTML = 'Winner: ' + this.Players[0].Name;
            this.Players[0].Credit += this.Bet*1;
            this.Players[0].GameState.wonHand();
            document.getElementById('balanceBox').value = this.Players[0].Credit;
            console.log(this.Players[0].Name + ' won, ' + this.Players[0].Name + ' stats: hands won/hands played = ' + this.Players[0].GameState.getStats().HandsWon + '/' + this.Players[0].GameState.getStats().HandsPlayed);
        } else {
            document.getElementById('status').innerHTML = 'Winner: Dealer';
            this.Players[0].Credit -= this.Bet;
            document.getElementById('balanceBox').value = this.Players[0].Credit;
            console.log('Dealer won, ' + this.Players[0].Name + ' stats: hands won/hands played = ' + this.Players[0].GameState.getStats().HandsWon + '/' + this.Players[0].GameState.getStats().HandsPlayed);
        }
        document.getElementById("status").style.display = "inline-block";
        return state;
    }

    /**
     * This function computes the state after a player takes a hit, as a player may exceed 21 and so lose instantly
     * upon taking a hit.
     *
     * @param state - either player1turn or player2turn
     * @returns {string} - next state, either player1turn, player2turn, player1won, or player2won
     */
    check(state)
    {

        if (state === 'player1turn') {
            if (this.Players[0].GameState.getPoints() > 21)
            {
                console.log("check() returning player2won");
                this.end('player2won');
                return 'player2won';
            } else {
                console.log("check() returning player1turn");
                return 'player1turn';
            }
        } else {
            if (this.Players[1].GameState.getPoints() > 21)
            {
                console.log("check() returning player1won");
                this.end('player1won');
                return 'player1won';
            } else {
                console.log("check() returning player2turn");
                return 'player2turn';
            }
        }
    }

    /**
     * This function plays for the dealer and returns the state of the game after he plays
     *
     * @returns {string} - either player1won, player2won, or push
     */
    autoPlay() {

        var newState = 'player2turn';
        while (this.Players[1].GameState.getPoints() < this.Players[0].GameState.getPoints() && this.Players[1].GameState.getPoints() < 22) {
            newState = this.hitMe('player2turn');
            console.log('Dealer takes a hit, score = ' + this.Players[1].GameState.getPoints());
        }
        if (newState == 'player2turn') newState = this.stand(newState);

        return newState;
    }

    /**
     * This function clears the graphical elements from the board and takes down the status display, and alerts
     * user of balance. Then advances to cashedOut state.
     *
     * @returns {string}
     */
    cashOut() {
        if (this.Players != null && this.Players.length > 0 && this.Players[0].GameState != null) this.Players[0].GameState.clearHand();
        if (this.Players != null && this.Players.length > 1 && this.Players[1].GameState != null) this.Players[1].GameState.clearHand();
        document.getElementById('status').style.display="none";
        if (this.Players != null && this.Players.length > 0) {
            alert('Cashing out with balance of $' + this.Players[0].Credit + ', press deal to play again!');
        } else {
            alert('Cashing out, press deal to play again!');
        }
        return 'cashedOut';
    }

}