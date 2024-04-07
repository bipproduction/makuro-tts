import prisma from "@/util/prisma"
export async function POST(req: Request) {
    try {
        const { session } = await req.json()
        await prisma.sessionId.upsert({
            where: {
                id: 1
            },
            create: {
                value: session
            },
            update: {
                value: session
            }
        })

        return new Response(JSON.stringify({ message: 'suscess' }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ message: 'failed' }), { status: 400 })
    }

}