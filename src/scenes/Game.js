import { Scene } from 'phaser';

var gameOver = false;

var fondo;
var scoreTime;
var tiempo = 0;
///
var visualizarSangre = true;
var ciervosMatar = 3;
var cantidadBalas = 3;
var cargadorBalas = 1;
var tutorial = true;
//
var bullet1;
var bullet2;
var bullet3;
var apuntar = false;
//
var emitter;
var buttonText3;
var button3;
//
var ciervoExiste = false;
var rifle;
var brownBar;
var ganar = null;
//
let tiempoInicio = 0; 


export class Game extends Scene {
  constructor() {
    super('Game');
  }

  ///////////// CREATE ///////////
  create() {
    tiempoInicio = this.time.now;
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
    // Crear el rectángulo para oscurecer la pantalla
    //

    //////////////
    //////////
    //////

    //  A simple background for our game
    fondo = this.add.image(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2, 'backGround');
    fondo.setDisplaySize(this.scale.gameSize.width, this.scale.gameSize.height);

    //////
    //  The score

    scoreTime = this.add.text(16, 50, 'Tiempo: 00:00:00', { fontSize: '32px', fill: '#000' });
    //////////

    // Detectar la tecla B presionada
    const keyB = this.input.keyboard.addKey('B');
    var blackOverlay;
    
    keyB.on('down', () => {
      // Agregar un rectángulo negro que cubra toda la pantalla
blackOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);
blackOverlay.setOrigin(0);
 
//this.scope.setMask(blackOverlay.createGeometryMask());
      //console.log('estas apuntando');
      // Iniciar la animación para aumentar la escala al apuntar
      this.scope.setScale(0.7);
      // Habilitar pixelPerfect en la imagen del "scope"
   
    });
    keyB.on('up', () => {
      blackOverlay.destroy();
      //console.log('ya no apuntas');
      apuntar = false;
      // Iniciar la animación para reducir la escala al dejar de apuntar
      this.scope.setScale(0.3);
    });
    //////////////

    //////
    // Añadir el sprite del rifle encima de la barra marrón, en la esquina superior derecha
    rifle = this.add
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
    brownBar = this.add.rectangle(this.scale.gameSize.width / 2, this.scale.gameSize.height, this.scale.gameSize.width, 100, 0x8b4513);
    brownBar.setOrigin(0.5, 1); // Establecer el origen en la parte inferior

    // Añadir botón 1 a la barra marrón
    const button1 = this.add
      .image(100, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Reload.png')
      .setOrigin(0.5, 0.2)
      .setInteractive();
    button1.on('pointerdown', () => {
      //console.log('Botón Reload clicado');

      if (cargadorBalas > 0) {
        cantidadBalas = 3;
        cargadorBalas--;
        this.mostrarMensaje("Has regargado con exito ! tienes 3 balas más",2000);
        this.verBalas();
      } else {
        this.mostrarMensaje("No tienes más cargadores",2000);
      }
    });
    const buttonText1 = this.add.text(button1.x, button1.y, 'Recargar', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(0, -0.2);

    // Añadir botón 2 a la barra marrón
    const button2 = this.add
      .image(this.scale.gameSize.width / 2, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Replay.png')
      .setOrigin(0.9, -0.1)
      .setInteractive();
    button2.on('pointerdown', () => {
      // Cambiar el estado de visualizarSangre
      visualizarSangre = !visualizarSangre;

      // Imprimir un mensaje en la consola indicando si visualizarSangre está activo o desactivado
      if (visualizarSangre) {
        this.mostrarMensaje("Ahora veras las animaciones de sangre",2000);
      } else {
        this.mostrarMensaje("Ya no veras las animaciones de sangre",2000);
      }
    });
    const buttonText2 = this.add.text(button1.x, button1.y, 'VIEWBLOOD', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(-1.7, -0.4);

    // Añadir botón 3 a la barra marrón
    button3 = this.add
      .image(this.scale.gameSize.width / 2, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Replay.png')
      .setOrigin(-0.2, -0.1)
      .setInteractive();
    button3.on('pointerdown', () => {
      //console.log('Botón Para ver ciervos a los que matar');
    });
    buttonText3 = this.add.text(button1.x, button1.y, 'Ciervos = ' + ciervosMatar, { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(-3.15, -0.4);

    // Añadir botón 4 a la barra marrón
    const button4 = this.add
      .image(this.scale.gameSize.width - 100, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Continue.png')
      .setOrigin(0.5, 0.1)
      .setInteractive();
    // Crear las imágenes de las balas
    bullet1 = this.add.sprite(button4.x - 30, button3.y, 'atlas', 'bullet_small.png').setOrigin(0.5, 0.2);
    bullet2 = this.add.sprite(button4.x, button3.y, 'atlas', 'bullet_small.png').setOrigin(0.5, 0.2);
    bullet3 = this.add.sprite(button4.x + 30, button3.y, 'atlas', 'bullet_small.png').setOrigin(0.5, 0.2);
    button4.on('pointerdown', () => {
      //console.log('Balas');

      // Añadir las imágenes de las balas al botón
      button4.bullets = [bullet1, bullet2, bullet3];
    });
    ////////////////////

    // Añadir evento de clic del ratón para iniciar la animación del rifle
    this.input.on('pointerdown', (pointer) => {
      if (cantidadBalas <= 0) {
        this.mostrarMensaje("No te quedan balas",2000);
      } else {
        // Verificar si el clic está por encima de la barra marrón
        if (pointer.y < this.scale.gameSize.height - 100) {
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play('fire'); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
          }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        }
      }

      ///
      // posible mejora que no se pueda spamear
      ///
    });
    //////////

    ///////
    //particulas
    emitter = this.add.particles(0, 0, 'atlas', {
      frame: ['bloodP.png'],
      lifespan: 1000, // Reducir el tiempo de vida de las partículas a 1 segundo
      speed: { min: 50, max: 100 }, // Reducir la velocidad mínima y máxima
      scale: { start: 0.3, end: 0 }, // Reducir la escala inicial y final de las partículas
      gravityY: 50, // Reducir la gravedad
      blendMode: 'ADD',
      emitting: false,
    });

    /*collectStar(player, star) {
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
    });*/

    ////

    // Añadir la imagen del scope una vez en el método create
    this.scope = this.add.image(0, 0, 'atlas', 'scope.png').setOrigin(0.5);

    // Establecer la escala de la imagen del scope
    this.scope.setScale(0.3);

    // Ocultar el scope al principio
    this.scope.setVisible(false);

    // Detectar movimiento del ratón
    this.input.on('pointermove', (pointer) => {
      // Mostrar el scope y actualizar su posición al mover el ratón
      this.scope.setVisible(true);
      this.scope.setPosition(pointer.x, pointer.y);
    });
    ///////////////////////////

    ////////////////////////////

    /*// Definir los límites de movimiento del rifle
    const minX = 950; // Límite izquierdo
    const maxX = 1020; // Límite derecho

    const halfScreenWidth = this.scale.gameSize.width / 2; // Obtener la mitad del ancho de la pantalla

    this.input.on('pointermove', (pointer) => {
      let cursorX = Phaser.Math.Clamp(pointer.x, minX, maxX); // Limitar el cursor dentro de los límites X por defecto

      // Verificar si el cursor está en la mitad izquierda de la pantalla
      if (pointer.x < halfScreenWidth) {
        // Mover el rifle hacia la izquierda dentro de los límites minX
        cursorX = Phaser.Math.Clamp(pointer.x, minX, rifle.x);
      } else {
        // Mover el rifle hacia la derecha dentro de los límites maxX
        cursorX = Phaser.Math.Clamp(pointer.x, rifle.x, maxX);
      }

      // Mover el rifle a la posición del cursor en el eje X dentro de los límites definidos
      rifle.x = cursorX;
    });*/
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

    if (tutorial) {
      this.tutorial();
    } else {
      this.actualizarCiervos();
    }

    /*if (cursors.B.isDown) {
      //this.create2Bomb();
    }*/
    if (this.scope.visible) {
      this.scope.setPosition(this.input.mousePointer.x, this.input.mousePointer.y);
    }

    if (cantidadBalas == 0 && cargadorBalas == 0 && ciervosMatar > 0) {
      this.mostrarMensaje("Has perdido no tienes ni balas ni cargadores",2000);
      ganar = false;
      setTimeout(() => {
        this.gameOver();
      }, 1500);
    } else if (ciervosMatar <= 0) {
      this.mostrarMensaje("Felicidades has completado el desafio",2000);
      ganar = true;
      setTimeout(() => {
        this.gameOver();
      }, 1500);
    }
    // Simular el movimiento de respiración
    const frecuencia = 0.001; // Ajusta la frecuencia del movimiento de respiración según sea necesario
    const amplitud = 0.03; // Ajusta la amplitud del movimiento de respiración según sea necesario

    const tiempoActual = this.time.now;
    const tiempoTranscurrido = tiempoActual - tiempoInicio;

    // Calcula la posición vertical del rifle utilizando una función sinusoidal para el movimiento oscilatorio
    const movimientoRespiracion = amplitud * Math.sin(frecuencia * tiempoTranscurrido);

    // Aplica el movimiento al rifle
    rifle.y += movimientoRespiracion;

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

  ///////////// BALAS VISIBLES ///////////
  verBalas() {
    if (cantidadBalas >= 3) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1);
    } else if (cantidadBalas == 2) {
      bullet1.setAlpha(0);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1); // Ocultar la tercera bala
    } else if (cantidadBalas == 1) {
      bullet1.setAlpha(0);
      bullet2.setAlpha(0); // Ocultar la segunda y tercera bala
      bullet3.setAlpha(1);
    } else if (cantidadBalas == 0) {
      bullet1.setAlpha(0);
      bullet2.setAlpha(0);
      bullet3.setAlpha(0);
    }
  }
  ////////////// TIEMPO//////////
  tiempoReal(deltaTime) {
    tiempo += deltaTime / 1000;

    var horas = Math.floor(tiempo / 3600);
    var minutos = Math.floor((tiempo % 3600) / 60);
    var segundos = tiempo % 60;

    this.tiempoFormateado = (horas < 10 ? '0' : '') + horas + ':' + (minutos < 10 ? '0' : '') + minutos + ':' + Math.floor(segundos).toString().padStart(2, '0');

    return scoreTime.setText('Tiempo: ' + this.tiempoFormateado);
  }

  /////////// crear ciervo ////////
  crearCiervo(posX = this.scale.gameSize.width / 2, posY = this.scale.gameSize.height / 2, scale = 1) {
    // Añadir la imagen del ciervo
    const ciervo = this.add.image(posX, posY, 'deer').setInteractive({ pixelPerfect: true });

    // Establecer la escala de la imagen del ciervo
    ciervo.setScale(scale);

    // Agregar evento de clic a la imagen del ciervo
    ciervo.on('pointerdown', (pointer) => {
      // Agregar el parámetro pointer aquí
      //console.log('Se hizo clic en la imagen del ciervo');

      // Activar la emisión de partículas en la posición del ratón si la sangre esta activada
      if (!apuntar) {
        // Generar un número entero aleatorio entre 1 y 3
        const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

        // Establecer condiciones dependiendo del número aleatorio generado
        if (numeroAleatorio === 1 && cantidadBalas > 0) {
          this.mostrarMensaje("has fallado prueba apuntando es más facil",2000);
        } else if (numeroAleatorio === 2 && cantidadBalas > 0) {
          this.mostrarMensaje("has fallado si no apuntas tienes posibilidades de fallar la bala",2000);
        } else if (numeroAleatorio === 3 && cantidadBalas > 0) {
          this.mostrarMensaje("vaya tiro!!! le has dado sin apuntar???",2000);
          this.eliminarCiervo(pointer);

          // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play('fire'); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
          }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
          ciervo.destroy();
        }
      } else if (cantidadBalas > 0) {
        this.eliminarCiervo(pointer);

        // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
        // Realizar el efecto de screen shake
        var shakeIntensity = 0.01; // Intensidad del shake
        var shakeDuration = 50; // Duración del shake en milisegundos
        this.cameras.main.shake(shakeDuration, shakeIntensity);
        // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
        rifle.anims.play('fire'); // Iniciar la animación del rifle
        cantidadBalas--;
        /////
        // Verificar la cantidad de balas y ocultar las imágenes correspondientes
        this.verBalas();
        /////
        //console.log('se resto una bala');
        // Agregar un retraso antes de iniciar la animación de recolocación
        setTimeout(() => {
          rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
        }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        ciervo.destroy();
      }
    });
  }

  ///////////////////ACTUALIZAR TEXTO/////////////
  // Función para actualizar el texto que muestra la cantidad de ciervos restantes
  actualizarTextoCiervos() {
    // Actualizar el texto que muestra la cantidad de ciervos restantes
    buttonText3.setText('Ciervos = ' + ciervosMatar);
    
  }
  /////////////////ELIMINAR CIERVO//////////
  eliminarCiervo(pointer) {
    // Obtener la posición del ratón en el momento del clic
    const mouseX = pointer.x;
    const mouseY = pointer.y;

    if (visualizarSangre && cantidadBalas > 0) {
      emitter.setPosition(mouseX, mouseY);
      emitter.explode(16);
    }
    if (cantidadBalas > 0) {
      ciervosMatar--;
      // Actualizar el texto que muestra la cantidad de ciervos restantes
      this.actualizarTextoCiervos();
      setTimeout(() => {
        ciervoExiste = false;
      }, 1500);
    }
  }

  //////////////////// GAME OVER /////////////////
  gameOver() {
    // Cambiar a la escena de Gameover y pasar la puntuación y el tiempo como datos
    this.scene.start('GameOver', { tiempo: this.tiempoFormateado });
    tiempo = 0;

    cargadorBalas = 1;
    cantidadBalas = 3;
    ciervosMatar = 3;
    tutorial = true;
  }
  ///////////// actualizar ciervos /////
  actualizarCiervos() {
    if (!ciervoExiste) {
      // Generar un número aleatorio entre 1 y 3
      const numeroAleatorio = Math.floor(Math.random() * 3) + 1;
      // Generar un número aleatorio entre 100 y 1000 para la posición en el eje x
      const posicionX = Math.floor(Math.random() * 801) + 100;
      switch (numeroAleatorio) {
        case 1:
          this.crearCiervo(posicionX, 350, 0.2);
          ciervoExiste = true;
          // Acciones para el caso 1
          break;
        case 2:
          this.crearCiervo(posicionX, 400, 0.3);
          ciervoExiste = true;
          // Acciones para el caso 2
          break;
        case 3:
          this.crearCiervo(posicionX, 500, 0.4);
          ciervoExiste = true;
          break;
        default:
          // Acciones para otros casos, si es necesario
          break;
      }
    }
    // Asegurar que el scope esté por encima del ciervo
    this.scope.setDepth(2);
    // Asegurar que las partículas estén por encima del ciervo pero por debajo del scope
    emitter.setDepth(1);
    // Asegurar que el sprite del rifle esté por encima de los demás elementos
  }
  ///////////////TUTORIAL/////////////
  tutorial() {
    // black overlay
//black
// Agregar un rectángulo negro que cubra toda la pantalla
const blackOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);
blackOverlay.setOrigin(0);
///
    const ciervo = this.add.image(1000, 350, 'deer').setInteractive({ pixelPerfect: true });
    // Añadir la imagen 'tap_to_shoot' desde el atlas
    const tapToShoot = this.add.image(1000, 360, 'atlas', 'tap_to_shoot.png');
    ciervo.setScale(0.3);
    tapToShoot.setScale(0.5); // Puedes ajustar el valor según tu preferencia
    tapToShoot.setDepth(1);



    /////
    //animaciones
    ////
    
    // Animar la transición del ciervo y 'tap to shoot' desde la posición 1000 a la posición 850 y 900 respectivamente
    this.tweens.add({
      targets: ciervo, 
      x: 850,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
          // Una vez que la animación ha terminado, resaltar solo el ciervo
          this.tweens.add({
              targets: ciervo,
              scaleX: 0.35,
              scaleY: 0.35,
              duration: 500,
              yoyo: true,
              repeat: -1
          });
      }
  });
  ///// tap to shoot animatio
   // Animar la transición de 'tap to shoot' desde la posición 1000 a la posición 900
   this.tweens.add({
    targets: tapToShoot,
    x: 900, // Cambia la posición x según tu preferencia
    duration: 1000,
    ease: 'Linear'
});



    ////
    ciervo.on('pointerdown', (pointer) => {
      // Agregar el parámetro pointer aquí
      //console.log('Se hizo clic en la imagen del ciervo');

      // Activar la emisión de partículas en la posición del ratón si la sangre esta activada
      if (!apuntar) {
        // Generar un número entero aleatorio entre 1 y 3
        const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

        // Establecer condiciones dependiendo del número aleatorio generado
        if (numeroAleatorio === 1 && cantidadBalas > 0) {
          this.mostrarMensaje("has fallado prueba apuntando es más facil",2000);
        } else if (numeroAleatorio === 2 && cantidadBalas > 0) {
          this.mostrarMensaje("has fallado si no apuntas tienes posibilidades de fallar la bala",2000);
        } else if (numeroAleatorio === 3 && cantidadBalas > 0) {
          this.mostrarMensaje("vaya tiro!!! le has dado sin apuntar???",2000);
          this.eliminarCiervo(pointer);

          // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
         // Realizar el efecto de screen shake
         var shakeIntensity = 0.01; // Intensidad del shake
         var shakeDuration = 50; // Duración del shake en milisegundos
         this.cameras.main.shake(shakeDuration, shakeIntensity);
         // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
         rifle.anims.play('fire'); // Iniciar la animación del rifle
         cantidadBalas--;
         /////
         // Verificar la cantidad de balas y ocultar las imágenes correspondientes
         this.verBalas();
         /////
         //console.log('se resto una bala');
         // Agregar un retraso antes de iniciar la animación de recolocación
         setTimeout(() => {
           rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
         }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
          ciervo.destroy();
          tapToShoot.destroy(); 
          blackOverlay.destroy();
        }
      } else if (cantidadBalas > 0) {
        this.eliminarCiervo(pointer);

        // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
         // Realizar el efecto de screen shake
         var shakeIntensity = 0.01; // Intensidad del shake
         var shakeDuration = 50; // Duración del shake en milisegundos
         this.cameras.main.shake(shakeDuration, shakeIntensity);
         // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
         rifle.anims.play('fire'); // Iniciar la animación del rifle
         cantidadBalas--;
         /////
         // Verificar la cantidad de balas y ocultar las imágenes correspondientes
         this.verBalas();
         /////
         //console.log('se resto una bala');
         // Agregar un retraso antes de iniciar la animación de recolocación
         setTimeout(() => {
           rifle.anims.play('recolocateRifle'); // Volver a colocar el rifle
         }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        ciervo.destroy();
        tapToShoot.destroy(); 
        blackOverlay.destroy();
      }
    });
    // Resaltar la imagen del ciervo cuando se crea
    this.tweens.add({
      targets: ciervo,
      scaleX: 0.35, // Aumentar el tamaño en el eje x
      scaleY: 0.35, // Aumentar el tamaño en el eje y
      duration: 500, // Duración de la animación en milisegundos
      yoyo: true, // Hacer que la animación se revierta automáticamente
      repeat: -1 // Repetir la animación indefinidamente
  });

    ciervoExiste = true;
    tutorial = false;


  }

  ////////////////////MOSTRAR TEXTO/////////////////
  // Función para mostrar mensajes en la pantalla durante cierto tiempo
mostrarMensaje(mensaje, duracion) {
  const texto = this.add.text(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2, mensaje, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
  texto.setOrigin(0.5);

  setTimeout(() => {
      texto.destroy(); // Eliminar el texto después de la duración especificada
  }, duracion);
}
}
