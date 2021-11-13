import Task from "./Task"
import Button from "./Button"

const Completed = ({tasks, onDelete, onChange}) => {
    return (
        <div className='completed-tasks'>
            <div className='flex-end'>
            <Button color='black' text='delete' onClick={onDelete}/>
            </div>
         {tasks.map((task) => (
             <Task key={task.id} task={task}   onChange={onChange}/>
         ))}   
        </div>
    )
}

export default Completed
