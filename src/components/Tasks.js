import Task from "./Task"

const Tasks = ({tasks, onDelete, onToggle, onChange}) => {
    return (
        <>
         {tasks.map((task) => (
             <Task key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} onChange={onChange}/>
         ))}   
        </>
    )
}

export default Tasks
