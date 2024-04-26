import {AppShell, Burger, Button, Group, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './Layout.module.css';
import Logo from "./Logo.jsx";
import {NavLink} from "react-router-dom";

function Layout({children}) {
    const [opened, {toggle}] = useDisclosure();
    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
            padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    <Group justify="space-between" style={{flex: 1}}>
                        <Logo/>
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            <NavLink className={classes.control} to={"/"} underline="never">Home</NavLink>
                            <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                            <NavLink className={classes.control} to={"/register"}>Register</NavLink>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <NavLink className={classes.control} to={"/"}>Home</NavLink>
                <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                <NavLink className={classes.control} to={"/register"}>Register</NavLink>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;