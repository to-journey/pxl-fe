import { BoxProps, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text } from "@chakra-ui/react";
import { FC, useState } from "react";

interface Props extends BoxProps {
    label?: string;
    okLabel?: string;
    cancelLabel?: string;
    onOk?: () => void;
    onCancel?: () => void;
}

const Confirm: FC<Props> = ({ children, label, okLabel = 'OK', cancelLabel = 'CANCEL', onOk, onCancel, ...props }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Flex align='center' onClick={() => setShowConfirm(true)} {...props}>
                {children}
            </Flex>
            <Modal size='sm' isCentered isOpen={showConfirm} onClose={() => {
                setShowConfirm(false);
                onCancel?.();
            }}>
                <ModalContent bg='#000c' border='2px solid purple'>
                    <ModalCloseButton />
                    <ModalHeader>
                        <Text fontSize={14}>
                            {label}
                        </Text>
                    </ModalHeader>
                    <ModalBody>
                        <Flex justify='right' gap={2}>
                            <Button size='sm' onClick={onOk}>
                                {okLabel}
                            </Button>
                            <Button size='sm' onClick={() => {
                                setShowConfirm(false);
                                onCancel?.();
                            }}>
                                {cancelLabel}
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Confirm;
