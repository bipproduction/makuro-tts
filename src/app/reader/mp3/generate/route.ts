import { config, createAudioFromText, getConfig } from 'tiktok-tts'
import fs from 'fs'
import { spawn } from 'child_process'
import path from "path";
import prisma from "@/util/prisma";
import { AES } from 'crypto-js'
import CryptoJS from 'crypto-js'

const root_path = process.cwd()

interface BODY {
    text: string
    token: string
}

export async function POST(req: Request, res: Response) {
    const body: BODY = await req.json()
    const sessionId = await prisma.sessionId.findUnique({
        where: {
            id: 1
        }
    })
    config(sessionId?.value)
    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
        return new Response(JSON.stringify({ message: 'Not Authorized' }), { status: 403 })
    }

    const email = AES.decrypt(token!, "makuro").toString(CryptoJS.enc.Utf8)

    // row dir
    const dir_row = path.join(root_path, "assets", "mp3", `${email}_row`)
    const exist_row = await fs.promises.stat(dir_row).then(() => true).catch(() => false)

    // output dir
    const dir_output = path.join(root_path, "assets", "mp3", `${email}_output`)
    const exist_output = await fs.promises.stat(dir_output).then(() => true).catch(() => false)

    if (!exist_row) {
        await fs.promises.mkdir(dir_row)
    } else {
        await fs.promises.rm(dir_row, { recursive: true, force: true })
        await fs.promises.mkdir(dir_row)
    }

    if (!exist_output) {
        await fs.promises.mkdir(dir_output)
    } else {
        await fs.promises.rm(dir_output, { recursive: true, force: true })
        await fs.promises.mkdir(dir_output)
    }

    const text = body.text
    let list_text = text.toString().split("\n").map(t => t.split(".").map(tt => tt.split(",").flat()).flat().map(t => t.trim()).filter(t => t !== "")).flat()
    const files = []
    const list_data: any[] = []

    for (let c in list_text) {
        const d = {
            name: `audio${c}.mp3`,
            text: list_text[c]
        }
        list_data.push(d)
        files.push(path.join(root_path, "assets", "mp3", `${email}_row`, "audio" + c + ".mp3"))
        await createAudioFromText(list_text[c], path.join(root_path, "assets", "mp3", `${email}_row`, "audio" + c), "id_001");
    }

    // const files = await fs.promises.readdir(path.join(root_path, "assets", "mp3", `${email}_row`))
    const output = "output.mp3"

    const child = spawn('ffmpeg', [
        ...files.flatMap(file => ['-i', file]),
        '-filter_complex', `concat=n=${files.length}:v=0:a=1`, '-y',
        path.join(root_path, "assets", "mp3", `${email}_output`, output)
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


    return Response.json({ message: 'success', step: list_data })
}