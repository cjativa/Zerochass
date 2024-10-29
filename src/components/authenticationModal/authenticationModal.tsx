import { Modal } from '../modal/modal';

const GITHUB_AUTHENTICATION_LINK =
    `https://github.com/login/oauth/authorize?scope=read:user%20user:email&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

interface IAuthenticationModalProps {
    modalType?: 'login' | 'signUp',
    isOpen: boolean,
    onRequestClose: () => void,
};

export const AuthenticationModal = ({ modalType, isOpen, onRequestClose, }: IAuthenticationModalProps) => {

    const highlightClass = 'current';

    let loginClass = highlightClass;
    let signUpClass = highlightClass;

    const onGitHubClick = () => {
        window.location.href = GITHUB_AUTHENTICATION_LINK;
    };

    const handleModalClose = () => {
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            <div className="modal-content">
                <i className={`fas fa-times`} onClick={handleModalClose} />
                <div className="modal-content__inner">
                    <p className="modal-content__title">
                        <span className={loginClass}>Sign In</span>
                        <span className="line" />
                        <span className={signUpClass}>Zerochass</span>
                    </p>

                    <div className="modal-content__text">
                        <p>Learn what interests you</p>
                        <p>quickly and intuitively.</p>
                    </div>

                    <div className="modal-content__buttons">
                        <button
                            className="modal-content__sign-in"
                            onClick={() => onGitHubClick()}
                        >
                            Log in with GitHub
                    </button>
                        <button
                            className="modal-content__sign-in disabled"
                        >
                            Log in with Twitter — coming soon!
                    </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};