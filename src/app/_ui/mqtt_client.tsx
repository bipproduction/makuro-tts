'use client'

import { useShallowEffect } from "@mantine/hooks"
import mqtt_client from "@/util/mqtt_client"


export default function MqttClient({ show }: { show?: boolean }) {
    useShallowEffect(() => {
        mqtt_client.on("connect", () => {
            console.log("connected")
            mqtt_client.subscribe("makuro_tts")
        })
        mqtt_client.on("error", () => {
            console.log("error")
        })
        mqtt_client.on("reconnect", () => {
            console.log("reconnect")
        })
        mqtt_client.on("disconnect", () => {
            console.log("disconnect")
        })
        // mqtt_client.on("message", (topyc, message) => {
        //     console.log("message")
        //     show && seNotif(message.toString())
        // })
    })
    return null
}