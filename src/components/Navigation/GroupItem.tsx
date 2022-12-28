import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TodoGroup } from '../../types/todos';
import { TodoIcon } from './TodoGridItem/TodoIcon';
import { useDispatch } from 'react-redux';
import { setCurrentGroup } from '../../interface/client/todoSlice';
import { useAppSelector } from '../../hooks';

export interface GroupItemProps {
    todoGroup: TodoGroup;
    toggleDeleteStatus?: (id: number) => void;
    selectedForDelete?: boolean;
    closeNav: () => void;
}
const GroupItem: React.FC<GroupItemProps> = ({ todoGroup, toggleDeleteStatus, selectedForDelete, closeNav }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentGroup = useAppSelector(state => state.todo.currentGroup);

    const handleOnClick = () => {
        if (toggleDeleteStatus) {
            toggleDeleteStatus(todoGroup.id)
        } else {
            dispatch(setCurrentGroup(todoGroup.id));
            navigate('/todos/');
            closeNav();
        }
    }
    const isActive = currentGroup?.id === todoGroup.id;
    const regularClass = `
        ${isActive && 'shadow-lg backdrop-filter backdrop-blur-sm text-purple-100 fill-purple-100 font-bold'}
        flex flex-col
        items-center
        justify-center
        rounded-lg
        py-12
        ${!isActive && 'shadow-lg backdrop-filter backdrop-blur-sm text-white fill-white font-bold'}
        cursor-pointer
        transition-all
    `

    const deleteClass = `
        ${selectedForDelete && 'backdrop-filter backdrop-blur-md shadow-xl text-white fill-white stroke-white'}
        flex flex-col
        items-center
        justify-center
        rounded-lg
        py-12
        ${!selectedForDelete && 'bg-neutral-600 bg-opacity-50 text-slate-400 fill-slate-400 stroke-slate-400'}
        cursor-pointer
        hover:scale-105
        transition-all
    `
    return (
        <div onClick={handleOnClick} 
            className={toggleDeleteStatus ? deleteClass : regularClass }>
            <TodoIcon style={{ fontSize: isActive ? '3rem': '2.8rem' }} type={todoGroup.icon} className={`fill-inherit text-inherit`} />
            <span className='font-oxygen font-semibold'>{todoGroup.name}</span>
        </div>
    )
}

export default GroupItem;