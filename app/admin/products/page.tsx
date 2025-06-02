import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as LucideIcons from "lucide-react"
import { EditIcon, TrashIcon, PlusIcon, EyeIcon } from "@/lib/icons"
import { getProducts, testConnection } from "@/lib/db"

// Fallback to custom icons if lucide-react fails
let Edit = EditIcon
let Trash2 = TrashIcon
let Plus = PlusIcon
let Eye = EyeIcon

try {
  const icons = LucideIcons
  Edit = icons.Edit
  Trash2 = icons.Trash2
  Plus = icons.Plus
  Eye = icons.Eye
} catch (error) {
  console.warn("Using fallback icons")
}

export default async function AdminProductsPage() {
  const connectionTest = await testConnection()
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <Button asChild>
              <Link href="/admin/products/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Database Status Alert */}
        {!connectionTest.connected && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Database Connection Issue</p>
                <p>Showing sample data. Product uploads may not work properly.</p>
                <p className="text-sm">Error: {connectionTest.error}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 relative">
                          <Image
                            src={product.image_url || "/placeholder.svg?height=48&width=48"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category_name}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${product.price}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                          {product.stock_quantity} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
