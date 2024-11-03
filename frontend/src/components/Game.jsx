import { useEffect, useRef } from "react";
import Phaser from "phaser";

const GatherLikeGame = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: gameContainer.current.clientWidth,
      height: gameContainer.current.clientHeight,
      scene: {
        preload,
        create,
        update,
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Load each directional sprite or use a single spritesheet if available
      this.load.spritesheet("player-front", "front (2).png", {
        frameWidth: 32,
        frameHeight: 42,
      });
      this.load.spritesheet("player-back", "back (1).png", {
        frameWidth: 32,
        frameHeight: 42,
      });
      this.load.spritesheet("player-left", "left.png", {
        frameWidth: 32,
        frameHeight: 42,
      });
      this.load.spritesheet("player-right", "righ.png", {
        frameWidth: 32,
        frameHeight: 40,
      });
      this.load.image("background", "/ex.png"); // Ensure path is correct
    }

    function create() {
      // Add background tile
      this.background = this.add.tileSprite(0, 0, 2000, 2000, "background").setOrigin(0, 0);

      // Set world bounds and camera bounds
      this.cameras.main.setBounds(0, 0, 2000, 2000);
      this.physics.world.setBounds(0, 0, 2000, 2000);

      // Create animations for each direction
      this.anims.create({
        key: "walk-front",
        frames: this.anims.generateFrameNumbers("player-front", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "walk-back",
        frames: this.anims.generateFrameNumbers("player-back", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "walk-left",
        frames: this.anims.generateFrameNumbers("player-left", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "walk-right",
        frames: this.anims.generateFrameNumbers("player-right", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      // Create the player sprite with an initial direction (e.g., front)
      this.player = this.physics.add.sprite(100, 100, "player-front").setCollideWorldBounds(true);
      this.player.play("walk-front"); // Initial animation

      // Add a floating name label above the player
      this.player.nameLabel = this.add
        .text(0, -20, "Player Name", { fontSize: "14px", color: "#FFFFFF" })
        .setOrigin(0.5);

      // Make the camera follow the player
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

      // Set up controls
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      this.player.setVelocity(0); // Stop movement when no key is pressed

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.play("walk-left", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.play("walk-right", true);
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
        this.player.play("walk-back", true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
        this.player.play("walk-front", true);
      } else {
        this.player.anims.stop(); // Stop animation when idle
      }

      // Update name label position above the player
      this.player.nameLabel.x = this.player.x;
      this.player.nameLabel.y = this.player.y - 25;

      // Scroll the background image to match camera’s position
      this.background.tilePositionX = this.cameras.main.scrollX;
      this.background.tilePositionY = this.cameras.main.scrollY;
    }

    // Clean up Phaser game instance on component unmount
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} className="w-full h-full" />;
};

export default GatherLikeGame;
