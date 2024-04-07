import { AES } from "crypto-js"
import CryptoJS from "crypto-js"
import path from "path"
const root_path = process.cwd()
import fs from 'fs'


export async function GET(req: Request, { params }: { params: any }) {
    const name = params.name
    const token = new URLSearchParams(req.url).get("token")
    const email = AES.decrypt(token!, "makuro").toString(CryptoJS.enc.Utf8)
    const dir_row = path.join(root_path, "assets", "mp3", `${email}_row`)

    if (!fs.existsSync(dir_row)) {
        return new Response(JSON.stringify({ message: 'Not Authorized' }), { status: 403 })
    }
    const mp3 = await fs.promises.readFile(path.join(dir_row, `${name}`))
    return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', }, status: 200 })
}