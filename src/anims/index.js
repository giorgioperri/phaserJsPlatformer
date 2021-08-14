export default (anims) => {
	anims.create({
		key: 'hitEffect',
		frames: anims.generateFrameNumbers('hitSheet', { start: 0, end: 4 }),
		frameRate: 10,
		repeat: 0,
	});
};
