var config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        mode: Phaser.Scale.FIT,
        width: 616,
        height: 616
    },
    physics: {default: 'arcade', arcade: {gravity: {y: 200}}},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
// all the info for the end of each scene
var sceneEndStats = [{imgX: 176, imgY: 176, imgScale: 0.66, newX: 360, newY: 80, panX: 512, panY: 0, rmT1: [22, 5], rmT2: [22, 6], add1: [20, 5], add2: [20,6]},     {imgX: 510, imgY: 176, imgScale: 0.5, newX: 696, newY: 0, panX: 1040, panY: 0, rmT1: [43, 9], rmT2: [43, 10], add1: [42, 9], add2: [42, 10]}, 
    {imgX: 866, imgY: 176, imgScale: 0.325, newX: 960, newY: 384, panX: 864, panY: 528, rmT1: [59, 22], rmT2: [60, 22], add1: [59, 21], add2: [60,21]},
    {imgX: 864, imgY: 528, imgScale: 0.214, newX: 992, newY: 737, panX: 864, panY: 864, rmT1: [63, 44], rmT2: [62, 44], add1: [62, 42], add2: [63, 42]},
    {imgX: 864, imgY: 864, imgScale: 0.25, newX: 678, newY: 863, panX: 528, panY: 864, rmT1: [42, 52], rmT2: [42, 53], add1: [44, 52], add2: [44, 53]},
    {imgX: 528, imgY: 864, imgScale: 0.15625, newX: 343, newY: 905, panX: 0, panY: 864, rmT1: [21, 56], rmT2: [21, 57], add1: [22, 56], add2: [22, 57]}, 
    {imgX: 176, imgY: 864, imgScale: 0.15625, newX: 80, newY: 656, panX: 0, panY: 528, rmT1: [21, 56], rmT2: [21, 57], add1: [22, 56], add2: [22, 57]}, 
    {imgX: 176, imgY: 528, imgScale: 0.4167, newX: -10, newY: -10, panX: 520, panY: 528, rmT1: [21, 56], rmT2: [21, 57], add1: [22, 56], add2: [22, 57]}];

function preload ()
{
    this.load.image('invite', 'assets/80th_Invite.png');
    this.load.image('instructions', 'assets/80th_Instructions.png');
    this.load.image('end', 'assets/80th_End.png');
    this.load.image('tiles', 'assets/80th_Tiles.png');
    this.load.image('imagedot1', 'assets/80th_Photo1.png');
    this.load.image('imagedot2', 'assets/80th_Photo2.png');
    this.load.image('imagedot3', 'assets/80th_Photo3.png');
    this.load.image('imagedot4', 'assets/80th_Photo4.png');
    this.load.image('imagedot5', 'assets/80th_Photo5.png');
    this.load.image('imagedot6', 'assets/80th_Photo6.png');
    this.load.image('imagedot7', 'assets/80th_Photo7.png');
    this.load.image('imagedot8', 'assets/80th_Photo8.png');
    this.load.image('skip', 'assets/80th_SkipButton.png');
    this.load.image('next', 'assets/80th_NextButton.png');
    this.load.tilemapTiledJSON('map', 'assets/80th_Maze.json');
    this.load.spritesheet('sprite', 'assets/80th_Sprite.png', { frameWidth: 16, frameHeight: 12 });
    this.load.spritesheet('dotSprite', 'assets/80th_Dot.png', {frameWidth: 16, frameHeight: 16});
    this.load.audio('audioSynth', ['assets/80th_AudioSynth.ogg', 'assets/80th_AudioSynth.mp3']);
}

function create ()
{
    // set up map
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('retro', 'tiles');
    const maze = map.createLayer('Maze', tileset, 0, 0);
    maze.setCollisionBetween(0, 139);

    this.add.image(520, 528, 'invite').setScale(0.19);

    // add player
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

    // set up dots
    
    let dotOn = 1;
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
        dotOn = parseInt(dot.name.substr(3, 3)) + 1;
        let s = sceneEndStats[parseInt(dot.name.substr(3, 3)) - 1];
        let kalyanam = this.add.image(s.imgX, s.imgY, 'image' + dot.name).setScale(s.imgScale);
        next.x = 300;
        next.y = 460;
        next.setScrollFactor(0).depth = 10;
        next.on('pointerup', () => {
            kalyanam.destroy();
            dot.destroy();
            next.setScrollFactor(10000);
            if (s.newX != 0) {player.x = s.newX;}
            if (s.newY != 0) {player.y = s.newY;};
            camera.centerOn(s.panX, s.panY);
            maze.removeTileAt(s.rmT1[0], s.rmT1[1]);
            maze.removeTileAt(s.rmT2[0], s.rmT2[1]);
            maze.putTileAt(7, s.add1[0], s.add1[1]);
            maze.putTileAt(7, s.add2[0], s.add2[1]);
        },);
    };

    this.physics.add.overlap(player, dots, endLevel, null, this);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels).setZoom(1.75);
    camera.centerOn(520, 528);
    
    var invite = true;
    var instructions = false;

    this.input.on('pointerup', () => {if (invite) {
            this.add.image(520, 528, 'instructions').setScale(0.19);
            invite = false;
            instructions = true;
            this.time.addEvent({delay: 500})
            }
        else if (instructions) {
            camera.centerOn(0, 0);
            instructions = false;
            skip.visible = true;
            this.add.image(520, 528, 'end').setScale(0.19);
        };
    });
    
    this.sound.play('audioSynth', {loop: true});
    
    // set up skip button
    let skip = this.add.sprite(164, 460, 'skip').setInteractive().setScrollFactor(0);
    skip.visible = false;
    
    function skipToDot () {
        let skipSpot = map.findObject('Spawn', obj => obj.name === 'dot' + dotOn);
        player.x = skipSpot.x;
        player.y = skipSpot.y;
        this.time.addEvent({delay: 500});
    };

    skip.on('pointerup', skipToDot, this);


    var next = this.add.image(300, 460, 'next').setInteractive().setScrollFactor(1000);

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

    if (cursors.up.isDown) {player.setVelocityY(-50);};

}
