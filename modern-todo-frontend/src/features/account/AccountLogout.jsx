import {baseAccountUrl, useAccountContext} from "./AccountContext.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import {notifications} from "@mantine/notifications";
import classes from "../../ui/Layout.module.css";
import {Button, Space} from "@mantine/core";

function AccountLogout() {
    const {email, dispatch} = useAccountContext();
    const navigate = useNavigate();
    
    async function onLogoutAccount() {
        try {
            dispatch({type: "account/loading", payload: true})
            const token = localStorage.getItem("accessToken")
            const response = await fetch(`${baseAccountUrl}/logout`, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
            });
            dispatch({type: "account/loading", payload: false});
            if (response.ok) {
                localStorage.removeItem('accessToken')
                dispatch({type: "account/logout"})
                navigate("/", {state: "Logged out"});
            } else {
                const errorData = await response.json();
                const errorKeys = Object.keys(errorData.errors);
                errorKeys.forEach(errorKey => {
                    const errorMessages = errorData.errors[errorKey];
                    errorMessages.forEach(errorMessage => {
                        notifications.show({title: "Error", message: errorMessage, color: "red"});
                    });
                });
            }
        } catch (error) {
            dispatch({type: "account/loading", payload: false});
            notifications.show({
                title: "Error",
                message: "Internal server error",
                color: "red"
            });
        }
    }

    return (
        <>
            <NavLink className={classes.control} to={"/todo"} underline="never">To do</NavLink>
            {email}
            <Space w={"md"} />
            <Button variant="default" onClick={onLogoutAccount}>Logout</Button>
        </>
    )
}

export default AccountLogout;