import React from 'react'
import Header from '../others/Header'
import TaskListNumber from '../others/TaskListNumber'
import TaskList from '../TaskList/TaskList'

const EmployeeDashboard = () => {
  return (
    <div>
      <div className='p-10 bg-neutral-700 text-white min-h-screen'>
        <Header/>
        <TaskListNumber/>
        <TaskList/>
      </div>
    </div>
  )
}

export default EmployeeDashboard
