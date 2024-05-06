import {useEffect, useState} from "react";
import {useAccountContext} from "./AccountContext.jsx";
import {useNavigate} from "react-router-dom";

function AuthenticationCheck() {
    const {dispatch, isAuthenticated, isLoading, email} = useAccountContext();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        async function checkAuthentication() {
            dispatch({type: "account/loading", payload: true})
            const response = await fetch("https://localhost:7092/Account/manage/info", {
                method: "GET",
                headers: {"accept": "application/json", "Authorization": `Bearer ${token}`,},
            });
            dispatch({type: "account/loading", payload: false});
            if (response.ok) {
                const data = await response.json();
                dispatch({type: "account/authenticated", payload: data.email})
            } else {
                dispatch({type: "account/loading", payload: false});
                console.error("Failed to check authentication");
                
            }
        }
        checkAuthentication();
    }, []);
    
    return email;

}

export default AuthenticationCheck;