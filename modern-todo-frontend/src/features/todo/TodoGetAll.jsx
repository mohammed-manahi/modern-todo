import {useTodoContext, baseTodoUrl} from "./TodoContext.jsx";
import {notifications} from "@mantine/notifications";
import {useEffect} from "react";
import Spinner from "../../ui/Spinner.jsx";
import {Card} from "@mantine/core";

let pageIndex = 0;
let pageSize = 10;
let sortColumn = "Name";
let sortOrder = "ASC";
let filterQuery = "";

function TodoGetAll() {
    const {dispatch, todos, isLoading} = useTodoContext();

    useEffect(() => {
        getAllTodos();
    }, []);

    async function getAllTodos() {
        const getAllTodosUrl = `/getAll?PageIndex=${pageIndex}&PageSize=${pageSize}&SortColumn=${sortColumn}&SortOrder=${sortOrder}&FilterQuery=${filterQuery}`;
        const accessToken = localStorage.getItem("accessToken")
        try {
            dispatch({type: "todo/loading", payload: true});
            const response = await fetch(`${baseTodoUrl}${getAllTodosUrl}`, {
                method: "GET",
                headers: {"accept": "application/json", "Authorization": `Bearer ${accessToken}`,}
            });
            dispatch({type: "todo/loading", payload: false});
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                dispatch({type: "todo/getAll", payload: data});
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
                message: "Something went wrong. Please try again later.",
                color: "red"
            });
        }
    }

    if (isLoading) return <Spinner/>
    return (
        <div>
            {todos.map((todo) => (
                todo.name
            ))}
        </div>
    );
}

export default TodoGetAll;