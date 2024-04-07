import prisma from "@/util/prisma"

interface BODY_REGISTER {
    username: string
    email: string
    password: string
    confirm_password: string
}

export async function POST(req: Request) {
    const body: BODY_REGISTER = await req.json()

    const avaialbe = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (avaialbe) return new Response(JSON.stringify({ message: 'email already exist' }), {
        status: 400
    })

    await prisma.user.create({
        data: {
            name: body.username,
            email: body.email,
            password: body.password
        }
    })

    return new Response(JSON.stringify({ message: 'Hello, Next.js!' }), {
        status: 200
    })

}