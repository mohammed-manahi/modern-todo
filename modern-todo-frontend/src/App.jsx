import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Todo from "./pages/Todo.jsx";
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
