import {Button, Modal, Paper, Textarea, TextInput} from "@mantine/core";
import {Controller, Form, useForm} from "react-hook-form";
import * as yup from "yup";
import {useTodoContext, baseTodoUrl} from "./TodoContext.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router-dom";
import {DateTimePicker} from '@mantine/dates';
import {useState} from "react";
import {notifications} from "@mantine/notifications";

let schema = yup.object().shape({
    name: yup.string().required("To do name is required"),
    description: yup.string().required("To do description is required"),
    // dueDate: yup.string()
    //     .nullable()
    //     .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
    //         'Invalid JSON datetime format (YYYY-MM-DDTHH:mm:ss.SSSZ)')
});

function TodoCreate({isModalOpened, openModal, closeModal}) {
    // Invoke to do context 
    const {dispatch, isLoading} = useTodoContext();

    // Define field controller for date time picker
    const [dateTimeValue, setDateTimeValue] = useState("");

    // Invoke react use form hook
    const {handleSubmit, register, formState, control} = useForm({
        resolver: yupResolver(schema),
    });
    const {errors} = formState;

    // Invoke use navigate hook 
    const navigate = useNavigate();

    async function onTodoCreate(data) {
        console.log(typeof data.isCompleted)
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${baseTodoUrl}/create`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            body: JSON.stringify({
                name: data.name,
                description: data.description,
                dueDate: data.dueDate.toISOString(),
                isCompleted: false
            }),
        });
    }

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