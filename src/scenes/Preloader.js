import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
    // Custom Webfonts
    this.fonts = ['Madimi One'];
    // Workaround for Phaser 3 not loading fonts until used
    this.fonts.forEach((font) => {
      this.add.text(0, 0, '', { fontFamily: font });
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');

    this.load.image('backGround', 'background.jpg');

    //this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });

    this.load.atlas('atlas', 'atlas.png', 'atlas.json');

    this.load.spritesheet('rifle', 'rifle_V03.png', { frameWidth: 647, frameHeight: 732 });
    this.load.spritesheet('ciervo', 'deer_animation(750x750).png', { frameWidth: 750, frameHeight: 750 });
    this.load.spritesheet('animacionSangreCiervo', 'AnimationBloodDeer.png', { frameWidth: 394, frameHeight: 574 });
    this.load.spritesheet('animacionTierraDisparo', 'dirtFireAnimation(200x200).png', { frameWidth: 200, frameHeight: 200 });

    this.load.image('deer', 'deer.png');
    this.load.image('bloodParticle', 'bloodP.png');
    this.load.image('buttonAgain', 'buttonAgain.png');
    this.load.image('deerTableScore', 'scoreIcon_BG.png');
    this.load.image('deerScoreActive', 'scoreIcon_active.png');
    this.load.image('deerScoreInactive', 'scoreIcon_inactive.png');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu');
  }
}
