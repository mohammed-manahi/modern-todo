import {createContext, useContext, useReducer} from "react";

const baseTodoUrl = "https://localhost:7092/api/todo";

const TodoContext = createContext();

const initialState = {
    todos: [],
    isLoading: "",
    status: "",
    error: "",

}

function reducer(state, action) {
    switch (action.type) {
        case "todo/getAll":
            return {...state, todos: action.payload};
        case "todo/loading":
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
}

function TodoProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <TodoContext.Provider value={{
            dispatch: dispatch,
            todos: state.todos,
            isLoading: state.isLoading
        }}>
            {children}
        </TodoContext.Provider>
    );
}

function useTodoContext(){
    const todoConsumer = useContext(TodoContext);
    if (todoConsumer === undefined) {
        throw new Error("Consumer of todo context is undefined because it was invoked outside the context provider");
    }
    return todoConsumer;
}

export {TodoProvider, useTodoContext, baseTodoUrl}