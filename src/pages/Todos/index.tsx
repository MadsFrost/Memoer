import React from 'react'
import TodoLayout from './TodoLayout';
import TodoDragContainer from './TodoDragContainer';
const Todos = () => {
  return (
    <TodoLayout>
      <TodoDragContainer />
    </TodoLayout>
  )
}

export default Todos;