var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 616,
    height: 616,
    physics: {default: 'arcade', arcade: {gravity: {y: 200}}},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var sceneEndStats = [{imgX: 176, imgY: 176, imgScale: 0.66, newX: 340, newY: 0, panX: 512, panY: 0, rmT1: [22, 5], rmT2: [22, 6]}, 
                    {imgX: 510, imgY: 176, imgScale: 0.5, newX: 696, newY: 0,    panX: 1040, panY: 0, rmT1: [43, 9], rmT2: [43, 10]}, 
                    {imgX: 510, imgY: 0, imgScale: 0.5, newX: 960, newY: 384, panX: 864, panY: 528, rmT1: [59, 22], rmT2: [60, 22]},
                    {imgX: 0, imgY: 0, imgScale: 0.5, newX: 992, newY: 737, panX: 864, panY: 864, rmT1: [61, 44], rmT2: [62, 44]}, {}, {}, {}, {}];

function preload ()
{
    this.load.image('invite', 'assets/80th_Invite.png');    
    this.load.image('tiles', 'assets/80th_Tiles.png');
    this.load.image('imagedot1', 'assets/80th_Photo1.png');
    this.load.image('imagedot2', 'assets/80th_Photo2.png');
    this.load.tilemapTiledJSON('map', 'assets/80th_Maze.json');
    this.load.spritesheet('sprite', 'assets/80th_Sprite.png', { frameWidth: 16, frameHeight: 12 });
    this.load.spritesheet('dotSprite', 'assets/80th_Dot.png', {frameWidth: 16, frameHeight: 16});
}

function create ()
{
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('retro', 'tiles');
    const maze = map.createLayer('Maze', tileset, 0, 0);
    maze.setCollisionBetween(0, 139);

    this.add.image(520, 528, 'invite').setScale(0.19);

    const spawn = map.findObject('Spawn', obj => obj.name === 'spawn')
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

    const dots = this.physics.add.group();

    for (i = 1; i <= 8; i++) {
        let dotspot = map.findObject('Spawn', obj => obj.name === 'dot' + i);
        let key = 'dot' + i;
        dots.create(dotspot.x, dotspot.y, 'dot').name = key;
    }

    this.anims.create({
        key: 'dots',
        frames: this.anims.generateFrameNumbers('dotSprite', { start: 0, end: 4 }),
        frameRate: 6.67,
        repeat: -1
    });
    
    this.physics.add.collider(dots, maze);
    dots.playAnimation('dots');
    
    function endLevel(player, dot) {
        let s = sceneEndStats[parseInt(dot.name.substr(3, 3)) - 1];
        let kalyanam = this.add.image(s.imgX, s.imgY, 'image' + dot.name).setScale(s.imgScale);
        this.input.on('pointerup', () => {
            kalyanam.destroy();
            if (s.newX != 0) {player.x = s.newX;}
            if (s.newY != 0) {player.y = s.newY;};
            dot.destroy();
            camera.centerOn(s.panX, s.panY);
            maze.removeTileAt(s.rmT1[0], s.rmT1[1]);
            maze.removeTileAt(s.rmT2[0], s.rmT2[1]);
        },);
    };

    this.physics.add.overlap(player, dots, endLevel, null, this);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels).setZoom(1.75);
    camera.centerOn(520, 528);
    let invite = true;

    this.input.on('pointerup', () => {if (invite = true) 
        {camera.centerOn(0, 0); invite = false;}
    });
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
