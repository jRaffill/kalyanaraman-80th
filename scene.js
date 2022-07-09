var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 616,
    height: 616,
    //figure out gravity
    physics: {default: 'arcade', arcade: {gravity: {y: 200}}},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;

function preload ()
{
    this.load.image('invite', 'assets/80th_Invite.png');    
    this.load.image('tiles', 'assets/80th_Tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/80th_Maze.json');
    this.load.spritesheet('sprite', 'assets/80th_Sprite.png', { frameWidth: 16, frameHeight: 12 });
}

function create ()
{
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('retro', 'tiles');
    const maze = map.createLayer('Maze', tileset, 0, 0);
    maze.setCollisionBetween(0, 139);

    this.add.image(520, 528, 'invite');

    const spawn = map.findObject('Dots', obj => obj.name === 'spawn')
    player = this.physics.add.sprite(spawn.x, spawn.y, 'sprite').setScale(0.9);
    player.setBounce(0.4);

    this.anims.create(
        {key: 'anim',
         frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 3 }),
         frameRate: 7,
         repeat: -1
        }
    );
    player.anims.play('anim');
    player.flipX = true;
    
    this.physics.add.collider(player, maze);

    cursors = this.input.keyboard.createCursorKeys();
    
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels).setZoom(1.75);
    camera.pan(0, 0);

}

function update ()
{
    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.flipX = false;
    }
    
    else if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.flipX = true;
    }

    else {player.setVelocityX(0);};

    if (cursors.up.isDown) {player.setVelocityY(-50);}
}
