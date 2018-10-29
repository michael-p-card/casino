/**
 * Finite State Machine (FSM) for playing blackjack, uses the javascript-state-machine npm code,
 * see https://github.com/jakesgordon/javascript-state-machine/blob/master/README.md
 *
 * State machine based on blackjack state machine shown in https://mypages.valdosta.edu/dgibson/courses/cs4321/topics/uml/stateDiagrams.docx
 *
 * This class contains the following state information:
 *
 * BJGameState - an instance of the BlackjackGameFunctions class
 * FSM - an instance of the StateMachine class from the javascript-state-machine repo
 */
class BlackjackGameFSM {

    constructor(bjGameState) {

        this.FSM = new StateMachine({
            init: 'deal',
            transitions: [
                { name: 'dealPressed',   from: 'deal',        to: function() { return bjGameState.startblackjack(); } },
                { name: 'dealPressed',   from: 'player1won',  to: function() { return bjGameState.startblackjack(); } },
                { name: 'dealPressed',   from: 'player2won',  to: function() { return bjGameState.startblackjack(); } },
                { name: 'dealPressed',   from: 'push',        to: function() { return bjGameState.startblackjack(); } },
                { name: 'hitMePressed',   from: 'player1turn', to: function() { return bjGameState.hitMe('player1turn'); } },
                { name: 'standPressed',   from: 'player1turn', to: function() { return bjGameState.stand('player1turn'); } },
                { name: 'cashOutPressed', from: 'player1won',  to: function() { return bjGameState.cashOut(); } },
                { name: 'cashOutPressed', from: 'player2won',  to: function() { return bjGameState.cashOut(); } },
                { name: 'cashOutPressed', from: 'push',        to: function() { return bjGameState.cashOut(); } },
                { name: 'cashOutPressed', from: 'deal',        to: function() { return bjGameState.cashOut(); } },
                { name: 'dealPressed',    from: 'cashedOut',   to: function() { return bjGameState.startblackjack(); } }
            ],
            methods: {
                onDealPressed:   function() { console.log('Dealing the cards') },
                onHitMePressed:   function() {
                    if (this.state === 'player1turn') {
                        console.log(bjGameState.Players[0].Name + ' takes a hit, score = ' + bjGameState.Players[0].GameState.getPoints())
                    } else {
                        console.log('Dealer takes a hit, score = ' + bjGameState.Players[1].GameState.getPoints())
                    }
                },
                onStandPressed:   function() {
                    if (this.state === 'player2turn') {
                        console.log(bjGameState.Players[0].Name + ' stands at ' + bjGameState.Players[0].GameState.getPoints())
                    } else if (this.state === 'player1won') {
                        console.log(bjGameState.Players[0].Name + ' won ' + bjGameState.Players[0].GameState.getPoints() + ' to ' +  bjGameState.Players[1].GameState.getPoints())
                    } else if (this.state === 'player2won') {
                        console.log('Dealer won ' + bjGameState.Players[1].GameState.getPoints() + ' to ' +  bjGameState.Players[0].GameState.getPoints())
                    }
                },
                onCashOutPressed: function() { console.log(bjGameState.Players[0].Name + ' cashing out with balance of ' + bjGameState.Players[0].Credit) }
            }
        });

        this.BJGameState = bjGameState;

    }

    dealPressed(bet, thePlayer) {
        this.BJGameState.Bet = bet;
        this.BJGameState.Player = thePlayer;
        this.FSM.dealPressed();
    }
}
