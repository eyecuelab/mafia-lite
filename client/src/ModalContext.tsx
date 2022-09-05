import { createContext, ReactNode, useContext } from "react";

// interface for the modal context
export type ModalContextType = {
  content: ReactNode | null;
  isOpen: boolean;
  callModal: (content: ReactNode) => void,
  closeModal: () => void,
}

// create context sets the default value to null
export const ModalContext = createContext<ModalContextType>({
  content: null,
  isOpen: false,
  callModal: () => null,
  closeModal: () => null,
});

export const useModal = () => useContext(ModalContext);