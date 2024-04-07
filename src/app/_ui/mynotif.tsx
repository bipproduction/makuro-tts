'use client'
import { useShallowEffect } from "@mantine/hooks"
import mqtt_client from "@/util/mqtt_client"
import toast from "react-simple-toasts"

export default function MyNotif() {
    useShallowEffect(() => {
        mqtt_client.on("message", (topyc, message) => {
            toast(message.toString())
        })

        
    })
    return null
}