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

	getRandomRange(min: number, max: number) {
		return Math.floor(Math.random() * (max - min) + min);
	},

	/**
	 * @param min inclusive
	 * @param max exclusive
	 * @returns array of numbers from 'min' to 'max'
	 */
	range(min: number, max: number) {
		let array = [];
		for (let i = min; i < max; i++) {
			array.push(i);
		}

		return array;
	},

	removeElementFromArray(traits: any[], index: number) {
		const leftHalf = traits.slice(0, index);
		const rightHalf = traits.slice(index + 1);
	
		return leftHalf.concat(rightHalf);
	}
}

export default Utility;