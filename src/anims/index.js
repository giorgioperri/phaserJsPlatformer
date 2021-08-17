export default (anims) => {
	anims.create({
		key: 'hitEffect',
		frames: anims.generateFrameNumbers('hitSheet', { start: 0, end: 4 }),
		frameRate: 10,
		repeat: 0,
	});

	anims.create({
		key: 'swordDefaultSwing',
		frames: anims.generateFrameNumbers('swordDefault', { start: 0, end: 2 }),
		frameRate: 20,
		repeat: 0,
	});
};
