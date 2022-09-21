const credentials: RequestCredentials = "include";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const BASE_HEADERS = {
	headers: {
		"Content-Type": "application/json"
	},
	credentials: credentials
};

const handleResponse = async (response: Response) => {
	const json = await response.json();

	if (!response.ok) {
		throw Error(json.error);
	} else {
		return json;
	}
};

export const getData = async (endpoint: string) => {
	try {
		const url = `${API_ENDPOINT}${endpoint}`;
		const response = await fetch(url, { ...BASE_HEADERS , method: "GET" });
		return await handleResponse(response);
	} catch(error) {
		console.log(error);
	}
};

export const postData = async (endpoint: string, payload: unknown) => {
	const url = `${API_ENDPOINT}${endpoint}`;
	const response = await fetch(url, { ...BASE_HEADERS , method: "POST", body: JSON.stringify(payload) });
	return await handleResponse(response);
};