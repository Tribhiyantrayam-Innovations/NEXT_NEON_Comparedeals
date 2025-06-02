import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as LucideIcons from "lucide-react"
import { PackageIcon, UsersIcon, ShoppingCartIcon, PlusIcon } from "@/lib/icons"
import { getDashboardStats, testConnection } from "@/lib/db"

// Fallback to custom icons if lucide-react fails
let Package = PackageIcon
let Users = UsersIcon
let ShoppingCart = ShoppingCartIcon
let Plus = PlusIcon

try {
  const icons = LucideIcons
  Package = icons.Package
  Users = icons.Users
  ShoppingCart = icons.ShoppingCart
  Plus = icons.Plus
} catch (error) {
  console.warn("Using fallback icons")
}

export default async function AdminDashboard() {
  // Test database connection
  const connectionTest = await testConnection()
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your ecommerce store</p>
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
                <p>Some features may not work properly. Showing cached data.</p>
                <p className="text-sm">Error: {connectionTest.error}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">Active products in store</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
              <p className="text-xs text-muted-foreground">Product categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Manage Products
              </CardTitle>
              <CardDescription>Add, edit, or remove products from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/products">View All Products</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/products/upload">Upload New Product</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Categories
              </CardTitle>
              <CardDescription>Organize your products into categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/categories">View Categories</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/categories/new">Add Category</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Store Management
              </CardTitle>
              <CardDescription>View store performance and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/">View Store</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/api/init-db">Check Database</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Database Connection:</span>
                <span className={`ml-2 ${connectionTest.connected ? "text-green-600" : "text-red-600"}`}>
                  {connectionTest.connected ? "✅ Connected" : "❌ Disconnected"}
                </span>
              </div>
              <div>
                <span className="font-medium">Tables Available:</span>
                <span className="ml-2 text-gray-600">{connectionTest.tables?.length || 0} tables</span>
              </div>
            </div>
            {connectionTest.tables && connectionTest.tables.length > 0 && (
              <div className="mt-4">
                <span className="font-medium text-sm">Available Tables:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {connectionTest.tables.map((table) => (
                    <span key={table} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {table}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
