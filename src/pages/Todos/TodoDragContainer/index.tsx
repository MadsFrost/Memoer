import update from 'immutability-helper'
import React from 'react';
import { useCallback, useState } from 'react'
import TodoDragWrapper from '../TodoDragWrapper/index.';
import { useAppSelector } from '../../../hooks';
import { Todo } from '../../../types/todos';
import { updateGroupTodos, undoTodoCompleted } from '../../../interface/client/todoSlice';
import { useDispatch } from 'react-redux';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { FaUndoAlt } from 'react-icons/fa';
import CreateNewTodo from '../CreateNewTodo';
const Container: React.FC = () => {

  {
    const dispatch = useDispatch();
    const currentGroup = useAppSelector(state => state.todo.currentGroup);
    const [todos, setTodos] = useState<Todo[]>(currentGroup?.todos || [])
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
      <div className='flex flex-col justify-between min-h-full max-[600px]:mx-2'>
        <CreateNewTodo />
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
                    <div className={`flex flex-col`}>
                        <p className={`text-xl ${todo.deadline && todo.deadline < Date.now() && 'line-through'}`}>{todo.text}</p>
                        {todo.deadline ? 
                            <p>{`${new Date(todo.deadline).toDateString()} at: ${new Date(todo.deadline).toTimeString().split("GMT")[0].slice(0,5)} ${todo.deadline < Date.now() ? '| Deadline exceeded' : ''}`}</p>
                            :
                            <p>Ingen Deadline</p>
                        
                        }
                    </div>
                    
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
                    <div className='flex flex-row items-center cursor-pointer rounded-md bg-gray-400 text-gray-500 font-medium text-md py-2 px-2 my-2'>
                        <FaUndoAlt onClick={() => undoCompletedTodo(todo.id)} className='ml-2 mr-2 w-8 h-8 hover:text-purple-600'/> <span className="!text-md">{todo.text}</span>
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
