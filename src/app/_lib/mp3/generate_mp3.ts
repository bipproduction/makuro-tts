import path from "path"
const root_path = process.cwd();
import fs from 'fs'
import { spawn } from 'child_process'
import { config, createAudioFromText } from "tiktok-tts";
import prisma from "@/util/prisma";

export default async function generate({ text, email }: { text: string, email: string }) {
    const sessionId = await prisma.sessionId.findUnique({
        where: {
            id: 1
        }
    })
    config(sessionId?.value)

    // row dir
    const dir_row = path.join(root_path, "assets", "mp3", `${email}_row`)
    const exist_raw = await fs.promises.stat(dir_row).then(() => true).catch(() => false)

    // output dir
    const dir_output = path.join(root_path, "assets", "mp3", `${email}_output`)
    const exist_output = await fs.promises.stat(dir_output).then(() => true).catch(() => false)

    // check if dir exist
    if (!exist_raw) {
        // if not exist create one
        await fs.promises.mkdir(dir_row)
    } else {
        // if exist remove and create again
        await fs.promises.rm(dir_row, { recursive: true, force: true })
        await fs.promises.mkdir(dir_row)
    }

    // check if dir output exist
    if (!exist_output) {
        // if not exist create one
        await fs.promises.mkdir(dir_output)
    } else {
        // if exist remove and create again
        await fs.promises.rm(dir_output, { recursive: true, force: true })
        await fs.promises.mkdir(dir_output)
    }

    // split text
    let list_text = text.toString()
        .split("\n")
        .map(t => t.split(".")
            .map(tt => tt.split(",")
                .flat()).flat()
            .map(t => t.trim())
            .filter(t => t !== ""))
        .flat()

    // generate audio
    const files = []
    const list_data: any[] = []

    // generate audio
    for (let c in list_text) {
        const d = {
            name: `audio${c}.mp3`,
            text: list_text[c]
        }
        list_data.push(d)
        files.push(path.join(root_path, "assets", "mp3", `${email}_row`, "audio" + c + ".mp3"))
        await createAudioFromText(list_text[c], path.join(root_path, "assets", "mp3", `${email}_row`, "audio" + c), "id_001");
    }

    const output = "output.mp3"

    // run ffmpeg
    const child = spawn('ffmpeg', [
        ...files.flatMap(file => ['-i', file]),
        '-filter_complex', `concat=n=${files.length}:v=0:a=1`, '-y',
        path.join(root_path, "assets", "mp3", `${email}_output`, output)
    ])

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    await prisma.tmpContent.upsert({
        where: {
            id: 1
        },
        create: {
            userId: user?.id,
            content: list_data
        },
        update: {
            content: list_data
        }
    })

    // run ffmpeg
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    })

    // child.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // })

    // child.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);
    // })

    return list_data
}