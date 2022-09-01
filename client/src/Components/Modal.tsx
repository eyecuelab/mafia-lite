import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
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

type Props = {
  children: ReactNode;
  modalOpen: boolean,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}

export const Modal: React.FC<Props> = ({ modalOpen, children, setModalOpen, className}) => {
	if (!modalOpen) return null;
	return createPortal(
		<div className={className}>
			<button onClick={() => setModalOpen(false)}>Close</button>
			{children}
		</div>,
		document.body
	);
};
