import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('token');
    console.log(token)
    if (!token) {
        return <Navigate to='/' />
    }
   
    return children;
}

export default ProtectedRoute;