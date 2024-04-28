import {Center, Loader} from "@mantine/core";

function Spinner() {
    return (
        <Center>
            <Loader color="blue" type="dots"/>
        </Center>
    );
}

export default Spinner;