let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    table: 4,
    matrixBlocks: [],
    scale: 1,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: new GameScene
};

let game = new Phaser.Game(config);