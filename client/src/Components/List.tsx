import { Fragment } from "react";
import testAvatar from "../assets/The Nameless Terror Images/Portraits/image\ 181.png";

const renderImg = () => {
	return `/src/assets/The Nameless Terror Images/Portraits/image\ 181.png`;
}

export type listItem = {
	id: number,
	name: string,
	avatar: string
}

type propTypes = {
	listItems: listItem[]
}

const List = (props: propTypes): JSX.Element => {
	const { listItems } = props;

	const getImg = renderImg();

	return (
		<ul>
			{listItems?.map((item: listItem) => {
				return (
					<Fragment key={item.id}>
						<li style={{ display: `flex` }}>
							<img style={{ width: `20%` }} src={`${getImg}`} />
							<h4>{item.name}</h4>
						</li>
					</Fragment>
				)
			}
			)}
		</ul>
	);
}

export default List;