﻿import {baseTodoUrl, useTodoContext} from "./TodoContext.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
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
    Autocomplete, Select, Button
} from "@mantine/core";
import {IconSearch, IconArrowRight} from '@tabler/icons-react';
import {Controller, Form, useForm} from "react-hook-form";
import AlertArea from "../../ui/AlertArea.jsx";
import EmptyContent from "../../ui/EmptyContent.jsx";

let pageIndex = 0;
let pageSize = 10;
let sortColumn = "Name";
let sortOrder = "ASC";
let filterQuery = "";

function TodoList() {
    // Define a state to manage sort column
    const [sortColumnValue, setSortColumnValue] = useState(sortColumn);
    const [sortOrderValue, setSortOrderValue] = useState(sortOrder);
    
    // Invoke todo context hook 
    const {dispatch} = useTodoContext();
    
    // Use react form hook for filtering and searching 
    const {handleSubmit, register, formState, control} = useForm();
  
    // Use the query hook to define the query key and the function 
    const query = useQuery({
        queryKey: ["todo"],
        queryFn: getTodos,
    });
    // Destructure query object
    const {
        data: todos,
        isSuccess,
        isError,
        isFetching,
        isFetched,
        error
    } = query;

    async function getTodos() {
        const getAllTodosUrl = `/getAll?PageIndex=${pageIndex}&PageSize=${pageSize}&SortColumn=${sortColumnValue}&SortOrder=${sortOrderValue}&FilterQuery=${filterQuery}`;
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

    async function onTodoSearchOrFilter(data) {
        console.log(data)
        if (data.filterQuery !== null) {
            filterQuery = data.filterQuery;
            return query.refetch();
        }
        if (data.sortColumn !== null) {
            setSortColumnValue(() => data.sortColumn);
            return query.refetch();
        }
        if (data.sortOrder !== null) {
            sortOrder = data.sortOrder;
            return query.refetch();
        }
        return;
    }

    if (isFetching) return <Spinner/>
    if (error) return <NotificationArea title={"Error"} color={"red"} message={error.message}/>
    return (
        <Container py="xl">
            <AlertArea title="Tip for search use:" description={<Kbd>Enter</Kbd>}/>
            <Space h={"md"}/>
            <Form onSubmit={handleSubmit(onTodoSearchOrFilter)} control={control}>
                <TextInput
                    id="filterQuery" name="filterQuery"
                    radius="xl" size="md" placeholder="Search title" rightSectionWidth={42}
                    leftSection={<IconSearch style={{width: rem(18), height: rem(18)}} stroke={1.5}/>}
                    {...register('filterQuery')}
                />
                <Controller
                    name="sortColumn"
                    control={control}
                    render={({field}) => (
                        <Select label="Sort by" placeholder="Pick value" value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setSortColumnValue(value);
                                }}
                                data={[{label: 'Todo Name', value:'Name'}, {label: 'Todo Description', value:'Description'}, {label: 'Todo Due Date', value:'DueDate'}]}
                                searchable
                        />
                    )}
                />
                <Controller
                    name="sortOrder"
                    control={control}
                    render={({field}) => (
                        <Select label="Sort Order" placeholder="Pick value" value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setSortOrderValue(value);
                                }}
                                data={[{label: 'Ascending', value: 'ASC'}, {label: 'Descending', value: 'DESC'}]}
                                searchable
                        />
                    )}
                />
                <Button fullWidth mt="xl" type={"submit"} disabled={isFetching}>
                    Apply
                </Button>
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