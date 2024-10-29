import { useState } from 'react';

interface HookReturn {
    isModalOpen: boolean,
    toggleModal: () => void,
};

export const useModal = (): HookReturn => {
    const [isModalOpen, setModalOpen] = useState(false);

    /** Toggle the current status of the dialog */
    const toggleModal = () => setModalOpen(!isModalOpen);

    return { isModalOpen, toggleModal }
};







