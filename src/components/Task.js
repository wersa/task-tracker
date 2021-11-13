import { FaTimes } from 'react-icons/fa'

const Task = ({task, onDelete, onToggle, onChange}) => {
    return (
        <div className={`task ${task.reminder ? 'reminder' : ''} ${task.completed ? 'completed' : ''}`} >
            <div className='wrapper'> 
            <h3 onDoubleClick={() => onToggle(task.id)} 
            onClick={() => onChange(task.id)}>
                {task.text} 
            </h3>
                 {!task.completed && (<FaTimes className='delete' style={{ color: 'black', cursor: 'pointer' }} 
                onClick={() => onDelete('tasks', task.id)} />)} 
                </div>
            <p>{task.day}</p>
        </div>
    )
}

export default Task
