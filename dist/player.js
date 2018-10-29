/**
 * This class carries the state information for a game player, including:
 *
 * ID - integer identifier for Player instance
 * Name - name string entered at sign in page
 * Credit - amount of $ available for betting, entered at sign in page
 * GameState - an object containing the state information for the game being played,
 *             in this demo this would be an instance of BlackjackPlayerState
 * StatisticalHistory - list of statistical records for games played, includes date and # wins / # rounds played
 */
class Player {
    constructor(id, name, credit) {
        this.Name = name;
        this.ID = id;
        this.Credit = credit;
        this.GameState = null;
        this.StatisticalHistory = new Array();
    }

    getInfo() {
        return this.JSON.toString();
    }

    addCredit(winnings) {
        this.Credit += winnings;
    }

    debit(losses) {
        this.Credit -= losses;
    }

    joinGame(gameState) {
        this.GameState = gameState;
    }

}





