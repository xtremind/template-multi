/**
* This module contains all logic related to hosting/joining games.
*/

var Lobby = {
    onEnterLobby: function() {
        console.log("onEnterLobby");

    },

    onHostGame: function() {
        console.log("onHostGame");
        
    },

    onEnterPendingGame: function() {
        console.log("onEnterPendingGame");
        
    },

    onLeavePendingGame: function() {
        console.log("onLeavePendingGame");
        
    }
}

module.exports = Lobby;