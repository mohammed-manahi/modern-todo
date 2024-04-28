import {useDisclosure} from '@mantine/hooks';
import {Modal, Button} from '@mantine/core';

function DialogModal() {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Authentication">
                HI
            </Modal>

            <Button onClick={open}>Open modal</Button>
        </>
    );

}

export default DialogModal;