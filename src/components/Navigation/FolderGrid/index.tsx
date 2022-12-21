import React from 'react'
import { useAppSelector } from '../../../hooks';
import FolderItem from '../FolderItem';
import { useDispatch } from 'react-redux';
import { addGroupToFolder, setFolderView, removeFolder, updateFolder } from '../../../interface/client/todoSlice';
import { Input } from '@chakra-ui/react';

const FolderGrid = () => {
    const dispatch = useDispatch();
    const [newName, setNewName] = React.useState<string>('');
    const { groups, todofolders, folderView } = useAppSelector(state => state.todo);
    const activeFolder = todofolders.find((folder) => { 
        return folder.name === folderView;
    })
    const availableGroupIds = groups.map((group) => {
        return String(group.id);
    })

    const onDrop = ({ folder, item }: { folder: string, item: {
        type: number,
        name: string
    }}) => {
        dispatch(addGroupToFolder({
            groupId: item.type,
            folder: folder
        }))
    }

    const openFolder = (folderName: string) => {
        if (folderView === folderName) {
            dispatch(setFolderView(undefined))
        } else {
            dispatch(setFolderView(folderName))
        }
    }

    const removeFolderFromId = (folderId: number) => {
        dispatch(setFolderView(undefined));
        dispatch(removeFolder(folderId));
    }

    const renameFolder = () => {
        activeFolder && dispatch(updateFolder({ id: activeFolder.id, name: newName }));
        dispatch(setFolderView(newName));
        setNewName('')
    }

    return (
        <>
            <div id="folderGrid" className={`${ todofolders && 'min-h-fit min-w-full rounded-lg px-8 py-4 max-w-fit'}`}>
                {todofolders.map((folder, idx) => {
                    return <FolderItem 
                        key={`${idx}-${folder.id}`} 
                        folder={folder} 
                        accept={availableGroupIds}  
                        onDrop={onDrop}
                        onClick={openFolder}
                    />
                })}
            </div>
            <div className='px-10 space-x-4 h-10 flex flex-row items-center'>
                {activeFolder && <button onClick={() => removeFolderFromId(activeFolder.id)} className='py-2 px-4 backdrop-filter backdrop-blur-2xl bg-white bg-opacity-10 rounded-sm'>Slet Mappe</button>}
                {activeFolder && <button disabled={newName.length <= 1} onClick={renameFolder} className='py-2 px-4 backdrop-filter backdrop-blur-2xl bg-white disabled:bg-gray-300 bg-opacity-10 disabled:bg-opacity-10 disabled:text-gray-400 rounded-sm'>Omdøb Mappe</button>}
                {activeFolder && <Input placeholder='Nyt mappe navn...' className='!border-none !w-[150px] backdrop-filter backdrop-blur-2xl' value={newName} onChange={(e) => setNewName(e.currentTarget.value)} />}
            </div>
        </>
    )
}

export default FolderGrid