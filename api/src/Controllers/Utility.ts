const Utility = {
	validateInputs (res: any, error: string, ...inputs: any[]) {
		for (let i = 0; i < inputs.length; i++) {
			if (!inputs[i]) {
				res.status(400).json({ error: error });
				return false;
			}
		}

		return true;
	}
}

export default Utility;