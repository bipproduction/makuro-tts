import auth from "@/app/_lib/auth"
import generate from "@/app/_lib/mp3/generate_mp3"
import prisma from "@/util/prisma"

export const POST = async (req: Request) => await auth(req as any, async (email) => {
    const body = await req.json()

    // WritableStream
    const list_content = await generate({ text: body.text, email: email })
    
    // return stream
    return Response.json(list_content)

})
