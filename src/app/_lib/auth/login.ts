import prisma from "@/util/prisma"
import { AES } from "crypto-js"
import { cookies } from "next/headers"
const login = async ({ body }: { body: any }) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user || user.password !== body.password) return {
            success: false,
            message: 'wrong email or password'
        }

        const token = AES.encrypt(body.email, 'makuro').toString()

        await prisma.logAuth.create({
            data: {
                token: token,
                userId: user.id,
                // expires selama 1 minggu
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            }
        })

        cookies().set("token", token)

        return {
            success: true,
            token: token,
            message: 'login success'
        }
    } catch (error) {
        return {
            success: false,
            message: 'wrong email or password'
        }
    }
}

export default login