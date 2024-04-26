import { useState } from 'react'
import './App.css'
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Todo from "./pages/Todo.jsx";

function App() {
  return (
    <>
      <p>Application Pages:</p>
        <Home/>
        <Register/>
        <Login/>
        <NotFound/>
        <Todo/>
    </>
  )
}

export default App
