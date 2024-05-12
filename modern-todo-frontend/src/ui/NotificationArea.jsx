import {Notification} from '@mantine/core';
import '@mantine/notifications/styles.css';

function NotificationArea({title, message, color}) {
    return (
        <Notification color={color} title={title}>
            {message}
        </Notification>)
}

export default NotificationArea;