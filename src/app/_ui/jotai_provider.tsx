'use client'

import { Button, Flex, Group, Text } from "@mantine/core"
import { Provider, createStore, useAtom } from "jotai"
import Login from "./login"
import { useEffect, useState } from "react"
import { _nav } from "../_lib/global_val"
import { useShallowEffect } from "@mantine/hooks"
import { useRouter } from "next/navigation"

async function _logOut() {
    const res = await fetch('/api/logout', {
        method: 'POST',
    })
    if (res.status === 200) {
        window.location.reload()
    }
    // window.localStorage.removeItem("token")
    // window.location.reload()

}

const store = createStore()

const listNav = [
    {
        name: "home",
        path: "/"
    },
    {
        name: "dev",
        path: "/dev"
    },
    {
        name: "reader",
        path: "/reader"
    },
    {
        name: "api-doc",
        path: "/api-doc"
    }
]

export default function JotaiProvider({ children, user }: { children: React.ReactNode, user: any }) {
    const [win, setWin] = useState<boolean | null>(null)
    const [nav, setNav] = useAtom(_nav)
    const router = useRouter()

    useShallowEffect(() => {
        if (window && !win) {
            setWin(true)
            setNav(window.location.pathname)
        }

    }, [])


    if (!win) return null
    return <Provider store={store}>
        <Group justify='space-between' p={12}>
            <Flex gap={12}>
                {listNav.map((l, i) => <Button key={i} onClick={() => {
                    setNav(l.path)
                    router.push(l.path)
                }} variant={nav === l.path ? "filled" : "subtle"}>{l.name}</Button>)}

            </Flex>
            <Flex gap={12}>
            <Text>{user?.name}</Text>
            <Button onClick={_logOut}> Logout</Button>
            </Flex>
        </Group>
        {localStorage && localStorage.getItem("token") ? children : <Login />}
    </Provider>
}