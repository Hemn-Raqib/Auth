import { useContext, useDebugValue } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
    const context = useContext(AuthContext);
    useDebugValue(context?.auth, auth => auth ? "Logged In" : "Logged Out");
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}

export default useAuth;