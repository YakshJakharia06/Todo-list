import React from 'react'
import "./Navbar.css"

const Navbar = () => {
  return (
    <nav className='flex justify-between text-white bg-violet-800 py-3'>
        <div className="logo">
            <span className='font-bold text-1xl mx-10'>iTask</span>
        </div>
        <ul className='flex gap-10 mx-10'>
            <li className='cursor-pointer hover:font-bold transition-all duration'>Home</li>
            <li className='cursor-pointer hover:font-bold transition-all duration'>Your Task</li>
        </ul>
    </nav>
  )
}

export default Navbar
