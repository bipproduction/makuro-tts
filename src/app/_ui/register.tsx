'use client'

import { ActionIcon, Button, Center, Container, Stack, TextInput, Title } from "@mantine/core"
import { useAtom } from "jotai"
import { _is_login } from "../_lib/global_val"
import { useState } from "react"
import { MdLock, MdLockOpen } from 'react-icons/md'

interface REGISTER {
    username: string
    email: string
    password: string
    confirm_password: string
}


async function _register(data: REGISTER, setIsLogin: any) {

    if (data.username === "" || data.email === "" || data.password === "" || data.confirm_password === "") return alert("username or email or password cannot be empty")
    if (data.password !== data.confirm_password) return alert("password and confirm password not same")
    const k = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    

    if (k.status === 200) {
        setIsLogin(true)
    }
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLogin, setIsLogin] = useAtom(_is_login)
    const [val, setVal] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    })
    return <Container>
        <Center>
            <Stack gap={12}>
                <Title>Register</Title>
                <TextInput placeholder="username" onChange={e => setVal({ ...val, username: e.target.value })} />
                <TextInput placeholder="email" onChange={e => setVal({ ...val, email: e.target.value })} />
                <TextInput rightSection={<ActionIcon onClick={() => setShowPassword(!showPassword)}>{showPassword ? <MdLockOpen /> : <MdLock />}</ActionIcon>} withAsterisk placeholder="password" type={showPassword ? "text" : "password"} onChange={e => setVal({ ...val, password: e.target.value })} />
                <TextInput placeholder="confirm password" type={showPassword ? "text" : "password"} onChange={e => setVal({ ...val, confirm_password: e.target.value })} />
                <Button onClick={() => _register(val, setIsLogin)}>Register</Button>
                <Button variant="outline" onClick={() => setIsLogin(true)}>Login</Button>
            </Stack>
        </Center>
    </Container>
}