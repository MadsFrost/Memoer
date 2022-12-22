import update from 'immutability-helper'
import React from 'react';
import { useCallback, useState } from 'react'
import { Input, Button } from '@chakra-ui/react';
import TodoDragWrapper from '../TodoDragWrapper/index.';
import { useAppSelector } from '../../../hooks';
import { Todo } from '../../../types/todos';
import { updateGroupTodos, addGroupTodo, undoTodoCompleted } from '../../../interface/client/todoSlice';
import { useDispatch } from 'react-redux';
import { ImPlus } from 'react-icons/im';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { FaUndoAlt } from 'react-icons/fa';

const Container: React.FC = () => {

  {
    const dispatch = useDispatch();
    const currentGroup = useAppSelector(state => state.todo.currentGroup);
    const [todos, setTodos] = useState<Todo[]>(currentGroup?.todos || [])
    const [todoInput, setTodoInput] = useState<string>('')
    const [showCompleted, setShowCompleted] = useState<boolean>(false);
    const completedTodos = todos.filter((todo) => {
        return todo.completed;
    })

    const nonCompletedTodos = todos.filter((todo) => {
        return !todo.completed;
    }).length;

    React.useEffect(() => {
        setTodos(currentGroup?.todos ?? [])
    }, [currentGroup])
    React.useEffect(() => {
        if (todos !== currentGroup?.todos) {
            dispatch(updateGroupTodos({
                groupId: currentGroup?.id as number,
                todoList: todos
            }))
        }
    }, [todos])
    
    const addNewTodo = () => {
        if (todoInput.length > 0) {
            dispatch(addGroupTodo({
                groupId: currentGroup?.id as number,
                todo: {
                    date: Date.now(),
                    text: todoInput
                }
            }))
        }
        setTodoInput('')
    }
    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setTodos((prevCards: Todo[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Todo],
          ],
        }),
      )
    }, [])

    const undoCompletedTodo = (todoId: number) => {
        dispatch(undoTodoCompleted({
            groupId: currentGroup?.id as number,
            todoId: todoId
        }))
    }

    return (
      <div className='flex flex-col justify-between min-h-full'>
        <div className='py-8 flex flex-row items-center'>
            <Input
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder='Ny todo navn her..'
                className='focus:outline-none focus:border-none !bg-gray-300 !bg-opacity-30 !rounded-tr-none !rounded-br-none' />
            <Button onClick={addNewTodo} className='text-purple-400 !rounded-sm !px-8'>
                <ImPlus />
            </Button>
        </div>
        <div className='w-full h-full'>
            <h1 className='text-2xl py-2 font-oxygen'>Todos ({nonCompletedTodos}):</h1>
            {todos.map((todo, i) => { 
                if (!todo.completed) {
                    return <TodoDragWrapper
                    groupId={currentGroup?.id as number}
                    key={todo.id}
                    index={i}
                    id={todo.id}
                    moveCard={moveCard}
                >
                    <p className='text-2xl'>{todo.text}</p>
                </TodoDragWrapper>
                }
            })}
        </div>
        {completedTodos.length > 0 && <div className='py-8'>
            <h1 onClick={() => setShowCompleted(!showCompleted)} className='cursor-pointer text-2xl py-2 font-oxygen flex flex-row items-center'>{showCompleted ? `Gem færdige todos (${completedTodos.length}): ` : `Vis færdige todos (${completedTodos.length}):`}
                {showCompleted ? <BsChevronUp className='ml-2' /> : <BsChevronDown className='ml-2' />}
            </h1>
            {showCompleted && todos.map((todo, i) => {
                if (todo.completed) {
                    return (
                    <div className='flex flex-row items-center cursor-pointer rounded-md bg-gray-400 text-gray-500 font-medium text-lg py-2 px-2 my-2'>
                        <FaUndoAlt onClick={() => undoCompletedTodo(todo.id)} className='ml-2 mr-2 w-8 h-8 hover:text-purple-600'/> <span>{todo.text}</span>
                    </div>
                    )
                }
            })

            }
        </div>
        }
      </div>
    )
  }
}

export default Container;
