import { Scene } from 'phaser';

var player;
var stars;
var bombs;
var bombs2;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var fondo;
var scoreTime;
var tiempo = 0;
var corazones;
var nextBombTime = 0;
var invulnerable = false;

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  ///////////// CREATE ///////////
  create() {
    //  A simple background for our game
    fondo = this.add.image(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2, 'sky');
    fondo.setDisplaySize(this.scale.gameSize.width, this.scale.gameSize.height);

    //  The platforms group contains the ground and the 2 ledges we can jump on

    //  Input Events
    //cursors = this.input.keyboard.createCursorKeys();
    //cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    //cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    //cursors.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreTime = this.add.text(16, 50, 'Tiempo: 00:00:00', { fontSize: '32px', fill: '#000' });

    // Añadimos los corazones
    /*
    corazones = this.add.group();
    corazones.create(this.scale.gameSize.width - 40, 20, 'atlas', 'heart.png').setOrigin(1, 0);
    corazones.create(this.scale.gameSize.width - 70, 20, 'atlas', 'heart.png').setOrigin(1, 0);
    corazones.create(this.scale.gameSize.width - 100, 20, 'atlas', 'heart.png').setOrigin(1, 0);
    */

    /////////////////
    // Añadir un evento de clic del ratón para cambiar a la escena de Gameover
    this.input.on('pointerdown', () => {
      this.gameOver();
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
