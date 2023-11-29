import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import EditModal from "./EditModal/EditModal";

const url = 'https://65642480ceac41c0761d7ea7.mockapi.io/todo'
const App = () => {
    const [todos, setTodos] = useState([])
    const [todoTitle, setTodoTitle] = useState('')
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [idTodo,setIdTodo]=useState('')

    useEffect(() => {
        axios(url)
            .then(({data}) => setTodos(data))
    }, []);

    const handleEdit =(idTodo)=> {
        setEditModalOpen(true)
        setIdTodo(idTodo)
    }

    const handleAddTodo = () => {
        const newTodo = {
            title: todoTitle,
            completed: false,
            completedAt: null,
            createAt: +new Date()
        }
        setTodoTitle('')
        axios.post(url, newTodo)
            .then(({data}) => setTodos([...todos, data]))

    }

    const handleDelete = (todo) => {
        axios.delete(`${url}/${todo.id}`, todo)
            .then(({data}) => setTodos(todos.filter(todo => todo.id !== data.id)))
    }



    const handleSave = (todo) => {
        axios.put(`${url}/${idTodo}`, todo)
            .then(({data}) =>
                setTodos(todos.map(el => el.id === data.id ? data : el)))

    }

    return (
        <div className={'container'}>
            <h1>Todo List</h1>
            <input onChange={(e) => setTodoTitle(e.target.value)} type="text"/>
            <button onClick={handleAddTodo}>Add</button>
            <div>
                {
                    editModalOpen &&
                    <EditModal handleSave={handleSave} setOpen={setEditModalOpen} idTodo={idTodo} url={url}/>
                }
                {
                    todos.map(todo =>
                            <div className={'todo-wrapper'} key={todo.id}>
                                <p>{todo.title}</p>
                                <input type="checkbox" checked={todo.completed}/>
                                <span>
                                    {dayjs(todo.createAt).format('HH:mm DD/MM/YYYY')}
                                </span>
                                <button onClick={()=>handleEdit(todo.id)}>Edit</button>
                                <button onClick={() => handleDelete(todo)}>Delete Todo</button>
                            </div>
                    )
                }
            </div>
        </div>
    )
}
export default App;