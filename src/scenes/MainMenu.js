import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(512, 384, "backGround").setScale(1.2);

    this.add.image(512, 340, "atlas", "logo.png");

    this.add
      .text(512, 460, "Se un cazador", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Espera 3 segundos antes de iniciar la escena
    setTimeout(() => {
      this.scene.start("Game");
    }, 3000);
  }
}
