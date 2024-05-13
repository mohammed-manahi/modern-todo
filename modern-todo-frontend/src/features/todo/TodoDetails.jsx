import {Divider, Drawer, Title, Text, Badge} from "@mantine/core";
import "@mantine/core/styles.css";
import {formatDate, formatTimeDuration} from "../../utilities/dateFormatter.js";

function TodoDetails({todo, isDrawerOpened, openDrawer, closeDrawer}) {
    return (
        <Drawer overlayProps={{backgroundOpacity: 0.5, blur: 4}} transitionProps={{duration: 800, transition: 'pop'}}
                opened={isDrawerOpened} onClose={closeDrawer}
                title={todo.name}>
            <Divider my="md"/>
            <Title order={2}>{todo.name}</Title>
            <Title order={3}>{todo.description}</Title>
            <Text size="md">
                <Badge w="fit-content" variant="light">
                    Due Date: {todo.dueDate !== null ? formatDate(todo.dueDate) : ""}
                </Badge>
            </Text>
            <Text size="md">
                Completed:
                {todo.isCompleted ? <Badge color="green"> Yes</Badge> : <Badge color="red"> No</Badge>}
            </Text>
            <Text size="md">
                Created: {formatTimeDuration(todo.createdDate)}
            </Text>
            <Text size="md">
                Last Modified: {formatTimeDuration(todo.updatedDate)}
            </Text>
        </Drawer>
    );
}

export default TodoDetails;