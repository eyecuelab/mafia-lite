import React from "react";
import { createPortal } from "react-dom";
import { useModal } from "../../ModalContext";
import ModalStyles from "./Modal.module.css";


export const Modal: React.FC = () => {
	const { content, isOpen, closeModal } = useModal();

	if (!isOpen) {
		return null;
	}

	const modalDomNode = document.getElementById("modal-root") as HTMLElement;

	return createPortal(
		<div className={ModalStyles["modal-container"]}>
			<div className={ModalStyles["modal"]}>
				<div>{content}</div>
				<button className={ModalStyles["modal-button"]} onClick={() => closeModal()}>Close</button>
			</div>
		</div>,
		modalDomNode
	);
};
