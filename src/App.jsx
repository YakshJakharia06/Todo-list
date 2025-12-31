import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const TodoItem = ({ item, handleCheckBox, handleEdit, handleDelete }) => {
  return (
    <>
      <div className="todo flex w-full my-3 justify-between items-center bg-white/50 p-3 rounded-lg shadow-sm">
        <div className='flex flex-col gap-1'>
          <div className="flex gap-3">
            <input className='' onChange={handleCheckBox} type="checkbox" checked={item.isCompleted} name={item.id} />
            <div className={item.isCompleted ? "line-through text-gray-500 w-40 md:w-full wrap-break-word" : "font-medium text-slate-800 w-40 md:w-full wrap-break-word"}>
              {item.todo}
            </div>
          </div>
        </div>
      </div>
      <div className="btns flex gap-2 justify-center">
        <button onClick={(e) => handleEdit(e, item.id)} className='p-2 bg-violet-800 text-white rounded-md hover:bg-violet-900'><CiEdit /></button>
        <button onClick={(e) => handleDelete(e, item.id)} className='p-2 bg-violet-800 text-white rounded-md hover:bg-violet-900'><MdDeleteForever /></button>
      </div>
    </>
  );
};

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [showFinished, setshowFinished] = useState(true)
  const completedCount = todos.filter(t => t.isCompleted).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const sortedTodos = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const [dueDate, setDueDate] = useState("");


  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])


  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    } else if (todos.length === 0) {
      localStorage.setItem("todos", JSON.stringify([]));
    }
  }, [todos]);

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const handleAdd = () => {
    if (todo.trim().length === 0) return; // Prevent empty todos
    setTodos([...todos, { id: uuidv4(), todo, dueDate, isCompleted: false }]);
    setTodo("");
    setDueDate("");
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(item => {
      return item.id === id
    })
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
  }

  const handleDelete = (e, id) => {
    let index = todos.findIndex(item => {
      return item.id === id;
    })

    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckBox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  }


  // const router = createBrowserRouter([
  //   {
  //     path: ""
  //   }
  // ])

  const groupedTodos = todos.reduce((groups, item) => {
    const date = item.dueDate || "No Date"; // Handle items without dates
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});


  const sortedDates = Object.keys(groupedTodos).sort();

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-5 w-3/4 md:w-[90%] rounded-2xl bg-purple-400 min-h-[80vh]">
        <h2 className='text-xl font-bold mb-4'>Your Agenda</h2>


        <div className="flex overflow-x-auto gap-6 pb-4">
          {sortedDates.map(date => (
            <div key={date} className="w-full bg-white/20 p-4 rounded-xl flex flex-col shadow-lg">


              <h3 className='text-lg font-bold mb-3 border-b border-purple-800 pb-2 flex justify-between'>
                <span>{date === "No Date" ? "Unscheduled" : `${date}`}</span>
                {/* <span className="text-sm bg-purple-700 text-white px-2 py-1 rounded-full">
                  {groupedTodos[date].length}
                </span> */}
              </h3>



              {/* Todos for this specific date */}



              <div className="flex-1 overflow-y-auto w-full">
                {groupedTodos[date].map(item => (
                  <TodoItem key={item.id} item={item} handleCheckBox={handleCheckBox} handleEdit={handleEdit} handleDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}

          {todos.length === 0 && <div className='mt-5'>Your agenda is empty. Add a task!</div>}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}>
          </div>
        </div>
        <p className="text-sm text-[#000000] text-center">{completedCount} of {totalCount} tasks completed</p>
        <h1 className='font-bold text-center text-2xl p-5'>iTask - Manage your todos at one place</h1>




        {/* input section  */}




        <h2 className='text-lg font-bold mt-2 mb-5'>Add a Todo</h2>
        <div className="addTodo justify-center items-center text-center">
          <input onChange={handleChange} onKeyDown={handleKeyPress} value={todo} type="text" className='bg-white h-full w-full rounded-[5px] px-2 py-1' />
          <div className="flex gap-2 items-center">
            <span className="text-sm font-semibold text-violet-900">Due Date:</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-md px-2 py-1 text-sm cursor-pointer"
            />
          </div>
          <button onClick={handleAdd} className='bg-violet-700 hover:bg-violet-950 mt-2 mb-2 py-1 rounded-md text-white cursor-pointer w-full'>Save</button>
        </div>
        <input className='mr-2 mb-5 my-4' onChange={toggleFinished} type="checkbox" checked={showFinished} />Show Finished todos



        {/* todos list  */}


        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='mt-5 w-[80%]'>No todos to display</div>}
          {todos.map(item => {
            //if showfinished is true then all (finished and notfinished) will be shown if showfinished is false then i will only show when item.iscompleted is false
            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex w-full my-3">
              <div className='flex gap-2 w-full'>
                <input onChange={handleCheckBox} type="checkbox" checked={item.isCompleted} name={item.id} id="" />
                <div className={item.isCompleted ? "wrap-break-word p-2 w-fit h-full text-center" : "w-[60%] h-full wrap-break-word p-2"}>
                  {item.todo}
                </div>

                  {item.dueDate && (
                    <div className="text-[12px] ml-2 text-violet-900 font-bold bg-violet-100 w-18 p-2 rounded-2xl h-fit">
                      {item.dueDate}
                    </div>
                  )}
                  <div className="btns h-full p-2 w-12 align-middle">
                    <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 mx-1 px-2 py-1 mb-1 rounded-md text-white cursor-pointer'><CiEdit />
                    </button>
                    <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 mx-1 px-2 py-1 rounded-md text-white cursor-pointer'><MdDeleteForever /></button>
                  </div>
                
              </div>

            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
