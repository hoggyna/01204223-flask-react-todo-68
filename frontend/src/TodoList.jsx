import { useState, useEffect } from 'react'
import './App.css'
import TodoItem from './TodoItem.jsx'
import { useAuth } from './context/AuthContext.jsx';

function TodoList({ apiUrl }) {
    const TODOLIST_API_URL = apiUrl;
    const [newComments, setNewComments] = useState({});
    const [todoList, setTodoList] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const { username, accessToken, logout } = useAuth();

    useEffect(() => {
        fetchTodoList();
    }, [username]);

    async function fetchTodoList() {
        try {
            const response = await fetch(TODOLIST_API_URL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            setTodoList(data);
        } catch (err) {
            setTodoList([]);
        }
    }

    async function toggleDone(id) {
        try {
        const response = await fetch(`${TODOLIST_API_URL}${id}/toggle`, { method: 'PATCH' });
        if (response.ok) {
            const updatedTodo = await response.json();
            setTodoList(todoList.map(todo => todo.id === id ? updatedTodo : todo));
        }
        } catch (error) {
        console.error("Error toggling todo:", error);
        }
    }

    async function addNewTodo() {
        try {
        const response = await fetch(TODOLIST_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle }),
        });
        if (response.ok) {
            const newTodo = await response.json();
            setTodoList([...todoList, newTodo]);
            setNewTitle("");
        }
        } catch (error) {
        console.error("Error adding new todo:", error);
        }
    }

    async function deleteTodo(id) {
        try {
        const response = await fetch(`${TODOLIST_API_URL}${id}`, { method: 'DELETE' });
        if (response.ok) {
            setTodoList(todoList.filter(todo => todo.id !== id));
        }
        } catch (error) {
        console.error("Error deleting todo:", error);
        }
    }

    async function addNewComment(todoId, newComment) {
        try {
        const response = await fetch(`${TODOLIST_API_URL}${todoId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newComments[newComment] || "" }),
        });
        if (response.ok) await fetchTodoList();
        } catch (error) {
        console.error("Error adding new comment:", error);
        }
    }

    return (
        <>
        <h1>Todo List</h1>
        <ul>
            {todoList.map(todo => (
            <TodoItem
                key={todo.id}
                todo={todo}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                addNewComment={addNewComment}
            />
            ))}
        </ul>
        New: <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button onClick={addNewTodo}>Add</button>

        <br/>
        <a href="/about">About</a>
        <br/>
        {username && (
        <a href="#" onClick={(e) => {e.preventDefault(); logout();}}>Logout</a> 
        )}
        <a href="/login">Login</a> 
        </>
    )
}

export default TodoList