import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { BsFillTrashFill, BsCircleFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setGroupTodoCompleted, deleteGroupTodo } from '../../../interface/client/todoSlice';
import { useAppSelector } from '../../../hooks';
export const ItemTypes = {
    TODO: 'todo',
  }

export interface TodoDragWrapperProps {
  id: any
  children: React.ReactNode | React.ReactNode[];
  index: number
  groupId: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const TodoDragWrapper: FC<TodoDragWrapperProps> = ({ groupId, id, children, index, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch();
  const myTodo = useAppSelector(state => state.todo.groups).find((group) => {
    return group.id === groupId;
  })?.todos.find((todo) => {
    return todo.id === id;
  })

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.TODO,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.5 : 1
  drag(drop(ref))

  const setTodoCompleted = () => {
    dispatch(setGroupTodoCompleted({ groupId: groupId, todoId: id }))
  }

  const deleteTodo = () => {
    dispatch(deleteGroupTodo({ groupId: groupId, todoId: id }))
  }

  const exceededDeadline = myTodo?.deadline && myTodo.deadline < Date.now();

  return (
    <div ref={ref} onClick={setTodoCompleted} style={{ opacity }} data-handler-id={handlerId} 
     className={`
     ${exceededDeadline && '!bg-purple-100'}
     cursor-pointer
     !bg-white
     p-2 my-2 px-4
     bg-opacity-50 text-purple-700 font-medium !shadow-lg rounded-md
     flex flex-row justify-between items-center
     ${exceededDeadline && '!opacity-40' }
     `}
    >
      {children}
      <BsFillTrashFill onClick={deleteTodo} className='text-purple-600 text-2xl cursor-pointer' />
    </div>
  )
}

export default TodoDragWrapper;
