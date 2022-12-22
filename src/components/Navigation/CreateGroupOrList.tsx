import React from 'react'
import { MdPlaylistAdd } from 'react-icons/md';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton ,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    FormLabel
} from '@chakra-ui/react'
import { TodoIcon } from './TodoGridItem/TodoIcon';
import { TodoIconTypes } from './TodoGridItem/TodoIcon';
import { useDispatch } from 'react-redux';
import { addNewGroup, setLatestGroup } from '../../interface/client/todoSlice';
import { useToast, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useAppSelector } from '../../hooks';
import { ImFolder } from 'react-icons/im';

export interface CreateGroupOrListProps {
    closeNav: () => void;
}
const CreateGroupOrList: React.FC<CreateGroupOrListProps> = ({ closeNav }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()
    const navigate = useNavigate();
    const toastIdRef = React.useRef<any>()
    const dispatch = useDispatch();
    const [name, setName] = React.useState<string>('');
    const [todoIcon, setTodoIcon] = React.useState<TodoIconTypes>('checklist');
    const [folder, setFolder] = React.useState<string | undefined>(undefined);
    const TodoIcons: TodoIconTypes[] = ['checklist', 'code', 'house', 'note', 'star', 'university']
    const todofolders = useAppSelector(state => state.todo.todofolders);
    const closeToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }
    const handleCreate = () => {
        dispatch(addNewGroup({
            name: name,
            created: Date.now(),
            completedTodos: [],
            todos: [],
            icon: todoIcon,
            belongsTo: folder
    }))

    const handleOpenCreate = () => {
        dispatch(setLatestGroup())
        navigate('/todos/');
        closeToast();
        closeNav();
    }
        onClose();
        setName('');
        setTodoIcon('checklist');
        toastIdRef.current = toast({
            title: 'Ny Todo!',
            description: 'Klik her for at åbne din nye todo',
            variant: 'left-accent',
            status: 'info',
            render: () => (
                <Alert status="info" className='cursor-pointer border-l-8 border-purple-600 !bg-black !text-white !bg-opacity-30 rounded-lg'
                    onClick={handleOpenCreate}
                >
                    <AlertIcon>
                        <TodoIcon type={todoIcon} className='fill-white text-white' />
                    </AlertIcon>
                    <div className='flex flex-col'>
                        <AlertTitle> Ny Todo! </AlertTitle>
                        <AlertDescription>Klik her for at åbne din nye todo</AlertDescription>
                    </div>
                </Alert>
            ),
            duration: 2000,
            position: 'bottom-right',
            isClosable: true
        })
    }

    return (
            <div 
                onClick={onOpen}
                className='
                flex flex-col items-center
                justify-center
                cursor-pointer w-30 rounded-lg
                min-[600px]:h-[110px] h-[130px]
                transition-all 
                text-white
                hover:text-neutral-300
            '>
                <MdPlaylistAdd className='mt-1 text-4xl'/>
                <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'lg'} isCentered>
                    <ModalOverlay />
                    <ModalContent id="folderSelect" className={`${!isMobile && '!mt-72'} !rounded-lg !pt-4 !bg-transparent backdrop-filter backdrop-blur-lg !text-white`}>
                        <div className='py-4 px-6 flex flex-row w-full justify-between items-center'>
                            <span className='font-open font-bold text-2xl'>Ny Todo</span>
                            <ModalCloseButton className='-mr-6 -mt-3 !relative' />
                        </div>
                        <ModalBody className='font-oxygen flex flex-col'>
                            <FormLabel className='text-sm font-medium'>Navn:</FormLabel>
                            <Input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder='F.eks arbejde..' />
                            <FormLabel className='text-sm pt-6'>Vælg ikon:</FormLabel>
                            <div className='grid grid-cols-4 max-[600px]:grid-cols-3 gap-4'>
                                {TodoIcons.map((icon, key) => {
                                    return (
                                        <div key={`${icon}-${key}`} className={`
                                        ${todoIcon === icon ? 'bg-black bg-opacity-40 text-white' : 'text-white'} 
                                        px-2 py-4 cursor-pointer
                                        shadow-md flex justify-center items-center hover:shadow-lg h-[100px] rounded-lg
                                        `} onClick={() => setTodoIcon(icon)}>
                                            <TodoIcon style={{ fontSize: '2.2rem' }} key={`${key}-${icon}`} className={`${todoIcon === icon && '!text-white fill-white'} text-4xl`} type={icon}/>
                                        </div>
                                    )
                                })}
                            </div>
                            {todofolders.length !== 0 && (
                                <>
                                    <FormLabel className='text-sm pt-6'>Vælg mappe?:</FormLabel>
                                    <div id="folderSelect" className='h-[300px] overflow-y-auto overflow-x-hidden'>
                                        {todofolders.map((folderItem, key) => {
                                            return (
                                                <div id="folderSelect" key={`${folderItem.id}-${key}`} className={`
                                                ${folder === folderItem.name ? 'bg-black bg-opacity-40 text-white' : 'text-white'} 
                                                px-2 py-4 cursor-pointer
                                                shadow-md flex justify-center items-center hover:shadow-lg h-[100px] rounded-lg
                                                `} onClick={() => {
                                                    folder !== folderItem.name && setFolder(folderItem.name);
                                                    folder === folderItem.name && setFolder(undefined);
                                                }}>
                                                    <ImFolder style={{ fontSize: '2.2rem' }} key={`${key}-${folderItem}`} className={`${folder === folderItem.name && '!text-white fill-white'} text-4xl`} />
                                                    <span className='ml-3'>{folderItem.name}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button className='font-oxygen !bg-purple-700 !text-white hover:!bg-purple-600 !px-8 !py-6 mb-4' mr={3} onClick={handleCreate}>
                                Lav
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
    )
}

export default CreateGroupOrList