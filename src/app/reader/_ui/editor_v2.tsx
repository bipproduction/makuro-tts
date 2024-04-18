'use client'
import { Button, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import toast from "react-simple-toasts";
import _ from 'lodash'
import { EventEmitter } from 'events'
const e = new EventEmitter()



export default function ReaderEditorV2({ token }: { token: string }) {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [div, setDiv] = useState(<div></div>)
    // const [listPlay, setListPlay] = useState<any[]>([])
    const [currentText, setCurrentText] = useState("")
    const [isPlay, setIsPlay] = useState(false)
    const [index, setIndex] = useState(0)
    const [audioName, setAudioName] = useState("")
    const [listAudio, setListAudio] = useState<any[]>([])

    async function tmpContent() {
        const res = await fetch('/api/mp3/tmp-content', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data: any[] = await res.json()
        setListAudio(data)
        // setListPlay(data)
        const tx = data.map((d: any) => d.text).join(". ")
        setText(tx)

    }

    useShallowEffect(() => {
        tmpContent()
    }, [])

    async function generate() {
        setLoading(true)
        if (text === "") return toast("text cannot be empty")
        const k = await fetch('/api/mp3/generate', {
            method: 'POST',
            body: JSON.stringify({ text, token }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())

        const tx = k.map((d: any) => d.text).join(". ")
        setText(tx)
        setLoading(false)
    }


    function play() {
        let idx = +(localStorage.getItem("idx") || "0");
        console.log(idx, listAudio.length);
        setIsPlay(true);

        try {
            const audio = new Audio(`/api/mp3/load/${listAudio[idx].name}/${token}`);
            const playNext = () => {
                idx++;
                localStorage.setItem("idx", idx.toString());
                return play();
            };

            if (idx < listAudio.length && audio.paused) {
                setCurrentText(listAudio[idx].text);
                audio.play();
                audio.addEventListener('ended', playNext);
            }

            const onPause = () => {
                setIsPlay(false);
                audio.pause();
            };

            const onStop = () => {
                setIsPlay(false);
                audio.pause();
                localStorage.setItem("idx", "0");
            };

            e.on("pause", onPause);
            e.on("stop", onStop);
        } catch (error) {
            localStorage.setItem("idx", "0");
            setIsPlay(false);
            console.error(error);
        }
    }

    let keberapa = 0;
    async function loadSingle() {

        const list_text = text.split(".").map((d: any) => d.trim())
        console.log("keberapa: ", keberapa, "text: ", list_text[keberapa])
        if (keberapa < list_text.length) {
            await fetch('/api/mp3/single', {
                method: 'POST',
                body: JSON.stringify({ text: list_text[keberapa], token }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
            const au = new Audio(`/api/mp3/load-single/${token}`)
            au.play()
            au.addEventListener('ended', async () => {
                keberapa++;
                return await loadSingle()
            })
        }
    }

    return <Stack gap={12} p={12}>
        {listAudio.length}
        <Group justify="end">
            <Button loading={isPlay} onClick={() => {
                play()
            }}>Play</Button>
            <Button onClick={() => e.emit("pause")}>Pause</Button>
            <Button onClick={() => e.emit("stop")}>Stop</Button>
        </Group>
        {div}
        <Title>Editor</Title>

        <Textarea placeholder="editor" rows={10} cols={100} value={text} onChange={e => setText(e.target.value)} />
        <Group justify="end">
            <Button loading={loading} onClick={generate}>GENERATE</Button>
        </Group>
        <Text p={12} bg={"black"} c={"blue"} size="lg">{currentText}</Text>
        <Stack>
            <Title>Test Single</Title>
            <Button onClick={async () => {

                loadSingle()

            }}>TEST</Button>
        </Stack>
    </Stack>
}