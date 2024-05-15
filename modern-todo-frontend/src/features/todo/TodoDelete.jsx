import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {Modal, Button, Group, Space, Text} from '@mantine/core';
import {baseTodoUrl, useTodoContext} from "./TodoContext.jsx";
import {useEffect} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";

function TodoDelete({todo, isDialogueOpened, toggleDialogue, closeDialogue}) {
    // Invoke to do context 
    const {dispatch, isLoading, error} = useTodoContext();

    // Invoke react query mutation for create 
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: onTodoDelete,
        onSuccess: () => {
            closeDialogue();
            queryClient.invalidateQueries({queryKey: ["todo"]});
        },
    });

    async function onTodoDelete() {
        dispatch({type: "todo/loading", payload: true});
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${baseTodoUrl}/delete/${todo.id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
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
            dispatch({type: "todo/delete", payload: mutation.data});
            dispatch({type: "todo/loading", payload: false});
        } else if (mutation.isPending) {
            dispatch({type: "todo/loading", payload: true});
        } else {
            dispatch({type: "todo/error", payload: error});
            dispatch({type: "todo/loading", payload: false});
        }
    }, [dispatch, error, mutation]);
    
    return (
        <Modal
            opened={isDialogueOpened}
            onClose={closeDialogue}
            title="Delete To do"
            transitionProps={{ transition: 'fade', duration: 200 }}>
            <Text> Are you sure you want to delete: <strong>{todo.name}</strong>?</Text>
            <Space h={"md"} />
            <Group justify="center" gap="xl" grow>
            <Button color={"red"} onClick={onTodoDelete}>Confirm</Button>
            <Button onClick={closeDialogue}>Cancel</Button>
            </Group>
        </Modal>
    );
}

export default TodoDelete;