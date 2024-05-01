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

const queryClient = new QueryClient();

function App() {
    return (
        // Add mantine provider to use mantine ui library 
        <MantineProvider>
            <Notifications position={"top-center"} zIndex={1000}/>
            {/* React query client provider */}
            <AccountProvider>
                <QueryClientProvider client={queryClient}>
                    <ReactQueryDevtools initialIsOpen={false}/>
                    {/* Define basic routes */}
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="register" element={<Register/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </AccountProvider>
        </MantineProvider>

    )
}

export default App
