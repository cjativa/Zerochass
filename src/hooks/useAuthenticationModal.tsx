import { useState, ReactNode } from 'react';

import { AuthenticationModal } from '../components/authenticationModal/authenticationModal';

interface HookReturn {
    toggleAuthenticationModal: () => void,
    AuthModal: () => JSX.Element,
};

export const useAuthenticationModal = (): HookReturn => {

    /** Control the status of the dialog */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** Toggle the current status of the dialog */
    const toggleAuthenticationModal = () => {
        setIsModalOpen(!isModalOpen); 
    }

    /** Render the dialog */
    const AuthModal = () => {

        return (
            <>
                <AuthenticationModal
                    isOpen={isModalOpen}
                    onRequestClose={toggleAuthenticationModal}
                />
            </>
        );
    };


    return { toggleAuthenticationModal, AuthModal }
}