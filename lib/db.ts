import { neon } from "@neondatabase/serverless"

// Create a serverless connection to your Neon database
const sql = neon(process.env.DATABASE_URL!)

// Test database connection and check tables
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0])

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'products', 'product_images')
      ORDER BY table_name
    `

    console.log(
      "Existing tables:",
      tables.map((t) => t.table_name),
    )
    return { connected: true, tables: tables.map((t) => t.table_name) }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { connected: false, tables: [], error: error.message }
  }
}

// Helper functions for common queries with error handling
export async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name: string, role = "user") {
  try {
    const result = await sql`
      INSERT INTO users (email, password, name, role) 
      VALUES (${email}, ${password}, ${name}, ${role}) 
      RETURNING id, email, name, role
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getCategories() {
  try {
    const result = await sql`SELECT * FROM categories ORDER BY name`
    return result
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return fallback data if database is unavailable
    return [
      { id: 1, name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      { id: 2, name: "Grocery", slug: "grocery", description: "Food and grocery items" },
      { id: 3, name: "Mobile", slug: "mobile", description: "Mobile phones and accessories" },
      { id: 4, name: "Fashion", slug: "fashion", description: "Clothing and fashion accessories" },
      { id: 5, name: "Home & Kitchen", slug: "home-kitchen", description: "Home and kitchen appliances" },
    ]
  }
}

export async function getProducts() {
  try {
    const result = await sql`
      SELECT p.*, c.name as category_name, pi.image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return fallback data if database is unavailable
    return [
      {
        id: 1,
        name: "Sample Product",
        description: "This is a sample product",
        price: 99.99,
        category_name: "Electronics",
        image_url: "/placeholder.svg?height=300&width=300",
        source: "sample",
        stock_quantity: 10,
        is_active: true,
      },
    ]
  }
}

export async function getProductById(id: number) {
  try {
    const result = await sql`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id} AND p.is_active = true
    `
    return result[0] || null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getProductImages(productId: number) {
  try {
    const result = await sql`
      SELECT * FROM product_images 
      WHERE product_id = ${productId} 
      ORDER BY is_primary DESC, id
    `
    return result
  } catch (error) {
    console.error("Error fetching product images:", error)
    return [
      {
        id: 1,
        product_id: productId,
        image_url: "/placeholder.svg?height=600&width=600",
        alt_text: "Product image",
        is_primary: true,
      },
    ]
  }
}

export async function getProductsByCategory(categoryId: number) {
  try {
    const result = await sql`
      SELECT p.*, pi.image_url
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.category_id = ${categoryId} AND p.is_active = true
      ORDER BY p.created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const result = await sql`SELECT * FROM categories WHERE slug = ${slug}`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching category:", error)
    // Return fallback category data
    const fallbackCategories = {
      electronics: { id: 1, name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      grocery: { id: 2, name: "Grocery", slug: "grocery", description: "Food and grocery items" },
      mobile: { id: 3, name: "Mobile", slug: "mobile", description: "Mobile phones and accessories" },
      fashion: { id: 4, name: "Fashion", slug: "fashion", description: "Clothing and fashion accessories" },
      "home-kitchen": {
        id: 5,
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen appliances",
      },
    }
    return fallbackCategories[slug] || null
  }
}

export async function createProduct(productData: {
  name: string
  description: string
  price: number
  categoryId: number
  productType: string
  source: string
  productUrl?: string
  stockQuantity: number
}) {
  try {
    const result = await sql`
      INSERT INTO products (name, description, price, category_id, product_type, source, product_url, stock_quantity)
      VALUES (${productData.name}, ${productData.description}, ${productData.price}, 
              ${productData.categoryId}, ${productData.productType}, ${productData.source}, 
              ${productData.productUrl || null}, ${productData.stockQuantity})
      RETURNING id
    `
    return result[0]
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function createProductImage(productId: number, imageUrl: string, isPrimary = false, altText = "") {
  try {
    const result = await sql`
      INSERT INTO product_images (product_id, image_url, is_primary, alt_text)
      VALUES (${productId}, ${imageUrl}, ${isPrimary}, ${altText})
      RETURNING id
    `
    return result[0]
  } catch (error) {
    console.error("Error creating product image:", error)
    throw error
  }
}

export async function getDashboardStats() {
  try {
    const [productsResult, usersResult, categoriesResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`,
      sql`SELECT COUNT(*) as count FROM categories`,
    ])

    return {
      products: Number.parseInt(productsResult[0].count) || 0,
      users: Number.parseInt(usersResult[0].count) || 0,
      categories: Number.parseInt(categoriesResult[0].count) || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return fallback stats if database is unavailable
    return {
      products: 6, // Sample data count
      users: 0,
      categories: 5,
    }
  }
}

export async function getCategoriesWithProductCount() {
  try {
    const result = await sql`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.created_at
      ORDER BY c.name
    `
    return result
  } catch (error) {
    console.error("Error fetching categories with product count:", error)
    // Return fallback data if database is unavailable
    return [
      {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        product_count: 2,
      },
      { id: 2, name: "Grocery", slug: "grocery", description: "Food and grocery items", product_count: 0 },
      { id: 3, name: "Mobile", slug: "mobile", description: "Mobile phones and accessories", product_count: 2 },
      { id: 4, name: "Fashion", slug: "fashion", description: "Clothing and fashion accessories", product_count: 1 },
      {
        id: 5,
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen appliances",
        product_count: 1,
      },
    ]
  }
}
