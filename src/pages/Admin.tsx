import { ArrowForwardIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Flex, Grid, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr } from "@chakra-ui/react";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSendNotification } from "../api/message";
import { useCreatePumpImages, useDeletePumpImages, useGetPumpImages } from "../api/pump_images";
import { useGetQuestions, useSaveQuestions } from "../api/questions";
import Confirm from "../components/Confirm";
import { IPumpImage, IQuestion } from "../interfaces";
import { queryClient } from "../providers";

const dayOfWeeks = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Admin = () => {
    const { questions } = useGetQuestions();
    const [date, setDate] = useState('');
    const { mutate: saveQuestions, isPending: isSaving } = useSaveQuestions(date);
    const { mutate: sendNotification, isPending: isSending } = useSendNotification(() => {
        toast.success('Successfully sent notification');
    });
    const { pumpImages } = useGetPumpImages();
    const { mutateAsync: createPumpImage, isPending: isAdding } = useCreatePumpImages();
    const { mutateAsync: deletePumpImage, isPending: isDeleting } = useDeletePumpImages();
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [message, setMessage] = useState('');
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File>();
    const imageUrl = useMemo(() => file && URL.createObjectURL(file), [file]);

    useEffect(() => {
        const question = _.find(questions, (question => question.date == date))?.question;
        setQuestion(question || '');
    }, [questions, date]);

    const handleSave = async () => {
        try {
            JSON.parse(question);
            await saveQuestions(question);
            setIsOpenEditModal(false);
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    const handleSend = () => {
        sendNotification(message);
    }

    const handleAdd = async () => {
        try {
            if (!file)
                throw new Error('Please select image');
            const formData = new FormData();
            formData.append('image', file);
            await createPumpImage(formData);
            queryClient.invalidateQueries({ queryKey: ['getPumpImages'] });
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deletePumpImage(id);
            queryClient.invalidateQueries({ queryKey: ['getPumpImages'] });
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <>
            <Grid p={{ base: '16px', lg: '96px' }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }} gap='32px'>
                <Flex p='16px' bg='black' rounded='16px'>
                    <TableContainer w='full' maxW='1440px'>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th fontFamily='pixeled'>
                                        DATE
                                    </Th>
                                    <Th fontFamily='pixeled'>
                                        ACTION
                                    </Th>
                                    <Th fontFamily='pixeled'>
                                        PREVIEW
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {questions.map((question: IQuestion, index: number) => (
                                    <Tr key={index}>
                                        <Td>
                                            {dayOfWeeks[index]} {question.date}
                                        </Td>
                                        <Td>
                                            <EditIcon boxSize={6} onClick={() => {
                                                setDate(question.date);
                                                setIsOpenEditModal(true);
                                            }} />
                                        </Td>
                                        <Td>
                                            <Link href={`/games/cryptales.html?date=${question.date}`}>
                                                <ArrowForwardIcon boxSize={6} />
                                            </Link>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
                <Flex p='32px' direction='column' gap='32px' bg='black' rounded='16px'>
                    <Flex direction='column' gap='16px'>
                        <Text>
                            SEND NOTIFICATION
                        </Text>
                        <Textarea maxH='480px' value={message} onChange={(e) => setMessage(e.target.value)} />
                        <Flex justify='right'>
                            <Button p='8px 16px 12px 16px' onClick={handleSend}>
                                {isSending && <Spinner size='sm' mr={1} />}
                                SEND
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex direction='column' gap='16px'>
                        <Text>
                            PUMP&DUMP
                        </Text>
                        <Input type="file" display='none' ref={fileRef} onChange={(e) => e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])} />
                        <Flex gap={4}>
                            <TableContainer flexGrow={1}>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th fontFamily='pixeled'>
                                                #
                                            </Th>
                                            <Th fontFamily='pixeled'>
                                                IMAGE
                                            </Th>
                                            <Th fontFamily='pixeled'>
                                                ACTION
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {pumpImages.map((pumpImage: IPumpImage, index: number) => (
                                            <Tr key={pumpImage.id}>
                                                <Td>
                                                    {index + 1}
                                                </Td>
                                                <Td>
                                                    <Image w='48px' h='48px' src={`${import.meta.env.VITE_API_URL}/public/${pumpImage.image}`} />
                                                </Td>
                                                <Td>
                                                    <Flex align="center">
                                                        {isDeleting ? <Spinner size='sm' /> : (
                                                            <Confirm
                                                                label={'DO YOU REALLY DELETE THIS IMAGE?'}
                                                                onOk={() => handleDelete(pumpImage.id)}
                                                            >
                                                                <DeleteIcon boxSize={4} />
                                                            </Confirm>
                                                        )}
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Flex direction='column' align='center' gap={4}>
                                {imageUrl && <Image w='128px' h='128px' src={imageUrl} rounded={8} />}
                                <Button onClick={() => fileRef.current?.click()}>
                                    SELECT
                                </Button>
                                <Button onClick={handleAdd}>
                                    {isAdding && <Spinner size='sm' mr={1} />}
                                    ADD
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Grid>
            <Modal size='xl' isCentered isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)}>
                <ModalOverlay />
                <ModalContent bg='#000c'>
                    <ModalCloseButton />
                    <ModalHeader pb='8px'>
                        EDIT QUESTIONS
                    </ModalHeader>
                    <ModalBody>
                        <Textarea minH='320px' value={question} onChange={(e) => setQuestion(e.target.value)} />
                    </ModalBody>
                    <ModalFooter pt='8px'>
                        <Button p='8px 16px 12px 16px' onClick={handleSave}>
                            {isSaving && <Spinner size='sm' mr={1} />}
                            SAVE
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Admin;
