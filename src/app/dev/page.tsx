import { Button, Container, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import prisma from "@/util/prisma";
import SetSession from "./_ui/set_session";

export default async function Page() {
    const session = await prisma.sessionId.findUnique({
        where: {
            id: 1
        }
    })

    return <Stack gap={12} p={12}>
        <Title>Dev</Title>
        <SetSession session={session?.value as any} />
    </Stack>
}