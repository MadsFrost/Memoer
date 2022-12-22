import update from 'immutability-helper'
import React from 'react';
import { useCallback, useState } from 'react'

import TodoDragWrapper from '../TodoDragWrapper/index.';
import { useAppSelector } from '../../../hooks';
import { Todo } from '../../../types/todos';
import { updateGroupTodos } from '../../../interface/client/todoSlice';
import { useDispatch } from 'react-redux';
const Container: React.FC = () => {

  {
    const dispatch = useDispatch();
    const currentGroup = useAppSelector(state => state.todo.currentGroup);
    const [todos, setTodos] = useState<Todo[]>(currentGroup?.todos || [])

    React.useEffect(() => {
        console.log(todos);
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

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        return (
          <TodoDragWrapper
            key={card.id}
            index={index}
            id={card.id}
            moveCard={moveCard}
          >
            <p>123 {card.text}</p>
          </TodoDragWrapper>
        )
      },
      [],
    )

    return (
      <>
        <div className='w-full bg-black'>{todos.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}

export default Container;
