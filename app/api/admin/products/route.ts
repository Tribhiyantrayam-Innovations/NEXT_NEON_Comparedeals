import { type NextRequest, NextResponse } from "next/server"
import { createProduct, createProductImage, getProducts } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Get product data from request
    const { name, description, price, categoryId, productType, source, productUrl, stockQuantity, images } =
      await request.json()

    // Validate required fields
    if (!name || !price || !categoryId || !productType || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 })
    }

    // Validate stock quantity
    const stock = stockQuantity || 0
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: "Stock quantity must be a non-negative number" }, { status: 400 })
    }

    // Create product
    const product = await createProduct({
      name,
      description: description || "",
      price,
      categoryId,
      productType,
      source,
      productUrl,
      stockQuantity: stock,
    })

    const productId = product.id

    // Insert product images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i]
        if (imageUrl && imageUrl.trim()) {
          await createProductImage(productId, imageUrl.trim(), i === 0, name)
        }
      }
    }

    return NextResponse.json({
      message: "Product created successfully",
      productId: productId,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
