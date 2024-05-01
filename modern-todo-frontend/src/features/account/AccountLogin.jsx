import {useContext} from "react";
import {baseAccountUrl, useAccountContext} from "./AccountContext.jsx";
import {Form, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {handleResponseError} from "../../utilities/errorResponse.js";
import {showNotification} from "../../utilities/notificationSystem.js";
import * as yup from "yup"
import {Button, Checkbox, Container, Paper, PasswordInput, Space, Text, TextInput, Title} from "@mantine/core";
import classes from "../../ui/AuthenticationForm.module.css";
import Spinner from "../../ui/Spinner.jsx";

// Validation schema using yup
let schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
    rememberMe: yup.boolean()
});

function AccountLogin() {
    const {dispatch, isLoading} = useAccountContext();
    const {handleSubmit, register, formState, control} = useForm({
        resolver: yupResolver(schema),
    });
    const {errors} = formState;
    const navigate = useNavigate();

    let location = useLocation();
    if (location.state !== null) {
        showNotification("Info", location.state, "blue")
    }

    async function onLoginAccount(data) {
        console.log(data);
        let loginUrl = "";
        try {
            dispatch({type: "account/loading", payload: true});
            if (data.rememberMe === true)
                loginUrl = "/login?useCookies=true";
            else
                loginUrl = "/login?useSessionCookies=true";
            const response = await fetch(`${baseAccountUrl}${loginUrl}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json", "Access-Control-Allow-Credentials": true},
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
            dispatch({type: "account/loading", payload: false});
            console.log(response)
            if (response.ok) {
                navigate("/", {state: "Logged on successfully"});
            } else {
                const errorData = await response.json();
                handleResponseError(errorData);
            }
        } catch (error) {
            dispatch({type: "account/loading", payload: false});
            showNotification("Error", "Please enter a valid username and password and ensure your account is activated", "red");
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <NavLink to="/register">
                    Create account
                </NavLink>
            </Text>
            {isLoading && <Spinner/>}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Form onSubmit={handleSubmit(onLoginAccount)} control={control}>
                    <TextInput id="email" name="email" label="Email" placeholder="Example@Email.com"
                               required {...register('email')}/>
                    {errors?.email?.message}
                    <PasswordInput id="password" name="password" label="Password" placeholder="Your password" required
                                   mt="md" {...register('password')}/>
                    {errors?.password?.message}
                    <Space h={"sm"}/>
                    <Checkbox label="Remember Me" name="rememberMe" id="rememberMe" {...register('rememberMe')}/>
                    <Button fullWidth mt="xl" type={"submit"} disabled={isLoading}>
                        Login
                    </Button>
                </Form>
            </Paper>
        </Container>
    );
}

export default AccountLogin;