Game.MainMenu = function (game) {
    this.gameList = [];
};

Game.MainMenu.prototype = {
    create : function () {
        var position = 0,
            that = this;

        // add a background image

        // add a title
        var title = this.add.text(this.world.centerX, 80, 'Template Game', {font: '50px Arial', fill: '#ffffff'});
        title.anchor.setTo(0.5, 0.5);

        //add rounded buttons
        this.drawButton("Host Game", "1", position++, function(){socket.emit('host game', {});});

		socket.on("list games", function(data){
            // delete current join List
            that.gameList.forEach(function(joinButton){
                that.deleteButton(joinButton);
            });
            
            for(var key in that.gameList){
                that.deleteButton(that.gameList[key]);
            }

            that.gameList = [];
            position = 0;

            // create new join List
            data.forEach(function(party){
                that.gameList[party.id] = that.drawButton("Join Party", party.id, ++position, function(){
                    console.log("join game " + party.id); 
                    socket.emit('join game', {id: party.id});
                });
            });
        });

        socket.on("game joined", function(party){
            that.gameJoined(party.id);
        });

        socket.emit('get gamelist', {});
    },

    gameJoined : function(id){
        console.log("game joined " + id);
        socket.off("list games");
        socket.off("game joined");
        game.currentGameId = id;
        that.state.start('WaitingRoom');
    },

    drawButton : function(btnTitle, btnId, btnPosition, callBack){
        var button = game.add.graphics(100, 100);
        return this.drawButtonWithText(button, 50, 100+70*btnPosition, 100, 50, 7, {bSize: 2, bColor: 0x0000FF, bAlpha: 1, fColor: 0x027a71, fAlpha: 1}, btnTitle, {font: '25px Arial', fill: '#ffffff'}, btnId, callBack);
    },

    deleteButton : function(button) {
        button.children[0].destroy();
        button.clear();
    },

    start : function () {
        
    },

    drawRoundedRect : function (graphics, x, y, width, height, radius, btnStyle) {
        graphics.beginFill(btnStyle.fColor, btnStyle.fAlpha);
        graphics.lineStyle(btnStyle.bSize, btnStyle.bColor, btnStyle.bAlpha);
        graphics.drawRoundedRect(x, y, width, height, radius);
        graphics.endFill();
        return graphics;
    },

    drawText : function (x, y, width, height, label, labelStyle) {
        var text = game.add.text(x + width / 2, y + height / 2, label, labelStyle);
        text.smoothed = true;
        text.anchor.x = 0.5;
        text.anchor.y = 0.4;
        return text;
    },

    addInputDownToRect : function(graphics, callback){
        graphics.inputEnabled = true;
        graphics.input.useHandCursor = true;
        graphics.events.onInputDown.add(callback, this);
        return graphics;
    },

    drawButtonWithText: function (graphics, x, y, width, height, radius, btnStyle, text, textStyle, btnName, callback) {
        graphics.clear();  
        graphics.name = btnName;

        var buttonRect = this.drawRoundedRect(graphics, x, y, width, height, radius, btnStyle);
        var buttonText = this.drawText(x, y, width, height,text, textStyle);
        buttonRect.addChild(buttonText);

        return this.addInputDownToRect(buttonRect, callback);
    }
};
