/**
 * This class carries the state information for the blackjack game the player is playing, including:
 *
 * Hand - array of cards player is holding
 * Bet - amount of money being bet on this hand
 * PlayerID - integer ID assigned to player
 * PlayerName - player name entered at sign in screen
 * HandsWon - count of hands player has won
 * HandsPlayed - count of hands player has played
 */
class BlackjackPlayerState {

    constructor(deck, bet, playerID, playerName) {
        this.Game = 'blackjack';
        this.Hand = new Array();
        this.Bet = bet;
        this.PlayerID = playerID;
        this.PlayerName = playerName;
        this.HandsPlayed = 0;
        this.HandsWon = 0;

        // Add player GUI elements
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + this.PlayerID;
        div_player.id = 'player_' + this.PlayerID;
        div_player.className = 'player';
        div_hand.id = 'hand_' + this.PlayerID;

        div_playerid.innerHTML = this.PlayerName;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }

    /**
     * This function computes the point value of a player's hand
     * @returns {number}
     */
    getPoints() {
        var points = 0;
        this.Hand.forEach(function(card) {
            points += card.Weight;
        });

        // If you go over 21, count an ace as 1 instead of 11
        if (points > 21) {
            points = 0;
            this.Hand.forEach(function(card) {
                if (card.Weight === 11) {
                    points += 1;
                } else {
                    points += card.Weight;
                }
            });
        }
        return points;
    }

    /**
     * This function lets the player draw a card (a hit) from a deck
     * @param deck
     */
    hit(deck) {
        let card = deck.pop();
        this.Hand.push(card);
        Card.addCardToHandDisplay(card, this.PlayerID);
        document.getElementById('points_' + this.PlayerID).innerHTML = this.getPoints();
        document.getElementById('deckcount').innerHTML = deck.length; // update GUI count of cards in GameDeck
    }

    clearHand() {
        this.Hand = new Array();
        Card.removeAllCardsFromHandDisplay(this.PlayerID);
        document.getElementById('points_' + this.PlayerID).innerHTML = this.getPoints();
    }

    playHand() {
        this.HandsPlayed += 1;
    }

    wonHand() {
        this.HandsWon += 1;
    }

    getStats() {
        return {"HandsWon": this.HandsWon, "HandsPlayed": this.HandsPlayed};
    }
}

