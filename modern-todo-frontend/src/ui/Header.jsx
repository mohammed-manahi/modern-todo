import {AppShell, Burger, Group, Space} from "@mantine/core";
import Logo from "./Logo.jsx";
import {NavLink} from "react-router-dom";
import classes from "./Layout.module.css";
import ThemeToggle from "./ThemeToggle.jsx";


function Header({opened, toggle}){
    return(
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                <Group justify="space-between" style={{flex: 1}}>
                    <Logo/>
                    <Group ml="xl" gap={0} visibleFrom="sm">
                        <NavLink className={classes.control} to={"/"} underline="never">Home</NavLink>
                        <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                        <NavLink className={classes.control} to={"/register"}>Register</NavLink>
                        <Space w={"md"}/>
                        <ThemeToggle/>
                    </Group>
                </Group>
            </Group>
        </AppShell.Header>
    );
}

export default Header;