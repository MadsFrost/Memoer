import React from 'react'
import { BsHouse, BsCode } from 'react-icons/bs';
import { CiStickyNote } from 'react-icons/ci';
import { AiOutlineStar } from 'react-icons/ai';
import { FaUniversity } from 'react-icons/fa';
import { MdChecklist, MdLabelImportant, MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
export type TodoIconTypes = 'checklist' | 'house' | 'note' | 'code' | 'university' | 'star' | 'notificationClose' | 'notificationClear' | 'important';
export interface TodoIconProps {
    className?: string;
    type: TodoIconTypes;
    color?: string;
    style?: React.CSSProperties;
}
export const TodoIcon: React.FC<TodoIconProps> = ({ className, type, color, ...restProps }) => {
  return (
    <div {...restProps} className={`${className ?? ''} text-2xl `}>
        {type === 'checklist' && <MdChecklist />}
        {type === 'house' && <BsHouse />}
        {type === 'note' && <CiStickyNote />}
        {type === 'code' && <BsCode />}
        {type === 'star' && <AiOutlineStar />}
        {type === 'university' && <FaUniversity />}
        {type === 'important' && <MdLabelImportant/>}
        {type === 'notificationClose' && <MdNotificationsActive />}
        {type === 'notificationClear' && <MdNotificationsNone />}
    </div>
  )
};