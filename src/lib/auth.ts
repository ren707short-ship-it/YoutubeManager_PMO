import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Context } from 'hono'
import type { Bindings, Variables, User } from '../types'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'session_user_id'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getUserById(db: D1Database, userId: number): Promise<User | null> {
  const result = await db.prepare(
    'SELECT id, name, email, role FROM users WHERE id = ?'
  ).bind(userId).first<User>()
  
  return result || null
}

export async function getUserByEmail(db: D1Database, email: string): Promise<any | null> {
  const result = await db.prepare(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = ?'
  ).bind(email).first()
  
  return result || null
}

export function setSessionCookie(c: Context<{ Bindings: Bindings }>, userId: number) {
  setCookie(c, SESSION_COOKIE_NAME, String(userId), {
    path: '/',
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: SESSION_MAX_AGE,
    sameSite: 'Lax',
  })
}

export function deleteSessionCookie(c: Context<{ Bindings: Bindings }>) {
  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: '/',
  })
}

export async function getSessionUser(c: Context<{ Bindings: Bindings, Variables: Variables }>): Promise<User | null> {
  const sessionUserId = getCookie(c, SESSION_COOKIE_NAME)
  
  if (!sessionUserId) {
    return null
  }
  
  const userId = parseInt(sessionUserId, 10)
  if (isNaN(userId)) {
    return null
  }
  
  return getUserById(c.env.DB, userId)
}
