import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom"

const OnlyAdminPrivateRoute = () => {
  
    const { currentUser, loading } = useSelector(state => state.user)

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (currentUser && currentUser.isAdmin) ? <Outlet /> : <Navigate to='/' />
}

export default OnlyAdminPrivateRoute
