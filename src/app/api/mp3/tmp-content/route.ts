import tmp_conten from "@/app/_lib/mp3/tmp_content"
import auth from "@/app/_lib/auth"

export async function GET(req: Request) {
    return auth(req, async (email) => {
        const content = await tmp_conten({ email: email })
        const con = content || []
        return Response.json(con)
    })
}