import React from 'react'
import { Input, Button } from '@chakra-ui/react';
import { ImPlus } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { addGroupTodo } from '../../../interface/client/todoSlice';
import { useAppSelector } from '../../../hooks';
const CreateNewTodo = () => {
    const dispatch = useDispatch();
    const currentGroup = useAppSelector(state => state.todo.currentGroup);
    const [todoInput, setTodoInput] = React.useState<string>('')
    const [msDate, setMsDate] = React.useState<number>();
    const [showCreateField, setShowCreateField] = React.useState<boolean>(false);
    const addNewTodo = () => {
        if (todoInput.length > 0) {
            dispatch(addGroupTodo({
                groupId: currentGroup?.id as number,
                todo: {
                    date: Date.now(),
                    text: todoInput,
                    deadline: msDate
                }
            }))
            setTodoInput('');
            setMsDate(undefined);
            setShowCreateField(false);
        }
    }
    return (
        <div className='backdrop-filter backdrop-blur-lg rounded-md'>
            {!showCreateField && 
            <Button className='!bg-purple-500 border-b-4 hover:!scale-105 transition-all duration-200 border-purple-600 my-4' variant='solid' onClick={() => setShowCreateField(!showCreateField)}
            >
                Ny Todo
            </Button>
            }
            {showCreateField && 
                <div className='py-8 flex flex-col'>
                    <h1 className='font-oxygen text-2xl font-semibold'>Create New Todo</h1>
                    <label className='pt-4 text-md font-noto !text-medium'>Todo Navn</label>
                    <Input
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        placeholder='Ny todo navn her..'
                        className='!rounded-md my-2 !border-2 focus:outline-none focus:border-none !text-white !placeholder-gray-200 !bg-gray-300 !bg-opacity-20' 
                    />
                    <label className='pt-4 text-md font-noto !text-medium pb-2'>Deadline?</label>
                    <Input
                        onChange={(e) => setMsDate(new Date(e.currentTarget.value).getTime())}
                        className='!rounded-md !bg-black !border-2 !bg-opacity-20 !border-black !text-black !font-oxygen !font-medium !invert'
                        type='datetime-local'
                    />
                    <div className='w-full space-x-6 flex flex-row py-4'>
                        <Button onClick={addNewTodo} className='!bg-purple-500 !w-full border-b-4 hover:!scale-105 transition-all duration-200 border-purple-600'>
                            <span className='mr-2 text-lg'>Lav todo</span> <ImPlus />
                        </Button>
                        <Button onClick={() => setShowCreateField(false)} variant='solid' className='!bg-white !text-purple-600 !w-full border-b-4 hover:!scale-105 transition-all duration-200 border-gray-300'>
                            <span className='mr-2 text-lg'>Luk</span>
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}
export default CreateNewTodo;