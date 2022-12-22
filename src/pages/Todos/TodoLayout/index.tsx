import React from 'react';
import { useAppSelector } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
export interface TodoLayout {
    children: React.ReactNode |  React.ReactNode[];
}

const TodoLayout: React.FC<TodoLayout> = ({ children }) => {
    const currentGroup = useAppSelector(state => state.todo.currentGroup);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!currentGroup) navigate('/');
    }, [currentGroup])
    return (
    <>
        {currentGroup && (
            <div className={'backdrop-filter backdrop-blur-sm'}>
                <div>
                    {JSON.stringify(currentGroup)}
                </div>
                <div className='max-[600px]:px-2 px-8 py-4'>
                    {children}
                </div>
            </div>
        )}
    </>
    )
}

export default TodoLayout