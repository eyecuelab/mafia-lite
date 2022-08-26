class RoomCode {
	private static usedCodes: Set<string> = new Set();

	private static getRandomLetter() {
		return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
	}

	private static getRandomCode() {
		let code = "";
		for (let i = 0; i < 4; i++) {
			code += this.getRandomLetter();
		}

		return code;
	}

	static generate() {
		let newCode = this.getRandomCode();
		while (this.usedCodes.has(newCode)) {
			newCode = this.getRandomCode();
		}

		return newCode;
	}

	static removeCode(code: string) {
		return this.usedCodes.delete(code);
	}
}

export default RoomCode;