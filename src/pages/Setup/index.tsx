import React from 'react'
import { User } from '../../types/user';
import Stepper from './Stepper';
import { useNavigate } from 'react-router-dom';
import { Input } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setClient } from '../../interface/client/clientSlice';
const Setup = () => {
  const [username, setUsername] = React.useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initializeUser = () => {
    localStorage.setItem("user", JSON.stringify({
        name: username,
        email: 'N/A'
    }))
    dispatch(setClient({
        name: username,
        email: 'N/A'
    }))
    navigate('/')
  }
  return (
    <div className='min-h-screen w-screen flex justify-center items-center'>
        <div className='flex flex-col p-2 select-none items-center font-oxygen text-center'>
            <h1 className='text-5xl text-neutral-900'>
                Velkommen til
                <span className='font-bold text-white pl-2'>Memoer.</span>
            </h1>
            <Input value={username} onChange={(e) => setUsername(e.currentTarget.value)} className='mt-4 !border-none !text-center !text-lg !font-semibold' placeholder='Navn' />
            <button 
              className='cursor-pointer mt-4 bg-neutral-900 text-white font-semibold px-4 py-2 rounded-md'
              disabled={username.length === 0} 
              onClick={initializeUser}
            >
              Gå Videre
            </button>
        </div>
</div>
  )
}

export default Setup