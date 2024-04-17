import CryptoJS from "crypto-js";

export default async function auth(req: Request, callback: (email: string) => any) {

    try {
        const token = req.headers.get('Authorization')?.split(" ")[1]
        const email = CryptoJS.AES.decrypt(token!, "makuro").toString(CryptoJS.enc.Utf8)
        return callback(email)
    } catch (error) {
        return Response.json({ success: false, message: "not auth" }, { status: 400 })
    }
}