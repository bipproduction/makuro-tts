
import { cookies } from 'next/headers'
export async function POST(req: Request) {
    const cookie = cookies();
    cookie.delete('token')
    cookie.set('token', "")
    return new Response(JSON.stringify({ message: 'success' }), { status: 200 })
}