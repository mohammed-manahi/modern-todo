import {Card, Image, ActionIcon, Group, Text, Badge, useMantineTheme, rem, Chip, Space,} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconPencil, IconEye, IconTrash} from '@tabler/icons-react';
import classes from "../../ui/Card.module.css"
import {formatDate, formatTimeDuration} from "../../utilities/dateFormatter.js";
import TodoDetails from "./TodoDetails.jsx";
import TodoDelete from "./TodoDelete.jsx";

function TodoItem({todo}) {
    const theme = useMantineTheme();

    // Manage drawer toggle for to do details
    const [isDrawerOpened, {open: openDrawer, close: closeDrawer}] = useDisclosure(false);

    // Manage modal toggle for to do create and update 
    // const [isModalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);

    // Manage dialogue for to do delete confirmation
    const [isDialogueOpened, {open: toggleDialogue, close: closeDialogue}] = useDisclosure(false);

    return (
        <>
            <Card withBorder padding="lg" radius="md" className={classes.card}>
                <Card.Section mb="sm">
                    <Image
                        src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                        alt="Top 50 underrated plants for house decoration"
                        height={180}
                    />
                </Card.Section>

                <Badge w="fit-content" variant="light">
                    Due Date: {todo.dueDate !== null ? formatDate(todo.dueDate) : ""}
                </Badge>

                <Text fw={700} className={classes.title} mt="xs">
                    {todo.name}
                </Text>
                <Text fw={500}>{todo.description}</Text>
                <Space h={"md"}/>
                <Chip checked={todo.isCompleted} color="green"
                      variant="light">{todo.isCompleted ? "Completed" : "Not Yet"}</Chip>
                <Group mt="lg">
                    <div>
                        <Text fz="xs" c="dimmed"> Created:
                            {formatTimeDuration(todo.createdDate)}
                        </Text>
                    </div>
                    |
                    <div>
                        <Text fz="xs" c="dimmed"> Last modified:
                            {formatTimeDuration(todo.updatedDate)}
                        </Text>
                    </div>
                </Group>
                <Card.Section className={classes.footer}>
                    <Group justify="space-between">
                        <Text fz="xs" c="dimmed">
                            Actions
                        </Text>
                        <Group gap={0}>
                            <ActionIcon variant="subtle" color="gray" onClick={openDrawer}>
                                <IconEye
                                    style={{width: rem(20), height: rem(20)}}
                                    color={theme.colors.blue[6]}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray">
                                <IconPencil
                                    style={{width: rem(20), height: rem(20)}}
                                    color={theme.colors.yellow[6]}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" onClick={toggleDialogue}>
                                <IconTrash
                                    style={{width: rem(20), height: rem(20)}}
                                    color={theme.colors.red[6]}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>
            {isDrawerOpened &&
                <TodoDetails todo={todo} key={todo.id} isDrawerOpened={isDrawerOpened} openDrawer={openDrawer}
                             closeDrawer={closeDrawer}/>}
            {isDialogueOpened &&
                <TodoDelete todo={todo} key={todo.id} isDialogueOpened={isDialogueOpened}
                            toggleDialogue={toggleDialogue} closeDialogue={closeDialogue}/>}
        </>
    );
}

export default TodoItem;