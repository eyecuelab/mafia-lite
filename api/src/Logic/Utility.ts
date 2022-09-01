const Utility = {
	shuffleArray(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const randomIndex = this.getRandomRange(0, i);

			const temp = array[i];
			array[i] = array[randomIndex];
			array[randomIndex] = temp;
		}

		return array;
	},

	getRandomRange(min:number, max: number) {
		return Math.floor(Math.random() * (max - min) + min);
	}
}

export default Utility;