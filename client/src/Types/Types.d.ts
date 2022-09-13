export type Player = {
	id: number
	isHost: boolean
	name: string
	team?: string
	gameId: number
	status: string
	avatar: string
}

export type Round = {
	id: number
	gameId: number
	roundNumber: number
	died: Player[]
}

export type Game = {
	id: number
	players: Player[]
	gameCode: string
	name: string
	size: number
	rounds: Round[]
}

export type Role = {
	id: number
	name: string
	type: string
	nightTimePrompt: string
	roleDesc: string
}

export type Vote = {
	id: number
	gameId: number
	roundNumber: number
	voterId: number
	candidateId: number
	phase: string
}

export interface GameData {
	game: Game
	players: Player[]
	thisPlayer: Player
}
