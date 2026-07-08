import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const verifSession = async ()=>{

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect('/login')
    }
    return session
}
