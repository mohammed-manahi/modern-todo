import Home from "./ui/Home.jsx";
import Register from "./ui/Register.jsx";
import Login from "./ui/Login.jsx";
import NotFound from "./ui/NotFound.jsx";
import Todo from "./ui/Todo.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, MantineProvider} from '@mantine/core';
import '@mantine/core/styles.css';
import './App.css'

function App() {
    return (
        // Add mantine provider to use mantine ui library 
        <MantineProvider>
            {/* Define basic routes */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    )
}

export default App
