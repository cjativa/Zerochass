import React from 'react';

interface AuthContext {
    isAuthenticated: boolean,
    profileImageUrl: string,

    toggleAuthenticationModal: () => void,
};

export const AuthenticationContext: React.Context<AuthContext> = React.createContext({
    isAuthenticated: null,
    profileImageUrl: null,

    toggleAuthenticationModal: null
});
