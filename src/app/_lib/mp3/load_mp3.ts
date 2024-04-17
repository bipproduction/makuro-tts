import path from "path"
import fs from 'fs'
const root_path = process.cwd()
const load_mp3 = async ({ name, email }: { name: string, email: string }) => {
    const dir_row = path.join(root_path, "assets", "mp3", `${email}_row`)
    const mp3 = await fs.promises.readFile(path.join(dir_row, `${name}`))
    return mp3
}

export default load_mp3