import React, { useEffect, useState } from 'react';
import { ProtectedRoutesProps } from '../types/protectedRoutesTypes';
import { Route, Navigate } from 'react-router-dom';
import supabase from '../supabase';

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const user = await supabase.auth.getUser();
            setAuthenticated(!!user);
        };

        checkAuthentication();
    }, []);

    return (
        <Route
            element={authenticated ? children : <Navigate to="/login" replace />}
        />
    );
};

export default ProtectedRoutes;
