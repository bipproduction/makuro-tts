'use client'

import { Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import toast from "react-simple-toasts";

async function setSession(session: string) {
    const setsession = await fetch('/dev/api/set-session', {
        method: 'POST',
        body: JSON.stringify({ session }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await setsession.text()
    
    if (setsession.status === 200) {
        return toast("set session success")
    }

    return toast("set session failed")
}

export default function SetSession({ session }: { session: string }) {
    const [sessionId, setSessionId] = useState("")
    return <>
        <Group>
            <Stack>
                <Title order={4}>set session</Title>
                <Text>{session}</Text>
                {sessionId}
                <Group align="end">
                    <TextInput label="session" type="text" id="session" name="session" placeholder="session" onChange={e => setSessionId(e.target.value)} />
                    <Button onClick={() => setSession(sessionId)}>Save</Button>
                </Group>
            </Stack>
        </Group>
    </>
}