import axios from 'axios';

interface HookReturn {
    performLogout: () => Promise<void>;
};

export const useLogout = (): HookReturn => {

    const performLogout = async (): Promise<void> => {
        await axios.get('/api/logout');
        window.location.reload()
    };

    return {
        performLogout
    };
};