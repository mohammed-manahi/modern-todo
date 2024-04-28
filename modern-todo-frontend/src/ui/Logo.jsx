import {Group, Image, Title} from "@mantine/core";
import classes from "./Logo.module.css";
import {NavLink} from "react-router-dom";

function Logo() {
    return (
        <NavLink className={classes.control} to={"/"} underline="never">
            <Group>
                <Image radius="md" h={28} w="auto" fit="contain" src="logo.png"/>
                <Title order={4}>To do</Title>
            </Group>
        </NavLink>
    );
}

export default Logo;