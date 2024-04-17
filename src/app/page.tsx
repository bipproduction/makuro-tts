import prisma from "@/util/prisma";
import { Button, Container, Group, Stack, TextInput, Textarea, Title } from "@mantine/core";
import { config, createAudioFromText, getConfig } from 'tiktok-tts'
import path from "path";
import mqtt_client from "@/util/mqtt_client";
import MyNotif from "./_ui/mynotif";
import fs from 'fs'
import { spawn } from 'child_process'
import { revalidatePath } from "next/cache";

const root_path = process.cwd()
// var loading = false

async function olah(formData: FormData) {
  'use server'
  // loading = true
  revalidatePath('/')
  await fs.promises.rm(path.join(root_path, "assets", "mp3", "raw"), { recursive: true, force: true })
  await fs.promises.mkdir(path.join(root_path, "assets", "mp3", "raw"))

  let text = formData.get("text")

  if (!text || text === "") {
    mqtt_client.publish("makuro_tts", "jangan empty")
    return
  }

  let list_text = text.toString().split("\n").map(t => t.split(".").map(tt => tt.split(",").flat()).flat().map(t => t.trim()).filter(t => t !== "")).flat()

  for (let c in list_text) {
    await createAudioFromText(list_text[c], path.join(root_path, "assets", "mp3", "raw", "audio" + c), "id_001");
  }

  const files = await fs.promises.readdir(path.join(root_path, "assets", "mp3", "raw"))
  const output = "output.mp3"

  const child = spawn('ffmpeg', [
    ...files.flatMap(file => ['-i', path.join(root_path, "assets", "mp3", "raw", file)]),
    '-filter_complex', `concat=n=${files.length}:v=0:a=1`, '-y',
    path.join(root_path, "assets", "mp3", "output", output)
  ])

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  })

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  })

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  })

  mqtt_client.publish("makuro_tts", "done")
  // loading = false
  revalidatePath('/')
}

// const session_id = "67d99738f7855bf0bc05ee8f153f29e1"
let session_id: string;
export default async function Home() {
  // let data_session_id = await prisma.sessionId.findFirst()
  // let mp3_file = path.join(root_path, "assets", "mp3", "output", "output.mp3")
  // if (!data_session_id) session_id = '67d99738f7855bf0bc05ee8f153f29e1'
  // config(session_id)

  // const fl = await fs.promises.readFile(mp3_file)
  // const gToken =  getConfig()

  return null
  // return (
  //   <main>
  //     {/* {mp3_file} */}
  //     <audio controls>
  //       <source src={`data:audio/mpeg;base64,${fl.toString("base64")}`} type="audio/mpeg" />
  //       Your browser does not support the audio element.
  //     </audio>
  //     <MyNotif />
  //     <Container>
  //       <Stack gap={12}>
  //         <Title>Tts</Title>
  //         <form style={{
  //           display: "flex",
  //           gap: 12
  //         }}>
  //           <TextInput defaultValue={session_id} />
  //           <Button>Save</Button>
  //         </form>
  //         <form action={olah} style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           gap: 12
  //         }}>
  //           <Textarea name="text" rows={20} mih={300} />
  //           <Group justify="end">
  //             <Button variant="outline" type="submit">Tekan </Button>
  //           </Group>
  //         </form>
  //       </Stack>
  //     </Container>
  //   </main>
  // );
}
