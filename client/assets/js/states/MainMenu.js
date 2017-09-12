Game.MainMenu = function (game) {
};

Game.MainMenu.prototype = {
    create : function () {

        // add a background image

        // add a title
        var title = this.add.text(this.world.centerX, 80, 'Template Game', {font: '50px Arial', fill: '#ffffff'});
        title.anchor.setTo(0.5, 0.5);

        // show the score
        var score = this.add.text(this.world.centerX, this.world.centerY, 'Score : ' + this.game.global.score , {font: '25px Arial', fill: '#ffffff'});
        score.anchor.setTo(0.5, 0.5);

        // explain how to start a game
        var comment = this.add.text(this.world.centerX, this.world.height-80, 'Press UP key to start ', {font: '25px Arial', fill: '#ffffff'});
        comment.anchor.setTo(0.5, 0.5);

        // create a new Phaser keyboard variable
        var upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);

        // when the key UP is pressed, it will call the 'start' function once
        upKey.onDown.addOnce(this.start, this);

        //add graphics to state
        var g1 = game.add.graphics(100, 100);
        var g2 = game.add.graphics(100, 100);

        //clear the graphics
        g1.clear();
        
        i=0;

        //add rounded button
        this.drawButtonWithText(g1, 50, 100, 100, 100, 7, {bSize: 2, bColor: 0x0000FF, bAlpha: 1, fColor: 0x027a71, fAlpha: 1}, "no", {font: '25px Arial', fill: '#ffffff'}, "1", function(){console.log("click a" + i++);});
        //add rounded button
        this.drawButtonWithText(g2, 50, 250, 100, 100, 7, {bSize: 2, bColor: 0x0000FF, bAlpha: 1, fColor: 0x027a71, fAlpha: 1}, "yes", {font: '25px Arial', fill: '#ffffff'}, "1", function(){console.log("click b" + i++);});
    
        //window.graphics = graphics;
    },

    start : function () {
        // start the game

        //this.state.start('Level');

        socket.emit('host game', {});

        
		socket.on("new game", function(){
            console.log("new game");
        });
    },

    drawRoundedRect : function (graphics, x, y, width, height, radius, btnStyle) {
        graphics.beginFill(btnStyle.fColor, btnStyle.fAlpha);
        graphics.lineStyle(btnStyle.bSize, btnStyle.bColor, btnStyle.bAlpha);
        graphics.drawRoundedRect(x, y, width, height, radius);
        graphics.endFill();
        return graphics;
    },

    drawText : function (x, y, width, height,text, textStyle) {
        var text = game.add.text(x + width / 2, y + height / 2, text, textStyle);
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
