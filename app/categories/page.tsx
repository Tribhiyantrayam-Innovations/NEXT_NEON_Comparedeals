import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { getCategoriesWithProductCount } from "@/lib/db"

export default async function CategoriesPage() {
  const categories = await getCategoriesWithProductCount()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of products organized by categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">
                        {category.slug === "electronics" && "📱"}
                        {category.slug === "grocery" && "🛒"}
                        {category.slug === "mobile" && "📞"}
                        {category.slug === "fashion" && "👕"}
                        {category.slug === "home-kitchen" && "🏠"}
                        {!["electronics", "grocery", "mobile", "fashion", "home-kitchen"].includes(category.slug) &&
                          "📦"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.product_count} products</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {category.description || "Discover amazing products in this category"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
