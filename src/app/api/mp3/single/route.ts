import auth from "@/app/_lib/auth"
import single from "@/app/_lib/mp3/single"

export async function POST(req: Request) {
    return auth(req, async (email) => {
        const body = await req.json()
        const s = await single({ text: body.text, email: email })
        return Response.json(s)
    })
}