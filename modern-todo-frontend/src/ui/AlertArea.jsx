import {Alert, Container} from '@mantine/core';
import {IconInfoCircle} from '@tabler/icons-react';
import {useState} from "react";

function AlertArea({color, title, description}) {
    const [isClosed, setIsClosed] = useState(false);

    if (!isClosed) return (
        <Container size={"xs"}>
            <Alert variant="light" color={color} title={title} icon={<IconInfoCircle/>} withCloseButton
                   onClose={() => setIsClosed(!isClosed)}>
                {description}
            </Alert>
        </Container>

    );

}

export default AlertArea;