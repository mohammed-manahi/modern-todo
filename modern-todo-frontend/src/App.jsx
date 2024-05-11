import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Todo from "./pages/Todo.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, MantineProvider} from "@mantine/core";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {AccountProvider} from "./features/account/AccountContext.jsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import "./App.css";
import {Notifications} from "@mantine/notifications";
import ProtectedRoute from "./features/account/ProtectedRoute.jsx";
import {TodoProvider} from "./features/todo/TodoContext.jsx";

// Define query client with 1 minute stale time
const queryClient = new QueryClient({
    defaultOptions:{
        queries: {
            staleTime: 60 * 1000,
        },
    }
});

function App() {
    return (
        // Add mantine provider to use mantine ui library 
        <MantineProvider>
            <Notifications position={"top-center"} zIndex={1000}/>
            {/* React query client provider */}
            <AccountProvider>
                <TodoProvider>
                    {/* Add query client provider for react query */}
                    <QueryClientProvider client={queryClient}>
                        <ReactQueryDevtools initialIsOpen={false}/>
                        {/* Define basic routes */}
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="register" element={<Register/>}/>
                                <Route path="login" element={<Login/>}/>
                                <Route path="todo" element={
                                    <ProtectedRoute>
                                        <Todo/>
                                    </ProtectedRoute>}/>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </BrowserRouter>
                    </QueryClientProvider>
                </TodoProvider>
            </AccountProvider>
        </MantineProvider>

    )
}

export default App
