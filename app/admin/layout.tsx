"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import { LogOutIcon, PackageIcon, UsersIcon, ShoppingCartIcon } from "@/lib/icons"

// Fallback to custom icons if lucide-react fails
let LogOut = LogOutIcon
let Package = PackageIcon
let Users = UsersIcon
let ShoppingCart = ShoppingCartIcon

try {
  const icons = LucideIcons
  LogOut = icons.LogOut
  Package = icons.Package
  Users = icons.Users
  ShoppingCart = icons.ShoppingCart
} catch (error) {
  console.warn("Using fallback icons")
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-2xl font-bold text-primary">
                EStore Admin
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/admin" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-gray-600 hover:text-primary">
                  Products
                </Link>
                <Link href="/admin/categories" className="text-gray-600 hover:text-primary">
                  Categories
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-primary">
                  Users
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/">View Store</Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Sidebar - Mobile */}
      <div className="md:hidden bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 whitespace-nowrap"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

// Client component for logout functionality
function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/auth/login?admin=true"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}
