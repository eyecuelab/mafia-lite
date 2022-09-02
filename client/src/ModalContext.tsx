import { createContext, ReactNode, useContext } from "react";

export type ModalContextType = {
  content: ReactNode | null;
  isOpen: boolean;
  callModal: (content: ReactNode) => void,
  closeModal: () => void,
}

export const ModalContext = createContext<ModalContextType>({
	content: null,
	isOpen: false,
	callModal: () => null,
	closeModal: () => null,
});

export const useModal = () => useContext(ModalContext);