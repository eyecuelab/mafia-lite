import styles from './Lobby.module.css'
import PlayerCard from './PlayerCard'
type player = {
	id: number
	name: string
  isHost : boolean
	avatar: string
}
type propTypes = {
	players: Array<player>
}
const PlayerList = (props: propTypes) => {
  const {players} = props;
  return (
  <ul className={styles.playerListContainer}>
    {players?.map((player: player, index : number) => {
      return (
        <PlayerCard player={player} isMain={false} key={index} />
      )
    })}
	</ul>
  )
}

export default PlayerList