import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import { getProductById, getProductImages } from "@/lib/db"
import { notFound } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { ShoppingCartIcon, HeartIcon, Share2Icon } from "@/lib/icons"

// Fallback to custom icons if lucide-react fails
let ShoppingCart = ShoppingCartIcon
let Heart = HeartIcon
let Share2 = Share2Icon

try {
  const icons = LucideIcons
  ShoppingCart = icons.ShoppingCart
  Heart = icons.Heart
  Share2 = icons.Share2
} catch (error) {
  console.warn("Using fallback icons")
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  const images = await getProductImages(Number.parseInt(params.id))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category_slug}`} className="hover:text-primary">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              <Image
                src={images[0]?.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(1, 5).map((image, index) => (
                  <div key={image.id} className="aspect-square relative overflow-hidden rounded-lg bg-white">
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.category_name}</Badge>
                <Badge variant="outline">{product.source}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <span className="text-sm text-gray-500">{product.stock_quantity} units available</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Product Type:</span>
                  <p className="text-gray-600 capitalize">{product.product_type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Source:</span>
                  <p className="text-gray-600 capitalize">{product.source}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1" disabled={product.stock_quantity === 0}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{product.product_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium capitalize">{product.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{product.stock_quantity} units</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
