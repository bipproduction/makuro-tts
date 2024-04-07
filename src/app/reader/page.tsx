import { Container, Stack, Title } from "@mantine/core";
import ReaderEditor from "./_ui/editor";
import { cookies } from 'next/headers'

export default function Page() {

    return <Container>
        <Stack gap={12}>
            <Title>Reader</Title>
            <ReaderEditor  />
        </Stack>
    </Container>
}