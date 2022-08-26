import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const MIN_DURATION = 30;
const MAX_DURATION = 600;

interface GameSettings {
    id: number;
    dayDuration: number;
    nightDuration: number;
}

const BASE_HEADERS = {
    headers: {
      'Content-Type': 'application/json'
    },
  }
const getGameSettings = async (): Promise<GameSettings[]> => {
    const url = `${API_ENDPOINT}/game`;
    const response = await fetch(url, {...BASE_HEADERS});
    return await handleResponse(response);
}
const handleResponse = async (response: Response) => {
    const json = await response.json();

  if (!response.ok) {
    throw Error(json.error);
  } else {
    return json;
  }
}
const GameSettings = (props: any): JSX.Element => {
	// const { onClick, type, text, ...rest } = props;
    const dayDuration = useRef();
    const nightDuration = useRef();

    const { isLoading, error, data: games } = useQuery(["games"], getGameSettings);
	return (
        <div>
            <h1>Game Settings</h1>

            <div>
                <label>Day Duration</label>
                <input type="number" min={MIN_DURATION} max={MAX_DURATION} />
            </div>

            <div>
                <label>Night Duration</label>
                <input type="number" min={MIN_DURATION} max={MAX_DURATION} />
            </div>
            
            <div>
                <button>Save</button>
                <button>Back</button>
            </div>
        </div>
	);
}

export default GameSettings; 