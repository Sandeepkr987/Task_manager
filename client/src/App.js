import React, { useState, useEffect } from 'react'
import axios from 'axios';
export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    useEffect(() => {
        axios.get('http://localhost:5000/task')
        .then(response => {
            setTasks(response.data);
        })
        .catch(error => {
            console.error("There was an error getting the task!", error);
        })
    }, [])
    const addTask = () => {
    axios.post('http://localhost:5000/task', { title })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTitle('');
      })
      .catch(error => {
        console.error("There was an error creating the task!", error);
      });
    }
    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/task/${id}`)
        .then(() => {
            setTasks(tasks.filter(task => task._id !== id));
          })
          .catch(error => {
            console.error("There was an error deleting the task!", error);
          });
    }
  return (
    <div>
         <h1>Task Manager</h1>
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>
      <hr/>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
            <br/>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
            <hr/>
          </li>
        ))}
      </ul>

    </div>
  )
}
