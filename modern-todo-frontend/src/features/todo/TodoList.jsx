import {baseTodoUrl, useTodoContext} from "./TodoContext.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import NotificationArea from "../../ui/NotificationArea.jsx";
import TodoItem from "./TodoItem.jsx";
import {Container, SimpleGrid, TextInput, rem, Space, Kbd, Select, Button, Grid, Text,} from "@mantine/core";
import {IconPlus, IconSearch} from '@tabler/icons-react';
import {Controller, Form, useForm} from "react-hook-form";
import AlertArea from "../../ui/AlertArea.jsx";
import EmptyContent from "../../ui/EmptyContent.jsx";
import {useDisclosure} from "@mantine/hooks";
import TodoCreate from "./TodoCreate.jsx";

let pageIndex = 0;
let pageSize = 10;
let sortColumn = "Name";
let sortOrder = "ASC";
let filterQuery = "";

function TodoList() {
    // Define states to manage filter, sort, pagination
    const [sortColumnValue, setSortColumnValue] = useState(sortColumn);
    const [sortOrderValue, setSortOrderValue] = useState(sortOrder);

    // Manage modal toggle for to do create
    const [isModalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);

    // Invoke todo context hook 
    const {dispatch} = useTodoContext();

    // Use react form hook for filtering and searching 
    const {handleSubmit, register, control} = useForm();

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

    function onTodoSearchOrFilter(data) {
        if (data.filterQuery !== null) {
            filterQuery = data.filterQuery;
            return query.refetch();
        }
        if (data.sortColumn !== null) {
            setSortColumnValue(() => data.sortColumn);
            return query.refetch();
        }
        if (data.sortOrder !== null) {
            setSortOrderValue(() => data.sortOrder);
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
                <Grid columns={24}>
                    <Grid.Col span={8}>
                        <TextInput
                            id="filterQuery" name="filterQuery" label="Search"
                            placeholder="Search title"
                            leftSection={<IconSearch style={{width: rem(18), height: rem(18)}} stroke={1.5}/>}
                            {...register('filterQuery')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Controller
                            name="sortColumn"
                            control={control}
                            render={({field}) => (
                                <Select label="Sort by" placeholder="Pick value" value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setSortColumnValue(value);
                                        }}
                                        data={[{label: 'Todo Name', value: 'Name'}, {
                                            label: 'Todo Description',
                                            value: 'Description'
                                        }, {label: 'Todo Due Date', value: 'DueDate'}]}
                                        searchable
                                />
                            )}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Controller
                            name="sortOrder"
                            control={control}
                            render={({field}) => (
                                <Select label="Sort Order" placeholder="Pick value" value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setSortOrderValue(value);
                                        }}
                                        data={[{label: 'Ascending', value: 'ASC'}, {
                                            label: 'Descending',
                                            value: 'DESC'
                                        }]}
                                        searchable
                                />
                            )}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Button fullWidth mt="25px" type={"submit"} disabled={isFetching}>
                            Apply
                        </Button>
                    </Grid.Col>
                </Grid>
            </Form>
            <Space h={"xl"}/>
            <Button onClick={openModal} rightSection={<IconPlus size={14}/>}>New</Button>
            <Space h={"xl"}/>
            {todos.length === 0 ? <EmptyContent/> :
                <SimpleGrid cols={{base: 1, sm: 2}}>
                    {todos.map((todo) => <TodoItem todo={todo} key={todo.id}/>)}
                </SimpleGrid>
            }
            {isModalOpened && <TodoCreate isModalOpened={isModalOpened} openModal={openModal} closeModal={closeModal}/>}
        </Container>
    );
}

export default TodoList;