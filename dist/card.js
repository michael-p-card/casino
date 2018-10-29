let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

/**
 * This class is used to build Card objects with the following properties:
 *
 * Value - string representing face values 2-10, J, Q, K and A
 * Weight - number of points the card is worth in blackjack //TODO maybe inject this
 * Suit - string representing card suit
 */
class Card {

    constructor(value, suit) {
        this.Value = value;
        this.Suit = suit;

        var weight = parseInt(value);
        if (value == "J" || value == "Q" || value == "K")
            weight = 10;
        if (value == "A")
            weight = 11;

        this.Weight = weight;
    }

    static addCardToHandDisplay(card, player)
    {
        let hand = document.getElementById('hand_' + player);
        hand.appendChild(Card.getCardUI(card));
    }

    static removeAllCardsFromHandDisplay(player)
    {
        let hand = document.getElementById('hand_' + player);
        while (hand.firstChild) {
            hand.removeChild(hand.firstChild);
        }
    }

    static getCardUI(card)
    {
        let el = document.createElement('div');
        var icon = '';
        if (card.Suit == 'Hearts')
            icon='&hearts;';
        else if (card.Suit == 'Spades')
            icon = '&spades;';
        else if (card.Suit == 'Diamonds')
            icon = '&diams;';
        else
            icon = '&clubs;';

        el.className = 'card';
        el.innerHTML = card.Value + '<br/>' + icon;
        return el;
    }

    static buildDeck() {
        let deck = new Array();
        values.forEach(function(v) {
            suits.forEach(function(s) {
                deck.push(new Card(v, s))
            })
        });
        return deck;
    }

    static shuffleDeck(deck) {
        // switch the values of two random cards
        for (var i = 0; i < 1000; i++) {
            let location1 = Math.floor((Math.random() * deck.length));
            let location2 = Math.floor((Math.random() * deck.length));
            let tmp = deck[location1];

            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    }

}