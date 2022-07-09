var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    //figure out gravity
    physics: {default: 'arcade', arcade: {gravity: {y: 100}}}
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
    this.load.spritesheet('sprite', 'assets/80th_Sprite.png');
}

function create ()
{
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('retro', 'tiles');
    const maze = map.createLayer('Maze', tileset, 0, 0);
    maze.setCollisionBetween(0, 139);
    
    //figure out spawn point
    player = this.physics.add.sprite(400, 300, 'sprite');
    //figure out frame rate
    this.anims.create(
        {key: 'anim',
         frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 3 }),
         frameRate: 10;
         repeat: -1
        }
    );
    
    this.physics.add.collider(player, maze);
    
}

function update ()
{
}
