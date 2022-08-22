import React from "react";

const GenericButton = (props: any): JSX.Element => {
	const { onClick, type, text, ...rest } = props;

	return (
		<button onClick={onClick} type={type} {...rest}>{text}</button>
	);
}

export default GenericButton; 