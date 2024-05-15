import {createContext, useContext, useReducer} from "react";

const baseTodoUrl = "https://localhost:7092/api/todo";

const TodoContext = createContext();

const initialState = {
    todos: [],
    isLoading: false,
    status: "",
    error: "",
}

function reducer(state, action) {
    switch (action.type) {
        case "todo/loading":
            return {...state, isLoading: action.payload};
        case "todo/status":
            return {...state, status: action.payload};
        case "todo/error":
            return {...state, error: action.payload};
        case "todo/getAll":
            return {...state, todos: action.payload};
        case "todo/create":
            return {...state, todos: [...state.todos, action.payload]};
        case "todo/update":
            const updatedTodoIndex = state.todos.findIndex((todo) => todo.id === action.payload.id);
            if (updatedTodoIndex !== -1) {
                const updatedTodos = [...state.todos];
                updatedTodos[updatedTodoIndex] = action.payload;
                return { ...state, todos: updatedTodos };
            }
            return state;
        case "todo/delete":
            return {...state, todos: state.todos.filter((todo) => todo.id !== action.payload),};
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
            isLoading: state.isLoading,
            status: state.status,
            error: state.error,
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