import { Fragment } from "react";

type propTypes = {
	listItems: any
}

const List = (props: propTypes): JSX.Element => {
	const { listItems } = props;
	console.log("🚀 ~ file: List.tsx ~ line 7 ~ List ~ listItems", listItems)

	return (
		<ul>
			{listItems?.map((item: any) => 
				<Fragment key={item.id}>
					<li>{item.id}</li>
				</Fragment>
			)}
		</ul>
	);
}

export default List;