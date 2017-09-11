window.onload = function () {
    //connect to server
    socket = io.connect('http://localhost:8000');

    //Initialise game variable
    game = new Phaser.Game(800, 640, Phaser.CANVAS, 'gameContainer');
    
    game.global = {
        score: 0
    };

    //Declare states
    game.state.add('Boot', Game.Boot);
    game.state.add('Preloader', Game.Preloader);
    game.state.add('MainMenu', Game.MainMenu);
    game.state.add('Level', Game.Level);

    //Launch Boot state
    game.state.start('Boot');

};
