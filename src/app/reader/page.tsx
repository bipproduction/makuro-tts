import { Container, Group, Stack, Title } from "@mantine/core";
import ReaderEditor from "./_ui/editor";
import { cookies } from 'next/headers'
import Crypto from 'crypto-js'
import ReaderEditorV2 from "./_ui/editor_v2";

export default function Page() {
    const cookie = cookies();
    const token = cookie.get("token")?.value
    const email = Crypto.AES.decrypt(token!, "makuro").toString(Crypto.enc.Utf8)

    return <Group>
        <Stack gap={12}>
            <ReaderEditorV2 token={token!} />
        </Stack>
    </Group>
}