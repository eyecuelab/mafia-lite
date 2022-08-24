import { Fragment } from "react";

export type listItem = {
	id: number,
	data: any
}

type propTypes = {
	listItems: listItem[]
}

const List = (props: propTypes): JSX.Element => {
	const { listItems } = props;
	
	return (
		<ul>
			{listItems?.map((item: listItem) => 
				<Fragment key={item.id}>
					<li>{item.data}</li>
				</Fragment>
			)}
		</ul>
	);
}

export default List;