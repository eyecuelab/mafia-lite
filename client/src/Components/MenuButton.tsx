/* eslint-disable @typescript-eslint/ban-types */
import buttonImg from "../assets/The Nameless Terror Images/UI/image 15.png";
import GenericButton from "./GenericButton";

type propTypes = {
	link?: string,
	className: string,
	text: string,
	onClick?: Function
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
					backgroundImage: `url("${buttonImg}")`,
				}
			}
		/>
	);
}

export default MenuButton;