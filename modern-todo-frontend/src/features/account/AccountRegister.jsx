import {useAccountContext, baseAccountUrl} from "./AccountContext.jsx";
import {Form, useForm} from "react-hook-form";
import {Button, Container, Paper, PasswordInput, Text, TextInput, Title, Notification, Space} from "@mantine/core";
import classes from "../../ui/AuthenticationForm.module.css";
import {NavLink, useNavigate} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import Spinner from "../../ui/Spinner.jsx";
import {handleResponseError} from "../../utilities/errorResponse.js"
import {notifications} from "@mantine/notifications";
import {showNotification} from "../../utilities/notificationSystem.js";

// Validation schema using yup
let schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
});

function AccountRegister() {
    const {dispatch, isLoading} = useAccountContext();
    // Add yup resolver for form validation
    const {handleSubmit, register, formState, control} = useForm({
        resolver: yupResolver(schema),
    });
    const {errors} = formState;
    const navigate = useNavigate();

    async function onRegisterAccount(data) {
        try {
            dispatch({type: "account/loading", payload: true});
            const response = await fetch(`${baseAccountUrl}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
            dispatch({type: "account/loading", payload: false});
            if (response.ok) {
                navigate("/login", {state: "You need to activate your account. Please check your email inbox"});
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
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Already have an account?{' '}
                <NavLink to="/login">
                    Login
                </NavLink>
            </Text>
            {isLoading && <Spinner/>}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Form onSubmit={handleSubmit(onRegisterAccount)} control={control}>
                    <TextInput id="email" name="email" label="Email" placeholder="Example@Email.com"
                               required {...register('email')}/>
                    {errors?.email?.message}
                    <PasswordInput id="password" name="password" label="Password" placeholder="Your password" required
                                   mt="md" {...register('password')}/>
                    {errors?.password?.message}
                    <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password"
                                   placeholder="Your password" required
                                   mt="md" {...register('confirmPassword')}/>
                    {errors?.confirmPassword?.message}

                    <Button fullWidth mt="xl" type={"submit"} disabled={isLoading}>
                        Register
                    </Button>
                </Form>
            </Paper>
        </Container>

    );

}

export default AccountRegister;