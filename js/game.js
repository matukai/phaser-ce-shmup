(Phaser => {
  console.log(Phaser);
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game'
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const PLAYER_BULLET_SPEED = 6;
  const SQRT_TWO = Math.sqrt(2);
  const ENEMY_SPAWN_FREQ = 100;
  const randomGenerator = new Phaser.RandomDataGenerator();

  const ENEMY_SPEED = 4.5;
  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, {
    preload,
    create,
    update
  });

  let player;
  let cursors;
  let playerBullets;
  let enemies;

  //load assets | core game methods
  function preload() {
    game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    player = game.add.sprite(200, 400, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
  };

  //runs every 60 secs
  function update() {
    handlePlayerMovement();
    handleBulletAnimations();

    cleanup();
    randomlySpawnEnemy();
    handleEnemyActions();
  };

  //handler function 
  function handlePlayerMovement() {
    let movingH = SQRT_TWO;
    let movingV = SQRT_TWO;
    if (cursors.up.isDown || cursors.down.isDown) {
      movingH = 1; // slow down diagonal movement
    }
    if (cursors.left.isDown || cursors.right.isDown) {
      movingV = 1; // slow down diagonal movement
    }
    switch (true) {
      case cursors.left.isDown:
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch (true) {
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
    }
  };

  //handler functions
  function handlePlayerFire() {
    playerBullets.add(game.add.sprite(player.x, player.y, GFX, 7));
  };

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => bullet.y -= PLAYER_BULLET_SPEED);
  };
  //
  function randomlySpawnEnemy() {
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, -24, GFX, 0));
    }
  }

  function handleEnemyActions() {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
  };

  //utilities functions
  function cleanup() {
    playerBullets.children
      .filter( bullet => bullet.y < -14 )
      .forEach( bullet => bullet.destroy() );
  };





})(window.Phaser);