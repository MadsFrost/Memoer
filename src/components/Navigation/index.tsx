import React from "react";
import DrawerButton from "./DrawerButton";
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import { setMenu } from "../../interface/client/clientSlice";
import GroupItem from "./GroupItem";
import CreateGroupOrList from "./CreateGroupOrList";
import { MdOutlineDeleteOutline, MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md';
import { RiFolderSettingsFill } from 'react-icons/ri';
import { removeGroups } from "../../interface/client/todoSlice";
import './animations.css';
import Box from "./DND/Box";
import FolderGrid from "./FolderGrid";
import CreateFolder from "./CreateFolder";

const Navigation = () => {
    const { isMenuOpen: isOpen, user } = useAppSelector(state => state.client);
    const [deleteView, setDeleteView] = React.useState(false);
    const [ showFolderSettings, setShowFolderSettings ] = React.useState(false);
    const [ selectedGroups, setSelectedGroups ] = React.useState<number[]>([]);
    const { groups, todofolders, folderView, currentGroup } = useAppSelector(state => state.todo);
    const dispatch = useDispatch();
    const toggleMenu = () => {
        dispatch(setMenu(!isOpen))
    }

    const toggleDeleteView = () => {
        setDeleteView(!deleteView);
    }

    const handleCloseDelete = () => {
        toggleDeleteView();
        setSelectedGroups([]);
    }

    const handleSubmitDelete = () => {
        dispatch(removeGroups(
            selectedGroups
        ))
        toggleDeleteView();
        setSelectedGroups([]);
    }

    const toggleGroupToSelected = (id: number) => {
        if (selectedGroups.includes(id)) {
            setSelectedGroups(
                selectedGroups.filter((groupId) => {
                    return groupId !== id;
                })
            )
        } else {
            setSelectedGroups([...selectedGroups, id])
        }
    }

    const idInSelected = (id: number): boolean => {
        const findById = selectedGroups.some((groupId) => {
            return groupId === id;
        })

        return findById;
    }

    return (
        <>  
            {<div className={`m-3 ${isOpen ? 'menuClose' : 'menuOpen' } flex flex-row items-center`}>
                <DrawerButton />
                {currentGroup && 
                    <div className='ml-2 flex flex-col'>
                        <span className='font-semibold'>{currentGroup.name} Liste</span>
                        {currentGroup?.belongsTo && <span className='text-sm text-gray-200'>Mappe: {currentGroup.belongsTo}</span>}
                    </div>    
                }
            </div>}
            <div className={`${isOpen ? 'drawerOpen': 'drawerClose'} top-0 left-0 backdrop-filter fixed z-10 backdrop-blur-md h-screen flex-col w-full`}>
                <div className='h-full flex flex-col'>
                    <div className='min-h-min p-3 text-white shadow-xl flex flex-row items-center cursor-pointer' onClick={toggleMenu}>
                        <div className='drawerOpen'>
                            <DrawerButton />
                        </div>
                        <div className='flex flex-col font-oxygen pl-4 text-left'>
                            <span className="text-2xl font-medium">Opskriv</span>
                            <span className='text-sm font-semibold font-open'>{user?.name}</span>
                        </div>
                    </div>
                    <div className='min-h-full flex flex-col justify-between overflow-scroll' id="drawerbody">
                            <div>
                                {todofolders && <FolderGrid activateSettings={showFolderSettings} />}
                                <div className='grid min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 min-[1100px]:grid-cols-3 min-[800px]:grid-cols-2 grid-cols-2 px-8 gap-3 py-4 overflow-x-hidden overflow-y-hidden'>
                                    {deleteView ?  
                                        groups.filter((group) => {
                                            if (folderView) {
                                                return group.belongsTo === folderView
                                            } else {
                                                return group.belongsTo === undefined
                                            }
                                        }).map((group) => <GroupItem closeNav={toggleMenu} selectedForDelete={idInSelected(group.id)} toggleDeleteStatus={toggleGroupToSelected} todoGroup={group} />)
                                    : 
                                        groups.filter((group) => { 
                                            if (folderView) {
                                                return group.belongsTo === folderView
                                            } else {
                                                return group.belongsTo === undefined
                                            }
                                        }).map((group) => {
                                            return (
                                                <Box name={group.name} key={group.id} type={group.id}>
                                                    <GroupItem closeNav={toggleMenu} todoGroup={group} />
                                                </Box>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='mb-24 shadow-inner w-full min-h-min flex flex-row justify-between items-center px-5'>
                                {deleteView ? (
                                    <div className='flex flex-row items-center w-full justify-between'>
                                        <MdOutlineCancel className='text-4xl text-red-600
                                        cursor-pointer hover:scale-125 transition-all
                                        ' 
                                        onClick={handleCloseDelete}
                                        />
                                        <MdOutlineCheckCircle className={`
                                        ${selectedGroups.length > 0 ? 
                                            'text-4xl text-green-600 cursor-pointer hover:scale-125 transition-all'
                                            :
                                            'text-4xl text-gray-400 opacity-50'
                                        }

                                        `}
                                        onClick={handleSubmitDelete}
                                        />
                                    </div>
                                )
                                : ( 
                                    <div className='flex flex-row items-center w-full justify-between'>
                                        <div className='flex flex-row items-center'>
                                            <MdOutlineDeleteOutline onClick={toggleDeleteView} className={`
                                                ${groups.length !== 0 && 'text-4xl text-white fill-white cursor-pointer hover:scale-125 transition-all'}
                                                ${groups.length === 0 && 'text-4xl text-gray-400 opacity-50'}
                                                `}
                                            />
                                        </div>
                                        <div className='flex flex-row items-center space-x-4'>
                                            {!deleteView && <CreateGroupOrList closeNav={toggleMenu} />}
                                            <CreateFolder closeNav={toggleMenu} />
                                            <button 
                                                onClick={() => setShowFolderSettings(!showFolderSettings)}
                                                disabled={folderView === undefined} className={`
                                                    ${folderView !== undefined && 'text-white'}
                                                    ${folderView === undefined && 'text-gray-400 opacity-50'}
                                                    `}>
                                                <RiFolderSettingsFill style={{ fontSize: '1.85rem'}} />
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navigation