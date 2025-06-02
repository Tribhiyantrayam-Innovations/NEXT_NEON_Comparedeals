-- Drop existing tables if they exist (be careful in production)
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication (both admin and regular users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  product_type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Grocery', 'grocery', 'Food and grocery items'),
('Mobile', 'mobile', 'Mobile phones and accessories'),
('Fashion', 'fashion', 'Clothing and fashion accessories'),
('Home & Kitchen', 'home-kitchen', 'Home and kitchen appliances');

-- Insert default admin user (password: admin123)
-- Note: In production, use a stronger password and hash it properly
INSERT INTO users (email, password, name, role) VALUES
('admin@ecommerce.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');

-- Insert some sample products
INSERT INTO products (name, description, price, category_id, product_type, source, stock_quantity) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced camera system and A17 Pro chip', 999.99, 3, 'mobile', 'apple', 50),
('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 899.99, 3, 'mobile', 'samsung', 30),
('MacBook Air M3', 'Lightweight laptop with M3 chip and all-day battery life', 1299.99, 1, 'electronics', 'apple', 25),
('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 399.99, 1, 'electronics', 'sony', 40),
('Nike Air Max 270', 'Comfortable running shoes with Air Max technology', 149.99, 4, 'fashion', 'nike', 60),
('Instant Pot Duo 7-in-1', 'Multi-functional electric pressure cooker', 89.99, 5, 'home', 'amazon', 35);

-- Insert sample product images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, '/placeholder.svg?height=300&width=300', true),
(2, '/placeholder.svg?height=300&width=300', true),
(3, '/placeholder.svg?height=300&width=300', true),
(4, '/placeholder.svg?height=300&width=300', true),
(5, '/placeholder.svg?height=300&width=300', true),
(6, '/placeholder.svg?height=300&width=300', true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_categories_slug ON categories(slug);
