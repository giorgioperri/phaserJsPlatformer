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
		const fontSize = 6;

		const scoreText = this.scene.add
			.text(-17, -12, '0', {
				fontSize: `${fontSize}px`,
				fill: '#fff',
				fontFamily: 'NHU',
			})
			.setStroke('#000000', 5);

		const scoreImage = this.scene.add.image(25, 0, 'battery').setOrigin(0, 0.3).setScale(1.5);

		const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
		scoreBoard.setName('scoreBoard');

		return scoreBoard;
	}

	updateScoreBoard(score) {
		const [scoreText, scoreImage] = this.getByName('scoreBoard').list;
		scoreText.setText(score);
	}
}
