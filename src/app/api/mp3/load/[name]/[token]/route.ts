import load_mp3 from "@/app/_lib/mp3/load_mp3";
import auth from "@/app/_lib/auth"
import Crp from "crypto-js"

export async function GET(req: Request, { params }: { params: any }) {
    const name = params.name
    const token = params.token
    const email = Crp.AES.decrypt(token, "makuro").toString(Crp.enc.Utf8)

    const mp3 = await load_mp3({ name, email })
    return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', }, status: 200 })
}
