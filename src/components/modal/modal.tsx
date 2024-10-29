import { ReactNode } from 'react';
import ReactModal from 'react-modal';

interface IModalProps {
    isOpen: boolean,
    onRequestClose?: any,
    children: ReactNode,
}

export const Modal = ({ isOpen, onRequestClose, children }: IModalProps) => {
    ReactModal.setAppElement('#__next');

    const customStyles = {
        overlay: {
            background: 'rgba(0, 0, 0, 0.685)',
            zIndex: '9999',
        },
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Example Modal"
            className="modal-content"
        >
            {children}
        </ReactModal>
    );
};