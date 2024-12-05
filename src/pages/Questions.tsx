import { Button, Flex, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr } from "@chakra-ui/react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetQuestions, useSaveQuestions } from "../api/questions";
import { EditIcon, PlayIcon } from "../components/icons";
import { IQuestion } from "../interfaces";

const Questions = () => {
    const { questions } = useGetQuestions();
    const [date, setDate] = useState('');
    const { mutate: saveQuestions } = useSaveQuestions(date);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [question, setQuestion] = useState('');

    const handleSave = () => {
        try {
            JSON.parse(question);
            saveQuestions(question);
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        const question = _.find(questions, (question => question.date == date))?.question;
        setQuestion(question || '');
    }, [questions, date]);

    return (
        <>
            <Flex p={{ base: '16px', lg: '96px' }} justify='center'>
                <Flex w='full' maxW='1440px' bg='black' p='16px' rounded='16px'>
                    <TableContainer w='full' maxW='1440px'>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>
                                        DATE
                                    </Th>
                                    <Th>
                                        ACTION
                                    </Th>
                                    <Th>
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
            </Flex>
            <Modal size='sm' isCentered isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader pb='8px'>
                        Edit questions
                    </ModalHeader>
                    <ModalBody>
                        <Textarea minH='320px' value={question} onChange={(e) => setQuestion(e.target.value)} />
                    </ModalBody>
                    <ModalFooter pt='8px'>
                        <Button onClick={handleSave}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Questions;
