import fs from 'fs'
import path from 'path'
import { AES } from 'crypto-js'
import CryptoJS from 'crypto-js'

const root_path = process.cwd()

export async function GET(req: Request) {
    // get token from url
    const token = new URL(req.url).searchParams.get("token")
    const email = AES.decrypt(token!.trim(), "makuro").toString(CryptoJS.enc.Utf8)

    const mp3 = await fs.promises.readFile(path.join(root_path, "assets", "mp3", `${email}_output`, "output.mp3"))
    return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg' } })

}