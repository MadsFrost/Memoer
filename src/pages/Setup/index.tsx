import React from 'react'
import { User } from '../../types/user';
import Stepper from './Stepper';
import { useNavigate } from 'react-router-dom';
const Setup = () => {
  const [user, setUser] = React.useState<User>();
  const navigate = useNavigate();
  const initializeUser = () => {
    localStorage.setItem("user", JSON.stringify({
        name: 'Mads Frost',
        email: 'madsanton31@gmail.com'
    }))
    navigate('/')

    }
  return (
    <div className='min-h-screen w-screen flex justify-center items-center'>
        <div className='flex flex-col p-2 select-none items-center font-oxygen'>
            <h1 className='text-5xl text-neutral-900'>
                Welcome to
                <span className='font-bold text-orange-500 pl-2'>Memoer.</span>
            </h1>
            <button onClick={initializeUser}>123</button>
        </div>
</div>
  )
}

export default Setup