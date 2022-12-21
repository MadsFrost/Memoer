import React from 'react';
import { User } from '../../types/user';
import { useNavigate } from 'react-router-dom';
export interface ProtectedRouteProps {
    user?: User;
    children: React.ReactNode | React.ReactNode[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
    const navigate = useNavigate();
    const handleReturn = () => {
        navigate('/setup');
    }
    React.useEffect(() => {
      if (!user) handleReturn()
    }, [user]);
    return (
      <>
        {children}
      </>
    );
};

export default ProtectedRoute;