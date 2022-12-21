import React from 'react'
import { CgGoogleTasks } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks';
import { setMenu } from '../../../interface/client/clientSlice';
import Brand from '../../../assets/memoer.svg';
const DrawerButton = ({ className }: { className?: string}) => {
    const isOpen = useAppSelector(state => state.client.isMenuOpen);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        dispatch(setMenu(!isOpen))
    }

    return (
        <img src={Brand}
        className={`w-12 h-12 cursor-pointer ${className && className}`}
        onClick={toggleMenu}
        />
    )
}

export default DrawerButton