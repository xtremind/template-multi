var Game = function(id) {
    this.id = id;
    this.players = [];
    this.status = 'WAITING'; // WAITING, INPROGRESS
}

Game.prototype = {
    getId: function(){
        return this.id;
    },

    getPlayers: function(){
        return this.players;
    },

    addPlayer: function(playerId){
        var existingPlayer = this.playerById(playerId);
        if (!existingPlayer) {
            this.players.push(playerId);
        }
    },

    removePlayer: function(playerId){
        var removePlayer = this.playerById(playerId);
        if (!removePlayer) {
            return;
        }
        this.players.splice(this.players.indexOf(removePlayer), 1);
    },

    playerById: function (id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id)
                return this.players[i];
        }    
        return false;
    }
}

module.exports = Game;