export default (anims) => {
	anims.create({
		key: 'snakey-walk',
		frames: anims.generateFrameNumbers('snakey', { start: 0, end: 8 }),
		frameRate: 8,
		repeat: -1,
	});

	anims.create({
		key: 'snakey-damaged',
		frames: anims.generateFrameNumbers('snakey', { start: 21, end: 22 }),
		frameRate: 10,
		repeat: 0,
	});
};
