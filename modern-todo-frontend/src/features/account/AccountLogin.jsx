import {useContext, useEffect} from "react";
import {baseAccountUrl, useAccountContext} from "./AccountContext.jsx";
import {Form, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as yup from "yup"
import {Button, Checkbox, Container, Paper, PasswordInput, Space, Text, TextInput, Title} from "@mantine/core";
import classes from "../../ui/AuthenticationForm.module.css";
import Spinner from "../../ui/Spinner.jsx";
import {notifications} from "@mantine/notifications";

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
    useEffect(() => {
        // Receive account need confirmation notification
        if (location.state !== null) {
            notifications.show({
                title: "Info",
                message: location.state,
                color: "blue"
            });
        }
    }, [location]);

    async function onLoginAccount(data) {
        const loginUrl = "/login?useCookies=false&useSessionCookies=false";
        try {
            dispatch({type: "account/loading", payload: true});
            const response = await fetch(`${baseAccountUrl}${loginUrl}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
            dispatch({type: "account/loading", payload: false});
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.accessToken);
                const emailResponse = await fetch("https://localhost:7092/Account/getAuthenticatedUserEmail", {
                    method: "GET",
                    headers: {"accept": "application/json", "Authorization": `Bearer ${data.accessToken}`,},
                });
                if (emailResponse.ok) {
                    const emailData = await emailResponse.json();
                    console.log(email);
                    dispatch({type: "account/login", payload: emailData.email})
                    navigate("/todo", {state: "Logged on successfully"});
                }
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
                message: "Please enter a valid username and password and ensure your account is activated",
                color: "red"
            });
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