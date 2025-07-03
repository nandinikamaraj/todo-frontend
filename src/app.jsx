import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from "firebase/auth";  
import 'bootstrap/dist/css/bootstrap.min.css';  // ✅ Import Bootstrap for styling

function App() {
  const [user, setUser] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

  // ✅ Improved Google Sign-In function
  let loginInProgress = false;

  const handleLogin = async () => {
    if (loginInProgress) return;
    loginInProgress = true;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      });
      console.log("✅ Login success:", user.displayName);
    } catch (error) {
      console.error("❌ Login error:", error);
    } finally {
      loginInProgress = false;
    }
  };

  // ✅ Google Sign-Out
  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Logout error:", error));
  };

  // ✅ Fetch tasks (only when user is logged in)
  useEffect(() => {
    if (!user) return;
    axios.get('https://todo-backend-vmlw.onrender.com/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, [user]);

  // ✅ Add new task
  const handleAddTask = () => {
    if (!taskText.trim()) return;
    axios.post('https://todo-backend-vmlw.onrender.com/api/tasks', {
      title: taskText,
      userId: user?.uid,
    })
      .then(res => {
        setTasks([...tasks, res.data]);
        setTaskText('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  // ✅ Delete task
  const handleDeleteTask = (id) => {
    axios.delete(`https://todo-backend-vmlw.onrender.com/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(err => console.error('Error deleting task:', err));
  };

  // ✅ Mark Complete
  const markComplete = (id) => {
    axios.put(`https://todo-backend-vmlw.onrender.com/api/tasks/${id}`, { completed: true })
      .then(res => {
        setTasks(tasks.map(task => task._id === id ? res.data : task));
      })
      .catch(console.error);
  };

  // ✅ Mark Incomplete
  const markIncomplete = (id) => {
    axios.put(`https://todo-backend-vmlw.onrender.com/api/tasks/${id}`, { completed: false })
      .then(res => {
        setTasks(tasks.map(task => task._id === id ? res.data : task));
      })
      .catch(console.error);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo App with Google Login</h1>

      {/* ✅ Show login/logout */}
      {user ? (
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <span>Welcome, {user.name}</span>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={handleLogin}>Sign in with Google</button>
        </div>
      )}

      {/* ✅ Only show tasks if user is logged in */}
      {user && (
        <>
          {/* Add Task */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleAddTask}>Add</button>
          </div>

          {/* Task List */}
          <ul className="list-group">
            {tasks.map(task => (
              <li
                key={task._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              >
                {task.title}
                <div>
                  {!task.completed ? (
                    <button className="btn btn-sm btn-primary me-2" onClick={() => markComplete(task._id)}>Complete</button>
                  ) : (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => markIncomplete(task._id)}>Mark Incomplete</button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
