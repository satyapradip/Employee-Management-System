import React from 'react'

const Header = () => {
  return (
    <div className='flex items-end justify-between'> 
      <h1 className='text-2xl font-semibold'>Hello, <br /> <span className='text-3xl font-semibold'>Satyapradip </span>👋</h1>
      <button className='bg-red-500 px-4 py-2 rounded hover:scale-[1.02] active:scale-[0.98]'>log Out</button>
    </div>
  )
}

export default Header
