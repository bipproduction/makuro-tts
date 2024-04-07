'use client'
import { Button, Flex, Group, Stack, Text, Textarea } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import toast from "react-simple-toasts"
import _ from "lodash"
import { MdPause, MdPlayArrow } from "react-icons/md"

export default function ReaderEditor() {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState("")
    const audio = useRef<HTMLAudioElement | null>(null);
    const [isPaause, setIsPause] = useState(false)
    const [runText, setRunText] = useState("")

    useEffect(() => {
        setToken(localStorage.getItem("token") || "")

    }, [])


    async function kirim() {
        setLoading(true)
        if (text === "") return toast("text cannot be empty")
        const k = await fetch('/reader/mp3/generate', {
            method: 'POST',
            body: JSON.stringify({ text, token }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
        console.log(k)
        setLoading(false)
        window.localStorage.setItem("step", JSON.stringify(k.step))
    }

    function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value)
        localStorage.setItem("text", e.target.value)
    }

    var pausedTime: any = 0;

    useEffect(() => {
        setText(localStorage.getItem("text") || "")
    }, [])

    return <>
        <Stack gap={12}>
            <Group>
                <Button variant="outline" leftSection={isPaause ? <MdPause /> : <MdPlayArrow />} color="green" onClick={() => {

                    if (audio.current?.paused) {
                        // Play case: resume from pausedTime
                        audio.current?.setAttribute('src', `/reader/mp3/load?token=${token}&id=${_.random(10000, 99999)}`)
                        audio.current.currentTime = pausedTime;
                        audio.current.play();
                    } else {
                        // Pause case: store current time
                        pausedTime = audio.current?.currentTime;
                        audio.current?.pause();
                    }
                    setIsPause(!audio.current?.paused || false)
                    audio.current?.addEventListener('ended', () => {
                        setIsPause(false)
                    })
                }}>
                    play
                </Button>
                {/* <Button variant="outline" color="red" onClick={() => audio.current?.pause()}>stop</Button> */}
                <a href={`/reader/mp3/load?token=${token}&id=${_.random(10000, 99999)}`} download="audio.mp3">
                    <Button>Download</Button>
                </a>
            </Group>
            <audio ref={audio as any} src={`/reader/mp3/load?token=${token}`}>
            </audio>
            <div id="audio_bulk"></div>

            <Flex align="start">
                <Stack gap={12} >
                    <Textarea cols={40} rows={20} defaultValue={text} onChange={onTextChange} />
                    <Group justify="end">
                        <Button loading={loading} onClick={kirim}>PROCCESS</Button>
                        <Button variant="outline" onClick={async () => {
                            const step = JSON.parse(localStorage.getItem("step") || "[]")

                            
                            for (let i = 0; i < step.length; i++) {
                                setRunText(step[i].text)
                                // audio.current?.setAttribute('src', `/reader/mp3/step/audio${i}.mp3&id=${_.random(10000, 99999)}&token=${token}`)
                                await audio.current?.play().then(() => {

                                }).finally(() => {
                                    console.log(step[i].text)
                                });

                            }
                            // fetch('/reader/mp3/step/audio0.mp3', {
                            //     method: 'GET',
                            //     headers: {
                            //         'Authorization': `Bearer ${token}`
                            //     }
                            // }).then(res => res.json())
                            //     .then(res => {
                            //         console.log(res)
                            //     })
                        }}>STEP</Button>
                    </Group>
                </Stack>
                <Stack w={300} p={12}>
                    <Text>
                        {runText}
                    </Text>
                </Stack>
            </Flex>


        </Stack>

    </>
}