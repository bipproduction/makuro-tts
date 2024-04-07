'use client'

import { Button, Flex, Group } from "@mantine/core"
import { Provider, createStore, useAtom } from "jotai"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import Login from "./login"
import { useEffect, useState } from "react"
import { _nav } from "../_lib/global_val"
import { useShallowEffect } from "@mantine/hooks"
import { useRouter } from "next/navigation"



async function _logOut() {

    window.localStorage.removeItem("token")

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


export default function JotaiProvider({ children }: any) {
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
                {/* <Link href="/" ><Button variant="subtle">home</Button></Link>
                <Link href="/dev"><Button variant="subtle">dev</Button></Link>
                <Link href="/reader"><Button variant="subtle">reader</Button></Link>
                <Link href="/api-doc"><Button variant="subtle">api-doc</Button></Link> */}
            </Flex>
            <Button onClick={_logOut}>Logout</Button>
        </Group>
        {localStorage && localStorage.getItem("token") ? children : <Login />}
    </Provider>
}