import 'phaser';

export default class Hud extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		scene.add.existing(this);

		const { rightTopCorner } = scene.config;

		this.containerWidth = 70;

		this.setPosition(rightTopCorner.x - this.containerWidth, rightTopCorner.y + 15);

		this.setScrollFactor(0);

		this.setupList();
	}

	setupList() {
		const scoreBoard = this.createScoreBoard();
		this.add(scoreBoard);
	}

	createScoreBoard() {
		const fontSize = 20;

		const scoreText = this.scene.add.text(0, 0, '0', {
			fontSize: `${fontSize}px`,
			fill: '#fff',
		});

		const scoreImage = this.scene.add
			.image(scoreText.width + 5, 0, 'diamond')
			.setOrigin(0)
			.setScale(1.5);

		const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
		scoreBoard.setName('scoreBoard');

		return scoreBoard;
	}

	updateScoreBoard(score) {
		const [scoreText, scoreImage] = this.getByName('scoreBoard').list;
		scoreText.setText(score);
		scoreImage.setX(scoreText.width + 5);
	}
}
