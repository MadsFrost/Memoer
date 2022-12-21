import React from 'react'
import { TodoIcon } from '../TodoGridItem/TodoIcon';
import { useDispatch } from 'react-redux';
const StaticTodoLists = () => {
  return (
    <div className='flex flex-col px-2'>
        <div className='flex flex-row w-full min-[600px]:h-[160px] h-[200px] space-x-4 py-4'>
            <div className='w-1/2
                backdrop-filter backdrop-blur-xl
                rounded-lg shadow-md
                flex justify-center items-center
                cursor-pointer transition-all
            '>
                <TodoIcon style={{ fontSize: '3rem' }}
                type='notificationClose' className='fill-purple-400 text-purple-400'/>
            </div>
            <div className='w-1/2 
                backdrop-filter backdrop-blur-xl
                rounded-lg shadow-md
                flex justify-center items-center
                cursor-pointer transition-all
            '>
                <TodoIcon style={{ fontSize: '3rem' }}
                type='important' className='fill-purple-400 text-purple-400'/>
            </div>
        </div>
    </div>
  )
}

export default StaticTodoLists