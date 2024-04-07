import prisma from "@/util/prisma"
import { AES } from 'crypto-js'

interface BODY_LOGIN {
    email: string
    password: string
}
export async function POST(req: Request) {

    try {
        const body: BODY_LOGIN = await req.json()

        const avaialbe = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!avaialbe || avaialbe.password !== body.password) return new Response(JSON.stringify({ message: 'wrong email or password' }), { status: 400 })

        const token = AES.encrypt(body.email, 'makuro').toString()

        return new Response(JSON.stringify({ message: 'success', token }))
    } catch (error) {
        return new Response(JSON.stringify({ message: 'failed!, wrong email or password' }), { status: 400 })
    }
}