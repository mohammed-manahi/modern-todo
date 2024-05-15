import {Button, Modal, Paper, Textarea, TextInput} from "@mantine/core";
import {Controller, Form, useForm} from "react-hook-form";
import * as yup from "yup";
import {useTodoContext, baseTodoUrl} from "./TodoContext.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router-dom";
import {DateTimePicker} from '@mantine/dates';
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Spinner from "../../ui/Spinner.jsx";
import NotificationArea from "../../ui/NotificationArea.jsx";

let schema = yup.object().shape({
    name: yup.string().required("To do name is required"),
    description: yup.string().required("To do description is required"),
});

function TodoCreate({isModalOpened, openModal, closeModal}) {
    // Invoke to do context 
    const {dispatch, isLoading, error} = useTodoContext();

    // Define field controller for date time picker
    const [dateTimeValue, setDateTimeValue] = useState("");

    // Invoke react use form hook
    const {handleSubmit, register, formState, control} = useForm({
        resolver: yupResolver(schema),
    });
    const {errors} = formState;

    // Invoke react query mutation for create 
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: onTodoCreate,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["todo"]});
        },
    });

    async function onTodoCreate(data) {
        dispatch({type: "todo/loading", payload: true});
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${baseTodoUrl}/create`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            body: JSON.stringify({
                name: data.name,
                description: data.description,
                dueDate: data.dueDate ? data.dueDate.toISOString() : null,
                isCompleted: false
            }),
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            // Pass the mutation data from remote state (mutation) to ui state (todo reducer + context api )
            dispatch({type: "todo/create", payload: mutation.data});
            dispatch({type: "todo/loading", payload: false});
        } else if (mutation.isPending) {
            dispatch({type: "todo/loading", payload: true});
        } else {
            dispatch({type: "todo/error", payload: error});
            dispatch({type: "todo/loading", payload: false});
        }
    }, [dispatch, error, mutation]);

    if (isLoading) return <Spinner/>
    if (error) return <NotificationArea title={"Error"} color={"red"} message={error.message}/>
    return (
        <Modal size="lg" centered overlayProps={{backgroundOpacity: 0.55, blur: 3,}} opened={isModalOpened}
               onClose={closeModal}
               title="Add a new to do task">
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Form onSubmit={handleSubmit(onTodoCreate)} control={control}>
                    <TextInput id="name" name="name" label="Name" placeholder="Todo task name"
                               required {...register('name')}/>
                    {errors?.name?.message}
                    <Textarea id="description" name="description" label="Description"
                              placeholder="Todo task description"
                              required {...register('description')}/>
                    {errors?.description?.message}
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({field}) => (
                            <DateTimePicker name="dueDate" value={field.value} onChange={(value) => {
                                field.onChange(value);
                                setDateTimeValue(value);
                            }} label="Due date" placeholder="Pick date and time" clearable
                                            popoverProps={{withinPortal: true}}/>
                        )}
                    />
                    <input type="hidden" name="isCompleted" value="false" {...register('isCompleted')}/>
                    <Button fullWidth mt="xl" type={"submit"}>
                        Create
                    </Button>
                </Form>
            </Paper>
        </Modal>
    );
}

export default TodoCreate;