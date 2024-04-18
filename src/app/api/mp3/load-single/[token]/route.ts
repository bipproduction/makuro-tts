import auth from "@/app/_lib/auth";
import path from "path";
import fs from "fs"
import Crp from 'crypto-js'
const root_path = process.cwd()


export async function GET(req: Request, { params }: { params: { token: string } }) {
    const token = params.token
    const email = Crp.AES.decrypt(token, "makuro").toString(Crp.enc.Utf8)

    const file = await fs.promises.readFile(path.join(root_path, "assets", "mp3", `${email}_single`, "audio" + ".mp3"))
    return new Response(file, { headers: { 'Content-Type': 'audio/mpeg', }, status: 200 })
}