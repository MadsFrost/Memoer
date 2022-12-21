import React from 'react'
import { memo } from 'react'
import { useDrop } from 'react-dnd'
import { TodoFolder } from '../../../types/todos'
import { ImFolder, ImFolderOpen, ImFolderUpload } from 'react-icons/im';
import { useAppSelector } from '../../../hooks';
interface onDropProps {
    folder: string, 
    item: {
        type: number,
        name: string
    }
}

export interface DustbinProps {
  onClick: (folderName: string) => void;
  folder: TodoFolder;
  accept: string[]
  lastDroppedItem?: any
  onDrop: (props: onDropProps) => void
}

const Folder: React.FC<DustbinProps> = memo(function Dustbin({
  folder,
  accept,
  onDrop,
  onClick,
}) {
  const { folderView } = useAppSelector(state => state.todo);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: ((item: any) => onDrop({ folder: folder.name, item: { type: item.type, name: item.name } })),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <div onClick={() => onClick(folder.name)} ref={drop} className='
    w-[100px] flex flex-col h-[100px]
    justify-center items-center
    cursor-pointer
    ' data-testid="dustbin">
      {canDrop && !isOver && <ImFolderUpload className='text-6xl' />}
      {isOver && <ImFolderOpen className='text-purple-300 text-6xl'/>}
      {folderView === folder.name && <ImFolderOpen className='text-purple-300 text-6xl' />}
      {!canDrop && !isOver && folderView !== folder.name && <ImFolder className='text-6xl' />}
      {folder.name}
    </div>
  )
})

export default Folder;