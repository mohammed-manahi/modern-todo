import {baseTodoUrl, useTodoContext} from "./TodoContext.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import NotificationArea from "../../ui/NotificationArea.jsx";
import TodoItem from "./TodoItem.jsx";
import {
    Container,
    SimpleGrid,
    TextInput,
    ActionIcon,
    useMantineTheme,
    rem,
    Space,
    Kbd,
    Badge,
    Autocomplete, Select
} from "@mantine/core";
import {IconSearch, IconArrowRight} from '@tabler/icons-react';
import {Form, useForm} from "react-hook-form";
import AlertArea from "../../ui/AlertArea.jsx";
import EmptyContent from "../../ui/EmptyContent.jsx";

let pageIndex = 0;
let pageSize = 10;
let sortColumn = "Name";
let sortOrder = "ASC";
let filterQuery = "";

function TodoList() {
    // Invoke todo context hook 
    const {dispatch} = useTodoContext();
    // Use react form hook for filtering and searching 
    const {handleSubmit, register, formState, control} = useForm();
    // Use the query hook to define the query key and the function 
    const query = useQuery({
        queryKey: ["todo"],
        queryFn: getTodos,
    });

    const {
        data: todos,
        isSuccess,
        isError,
        isFetching,
        isFetched,
        error
    } = query;

    async function getTodos() {
        const getAllTodosUrl = `/getAll?PageIndex=${pageIndex}&PageSize=${pageSize}&SortColumn=${sortColumn}&SortOrder=${sortOrder}&FilterQuery=${filterQuery}`;
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${baseTodoUrl}${getAllTodosUrl}`,
            {
                method: "GET",
                headers: {"accept": "application/json", "Authorization": `Bearer ${accessToken}`}
            });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    }

    useEffect(() => {
        if (isFetched && isSuccess) {
            dispatch({type: "todo/getAll", payload: todos});
        } else if (isFetching && !isFetched) {
            dispatch({type: "todo/loading", payload: true});
        } else if (isError) {
            dispatch({type: "todo/error", payload: error.message});
        }
    }, [dispatch, error, todos, isFetched, isSuccess, isError, isFetching]);

    async function onTodoFilterOrSearch(data) {
        if (data.filterQuery !== null) {
            filterQuery = data.filterQuery;
            return query.refetch();
        }
        // console.log(data.control);
    }
    

    if (isFetching) return <Spinner/>
    if (error) return <NotificationArea title={"Error"} color={"red"} message={error.message}/>
    return (
        <Container py="xl">
            <AlertArea title="Tip for search use:" description={<Kbd>Enter</Kbd>}/>
            <Space h={"md"}/>
            <Form onSubmit={handleSubmit(onTodoFilterOrSearch)} control={control}>
                <TextInput
                    id="filterQuery" name="filterQuery"
                    radius="xl" size="md" placeholder="Search title" rightSectionWidth={42}
                    leftSection={<IconSearch style={{width: rem(18), height: rem(18)}} stroke={1.5}/>}
                    {...register('filterQuery')}
                />
                {/*<Select*/}
                {/*    label="Your favorite library"*/}
                {/*    placeholder="Pick value"*/}
                {/*    data={['React', 'Angular', 'Vue', 'Svelte']}*/}
                {/*    searchable*/}
                {/*    {...register('dropdown')}*/}
                {/*/>*/}

            </Form>
            <Space h={"xl"}/>
            {todos.length === 0 ? <EmptyContent/> :
                <SimpleGrid cols={{base: 1, sm: 2}}>
                    {todos.map((todo) => <TodoItem todo={todo} key={todo.id}/>)}
                </SimpleGrid>
            }
        </Container>
    );
}

export default TodoList;