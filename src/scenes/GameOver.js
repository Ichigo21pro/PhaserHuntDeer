import { Scene } from 'phaser';

export class GameOver extends Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    // Obtener la puntuación y el tiempo de los datos pasados desde la escena anterior
    const { score, tiempo } = data;

    this.cameras.main.setBackgroundColor(0xb3b3b3);

    this.add.image(512, 384, 'backGround').setAlpha(0.5);

    //añadir el tiempo de juego
    this.add.text(400, 350, 'Tiempo: ' + tiempo, { fontSize: '20px', fontFamily: 'Madimi One', fill: '#fff' }).setOrigin(2.35, 13.2);
    //
    //
    var Recuadro = this.add.image(512, 384, 'backGround').setAlpha(1);
    Recuadro.setOrigin(0.5, 0.5);
    Recuadro.setScale(500 / Recuadro.width, 700 / Recuadro.height);

    //

    //letras gameOver
    const logo = this.add.image(512, -100, 'atlas', 'logo.png');
    //imagen del ciervo y perro
    const deer = this.add.image(1300, 400, 'atlas', 'deer.png');
    deer.setScale(0.7); // Escalar la imagen si es necesario
    const perro = this.add.image(-150, 450, 'atlas', 'dog.png');
    perro.setScale(0.7);
    // Crear una animación para mover el ciervo hacia la posición x = 600
    this.tweens.add({
      targets: deer,
      x: 626,
      duration: 1000, // Duración de la animación en milisegundos
      ease: 'Linear', // Tipo de interpolación (lineal en este caso)
      onComplete: () => {
        // Se ejecuta cuando la animación se completa
        //
        // Aquí puedes agregar más acciones después de que la animación se complete
      },
    });
    //animacion del perro
    this.tweens.add({
      targets: perro,
      x: 364,
      duration: 1000, // Duración de la animación en milisegundos
      ease: 'Linear', // Tipo de interpolación (lineal en este caso)
      onComplete: () => {
        // Se ejecuta cuando la animación se completa
        //
        // Aquí puedes agregar más acciones después de que la animación se complete
      },
    });
    //animacion logo
    this.tweens.add({
      targets: logo,
      y: 150,
      duration: 1000, // Duración de la animación en milisegundos
      ease: 'Linear', // Tipo de interpolación (lineal en este caso)
      onComplete: () => {
        // Se ejecuta cuando la animación se completa
        //
        // Aquí puedes agregar más acciones después de que la animación se complete
      },
    });

    // Crear un rectángulo como borde del botón
    const buttonBorder = this.add.image(505, 650, 'buttonAgain');
    buttonBorder.setScale(0.6);

    // Animación de pulsación
    this.tweens.add({
      targets: buttonBorder,
      scaleX: buttonBorder.scaleX * 0.9, // Escala en el eje X al 90% del tamaño original
      scaleY: buttonBorder.scaleX * 0.9, // Escala en el eje Y al 90% del tamaño original
      duration: 700, // Duración de la animación en milisegundos
      yoyo: true, // Hacer que la animación se repita de vuelta al estado original
      repeat: -1, // Repetir la animación indefinidamente
    });

    //
    // Hacer que el botón sea interactivo
    buttonBorder.setInteractive();

    // Agregar evento de clic al botón
    buttonBorder.on('pointerdown', () => {
      window.open('https://play.google.com/store/apps/details?id=com.fullfat.deerhunter&hl=es_MX', '_blank'); // Vuelve a iniciar el juego al hacer clic en "Play Again"
    });
  }
}
