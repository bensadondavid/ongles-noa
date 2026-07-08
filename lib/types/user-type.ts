import { auth } from '@/lib/auth/auth'
export type SessionUser = typeof auth.$Infer.Session.user;