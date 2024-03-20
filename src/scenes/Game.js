import { Scene } from 'phaser';

var score = 0;
var gameOver = false;
var scoreText;
var fondo;
var scoreTime;
var tiempo = 0;
///
var visualizarSangre = true;
var ciervosMatar = 3;
var cantidadBalas = 3;
var cargadorBalas = 1;

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  ///////////// CREATE ///////////
  create() {
    //  The platforms group contains the ground and the 2 ledges we can jump on

    //  Input Events
    //cursors = this.input.keyboard.createCursorKeys();
    //cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    //cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    //cursors.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    //
    // Añadimos los corazones
    /*
    corazones = this.add.group();
    corazones.create(this.scale.gameSize.width - 40, 20, 'atlas', 'bullet_small.png').setOrigin(1, 0);
    corazones.create(this.scale.gameSize.width - 70, 20, 'atlas', 'bullet_small.png').setOrigin(1, 0);
    corazones.create(this.scale.gameSize.width - 100, 20, 'atlas', 'bullet_small.png').setOrigin(1, 0);
    */
    //
    //
    //  A simple background for our game
    fondo = this.add.image(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2, 'backGround');
    fondo.setDisplaySize(this.scale.gameSize.width, this.scale.gameSize.height);

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreTime = this.add.text(16, 50, 'Tiempo: 00:00:00', { fontSize: '32px', fill: '#000' });

    //////
    // Añadir el sprite del rifle encima de la barra marrón, en la esquina superior derecha
    const rifle = this.add
      .sprite(this.scale.gameSize.width - 10, 10, 'rifle')
      .setOrigin(1, -0.96)
      .setScale(0.5);
    rifle.setInteractive(); // Hacer que el sprite del rifle sea interactivo

    // Configurar la animación del rifle //
    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('rifle', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0, // La animación se reproduce una vez
    });
    this.anims.create({
      key: 'recolocateRifle',
      frames: this.anims.generateFrameNumbers('rifle', { start: 1, end: 0 }),
      frameRate: 10,
      repeat: 0, // La animación se reproduce una vez
    });
    ///////////////////////////////////////

    // Añadir una barra marrón en la parte inferior
    const brownBar = this.add.rectangle(this.scale.gameSize.width / 2, this.scale.gameSize.height, this.scale.gameSize.width, 100, 0x8b4513);
    brownBar.setOrigin(0.5, 1); // Establecer el origen en la parte inferior

    // Añadir botón 1 a la barra marrón
    const button1 = this.add
      .image(100, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Reload.png')
      .setOrigin(0.5, 0.2)
      .setInteractive();
    button1.on('pointerdown', () => {
      console.log('Botón Reload clicado');
    });
    const buttonText1 = this.add.text(button1.x, button1.y, 'Recargar', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(0, -0.2);

    // Añadir botón 2 a la barra marrón
    const button2 = this.add
      .image(this.scale.gameSize.width / 2, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Replay.png')
      .setOrigin(0.9, -0.1)
      .setInteractive();
    button2.on('pointerdown', () => {
      console.log('Botón Para ver sangre clicado');
    });
    const buttonText2 = this.add.text(button1.x, button1.y, 'VIEWBLOOD', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(-1.7, -0.4);

    // Añadir botón 3 a la barra marrón
    const button3 = this.add
      .image(this.scale.gameSize.width / 2, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Replay.png')
      .setOrigin(-0.2, -0.1)
      .setInteractive();
    button2.on('pointerdown', () => {
      console.log('Botón Para Recargar');
    });
    const buttonText3 = this.add.text(button1.x, button1.y, 'RELOAD', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(-4.5, -0.4);

    // Añadir botón 4 a la barra marrón
    const button4 = this.add
      .image(this.scale.gameSize.width - 100, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Continue.png')
      .setOrigin(0.5, 0.1)
      .setInteractive();
    // Crear las imágenes de las balas
    const bullet1 = this.add.sprite(button3.x - 30, button3.y, 'atlas', 'bullet_small.png').setOrigin(-17.5, 0.2);
    const bullet2 = this.add.sprite(button3.x, button3.y, 'atlas', 'bullet_small.png').setOrigin(-17.5, 0.2);
    const bullet3 = this.add.sprite(button3.x + 30, button3.y, 'atlas', 'bullet_small.png').setOrigin(-17.5, 0.2);
    button3.on('pointerdown', () => {
      console.log('Balas');

      // Añadir las imágenes de las balas al botón
      button3.bullets = [bullet1, bullet2, bullet3];

      if (cantidadBalas > 0) {
        // Verificar si hay balas disponibles
        // Disminuir la cantidad de balas
        cantidadBalas--;
      } else {
        console.log('No hay balas disponibles');
      }
    });
    ////////////////////

    // Añadir evento de clic del ratón para iniciar la animación del rifle
    this.input.on('pointerdown', (pointer) => {
      // Verificar si el clic está por encima de la barra marrón
      if (pointer.y < this.scale.gameSize.height - 100) {
        // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
        rifle.anims.play('fire'); // Iniciar la animación del rifle

        // Agregar un retraso antes de iniciar la animación de recolocación
        setTimeout(() => {
          rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
        }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
      }

      ///
      // posible mejora que no se pueda spamear
      ///
    });

    /////////////////
    // Añadir un evento de clic del ratón para cambiar a la escena de Gameover
    this.input.on('pointerdown', () => {
      //this.gameOver();
    });
    ////////////////
  }
  ///////////// UPDATE ///////////
  update(time, deltaTime) {
    if (gameOver) {
      return;
    }

    /*if (cursors.B.isDown) {
      //this.create2Bomb();
    }*/

    this.tiempoReal(deltaTime);
  }

  ///////////// OTHER FUNCTION ///////////
  ///////////// COLLECT START ///////////
  /*
  collectStar(player, star) {
    var x = star.x;
    var y = star.y;
    star.disableBody(false, false);
    //////////////
    // Crear el sistema de partículas
    const emitter = this.add.particles(0, 0, 'atlas', {
      frame: ['sparkle.png'],
      lifespan: 4000,
      speed: { min: 150, max: 250 },
      scale: { start: 0.8, end: 0 },
      gravityY: 150,
      blendMode: 'ADD',
      emitting: false,
      x: x,
      y: y,
    });

    //añadir particulas
    emitter.explode(16, x, y);
    //añadir sonido de recolectar estrellas
    this.sound.playAudioSprite('audiosprite', 'start');
    //////////////
    // Animar la opacidad de la estrella recogida a 0 (transparente)
    this.tweens.add({
      targets: star,
      alpha: 0, // Opacidad a 0
      duration: 500, // Duración de la animación en milisegundos
      onComplete: function () {
        // Una vez que se complete la animación
        // Deshabilitar el cuerpo de la estrella para que desaparezca
        star.disableBody(true, true);

        // Añadir puntos al puntaje
        score += 10;
        scoreText.setText('Score: ' + score);

        // Crear nuevas estrellas si no quedan estrellas activas
        if (stars.countActive(true) === 0) {
          // Activar el cuerpo de todas las estrellas para que aparezcan nuevamente
          stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            child.setAlpha(1);
          });

          // Generar una nueva posición en el eje X para la próxima estrella
          var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

          // Crear una nueva bomba en la posición generada
          var bomb = bombs.create(x, 16, 'atlas', 'bomb.png');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
          bomb.allowGravity = false;
        }
      },
    });
  }
  */

  ///////////// HIT BOMB ///////////

  ////////////// TIEMPO//////////
  tiempoReal(deltaTime) {
    tiempo += deltaTime / 1000;

    var horas = Math.floor(tiempo / 3600);
    var minutos = Math.floor((tiempo % 3600) / 60);
    var segundos = tiempo % 60;

    this.tiempoFormateado = (horas < 10 ? '0' : '') + horas + ':' + (minutos < 10 ? '0' : '') + minutos + ':' + Math.floor(segundos).toString().padStart(2, '0');

    return scoreTime.setText('Tiempo: ' + this.tiempoFormateado);
  }

  /////////// SEGUNDA BOMBA ////////

  ////

  // Realizar el efecto de screen shake
  //var shakeIntensity = 0.02; // Intensidad del shake
  //var shakeDuration = 2000; // Duración del shake en milisegundos
  //this.cameras.main.shake(shakeDuration, shakeIntensity);

  //////////////////// GAME OVER /////////////////
  gameOver() {
    // Cambiar a la escena de Gameover y pasar la puntuación y el tiempo como datos
    this.scene.start('GameOver', { score: score, tiempo: this.tiempoFormateado });
    tiempo = 0;
    score = 0;
  }
}
