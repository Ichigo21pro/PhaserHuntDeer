import { Scene } from 'phaser';

export class GameOver extends Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    // Obtener la puntuación y el tiempo de los datos pasados desde la escena anterior
    const { score, tiempo } = data;
    
    this.cameras.main.setBackgroundColor(0xB3B3B3);

    this.add.image(512, 384, 'backGround').setAlpha(0.5);

    //añadir el tiempo de juego
    this.add.text(400, 350, 'Tiempo: ' + tiempo, { fontSize: '20px', fontFamily: 'Madimi One', fill: '#fff' }).setOrigin(2.35,13.2);
    //
    //
    var Recuadro = this.add.image(512, 384, 'backGround').setAlpha(1);
    Recuadro.setOrigin(0.5,0.5);
    Recuadro.setScale(500/Recuadro.width,700/Recuadro.height);
  
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
  } });
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
    } });
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
      } });

    // Crear un rectángulo como borde del botón
    const buttonBorder = this.add.rectangle(400, 450, 200, 50, 0xFF5733).setStrokeStyle(3, 0x8B0000).setOrigin(0,-3.5);

    // Crear el texto del botón "Play Again"
    const playAgainText = this.add.text(400, 450, 'PLAY NOW', { fontSize: '32px', fontFamily: 'Madimi One', fill: '#000' }).setOrigin(-0.17, -4.8);
    //animacion de boton y letras
    //
// Define la escala inicial y final para la animación de pulsación
const initialScale = 1;
const finalScale = 1.1;

// Define la duración de la animación y la cantidad de veces que se repetirá
const duration = 500;
const repeatCount = -1; // -1 para repetir infinitamente

// Crea la animación de pulsación para el rectángulo del botón
this.tweens.add({
    targets: buttonBorder,
    scaleX: [initialScale, finalScale],
    scaleY: [initialScale, finalScale],
    duration: duration,
    yoyo: true,
    repeat: repeatCount
});

// Crea la animación de pulsación para el texto del botón "Play Again"
this.tweens.add({
    targets: playAgainText,
    scaleX: [initialScale, finalScale],
    scaleY: [initialScale, finalScale],
    duration: duration,
    yoyo: true,
    repeat: repeatCount
});
    //
    // Hacer que el botón sea interactivo
    buttonBorder.setInteractive();  

    // Agregar evento de clic al botón
    buttonBorder.on('pointerdown', () => {
      this.scene.start('Game'); // Vuelve a iniciar el juego al hacer clic en "Play Again"
    });
  }
}
