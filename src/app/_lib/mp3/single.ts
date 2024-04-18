import path from "path"
import { config, createAudioFromText } from "tiktok-tts";
import prisma from "@/util/prisma";
const root_path = process.cwd()
import fs from 'fs'

export default async function single({ text, email }: { text: string, email: string }) {
    if (text.length > 500) {
        return {
            success: false,
            message: "text is too long"
        }
    }

    try {
        const sessionId = await prisma.sessionId.findUnique({
            where: {
                id: 1
            }
        })
        config(sessionId?.value)

        // check if dir exist thand create if not
        if (!await fs.promises.stat(path.join(root_path, "assets", "mp3", `${email}_single`)).then(() => true).catch(() => false)) {
            await fs.promises.mkdir(path.join(root_path, "assets", "mp3", `${email}_single`))
        }

        // row dir
        await createAudioFromText(text, path.join(root_path, "assets", "mp3", `${email}_single`, "audio"), "id_001");

        return {
            success: true,
            path: "/api/mp3/load-single/",
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}   