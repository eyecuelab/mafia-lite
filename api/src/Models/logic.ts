import io from '../server';

const emitStartNight = (gameId: number) => {
	io.in(gameId.toString()).emit('start_night');
}

export { emitStartNight };