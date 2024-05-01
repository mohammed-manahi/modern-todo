import {notifications} from "@mantine/notifications";

export function showNotification(title, message, color) {
    // Notification 
    notifications.show({
        title: title,
        message: message,
        color: color,
    })
}