import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Test basic connection
    const connectionTest = await testConnection()

    // Test table existence
    let tablesExist = false
    try {
      const tableCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'categories', 'products', 'product_images')
        ORDER BY table_name
      `
      tablesExist = tableCheck.rows?.length === 4 || tableCheck.length === 4
    } catch (error) {
      console.error("Table check error:", error)
    }

    return NextResponse.json({
      connection: connectionTest ? "✅ Connected" : "❌ Failed",
      tables: tablesExist ? "✅ All tables exist" : "❌ Some tables missing",
      message: connectionTest && tablesExist ? "Database is ready!" : "Database setup needed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      connection: "❌ Failed",
      tables: "❌ Failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
