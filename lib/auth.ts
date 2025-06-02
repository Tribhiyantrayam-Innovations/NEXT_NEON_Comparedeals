import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon('postgresql://Ecommerce_owner:npg_xR5H9UGWflPc@ep-cool-hall-a8vrlanl-pooler.eastus2.azure.neon.tech/Ecommerce?sslmode=require')

export interface User {
  id: number
  email: string
  name: string
  role: "user" | "admin"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  // Simple token generation without JWT for now
  return Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }),
  ).toString("base64")
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (decoded.exp && Date.now() > decoded.exp) {
      return null
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || "",
      role: decoded.role,
    }
  } catch {
    return null
  }
}

// Database functions using the sql instance
export async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name: string, role: "user" | "admin" = "user") {
  try {
    const hashedPassword = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (email, password, name, role) 
      VALUES (${email}, ${hashedPassword}, ${name}, ${role}) 
      RETURNING id, email, name, role
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
