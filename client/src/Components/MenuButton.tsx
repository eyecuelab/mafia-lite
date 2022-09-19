import { ButtonImage } from "../assets/images/Images";
import GenericButton from "./GenericButton";

type propTypes = {
	link?: string,
	className: string,
	text: string,
	onClick?: () => unknown
}

function MenuButton(props: propTypes): JSX.Element {
	const { link, className, text, onClick } = props;

	return (
		<GenericButton
			link={link}
			className={className}
			text={text}
			onClick={onClick}
			style={
				{
					backgroundImage: `url("${ButtonImage}")`,
				}
			}
		/>
	);
}

export default MenuButton;