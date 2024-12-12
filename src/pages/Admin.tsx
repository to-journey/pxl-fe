import { Button, Flex, Grid, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr } from "@chakra-ui/react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSendNotification } from "../api/message";
import { useGetQuestions, useSaveQuestions } from "../api/questions";
import { EditIcon, PlayIcon } from "../components/icons";
import { IQuestion } from "../interfaces";

const Admin = () => {
    const { questions } = useGetQuestions();
    const [date, setDate] = useState('');
    const { mutate: saveQuestions, isPending: isSaving } = useSaveQuestions(date);
    const { mutate: sendNotification, isPending: isSending } = useSendNotification(() => {
        toast.success('Successfully sent notification');
    });
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [message, setMessage] = useState('');

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
                                            {question.date}
                                        </Td>
                                        <Td>
                                            <Button onClick={() => {
                                                setDate(question.date);
                                                setIsOpenEditModal(true);
                                            }}>
                                                <EditIcon />
                                            </Button>
                                        </Td>
                                        <Td>
                                            <Link href={`/games/cryptales.html?date=${question.date}`}>
                                                <PlayIcon />
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
