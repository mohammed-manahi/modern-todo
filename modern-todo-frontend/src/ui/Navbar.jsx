import {AppShell, Group, Space} from "@mantine/core";
import {NavLink} from "react-router-dom";
import classes from "./Layout.module.css";
import ThemeToggle from "./ThemeToggle.jsx";
import AccountLogout from "../features/account/AccountLogout.jsx";
import {useAccountContext} from "../features/account/AccountContext.jsx";

function Navbar() {
    const {isAuthenticated} = useAccountContext();
    return (

        <AppShell.Navbar py="md" px={4}>
            <NavLink className={classes.control} to={"/"} underline="never">Home</NavLink>
            {isAuthenticated ? <AccountLogout/> :
                <>
                    <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                    <NavLink className={classes.control} to={"/register"}>Register</NavLink>
                </>
            }
            <Space w={"md"}/>
            <ThemeToggle/>
        </AppShell.Navbar>
    );
}

export default Navbar;