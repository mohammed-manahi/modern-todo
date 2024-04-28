import {AppShell, Space} from "@mantine/core";
import {NavLink} from "react-router-dom";
import classes from "./Layout.module.css";
import ThemeToggle from "./ThemeToggle.jsx";

function Navbar(){
   return (

       <AppShell.Navbar py="md" px={4}>
           <NavLink className={classes.control} to={"/"}>Home</NavLink>
           <NavLink className={classes.control} to={"/login"}>Login</NavLink>
           <NavLink className={classes.control} to={"/register"}>Register</NavLink>
           <Space h={"md"}/>
           <ThemeToggle/>
       </AppShell.Navbar>
   );
}

export default Navbar;