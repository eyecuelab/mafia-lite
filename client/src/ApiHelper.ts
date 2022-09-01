export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const BASE_HEADERS = {
	headers: {
		"Content-Type": "application/json"
	},
	credentials: "include"
};

export const handleResponse = async (response: Response) => {
	const json = await response.json();

	if (!response.ok) {
		throw Error(json.error);
	} else {
		return json;
	}
};