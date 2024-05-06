import {AppShell, Burger, Group, Space} from "@mantine/core";
import Logo from "./Logo.jsx";
import {NavLink} from "react-router-dom";
import classes from "./Layout.module.css";
import ThemeToggle from "./ThemeToggle.jsx";
import {useAccountContext} from "../features/account/AccountContext.jsx";
import AccountLogout from "../features/account/AccountLogout.jsx";


function Header({opened, toggle}) {
    const {isAuthenticated, email} = useAccountContext();
    return (
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                <Group justify="space-between" style={{flex: 1}}>
                    <Logo/>
                    <Group ml="xl" gap={0} visibleFrom="sm">
                        <NavLink className={classes.control} to={"/"} underline="never">Home</NavLink>
                        {isAuthenticated ? <AccountLogout/>:
                            <>
                                <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                                <NavLink className={classes.control} to={"/register"}>Register</NavLink>
                            </>
                        }
                        <Space w={"md"}/>
                        <ThemeToggle/>
                    </Group>
                </Group>
            </Group>
        </AppShell.Header>
    );
}

export default Header;