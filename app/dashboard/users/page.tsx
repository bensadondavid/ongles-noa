import { prisma } from "@/lib/data/prisma"

export default async function Users(){

    const users = await prisma.user.findMany({
        where: {
            role: "CLIENT"
        }
    })
    if(!users)
        return <p className="pt-10">Aucun utilisateur trouvé.</p>
    else{
        return(
            <ol className="pt-15 flex flex-col gap-3 justify-center items-center">
                {users.map((user)=>(
                    <li key={user.id} className="h-fit w-4/5 bg-border/40 text-white text-md p-3 rounded-2xl">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.phone || ""}</p>
                        <p>{user.emailVerified ? "Email Vérifié" : "Email non vérifié"}</p>                   
                    </li>
                ))}
            </ol>
        )
    }
}