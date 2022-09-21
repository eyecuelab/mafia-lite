import styles from "./Titles.module.css";

type propsType = {
	title: string
}
const SubTitle = ((props: propsType) => {
	return (
		<div className={styles.subTitleContainer}>
			<div className={styles.border}></div>
			<h6>{props.title}</h6>
			<div className={styles.border}></div>
		</div>
	);
});
export default SubTitle;