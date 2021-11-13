import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import Completed from "./components/Completed";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks('tasks');
      setTasks(tasksFromServer)
    }
    const getCompletedTasks = async () => {
      const completedTasksFromServer = await fetchTasks('completedTasks')
      setCompletedTasks(completedTasksFromServer)
    }

    getTasks()
    getCompletedTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async (tasks) => {
    const res = await fetch(`http://localhost:5000/${tasks}`)
    const data = await res.json()

    return data
  }

  // Fetch a Task
  const fetchTask = async (task, id) => {
    const res = await fetch(`http://localhost:5000/${task}/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task, data) => {
    const res = await fetch(`http://localhost:5000/${task}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resultData = await res.json()

    setTasks([...tasks, resultData])
    return resultData
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Tasks
  const deleteTasks = async () => {
    let i = 0
    for (i; i < completedTasks.length; i++) {
      await fetch(`http://localhost:5000/completedTasks/${completedTasks[i].id}`, {
        method: 'DELETE'
      })
    }
    console.log('deleted all')
    setCompletedTasks([])
  }

  // Delete task
  const deleteTask = async (task, id) => {
    await fetch(`http://localhost:5000/${task}/${id}`, {
      method: 'DELETE'
    })

    console.log('delete', id)
    task === 'tasks' ? (setTasks(tasks.filter(task => task.id !== id))) : (setCompletedTasks(completedTasks.filter(task => task.id !== id)))
  }

  // Toggle Status(completed)
  const completedStatus = async (id) => {
    const taskToToggle = await fetchTask('tasks', id)
    const changeTask = { ...taskToToggle, completed: !taskToToggle.completed }

    if (changeTask.completed) {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(changeTask)
      })
      const data = await res.json()
      console.log('1', data)

      await deleteTask('tasks', data.id)
      delete data.id
      console.log('2', data)
      const newCompleted = await addTask('completedTasks', data)

      setCompletedTasks([...completedTasks, newCompleted])
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  // Toggle Status(not completed)
  const notCompletedStatus = async (id) => {
    const taskToToggle = await fetchTask('completedTasks', id)
    const changeTask = { ...taskToToggle, completed: !taskToToggle.completed }

    if (!changeTask.completed) {
      const res = await fetch(`http://localhost:5000/completedTasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(changeTask)
      })

      const data = await res.json()
      console.log('should be false', data)

      await deleteTask('completedTasks', data.id)
      delete data.id
      console.log('should be false without id', data)
      const newTask = await addTask('tasks', data)

      setTasks([...tasks, newTask])
      setCompletedTasks(completedTasks.filter(task => task.id !== id))


    }
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })
    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === data.id ? data : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} onChange={completedStatus} />) : (
              'no tasks'
            )}
          </>
        )} />
        <Route path='/' exact render={(props) => (
          <>
           {completedTasks.length > 0 && (<Completed tasks={completedTasks} onChange={notCompletedStatus} onDelete={deleteTasks} />)}
          </> )} 
        />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
