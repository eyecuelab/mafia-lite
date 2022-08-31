import { Link } from "react-router-dom";

const GenericButton = (props: any): JSX.Element => {
	const { onClick, type, text, link, ...rest } = props;

	if (link) {
		return (
			<Link to={link}>
				<button onClick={onClick} type={type} {...rest}>{text}</button>
			</Link>
		);
	} else {
		return (
			<button onClick={onClick} type={type} {...rest}>{text}</button>
		);
	}

	
};

export default GenericButton; 