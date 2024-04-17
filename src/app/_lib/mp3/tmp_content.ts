import prisma from "@/util/prisma"
const tmp_conten = async ({ email }: { email: string }) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        const content = await prisma.tmpContent.findUnique({
            where: {
                userId: user?.id
            }
        })

        return content?.content ?? []
    } catch (error) {
        return []
    }
}

export default tmp_conten