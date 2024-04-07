'use client'
import { Button, Center, Container, Stack, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import Register from "./register";
import { useAtom } from "jotai";
import { _is_login, _token } from "../_lib/global_val";
import toast from "react-simple-toasts";


interface LOGIN {
    email: string
    password: string
}

async function _login(data: LOGIN) {

    if (data.email === "" || data.password === "") return alert("email or password cannot be empty")

    const k = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
    })

    const d = await k.json()

    if (k.status === 200) {
        window.localStorage.setItem("token", d.token)
        return window.location.href = "/reader"
    }

    toast(d.message)
}

export default function Login() {
    const [value, setValue] = useState<LOGIN>({
        email: "",
        password: ""
    })

    const [isLogin, setIsLogin] = useAtom(_is_login)

    // const [token, setToken] = useAtom(_token)

    if (!isLogin) return <Register />
    return <Container>
        <Center>
            <Stack gap={12} maw={300}>
                <Title>Login</Title>
                <TextInput placeholder="email" onChange={e => setValue({ ...value, email: e.target.value })} />
                <TextInput placeholder="password" type="password" onChange={e => setValue({ ...value, password: e.target.value })} />
                <Button onClick={() => _login(value)}>Login</Button>
                <Button variant="outline" onClick={() => setIsLogin(false)}>Register</Button>
            </Stack>
        </Center>
    </Container>
}