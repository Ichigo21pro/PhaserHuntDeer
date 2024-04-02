import { Scene } from "phaser";

var gameOver = false;

var fondo;
var scoreTime;
var tiempo = 0;
///
var visualizarSangre = true;
var ciervosMatar = 3;
var cantidadBalas = 6;
//var cargadorBalas = 1;
var tutorial = true;
//
var bullet1;
var bullet2;
var bullet3;
var bullet4;
var bullet5;
var bullet6;
var apuntar = false;
//
var emitter;
//var buttonText3;
var button3;
//
var ciervoExiste = false;
var rifle;
var brownBar;
//
var mensajeActivo = false;

//
let tiempoInicio = 0;
var finalLevel = false;
var noGenerarCiervo = false;
var juegoCompletado = false;
var gameOverExecuted = false;
//
var markA1;
var markA2;
var markA3;
var markI1;
var markI2;
var markI3;
//
var AnimacionSangre;
var seHizoClick = false;
let inactivo = false;
var temporizadorAFK;
//
var maskGraphicsScope;
var maskScope;
var blackOverlay;

export class Game extends Scene {
  constructor() {
    super("Game");
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

    //////////////
    //////////
    //////

    //  A simple background for our game
    fondo = this.add.image(
      this.scale.gameSize.width / 2,
      this.scale.gameSize.height / 2,
      "backGround"
    );
    fondo.setDisplaySize(this.scale.gameSize.width, this.scale.gameSize.height);

    //////
    //  The score

    //scoreTime = this.add.text(16, 50, 'Tiempo: 00:00:00', { fontSize: '32px', fill: '#000' });
    //////////

    // Detectar la tecla B presionada
    const keyB = this.input.keyboard.addKey("B");

    keyB.on("down", () => {
      // Agregar un rectángulo negro que cubra toda la pantalla
      blackOverlay = this.add.rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.5
      );
      blackOverlay.setOrigin(0);

      //this.scope.setMask(blackOverlay.createGeometryMask());
      //console.log('estas apuntando');
      // Iniciar la animación para aumentar la escala al apuntar
      this.scope.setScale(0.7);
      apuntar = true;
      // Habilitar pixelPerfect en la imagen del "scope"
    });
    keyB.on("up", () => {
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
      .sprite(this.scale.gameSize.width - 10, 10, "rifle")
      .setOrigin(1, -1)
      .setScale(0.5);
    rifle.setInteractive(); // Hacer que el sprite del rifle sea interactivo

    // Configurar la animación del rifle //
    this.anims.create({
      key: "fire",
      frames: this.anims.generateFrameNumbers("rifle", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0, // La animación se reproduce una vez
    });
    this.anims.create({
      key: "recolocateRifle",
      frames: this.anims.generateFrameNumbers("rifle", { start: 1, end: 0 }),
      frameRate: 10,
      repeat: 0, // La animación se reproduce una vez
    });
    //añadimos el sprite del ciervo
    this.anims.create({
      key: "deer_anim", // Nombre de la animación
      frames: this.anims.generateFrameNumbers("ciervo", { start: 0, end: 9 }), // Rango de frames en el spritesheet
      frameRate: 10, // Velocidad de la animación (cuántos frames por segundo)
      repeat: 0, // Repetir la animación 1 vez
    });
    //añadimos el sprite de la sangre
    this.anims.create({
      key: "bloodAnimation", // Nombre de la animación
      frames: this.anims.generateFrameNumbers("animacionSangreCiervo", {
        start: 0,
        end: 8,
      }), // Rango de frames en el spritesheet
      frameRate: 20, // Velocidad de la animación (cuántos frames por segundo)
      repeat: 0, // Repetir la animación 1 vez
    });
    //AnimacionSangre.anims.play('bloodAnimation');
    //añadimos el sprite de la tierra
    this.anims.create({
      key: "dirtAnimation",
      frames: this.anims.generateFrameNumbers("animacionTierraDisparo", {
        start: 0,
        end: 5,
      }), // Rango de frames en el spritesheet
      frameRate: 10, // Velocidad de la animación (cuántos frames por segundo)
      repeat: 0, // Repetir la animación 1 vez
    });
    ///////////////////////////////////////

    // Añadir una barra marrón en la parte inferior
    brownBar = this.add.rectangle(
      this.scale.gameSize.width / 2,
      this.scale.gameSize.height,
      this.scale.gameSize.width,
      85,
      0x8b4513
    );
    brownBar.setOrigin(0.5, 1); // Establecer el origen en la parte inferior

    // Añadir botón 1 a la barra marrón
    /*const button1 = this.add
      .image(100, this.scale.gameSize.height - 60, 'atlas', 'ui_button_Reload.png')
      .setOrigin(0.5, 0.2)
      .setInteractive();
    button1.on('pointerdown', () => {
      //console.log('Botón Reload clicado');

      if (cargadorBalas > 0) {
        cantidadBalas = 3;
        cargadorBalas--;
        this.mostrarMensaje('Has regargado con exito ! tienes 3 balas más', 2000);
        this.verBalas();
      } else {
        this.mostrarMensaje('No tienes más cargadores', 2000);
      }
    });
    const buttonText1 = this.add.text(button1.x, button1.y, 'Recargar', { fontFamily: 'Madimi One', fontSize: '30px', fill: '#000000' }).setOrigin(0, -0.2);
    */
    // Añadir botón 2 a la barra marrón
    const button2 = this.add
      .image(
        this.scale.gameSize.width / 2,
        this.scale.gameSize.height - 60,
        "atlas",
        "ui_button_Replay.png"
      )
      .setOrigin(3, 0)
      .setInteractive();
    button2.on("pointerdown", () => {
      // Cambiar el estado de visualizarSangre
      visualizarSangre = !visualizarSangre;

      // Imprimir un mensaje en la consola indicando si visualizarSangre está activo o desactivado
      if (visualizarSangre) {
        this.mostrarMensaje("Ahora veras las animaciones de sangre", 2000);
      } else {
        this.mostrarMensaje("Ya no veras las animaciones de sangre", 2000);
      }
    });
    const buttonText2 = this.add
      .text(button2.x, button2.y, "VIEWBLOOD", {
        fontFamily: "Madimi One",
        fontSize: "30px",
        fill: "#000000",
      })
      .setOrigin(3.07, -0.25);

    // Añadir botón 3 a la barra marrón
    /*button3 = this.add
      .image(
        this.scale.gameSize.width / 2,
        this.scale.gameSize.height - 60,
        "atlas",
        "ui_button_Replay.png"
      )
      .setOrigin(0.2, 0)
      .setInteractive();
    button3.on("pointerdown", () => {
      //console.log('Botón Para ver ciervos a los que matar');
    });
    buttonText3 = this.add
      .text(button3.x, button3.y, "Ciervos = " + ciervosMatar, {
        fontFamily: "Madimi One",
        fontSize: "30px",
        fill: "#000000",
      })
      .setOrigin(0.15, -0.2);*/

    // Añadir botón 4 a la barra marrón
    const button4 = this.add
      .image(
        this.scale.gameSize.width - 100,
        this.scale.gameSize.height - 60,
        "atlas",
        "ui_button_Continue.png"
      )
      .setOrigin(0.8, 0.1)
      .setInteractive();
    // Crear las imágenes de las balas
    bullet1 = this.add
      .sprite(button4.x - 60, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    bullet2 = this.add
      .sprite(button4.x - 30, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    bullet3 = this.add
      .sprite(button4.x, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    bullet4 = this.add
      .sprite(button4.x + 30, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    bullet5 = this.add
      .sprite(button4.x + 60, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    bullet6 = this.add
      .sprite(button4.x + 90, button4.y, "atlas", "bullet_small.png")
      .setOrigin(3, 0.2);
    button4.on("pointerdown", () => {
      //console.log('Balas');

      // Añadir las imágenes de las balas al botón
      button4.bullets = [bullet1, bullet2, bullet3, bullet4, bullet5, bullet6];
    });

    // boton 5 apuntar
    var button5 = this.add
      .image(
        this.scale.gameSize.width / 2,
        this.scale.gameSize.height - 60,
        "atlas",
        "ui_button_Replay.png"
      )
      .setOrigin(1.8, 0)
      .setInteractive();

    ///
    ///
    button5.on("pointerdown", () => {
      apuntar = !apuntar;

      if (apuntar) {
        // Agregar un rectángulo negro que cubra toda la pantalla
        blackOverlay = this.add.graphics();
        blackOverlay.fillStyle(0x000000, 0.8).fillRect(0, 0, 1024, 683);

        ////añadir mascara
        // Crear una gráfica para la máscara circular
        maskGraphicsScope = this.make.graphics();

        // Definir la posición y el radio del círculo
        const circleX = this.cameras.main.width / 2; // Posición x del círculo (centro del canvas)
        const circleY = this.cameras.main.height / 2; // Posición y del círculo (centro del canvas)
        const circleRadius = 120; // Radio del círculo

        // Dibujar un círculo en la gráfica
        maskGraphicsScope.fillStyle(0xffffff); // Color blanco para el círculo (la máscara oculta lo que no es blanco)
        maskGraphicsScope.fillCircle(circleX, circleY, circleRadius);

        // Crear una máscara a partir de la gráfica circular
        maskScope = new Phaser.Display.Masks.BitmapMask(
          this,
          maskGraphicsScope
        );
        maskScope.invertAlpha = true;

        // Aplicar la máscara al rectángulo negro
        blackOverlay.setMask(maskScope);

        ////
        ////

        ///////
        //blackOverlay.setOrigin(0);

        // Iniciar la animación para aumentar la escala al apuntar
        this.scope.setScale(0.7);

        // Habilitar pixelPerfect en la imagen del "scope"
      } else {
        blackOverlay.destroy();
        //console.log('ya no apuntas');

        // Iniciar la animación para reducir la escala al dejar de apuntar
        this.scope.setScale(0.3);
      }
    });

    var buttonText5 = this.add
      .text(button5.x, button5.y, "APUNTAR", {
        fontFamily: "Madimi One",
        fontSize: "30px",
        fill: "#000000",
      })
      .setOrigin(2.2, -0.25);
    ////////////////////

    // Añadir evento de clic del ratón para iniciar la animación del rifle
    this.input.on("pointerdown", (pointer) => {
      if (cantidadBalas <= 0) {
        this.mostrarMensaje("No te quedan balas", 2000);
      } else {
        // Verificar si el clic está por encima de la barra marrón
        if (pointer.y < this.scale.gameSize.height - 85) {
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play("fire"); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
          }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        }
      }

      ///
      // posible mejora que no se pueda spamear
      ///
    });
    //////////
    var button6 = this.add
      .image(750, 10, "deerTableScore")
      .setOrigin(0, 0)
      .setScale(0.5);
    markI1 = this.add
      .sprite(button6.x - 90, button6.y, "deerScoreInactive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    markI2 = this.add
      .sprite(button6.x, button6.y, "deerScoreInactive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    markI3 = this.add
      .sprite(button6.x + 90, button6.y, "deerScoreInactive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    markA1 = this.add
      .sprite(button6.x - 90, button6.y, "deerScoreActive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    markA2 = this.add
      .sprite(button6.x, button6.y, "deerScoreActive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    markA3 = this.add
      .sprite(button6.x + 90, button6.y, "deerScoreActive")
      .setOrigin(-1.4, 0.2)
      .setScale(0.7);
    ////////

    ///////
    //particulas
    emitter = this.add.particles(0, 0, "atlas", {
      frame: ["bloodP.png"],
      lifespan: 1000, // Reducir el tiempo de vida de las partículas a 1 segundo
      speed: { min: 50, max: 100 }, // Reducir la velocidad mínima y máxima
      scale: { start: 0.3, end: 0 }, // Reducir la escala inicial y final de las partículas
      gravityY: 50, // Reducir la gravedad
      blendMode: "ADD",
      emitting: false,
    });

    ////

    // Añadir la imagen del scope una vez en el método create
    this.scope = this.add.image(0, 0, "atlas", "scope.png").setOrigin(0.5);

    // Establecer la escala de la imagen del scope
    this.scope.setScale(0.3);

    // Ocultar el scope al principio
    this.scope.setVisible(false);

    // Detectar movimiento del ratón
    this.input.on("pointermove", (pointer) => {
      // Mostrar el scope y actualizar su posición al mover el ratón
      this.scope.setVisible(true);
      this.scope.setPosition(pointer.x, pointer.y);
    });

    // Iniciar el temporizador de inactividad al cargar el juego
    temporizadorAFK = setTimeout(() => {
      this.gameOver();
    }, 20000); // 20 segundos en milisegundos

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

    ////////////////
  }
  ///////////// UPDATE ///////////
  update(time, deltaTime) {
    if (gameOver) {
      return;
    }

    this.input.on("pointermove", (pointer) => {
      if (apuntar) {
        this.updateMaskPosition(pointer);
      }
    });

    this.input.on("pointerdown", () => {
      inactivo = false;
      this.reiniciarTemporizador();
    });

    if (tutorial) {
      this.tutorial();
    } else {
      this.actualizarCiervos();
    }

    /*if (cursors.B.isDown) {
      //this.create2Bomb();
    }*/
    if (this.scope.visible) {
      // Verificar si se hizo clic en el juego
      if (this.input.activePointer.isDown) {
        if (this.input.activePointer.y < this.scale.gameSize.height - 150) {
          this.scope.setPosition(
            this.input.activePointer.x,
            this.input.activePointer.y
          );
        }
        // Establecer la posición del scope en las coordenadas del clic
      } else {
        // Si no se hizo clic, seguir la posición del ratón
        this.scope.setPosition(
          this.input.mousePointer.x,
          this.input.mousePointer.y
        );
      }
    }
    ////////////

    // console.log('Game - update - cantidadBalas:', cantidadBalas, ', cargadorBalas:', cargadorBalas, ', ciervosMatar:', ciervosMatar);
    if (!finalLevel) {
      if (cantidadBalas == 0 && ciervosMatar > 0) {
        this.mostrarMensaje(
          "Has perdido no tienes ni balas ni cargadores",
          2000
        );
        gameOver = true;
        setTimeout(() => {
          this.gameOver();
        }, 1500);
      } else if (ciervosMatar <= 0) {
        noGenerarCiervo = true;
        finalLevel = true;
        if (!juegoCompletado) {
          setTimeout(() => {
            this.final();
          }, 1500);
        }
      }
    }

    /////////////
    // Simular el movimiento de respiración
    const frecuencia = 0.001; // Ajusta la frecuencia del movimiento de respiración según sea necesario
    const amplitud = 0.03; // Ajusta la amplitud del movimiento de respiración según sea necesario

    const tiempoActual = this.time.now;
    const tiempoTranscurrido = tiempoActual - tiempoInicio;

    // Calcula la posición vertical del rifle utilizando una función sinusoidal para el movimiento oscilatorio
    const movimientoRespiracion =
      amplitud * Math.sin(frecuencia * tiempoTranscurrido);

    // Aplica el movimiento al rifle
    rifle.y += movimientoRespiracion;

    //this.tiempoReal(deltaTime);
  }

  ///////////// OTHER FUNCTION ///////////

  ///////////// BALAS VISIBLES ///////////
  verBalas() {
    if (cantidadBalas >= 6) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1);
      bullet4.setAlpha(1);
      bullet5.setAlpha(1);
      bullet6.setAlpha(1);
    } else if (cantidadBalas == 5) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1);
      bullet4.setAlpha(1);
      bullet5.setAlpha(1);
      bullet6.setAlpha(0);
    } else if (cantidadBalas == 4) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1);
      bullet4.setAlpha(1);
      bullet5.setAlpha(0);
      bullet6.setAlpha(0);
    } else if (cantidadBalas == 3) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(1);
      bullet4.setAlpha(0);
      bullet5.setAlpha(0);
      bullet6.setAlpha(0);
    } else if (cantidadBalas == 2) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(1);
      bullet3.setAlpha(0);
      bullet4.setAlpha(0);
      bullet5.setAlpha(0);
      bullet6.setAlpha(0);
    } else if (cantidadBalas == 1) {
      bullet1.setAlpha(1);
      bullet2.setAlpha(0);
      bullet3.setAlpha(0);
      bullet4.setAlpha(0);
      bullet5.setAlpha(0);
      bullet6.setAlpha(0);
    } else if (cantidadBalas == 0) {
      bullet1.setAlpha(0);
      bullet2.setAlpha(0);
      bullet3.setAlpha(0);
      bullet4.setAlpha(0);
      bullet5.setAlpha(0);
      bullet6.setAlpha(0);
    }
  }
  ////////////// TIEMPO//////////
  /*tiempoReal(deltaTime) {
    tiempo += deltaTime / 1000;

    var horas = Math.floor(tiempo / 3600);
    var minutos = Math.floor((tiempo % 3600) / 60);
    var segundos = tiempo % 60;

    this.tiempoFormateado = (horas < 10 ? '0' : '') + horas + ':' + (minutos < 10 ? '0' : '') + minutos + ':' + Math.floor(segundos).toString().padStart(2, '0');

    return scoreTime.setText('Tiempo: ' + this.tiempoFormateado);
  }*/

  /////////// crear ciervo ////////
  crearCiervo(
    posX = this.scale.gameSize.width / 2,
    posY = this.scale.gameSize.height / 2,
    scale = 1
  ) {
    // Añadir la imagen del ciervo
    const ciervo = this.add
      .image(posX, posY, "deer")
      .setInteractive({ pixelPerfect: true });

    // Establecer la escala de la imagen del ciervo
    ciervo.setScale(scale);
    //añadir tiempo

    /////
    /////
    this.input.on("pointerdown", (pointer) => {
      //si no se hace click
      clearTimeout(tiempoEspera);
      seHizoClick = true;
      setTimeout(() => {
        seHizoClick = false;
      }, 5000);
      //si se clickea fuer del parametro del ciervo
      if (!ciervo.getBounds().contains(pointer.x, pointer.y)) {
        // Si el clic no está dentro de los límites del ciervo, significa que no se hizo clic en el ciervo
        var anim = this.add.sprite(pointer.x, pointer.y, "dirtAnimation");
        anim.setScale(0.2); // Ajusta la escala según sea necesario
        anim.anims.play("dirtAnimation");
        // Aquí puedes agregar cualquier otra lógica que necesites para el caso en que no se haga clic en el ciervo
        //console.log("estoy diparando fuera del ciervo");
      }
    });

    // Agregar evento de clic a la imagen del ciervo
    ciervo.on("pointerdown", (pointer) => {
      // Agregar el parámetro pointer aquí
      //console.log('Se hizo clic en la imagen del ciervo');

      // Activar la emisión de partículas en la posición del ratón si la sangre esta activada
      if (!apuntar) {
        // Generar un número entero aleatorio entre 1 y 3
        const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

        // Establecer condiciones dependiendo del número aleatorio generado
        if (numeroAleatorio === 1 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado prueba apuntando es más facil",
            2000
          );
        } else if (numeroAleatorio === 2 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado si no apuntas tienes posibilidades de fallar la bala",
            2000
          );
        } else if (numeroAleatorio === 3 && cantidadBalas > 0) {
          this.mostrarMensaje("vaya tiro!!! le has dado sin apuntar???", 2000);
          this.eliminarCiervo(pointer);

          // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play("fire"); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
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
        rifle.anims.play("fire"); // Iniciar la animación del rifle
        cantidadBalas--;
        /////
        // Verificar la cantidad de balas y ocultar las imágenes correspondientes
        this.verBalas();
        /////
        //console.log('se resto una bala');
        // Agregar un retraso antes de iniciar la animación de recolocación
        setTimeout(() => {
          rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
        }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        ciervo.destroy();
      }
    });
    var tiempoEspera = setTimeout(() => {
      if (!seHizoClick) {
        // Aquí puedes agregar lo que quieres que pase si no se mata al ciervo en 15 segundos
        this.mostrarMensaje(
          "tienes que disparar al ciervo, lo sabes verdad?",
          4000
        );
      }
    }, 7000);
  }

  ///////////////////ACTUALIZAR TEXTO/////////////
  // Función para actualizar el texto que muestra la cantidad de ciervos restantes
  actualizarTextoCiervos() {
    if (ciervosMatar >= 3) {
      markA1.setAlpha(1);
      markA2.setAlpha(1);
      markA3.setAlpha(1);
      markI1.setAlpha(0);
      markI2.setAlpha(0);
      markI3.setAlpha(0);
    } else if (ciervosMatar == 2) {
      markA1.setAlpha(1);
      markA2.setAlpha(1);
      markA3.setAlpha(0);
      markI1.setAlpha(0);
      markI2.setAlpha(0);
      markI3.setAlpha(1);
    } else if (ciervosMatar == 1) {
      markA1.setAlpha(1);
      markA2.setAlpha(0);
      markA3.setAlpha(0);
      markI1.setAlpha(0);
      markI2.setAlpha(1);
      markI3.setAlpha(1);
    } else if (ciervosMatar == 0) {
      markA1.setAlpha(0);
      markA2.setAlpha(0);
      markA3.setAlpha(0);
      markI1.setAlpha(1);
      markI2.setAlpha(1);
      markI3.setAlpha(1);
    }
    // Actualizar el texto que muestra la cantidad de ciervos restantes
    //buttonText3.setText("Ciervos = " + ciervosMatar);
  }
  /////////////////ELIMINAR CIERVO//////////
  eliminarCiervo(pointer) {
    // Obtener la posición del ratón en el momento del clic
    const mouseX = pointer.x;
    const mouseY = pointer.y;

    if (visualizarSangre && cantidadBalas > 0) {
      emitter.setPosition(mouseX, mouseY);
      emitter.explode(16);
      // Crear la animación de sangre en la posición del cursor
      var anim = this.add.sprite(mouseX, mouseY, "animacionSangre");
      anim.setScale(0.1); // Ajusta la escala según sea necesario
      anim.anims.play("bloodAnimation");
      //////////

      // Escucha el evento animationcomplete
      anim.on(
        "animationcomplete",
        function () {
          // Destruye el sprite una vez que la animación ha terminado
          anim.destroy();
        },
        this
      );
    }
    if (noGenerarCiervo) {
      // Actualizar el texto que muestra la cantidad de ciervos restantes
      this.actualizarTextoCiervos();
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
    this.scene.start("GameOver");

    cantidadBalas = 3;
    ciervosMatar = 3;
    tutorial = true;
  }
  ///////////// actualizar ciervos /////
  actualizarCiervos() {
    if (!ciervoExiste && !noGenerarCiervo) {
      // Generar un número aleatorio entre 1 y 3
      const numeroAleatorio = Math.floor(Math.random() * 3) + 1;
      // Generar un número aleatorio entre 100 y 1000 para la posición en el eje x
      const posicionX = Math.floor(Math.random() * 801) + 100;
      switch (numeroAleatorio) {
        case 1:
          this.crearCiervo(posicionX, 300, 0.2);
          ciervoExiste = true;
          // Acciones para el caso 1
          break;
        case 2:
          this.crearCiervo(posicionX, 350, 0.3);
          ciervoExiste = true;
          // Acciones para el caso 2
          break;
        case 3:
          this.crearCiervo(posicionX, 450, 0.4);
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
    // Agregar un rectángulo negro que cubra toda la pantalla
    //const blackOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
    //blackOverlay.setOrigin(0);
    const overlay = this.add.graphics();

    overlay.fillStyle(0x000000, 0.8).fillRect(0, 0, 1024, 683);

    const maskGraphics = this.make.graphics();

    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillCircle(850, 370, 90);

    const mask = new Phaser.Display.Masks.BitmapMask(this, maskGraphics);

    mask.invertAlpha = true;

    overlay.setMask(mask);
    // Crear el sprite del ciervo
    const ciervo = this.add.sprite(1000, 350, "ciervo");
    ciervo.setScale(0.3);
    ciervo.setInteractive(); // Habilitar interactividad para el sprite

    // Crear la animación del ciervo
    this.anims.create({
      key: "ciervo_anim", // Nombre de la animación
      frames: this.anims.generateFrameNumbers("ciervo", { start: 0, end: 18 }), // Rango de frames en el spritesheet
      frameRate: 10, // Velocidad de la animación (cuántos frames por segundo)
      repeat: 0, //
    });

    // Reproducir la animación del ciervo
    ciervo.play("ciervo_anim");

    // Agregar la imagen 'tap_to_shoot' desde el atlas
    const tapToShoot = this.add.image(1000, 360, "atlas", "tap_to_shoot.png");
    tapToShoot.setScale(0.5); // Puedes ajustar el valor según tu preferencia
    tapToShoot.setDepth(1);

    // Animar la transición del ciervo y 'tap to shoot' desde la posición 1000 a la posición 850 y 900 respectivamente
    var animacionCiervoCorazon = this.tweens.add({
      targets: ciervo,
      scaleX: 0.35,
      scaleY: 0.35,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: ciervo,
      x: 850,
      duration: 1000,
      ease: "Linear",
      onComplete: () => {
        // Una vez que la animación ha terminado, resaltar solo el ciervo
        animacionCiervoCorazon.play();
      },
    });

    // Animar la transición de 'tap to shoot' desde la posición 1000 a la posición 900
    this.tweens.add({
      targets: tapToShoot,
      x: 900, // Cambia la posición x según tu preferencia
      duration: 1000,
      ease: "Linear",
    });

    // Resaltar la imagen del ciervo cuando se crea
    var animacionCiervoCorazon2 = this.tweens.add({
      targets: ciervo,
      scaleX: 0.35, // Aumentar el tamaño en el eje x
      scaleY: 0.35, // Aumentar el tamaño en el eje y
      duration: 500, // Duración de la animación en milisegundos
      yoyo: true, // Hacer que la animación se revierta automáticamente
      repeat: -1, // Repetir la animación indefinidamente
    });

    ////
    ciervo.on("pointerdown", (pointer) => {
      // Agregar el parámetro pointer aquí
      //console.log('Se hizo clic en la imagen del ciervo');

      // Activar la emisión de partículas en la posición del ratón si la sangre esta activada
      if (!apuntar) {
        // Generar un número entero aleatorio entre 1 y 3
        const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

        // Establecer condiciones dependiendo del número aleatorio generado
        if (numeroAleatorio === 1 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado prueba apuntando es más facil",
            2000
          );
        } else if (numeroAleatorio === 2 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado si no apuntas tienes posibilidades de fallar la bala",
            2000
          );
        } else if (numeroAleatorio === 3 && cantidadBalas > 0) {
          this.mostrarMensaje("vaya tiro!!! le has dado sin apuntar???", 2000);
          this.eliminarCiervo(pointer);

          // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play("fire"); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
          }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)

          ciervo.destroy();
          tapToShoot.destroy();
          // blackOverlay.destroy();
          overlay.destroy();
          maskGraphics.destroy();
          mask.destroy();
        }
      } else if (cantidadBalas > 0) {
        this.eliminarCiervo(pointer);

        // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
        // Realizar el efecto de screen shake
        var shakeIntensity = 0.01; // Intensidad del shake
        var shakeDuration = 50; // Duración del shake en milisegundos
        this.cameras.main.shake(shakeDuration, shakeIntensity);
        // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
        rifle.anims.play("fire"); // Iniciar la animación del rifle
        cantidadBalas--;
        /////
        // Verificar la cantidad de balas y ocultar las imágenes correspondientes
        this.verBalas();
        /////
        //console.log('se resto una bala');
        // Agregar un retraso antes de iniciar la animación de recolocación
        setTimeout(() => {
          rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
        }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        ciervo.destroy();
        tapToShoot.destroy();
        // blackOverlay.destroy();
        overlay.destroy();
        maskGraphics.destroy();
        mask.destroy();
      }
    });
    this.input.on("pointerdown", (pointer) => {
      if (!ciervo.getBounds().contains(pointer.x, pointer.y)) {
        // Si el clic no está dentro de los límites del ciervo, significa que no se hizo clic en el ciervo
        var anim = this.add.sprite(pointer.x, pointer.y, "dirtAnimation");
        anim.setScale(0.1); // Ajusta la escala según sea necesario
        anim.anims.play("dirtAnimation");
        // Aquí puedes agregar cualquier otra lógica que necesites para el caso en que no se haga clic en el ciervo
      }
    });
    // Resaltar la imagen del ciervo cuando se crea
    var animacionCiervoCorazon3 = this.tweens.add({
      targets: ciervo,
      scaleX: 0.35, // Aumentar el tamaño en el eje x
      scaleY: 0.35, // Aumentar el tamaño en el eje y
      duration: 500, // Duración de la animación en milisegundos
      yoyo: true, // Hacer que la animación se revierta automáticamente
      repeat: -1, // Repetir la animación indefinidamente
    });

    ciervoExiste = true;
    tutorial = false;

    //si pasa el tiempo y no se hace nada
    setTimeout(() => {
      overlay.destroy();
      maskGraphics.destroy();
      mask.destroy();
      tapToShoot.destroy();
      animacionCiervoCorazon.stop();
      animacionCiervoCorazon2.stop();
      animacionCiervoCorazon3.stop();
    }, 10000);
  }

  ////////////////////MOSTRAR TEXTO/////////////////
  // Función para mostrar mensajes en la pantalla durante cierto tiempo
  mostrarMensaje(mensaje, duracion) {
    // Verifica si ya hay un mensaje activo
    if (mensajeActivo) {
      // Si hay un mensaje activo, no hagas nada
      return;
    }

    // Crea el texto del mensaje
    const texto = this.add.text(
      this.scale.gameSize.width / 2,
      this.scale.gameSize.height / 2,
      mensaje,
      { fontFamily: "Arial", fontSize: "24px", fill: "#ffffff" }
    );
    texto.setOrigin(0.5);

    // Calcula el ancho y la altura del rectángulo de fondo
    const paddingX = 10;
    const paddingY = 5;
    const backgroundWidth = texto.width + paddingX * 2;
    const backgroundHeight = texto.height + paddingY * 2;

    // Crea el rectángulo de fondo
    const background = this.add.graphics();
    background.fillStyle(0xcfb53b, 0.2); // Color y opacidad del fondo
    background.fillRect(
      texto.x - backgroundWidth / 2,
      texto.y - backgroundHeight / 2,
      backgroundWidth,
      backgroundHeight
    );

    // Establece la variable de estado del mensaje como activa
    mensajeActivo = true;

    setTimeout(() => {
      // Elimina el texto y el fondo después de la duración especificada
      texto.destroy();
      background.destroy();
      // Restablece la variable de estado del mensaje como inactiva
      mensajeActivo = false;
    }, duracion);
  }

  ////////////////FINAL LEVL////////////////
  final() {
    // Agregar un rectángulo negro que cubra toda la pantalla
    const blackOverlay = this.add.rectangle(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.5
    );
    blackOverlay.setOrigin(0);

    //no generar ciervo
    noGenerarCiervo = true;

    // Agregar ciervo
    const ciervoF = this.add
      .image(500, 350, "deer")
      .setInteractive({ pixelPerfect: true });
    ciervoF.setScale(0.1);

    // Mostrar un mensaje indicando que es el último ciervo y la última bala
    this.mostrarMensaje("Último ciervo, última bala", 2000);

    // Condiciones
    ciervosMatar = 1;
    cantidadBalas = 1;
    this.actualizarTextoCiervos();
    this.verBalas();
    noGenerarCiervo = true;

    juegoCompletado = true;

    //mecanica de matar ciervo
    ciervoF.on("pointerdown", (pointer) => {
      // Agregar el parámetro pointer aquí
      //console.log('Se hizo clic en la imagen del ciervo');

      // Activar la emisión de partículas en la posición del ratón si la sangre esta activada
      if (!apuntar) {
        // Generar un número entero aleatorio entre 1 y 3
        const numeroAleatorio = Math.floor(Math.random() * 3) + 1;

        // Establecer condiciones dependiendo del número aleatorio generado
        if (numeroAleatorio === 1 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado te la has jugado a no apuntar",
            2000
          );
        } else if (numeroAleatorio === 2 && cantidadBalas > 0) {
          this.mostrarMensaje(
            "has fallado si no apuntas tienes posibilidades de fallar la bala",
            2000
          );
        } else if (numeroAleatorio === 3 && cantidadBalas > 0) {
          this.mostrarMensaje("vaya tiro!!! le has dado sin apuntar???", 2000);
          this.eliminarCiervo(pointer);
          ciervoF.destroy();
          setTimeout(() => {
            this.gameOver();
            gameOver = true;
          }, 2000);

          // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
          // Realizar el efecto de screen shake
          var shakeIntensity = 0.01; // Intensidad del shake
          var shakeDuration = 50; // Duración del shake en milisegundos
          this.cameras.main.shake(shakeDuration, shakeIntensity);
          // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
          rifle.anims.play("fire"); // Iniciar la animación del rifle
          cantidadBalas--;
          /////
          // Verificar la cantidad de balas y ocultar las imágenes correspondientes
          this.verBalas();
          /////
          //console.log('se resto una bala');
          // Agregar un retraso antes de iniciar la animación de recolocación
          setTimeout(() => {
            rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
          }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)

          ciervo.destroy();
          blackOverlay.destroy();
          setTimeout(() => {
            this.gameOver();
            gameOver = true;
          }, 2000);
          this.mostrarMensaje(
            "buen tiro has demostrado ser todo un cazador",
            2000
          );

          setTimeout(() => {
            this.gameOver();
            gameOver = true;
          }, 2000);
        }
      } else if (cantidadBalas > 0) {
        this.eliminarCiervo(pointer);

        // Establecer un temporizador para destruir el ciervo después de un cierto tiempo (por ejemplo, 1 segundo)
        // Realizar el efecto de screen shake
        var shakeIntensity = 0.01; // Intensidad del shake
        var shakeDuration = 50; // Duración del shake en milisegundos
        this.cameras.main.shake(shakeDuration, shakeIntensity);
        // Si el clic está por encima de la barra marrón, iniciar la animación del rifle
        rifle.anims.play("fire"); // Iniciar la animación del rifle
        cantidadBalas--;
        /////
        // Verificar la cantidad de balas y ocultar las imágenes correspondientes
        this.verBalas();
        /////
        //console.log('se resto una bala');
        // Agregar un retraso antes de iniciar la animación de recolocación
        setTimeout(() => {
          rifle.anims.play("recolocateRifle"); // Volver a colocar el rifle
        }, 300); // Tiempo en milisegundos (300 milisegundos = 0.3 segundos)
        ciervoF.destroy();
        this.mostrarMensaje(
          "buen tiro has demostrado ser todo un cazador",
          2000
        );
        blackOverlay.destroy();
        setTimeout(() => {
          this.gameOver();
          gameOver = true;
        }, 2000);
      }
      /*if (cantidadBalas <= 0) {
        //this.mostrarMensaje('has fallado la bala... buen intento', 2000);
        setTimeout(() => {
          this.gameOver();
          gameOver = true;
          console.log('me ejecuto');
        }, 2000);
      }*/

      finalLevel = false;
    });
    this.input.on("pointerdown", (pointer) => {
      // Verificar si el objetivo del evento no es la imagen del ciervo
      if (!gameOverExecuted) {
        this.mostrarMensaje("vaya has fallado el tiro...", 2000);
        setTimeout(() => {
          this.gameOver();
          gameOver = true;
          gameOverExecuted = true; // Marcar que el game over se ha ejecutado
        }, 2000);
      }
    });
    this.input.on("pointerdown", (pointer) => {
      if (!ciervoF.getBounds().contains(pointer.x, pointer.y)) {
        // Si el clic no está dentro de los límites del ciervo, significa que no se hizo clic en el ciervo
        var anim = this.add.sprite(pointer.x, pointer.y, "dirtAnimation");
        anim.setScale(0.1); // Ajusta la escala según sea necesario
        anim.anims.play("dirtAnimation");
        // Aquí puedes agregar cualquier otra lógica que necesites para el caso en que no se haga clic en el ciervo
      }
    });
  }
  ////////////////////////
  // Función para reiniciar el temporizador de inactividad
  reiniciarTemporizador() {
    clearTimeout(temporizadorAFK);
    temporizadorAFK = setTimeout(() => {
      this.gameOver();
    }, 20000); // 20 segundos en milisegundos
  }
  ////////////////////
  // Función para actualizar la posición de la máscara circular
  updateMaskPosition(pointer) {
    // Actualizar la posición del círculo de la máscara
    maskGraphicsScope.clear(); // Limpiar la máscara para actualizarla
    maskGraphicsScope.fillStyle(0xffffff); // Color blanco para el círculo
    maskGraphicsScope.fillCircle(pointer.x, pointer.y, 120); // Dibujar el círculo en la posición del puntero

    // Actualizar la máscara con la nueva gráfica
    maskScope = new Phaser.Display.Masks.BitmapMask(this, maskGraphicsScope);
    maskScope.invertAlpha = true;
    blackOverlay.setMask(maskScope); // Aplicar la máscara al rectángulo negro
  }
}
