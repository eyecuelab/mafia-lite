import React from "react";
import { createPortal } from "react-dom";
import { useModal } from "../ModalContext";
// import styled from "styled-components";

// const Wrapper = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100vh
//   height: 100vh;
//   background-color: rgba(0, 0, 0, 0.1);
// `;


export const Modal: React.FC = () => {
	const { content, isOpen, closeModal } = useModal();

	if (!isOpen) {
		return null;
	}

	const modalDomNode = document.getElementById("modal-root") as HTMLElement;

	return createPortal(
		<div className="modal-container">
			<button onClick={() => closeModal()}>Close</button>
			<div>{content}</div>
		</div>,
		modalDomNode
	);
};
