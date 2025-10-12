-- Seed the database with test data --

-- Insert Categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'Electronic devices and accessories', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Clothing', 'Fashion and apparel for everyone', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Home & Garden', 'Everything for your home and garden', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Sports & Outdoors', 'Gear for outdoor activities and sports', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Books', 'Physical and digital books', NOW(), NOW());

-- Insert Products
INSERT INTO products (id, available_for_sale, title, description, description_html, tags, category_id, created_at, updated_at) VALUES
-- Electronics
('a1111111-1111-1111-1111-111111111111', true, 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', '<p>Premium noise-cancelling wireless headphones with <strong>30-hour battery life</strong>. Perfect for travel and daily commutes.</p>', '["audio", "wireless", "bluetooth", "headphones"]', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', true, 'Smart Watch Pro', 'Advanced fitness tracking smartwatch with heart rate monitor', '<p>Advanced fitness tracking smartwatch with <strong>heart rate monitor</strong>, GPS, and waterproof design.</p>', '["smartwatch", "fitness", "wearable", "tech"]', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', true, 'Portable Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound', '<p>Waterproof portable speaker with <strong>360-degree sound</strong> and 20-hour playtime.</p>', '["audio", "speaker", "bluetooth", "portable"]', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
-- Clothing
('b1111111-1111-1111-1111-111111111111', true, 'Classic Cotton T-Shirt', 'Comfortable cotton t-shirt available in multiple colors', '<p>Comfortable <strong>100% cotton</strong> t-shirt available in multiple colors. Perfect for everyday wear.</p>', '["clothing", "tshirt", "cotton", "casual"]', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', true, 'Denim Jacket', 'Classic denim jacket with modern fit', '<p>Classic denim jacket with <strong>modern fit</strong>. A timeless wardrobe essential.</p>', '["clothing", "jacket", "denim", "outerwear"]', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', true, 'Running Shoes', 'Lightweight running shoes with cushioned sole', '<p>Lightweight running shoes with <strong>cushioned sole</strong> and breathable mesh upper.</p>', '["shoes", "running", "athletic", "footwear"]', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
-- Home & Garden
('c1111111-1111-1111-1111-111111111111', true, 'Ceramic Coffee Mug Set', 'Set of 4 handcrafted ceramic coffee mugs', '<p>Set of 4 <strong>handcrafted ceramic</strong> coffee mugs. Microwave and dishwasher safe.</p>', '["home", "kitchen", "mug", "ceramic"]', '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
('c2222222-2222-2222-2222-222222222222', true, 'Indoor Plant Collection', 'Collection of 3 easy-care indoor plants', '<p>Collection of 3 <strong>easy-care</strong> indoor plants including pothos, snake plant, and spider plant.</p>', '["garden", "plants", "indoor", "decor"]', '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
-- Sports & Outdoors
('d1111111-1111-1111-1111-111111111111', true, 'Yoga Mat Premium', 'Extra thick yoga mat with carrying strap', '<p>Extra thick <strong>6mm yoga mat</strong> with non-slip surface and carrying strap.</p>', '["yoga", "fitness", "mat", "exercise"]', '44444444-4444-4444-4444-444444444444', NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', true, 'Camping Tent 4-Person', 'Waterproof camping tent for 4 people', '<p>Waterproof <strong>4-person camping tent</strong> with easy setup and ventilation windows.</p>', '["camping", "tent", "outdoor", "hiking"]', '44444444-4444-4444-4444-444444444444', NOW(), NOW()),
-- Books
('e1111111-1111-1111-1111-111111111111', true, 'The Art of Programming', 'Comprehensive guide to modern programming', '<p>Comprehensive guide to <strong>modern programming</strong> practices and design patterns.</p>', '["books", "programming", "education", "tech"]', '55555555-5555-5555-5555-555555555555', NOW(), NOW());

-- Insert Product Images
-- Wireless Headphones
INSERT INTO product_images (product_id, url, alt_text, "order", width, height, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=1', 'Wireless Bluetooth Headphones - Front View', 0, 800, 800, NOW(), NOW()),
('a1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=2', 'Wireless Bluetooth Headphones - Side View', 1, 800, 800, NOW(), NOW()),
('a1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=3', 'Wireless Bluetooth Headphones - Detail', 2, 800, 800, NOW(), NOW()),
-- Smart Watch
('a2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=4', 'Smart Watch Pro - Front View', 0, 800, 800, NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=5', 'Smart Watch Pro - Display', 1, 800, 800, NOW(), NOW()),
-- Bluetooth Speaker
('a3333333-3333-3333-3333-333333333333', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=6', 'Portable Bluetooth Speaker', 0, 800, 800, NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=7', 'Portable Bluetooth Speaker - In Use', 1, 800, 800, NOW(), NOW()),
-- T-Shirt
('b1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=8', 'Classic Cotton T-Shirt - White', 0, 800, 800, NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=9', 'Classic Cotton T-Shirt - Black', 1, 800, 800, NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=10', 'Classic Cotton T-Shirt - Blue', 2, 800, 800, NOW(), NOW()),
-- Denim Jacket
('b2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=11', 'Denim Jacket - Front', 0, 800, 800, NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=12', 'Denim Jacket - Back', 1, 800, 800, NOW(), NOW()),
-- Running Shoes
('b3333333-3333-3333-3333-333333333333', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=13', 'Running Shoes - Side View', 0, 800, 800, NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=14', 'Running Shoes - Top View', 1, 800, 800, NOW(), NOW()),
-- Coffee Mug Set
('c1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=15', 'Ceramic Coffee Mug Set', 0, 800, 800, NOW(), NOW()),
('c1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=16', 'Ceramic Coffee Mug - Detail', 1, 800, 800, NOW(), NOW()),
-- Indoor Plants
('c2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=17', 'Indoor Plant Collection', 0, 800, 800, NOW(), NOW()),
-- Yoga Mat
('d1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=18', 'Yoga Mat Premium - Rolled', 0, 800, 800, NOW(), NOW()),
('d1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=19', 'Yoga Mat Premium - Unrolled', 1, 800, 800, NOW(), NOW()),
-- Camping Tent
('d2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=20', 'Camping Tent 4-Person - Exterior', 0, 800, 800, NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=21', 'Camping Tent 4-Person - Interior', 1, 800, 800, NOW(), NOW()),
-- Programming Book
('e1111111-1111-1111-1111-111111111111', 'https://th.bing.com/th/id/R.c6c532661c1cbb974dc59aa93df0a217?rik=FVufv3OGdmyDZw&pid=ImgRaw&r=22', 'The Art of Programming - Cover', 0, 800, 800, NOW(), NOW());

-- Insert Product Options
-- Headphones (Color)
INSERT INTO product_options (product_id, name, position, values, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'Color', 0, '["Black", "Silver", "Rose Gold"]', NOW(), NOW()),
-- Smart Watch (Color & Size)
('a2222222-2222-2222-2222-222222222222', 'Color', 0, '["Black", "Silver", "Gold"]', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Size', 1, '["40mm", "44mm"]', NOW(), NOW()),
-- Bluetooth Speaker (Color)
('a3333333-3333-3333-3333-333333333333', 'Color', 0, '["Blue", "Red", "Black"]', NOW(), NOW()),
-- T-Shirt (Size & Color)
('b1111111-1111-1111-1111-111111111111', 'Size', 0, '["XS", "S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'Color', 1, '["White", "Black", "Blue", "Gray", "Red"]', NOW(), NOW()),
-- Denim Jacket (Size)
('b2222222-2222-2222-2222-222222222222', 'Size', 0, '["S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
-- Running Shoes (Size & Color)
('b3333333-3333-3333-3333-333333333333', 'Size', 0, '["7", "8", "9", "10", "11", "12"]', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', 'Color', 1, '["White", "Black", "Blue"]', NOW(), NOW()),
-- Coffee Mug (Color)
('c1111111-1111-1111-1111-111111111111', 'Color', 0, '["White", "Black", "Blue", "Green"]', NOW(), NOW()),
-- Yoga Mat (Color)
('d1111111-1111-1111-1111-111111111111', 'Color', 0, '["Purple", "Blue", "Pink", "Black"]', NOW(), NOW()),
-- Camping Tent (Color)
('d2222222-2222-2222-2222-222222222222', 'Color', 0, '["Green", "Orange", "Gray"]', NOW(), NOW());

-- Insert Product Variants
-- Headphones variants (3 colors)
INSERT INTO product_variants (product_id, title, available_for_sale, selected_options, price, currency_code, inventory_quantity, weight, weight_unit, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'Black', true, '[{"name": "Color", "value": "Black"}]', 12999, 'USD', 50, 0.25, 'kg', NOW(), NOW()),
('a1111111-1111-1111-1111-111111111111', 'Silver', true, '[{"name": "Color", "value": "Silver"}]', 12999, 'USD', 30, 0.25, 'kg', NOW(), NOW()),
('a1111111-1111-1111-1111-111111111111', 'Rose Gold', true, '[{"name": "Color", "value": "Rose Gold"}]', 13999, 'USD', 20, 0.25, 'kg', NOW(), NOW()),
-- Smart Watch variants (3 colors x 2 sizes = 6)
('a2222222-2222-2222-2222-222222222222', 'Black / 40mm', true, '[{"name": "Color", "value": "Black"}, {"name": "Size", "value": "40mm"}]', 29999, 'USD', 40, 0.05, 'kg', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Black / 44mm', true, '[{"name": "Color", "value": "Black"}, {"name": "Size", "value": "44mm"}]', 32999, 'USD', 35, 0.06, 'kg', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Silver / 40mm', true, '[{"name": "Color", "value": "Silver"}, {"name": "Size", "value": "40mm"}]', 29999, 'USD', 30, 0.05, 'kg', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Silver / 44mm', true, '[{"name": "Color", "value": "Silver"}, {"name": "Size", "value": "44mm"}]', 32999, 'USD', 25, 0.06, 'kg', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Gold / 40mm', true, '[{"name": "Color", "value": "Gold"}, {"name": "Size", "value": "40mm"}]', 34999, 'USD', 15, 0.05, 'kg', NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Gold / 44mm', true, '[{"name": "Color", "value": "Gold"}, {"name": "Size", "value": "44mm"}]', 37999, 'USD', 10, 0.06, 'kg', NOW(), NOW()),
-- Bluetooth Speaker variants (3 colors)
('a3333333-3333-3333-3333-333333333333', 'Blue', true, '[{"name": "Color", "value": "Blue"}]', 7999, 'USD', 100, 0.5, 'kg', NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', 'Red', true, '[{"name": "Color", "value": "Red"}]', 7999, 'USD', 80, 0.5, 'kg', NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', 'Black', true, '[{"name": "Color", "value": "Black"}]', 7999, 'USD', 120, 0.5, 'kg', NOW(), NOW()),
-- T-Shirt variants (6 sizes x 5 colors = 30, showing subset)
('b1111111-1111-1111-1111-111111111111', 'S / White', true, '[{"name": "Size", "value": "S"}, {"name": "Color", "value": "White"}]', 1999, 'USD', 100, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'M / White', true, '[{"name": "Size", "value": "M"}, {"name": "Color", "value": "White"}]', 1999, 'USD', 150, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'L / White', true, '[{"name": "Size", "value": "L"}, {"name": "Color", "value": "White"}]', 1999, 'USD', 120, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'S / Black', true, '[{"name": "Size", "value": "S"}, {"name": "Color", "value": "Black"}]', 1999, 'USD', 80, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'M / Black', true, '[{"name": "Size", "value": "M"}, {"name": "Color", "value": "Black"}]', 1999, 'USD', 140, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'L / Black', true, '[{"name": "Size", "value": "L"}, {"name": "Color", "value": "Black"}]', 1999, 'USD', 110, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'M / Blue', true, '[{"name": "Size", "value": "M"}, {"name": "Color", "value": "Blue"}]', 1999, 'USD', 90, 0.15, 'kg', NOW(), NOW()),
('b1111111-1111-1111-1111-111111111111', 'L / Blue', true, '[{"name": "Size", "value": "L"}, {"name": "Color", "value": "Blue"}]', 1999, 'USD', 70, 0.15, 'kg', NOW(), NOW()),
-- Denim Jacket variants (5 sizes)
('b2222222-2222-2222-2222-222222222222', 'S', true, '[{"name": "Size", "value": "S"}]', 7999, 'USD', 30, 0.8, 'kg', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'M', true, '[{"name": "Size", "value": "M"}]', 7999, 'USD', 45, 0.8, 'kg', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'L', true, '[{"name": "Size", "value": "L"}]', 7999, 'USD', 40, 0.8, 'kg', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'XL', true, '[{"name": "Size", "value": "XL"}]', 7999, 'USD', 25, 0.8, 'kg', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 7999, 'USD', 15, 0.8, 'kg', NOW(), NOW()),
-- Running Shoes variants (6 sizes x 3 colors, showing subset)
('b3333333-3333-3333-3333-333333333333', '9 / White', true, '[{"name": "Size", "value": "9"}, {"name": "Color", "value": "White"}]', 8999, 'USD', 50, 0.4, 'kg', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', '10 / White', true, '[{"name": "Size", "value": "10"}, {"name": "Color", "value": "White"}]', 8999, 'USD', 60, 0.4, 'kg', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', '11 / White', true, '[{"name": "Size", "value": "11"}, {"name": "Color", "value": "White"}]', 8999, 'USD', 40, 0.4, 'kg', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', '9 / Black', true, '[{"name": "Size", "value": "9"}, {"name": "Color", "value": "Black"}]', 8999, 'USD', 45, 0.4, 'kg', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', '10 / Black', true, '[{"name": "Size", "value": "10"}, {"name": "Color", "value": "Black"}]', 8999, 'USD', 55, 0.4, 'kg', NOW(), NOW()),
-- Coffee Mug Set variants (4 colors)
('c1111111-1111-1111-1111-111111111111', 'White', true, '[{"name": "Color", "value": "White"}]', 3999, 'USD', 60, 1.2, 'kg', NOW(), NOW()),
('c1111111-1111-1111-1111-111111111111', 'Black', true, '[{"name": "Color", "value": "Black"}]', 3999, 'USD', 50, 1.2, 'kg', NOW(), NOW()),
('c1111111-1111-1111-1111-111111111111', 'Blue', true, '[{"name": "Color", "value": "Blue"}]', 3999, 'USD', 40, 1.2, 'kg', NOW(), NOW()),
('c1111111-1111-1111-1111-111111111111', 'Green', true, '[{"name": "Color", "value": "Green"}]', 3999, 'USD', 35, 1.2, 'kg', NOW(), NOW()),
-- Indoor Plant Collection (single variant)
('c2222222-2222-2222-2222-222222222222', 'Default', true, '[]', 4999, 'USD', 25, 2.5, 'kg', NOW(), NOW()),
-- Yoga Mat variants (4 colors)
('d1111111-1111-1111-1111-111111111111', 'Purple', true, '[{"name": "Color", "value": "Purple"}]', 2999, 'USD', 70, 1.0, 'kg', NOW(), NOW()),
('d1111111-1111-1111-1111-111111111111', 'Blue', true, '[{"name": "Color", "value": "Blue"}]', 2999, 'USD', 80, 1.0, 'kg', NOW(), NOW()),
('d1111111-1111-1111-1111-111111111111', 'Pink', true, '[{"name": "Color", "value": "Pink"}]', 2999, 'USD', 60, 1.0, 'kg', NOW(), NOW()),
('d1111111-1111-1111-1111-111111111111', 'Black', true, '[{"name": "Color", "value": "Black"}]', 2999, 'USD', 90, 1.0, 'kg', NOW(), NOW()),
-- Camping Tent variants (3 colors)
('d2222222-2222-2222-2222-222222222222', 'Green', true, '[{"name": "Color", "value": "Green"}]', 19999, 'USD', 20, 5.0, 'kg', NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'Orange', true, '[{"name": "Color", "value": "Orange"}]', 19999, 'USD', 15, 5.0, 'kg', NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'Gray', true, '[{"name": "Color", "value": "Gray"}]', 19999, 'USD', 18, 5.0, 'kg', NOW(), NOW()),
-- Programming Book (single variant)
('e1111111-1111-1111-1111-111111111111', 'Default', true, '[]', 4999, 'USD', 100, 0.6, 'kg', NOW(), NOW());