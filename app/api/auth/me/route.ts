import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get fresh user data from database
    try {
      const result = await sql`
        SELECT id, email, name, role, created_at 
        FROM users 
        WHERE id = ${user.id}
      `
      
      if (result.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Return token data as fallback
      return NextResponse.json(user)
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
