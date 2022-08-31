import { Fragment } from "react";

export type listItem = {
	id: number,
	style: any,
	data: any
}

type propTypes = {
	listItems: listItem[]
}

const GenericList = (props: propTypes): JSX.Element => {
	const { listItems } = props;

	return (
		<ul>
			{listItems?.map((item: listItem) => {
				return (
					<Fragment key={item.id}>
						<li style={item.style}>
							{ item.data }
						</li>
					</Fragment>
				);
			})}
		</ul>
	);
};

export default GenericList;
