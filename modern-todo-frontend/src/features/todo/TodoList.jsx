import {baseTodoUrl, useTodoContext} from "./TodoContext.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import NotificationArea from "../../ui/NotificationArea.jsx";
import TodoItem from "./TodoItem.jsx";
import {Container, SimpleGrid} from "@mantine/core";

let pageIndex = 0;
let pageSize = 10;
let sortColumn = "Name";
let sortOrder = "ASC";
let filterQuery = "";

function TodoList() {
    const {dispatch} = useTodoContext();
    // Use the query hook to define the query key and the function 
    const {
        data: todos,
        isSuccess,
        isError,
        isFetching,
        isFetched,
        error
    } = useQuery({
        queryKey: ["todo"],
        queryFn: getTodos,
    });

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

    if (isFetching) return <Spinner/>
    if (error) return <NotificationArea title={"Error"} color={"red"} message={error.message}/>
    return (
        <Container py="xl">
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {todos.map((todo) => <TodoItem todo={todo} key={todo.id}/>)}
            </SimpleGrid>
        </Container>
    );
}

export default TodoList;