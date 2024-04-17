import login from "@/app/_lib/auth/login"
import prisma from "@/util/prisma"
import { AES } from 'crypto-js'
import { cookies } from "next/headers"

interface BODY_LOGIN {
    email: string
    password: string
}
export async function POST(req: Request) {
    const body: BODY_LOGIN = await req.json()
    const lgn = await login({ body })

    if (!lgn.success) return Response.json(lgn, { status: 400 })

    return Response.json(lgn, { status: 200 })
}