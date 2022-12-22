import React from 'react'
import { 
    Modal, 
    ModalOverlay, 
    ModalContent,
    ModalCloseButton ,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    FormLabel,
    Input
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { addNewFolder } from '../../interface/client/todoSlice';
import { isMobile } from 'react-device-detect';
import { ImFolderPlus } from 'react-icons/im';

export interface CreateFolderProps {
    closeNav: () => void;
}
const CreateFolder: React.FC<CreateFolderProps> = ({ closeNav }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [name, setName] = React.useState<string>('');
    const handleCreate = () => {
        dispatch(addNewFolder(name))
        onClose();
        setName('');
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
                <ImFolderPlus className='text-2xl' />
                <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'lg'} isCentered>
                    <ModalOverlay />
                    <ModalContent className='!rounded-lg !pt-4 !bg-transparent backdrop-filter backdrop-blur-lg !text-white'>
                        <div className='py-4 px-6 flex flex-row w-full justify-between items-center'>
                            <span className='font-open font-bold text-2xl'>Ny Mappe</span>
                            <ModalCloseButton className='-mr-6 -mt-3 !relative' />
                        </div>
                        <ModalBody className='font-oxygen flex flex-col'>
                            <FormLabel className='text-sm font-medium'>Navn:</FormLabel>
                            <Input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder='F.eks arbejde..' />
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

export default CreateFolder;