class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, 'grass');
        this.scene = scene;
        this.value = value;
        this.scene.add.existing(this);
        this.setInteractive({cursor: 'url(assets/sprites/iron_pickaxe.png), pointer'});
        this.opened = false;
    }
}