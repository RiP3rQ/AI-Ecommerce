-- Truncate database and seed with proper RAG-ready product data

-- Truncate tables in dependency order (reverse of creation)
TRUNCATE TABLE ai_data CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE carts CASCADE;
TRUNCATE TABLE review_summary_feedback CASCADE;
TRUNCATE TABLE review_summaries CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE product_images CASCADE;
TRUNCATE TABLE product_options CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Insert Categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hoodies', 'Comfortable, stylish, and versatile hooded sweatshirts designed for everyday wear, layering, and casual fashion. Includes a range of colors and fits suitable for any season.', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pants', 'Durable and comfortable trousers designed for style, mobility, and versatility. From chinos and joggers to performance pants, these pieces complement any hoodie or top.', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Shoes', 'Footwear collection ranging from performance sneakers to premium lifestyle shoes. Each pair is crafted to balance comfort, design, and color coordination with hoodie and pants sets.', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Accessories', 'Curated range of complementary accessories — caps, belts, watches, and backpacks — designed to complete any outfit combination with matching tones and functions.', NOW(), NOW());
--> statement-breakpoint

-- Insert Products
INSERT INTO products (id, available_for_sale, title, description, description_html, tags, category_id, created_at, updated_at) VALUES
-- Hoodies
('11111111-1111-1111-1111-111111111111', true, 'Classic Red Pullover Hoodie', 'The Classic Red Pullover Hoodie is a timeless, unisex garment designed for everyday comfort and versatility. Crafted from a premium cotton-polyester blend, it features a soft brushed fleece interior that provides warmth without bulk. The exterior surface has a smooth, durable finish that resists pilling and maintains color vibrancy over time.\n\nThe hoodie includes a spacious, double-layer hood with adjustable drawstrings, ribbed cuffs and hem for a snug fit, and a large kangaroo pocket at the front for convenience and style. The bright red color offers a bold, confident aesthetic suitable for casual wear, athletic layering, or cozy indoor lounging.\n\nEngineered for comfort, breathability, and long-lasting wear, this hoodie maintains its shape after repeated washes and pairs easily with jeans, joggers, or shorts. Its minimalist design makes it an ideal blank canvas for branding, embroidery, or screen printing—perfect for teams, startups, or merchandise lines.\n\nKey details:\n- Material: 80% Cotton / 20% Polyester fleece\n- Fit: Regular unisex fit\n- Color: Deep vibrant red\n- Features: Adjustable drawstring hood, front kangaroo pocket, ribbed cuffs & hem\n- Care: Machine wash cold, tumble dry low\n- Ideal use: Casual wear, activewear, loungewear, team uniforms, promotional apparel\n\nThis hoodie represents a balance of simplicity, durability, and comfort—an essential wardrobe staple suitable for all seasons.', '<h2>Classic Red Pullover Hoodie</h2><p>The <strong>Classic Red Pullover Hoodie</strong> combines style, warmth, and everyday comfort. Made from a soft cotton-poly blend with a fleece interior, it provides lightweight insulation and durability for long-term wear.</p><ul><li><strong>Material:</strong> 80% Cotton / 20% Polyester fleece</li><li><strong>Fit:</strong> Regular unisex fit</li><li><strong>Color:</strong> Deep vibrant red</li><li><strong>Features:</strong> Adjustable drawstring hood, kangaroo pocket, ribbed cuffs & hem</li><li><strong>Care:</strong> Machine wash cold, tumble dry low</li><li><strong>Use cases:</strong> Everyday casual wear, layering, gym sessions, lounging, or team apparel</li></ul><p>Minimalist yet striking, this hoodie is designed to retain its shape and color after multiple washes. Perfect for personal wear or custom branding.</p>', '["hoodie", "red hoodie", "pullover sweatshirt", "cotton blend hoodie", "unisex hoodie", "fleece hoodie", "casual wear", "streetwear", "loungewear", "sportswear", "apparel", "comfortable hoodie", "classic hoodie", "minimalist clothing", "everyday fashion", "merchandise"]', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', true, 'Forest Green Pullover Hoodie', 'The Forest Green Pullover Hoodie offers a nature-inspired tone that blends modern comfort with an organic aesthetic. Designed from a midweight cotton-poly blend, it features a soft interior fleece for warmth and a smooth exterior for durability. The rich forest green shade reflects calm confidence and pairs well with earth tones like beige, brown, or cream.\n\nA double-lined hood with adjustable drawstrings, ribbed trims, and a spacious kangaroo pocket make it as functional as it is stylish. Ideal for outdoor adventures, relaxed office environments, or cozy weekends, this hoodie balances versatility with grounded style.\n\nKey details:\n- Material: 80% Cotton / 20% Polyester fleece\n- Fit: Regular unisex fit\n- Color: Forest green\n- Features: Drawstring hood, ribbed cuffs and hem, kangaroo pocket\n- Care: Machine wash cold, gentle cycle\n- Ideal use: Outdoor wear, loungewear, eco-inspired fashion\n\nA versatile and timeless piece, perfect for those who appreciate subtle, natural tones in their wardrobe.', '<h2>Forest Green Pullover Hoodie</h2><p>The <strong>Forest Green Pullover Hoodie</strong> merges nature-inspired tones with everyday comfort.</p><ul><li><strong>Material:</strong> 80% Cotton / 20% Polyester fleece</li><li><strong>Color:</strong> Forest green</li><li><strong>Fit:</strong> Unisex regular fit</li><li><strong>Features:</strong> Drawstring hood, kangaroo pocket, ribbed cuffs</li><li><strong>Use cases:</strong> Outdoor activities, daily casual wear</li></ul><p>Subtle, grounded, and timeless—ideal for versatile natural outfits.</p>', '["hoodie", "green hoodie", "forest green hoodie", "nature inspired", "cotton hoodie", "casual wear", "eco fashion", "unisex hoodie", "streetwear", "comfortable hoodie"]', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', true, 'Ocean Blue Hoodie', 'The Ocean Blue Hoodie embodies calm and confidence through its cool, rich hue reminiscent of deep coastal waters. Constructed from premium cotton fleece, it ensures both warmth and breathability, ideal for transitional weather. The fabric offers a soft touch and strong color retention even after multiple washes.\n\nThis hoodie''s minimalist silhouette includes ribbed cuffs, a front pocket, and a roomy hood, creating a perfect blend of utility and simplicity. The blue tone works well with gray, black, or white pants for a clean, modern look.\n\nKey details:\n- Material: 85% Cotton / 15% Polyester\n- Fit: Regular fit\n- Color: Ocean blue\n- Features: Ribbed hem, adjustable hood, kangaroo pocket\n- Care: Machine washable\n- Ideal use: Urban wear, travel, layering\n\nA clean, modern essential for those who favor balance between comfort and contemporary design.', '<h2>Ocean Blue Hoodie</h2><p>The <strong>Ocean Blue Hoodie</strong> is a calm, confident staple made from soft cotton fleece, balancing breathability and warmth.</p><ul><li><strong>Material:</strong> 85% Cotton / 15% Polyester</li><li><strong>Color:</strong> Ocean blue</li><li><strong>Fit:</strong> Regular</li><li><strong>Features:</strong> Ribbed hem, kangaroo pocket</li><li><strong>Use cases:</strong> Urban casual, travel, layering</li></ul><p>Clean, comfortable, and effortlessly modern.</p>', '["blue hoodie", "hoodie", "cotton hoodie", "minimalist hoodie", "unisex fashion", "modern style", "urban casual", "streetwear", "comfortable hoodie"]', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', true, 'Midnight Black Hoodie', 'The Midnight Black Hoodie represents modern minimalism with an edge. Made from heavyweight cotton fleece, it offers a structured fit and superior warmth. The black-on-black detailing—tonal drawstrings, hidden stitching, and minimalist seams—creates a sophisticated streetwear aesthetic.\n\nDesigned for versatility, this hoodie transitions effortlessly from gym wear to urban casual. The soft interior and smooth exterior provide both comfort and polish.\n\nKey details:\n- Material: 100% Cotton fleece\n- Fit: Modern relaxed fit\n- Color: Jet black\n- Features: Double-lined hood, front pocket, ribbed cuffs\n- Care: Cold wash, tumble dry low\n- Ideal use: Streetwear, gym, everyday minimalist outfits\n\nA durable, sleek hoodie for those who prefer understated confidence and timeless appeal.', '<h2>Midnight Black Hoodie</h2><p>The <strong>Midnight Black Hoodie</strong> blends structure, warmth, and sleek aesthetics for modern streetwear looks.</p><ul><li><strong>Material:</strong> 100% Cotton fleece</li><li><strong>Color:</strong> Jet black</li><li><strong>Fit:</strong> Relaxed</li><li><strong>Features:</strong> Minimal seams, double-lined hood</li><li><strong>Use cases:</strong> Streetwear, gym, everyday minimalist outfits</li></ul><p>Understated yet bold — a true wardrobe essential.</p>', '["black hoodie", "hoodie", "minimalist hoodie", "streetwear", "modern fashion", "cotton fleece", "casual wear", "unisex style", "urban outfit"]', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),

-- Pants
('55555555-5555-5555-5555-555555555555', true, 'Charcoal Gray Jogger Pants', 'The Charcoal Gray Jogger Pants combine comfort and street-style energy. Made from premium brushed cotton with a hint of elastane, they provide flexibility and structure. The elastic waistband and adjustable drawstring offer a secure, tailored fit. Tapered legs with ribbed cuffs give a modern silhouette suitable for gym sessions or relaxed urban wear.\n\nThe charcoal hue complements bold topwear, especially red or white hoodies, creating contrast while maintaining balance.\n\nKey details:\n- Material: Cotton + Elastane blend\n- Fit: Tapered athletic fit\n- Color: Charcoal gray\n- Features: Elastic waist, drawstring, ribbed cuffs, side pockets\n- Use: Activewear, casual wear\n\nIdeal pairing: Red hoodie and gray sneakers for a dynamic casual outfit.', '<h2>Charcoal Gray Jogger Pants</h2><p>Comfortable and structured joggers perfect for active or casual wear. Works especially well with bright tops like red hoodies.</p><ul><li><strong>Material:</strong> Cotton + Elastane</li><li><strong>Fit:</strong> Athletic tapered</li><li><strong>Color:</strong> Charcoal gray</li><li><strong>Features:</strong> Elastic waist, ribbed cuffs</li></ul>', '["joggers", "gray pants", "charcoal joggers", "athletic wear", "streetwear", "casual wear", "unisex pants", "elastic waist pants"]', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', true, 'Beige Slim Chinos', 'Beige Slim Chinos offer a refined silhouette blending classic tailoring with everyday wearability. The smooth cotton twill fabric ensures durability, while a hint of stretch enhances mobility. The beige tone pairs beautifully with earthy or green hues, evoking a natural and sophisticated aesthetic.\n\nIdeal for semi-casual environments, these chinos elevate simple outfits effortlessly.\n\nKey details:\n- Material: Cotton twill with 2% elastane\n- Fit: Slim fit\n- Color: Beige\n- Features: Zip fly, belt loops, side and back pockets\n- Use: Smart casual, office, or weekend wear\n\nPairs perfectly with the Forest Green Hoodie for an organic and balanced look.', '<h2>Beige Slim Chinos</h2><p>Refined slim-fit chinos crafted from soft cotton twill. Ideal for pairing with green or neutral tops.</p><ul><li><strong>Material:</strong> Cotton twill</li><li><strong>Fit:</strong> Slim</li><li><strong>Color:</strong> Beige</li><li><strong>Features:</strong> Stretch, belt loops, zip fly</li></ul>', '["chinos", "beige pants", "smart casual", "slim fit", "cotton twill", "office wear", "neutral tones", "unisex pants"]', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', true, 'Graphite Blue Track Pants', 'Graphite Blue Track Pants are designed for performance and comfort. Featuring moisture-wicking fabric and articulated knee design, they ensure unrestricted movement. The dark blue-gray tone creates a sleek, modern athletic look that pairs seamlessly with Ocean Blue Hoodies and tech sneakers.\n\nKey details:\n- Material: Recycled polyester and spandex blend\n- Fit: Athletic slim fit\n- Color: Graphite blue\n- Features: Zippered pockets, reflective accents, stretch waistband\n- Use: Running, gym, or travel\n\nIdeal for a cohesive tech-inspired athletic outfit.', '<h2>Graphite Blue Track Pants</h2><p>Performance-driven pants for active lifestyles. Works perfectly with blue or gray hoodies.</p><ul><li><strong>Material:</strong> Recycled polyester + spandex</li><li><strong>Fit:</strong> Athletic</li><li><strong>Color:</strong> Graphite blue</li><li><strong>Features:</strong> Reflective details, stretch waistband</li></ul>', '["track pants", "blue pants", "athletic wear", "sportswear", "activewear", "modern outfit", "performance pants"]', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', true, 'Black Cargo Pants', 'The Black Cargo Pants bring utility and modern aesthetics together. Crafted from durable cotton canvas, they feature large flap pockets, reinforced seams, and a straight-leg silhouette. The matte black finish complements the Midnight Black Hoodie for a cohesive streetwear look.\n\nKey details:\n- Material: Cotton canvas\n- Fit: Regular straight\n- Color: Matte black\n- Features: Cargo pockets, reinforced stitching, adjustable cuffs\n- Use: Streetwear, outdoor, casual\n\nCombines durability and function for versatile all-day wear.', '<h2>Black Cargo Pants</h2><p>Durable, functional cargo pants with a modern streetwear aesthetic. Ideal with black or gray hoodies.</p><ul><li><strong>Material:</strong> Cotton canvas</li><li><strong>Fit:</strong> Regular straight</li><li><strong>Color:</strong> Black</li><li><strong>Features:</strong> Cargo pockets, adjustable cuffs</li></ul>', '["cargo pants", "black pants", "streetwear", "urban outfit", "cotton canvas", "functional wear", "utility pants"]', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),

-- Shoes
('99999999-9999-9999-9999-999999999999', true, 'White & Red Running Sneakers', 'White & Red Running Sneakers feature lightweight construction and modern performance design. The breathable mesh upper with red accent panels provides contrast and energy, pairing perfectly with the Classic Red Hoodie and Charcoal Joggers.\n\nKey details:\n- Material: Mesh upper, rubber sole\n- Fit: True to size\n- Color: White with red accents\n- Features: Breathable, cushioned sole, flexible design\n- Use: Running, casual wear\n\nIdeal for energetic, street-style looks that balance comfort and color coordination.', '<h2>White & Red Running Sneakers</h2><p>Lightweight sneakers designed for both sport and casual wear. Complements red apparel perfectly.</p>', '["sneakers", "running shoes", "red sneakers", "athletic footwear", "casual shoes", "streetwear", "performance sneakers"]', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', true, 'Olive Green Low-Top Sneakers', 'The Olive Green Low-Top Sneakers combine earth tones with urban design. The suede and textile mix creates depth and comfort, complementing the Forest Green Hoodie and Beige Chinos for a coordinated natural outfit.\n\nKey details:\n- Material: Suede and mesh upper, rubber sole\n- Fit: Regular\n- Color: Olive green\n- Features: Padded collar, durable outsole, breathable lining\n- Use: Casual and everyday wear\n\nPerfect for eco-inspired or smart casual outfits.', '<h2>Olive Green Low-Top Sneakers</h2><p>Earthy, stylish sneakers built for comfort and balance. Pair with beige or green clothing.</p>', '["green sneakers", "olive shoes", "casual sneakers", "eco fashion", "unisex footwear", "streetwear"]', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', true, 'Blue & Gray Training Shoes', 'Blue & Gray Training Shoes are designed for comfort, performance, and minimalism. Featuring a breathable mesh upper and responsive midsole cushioning, they are ideal for gym sessions or urban activities. The cool-toned design pairs perfectly with the Ocean Blue Hoodie and Graphite Pants.\n\nKey details:\n- Material: Mesh and TPU overlays\n- Fit: Athletic fit\n- Color: Blue and gray\n- Features: Lightweight, shock absorption, grip outsole\n- Use: Training, casual wear\n\nA perfect balance of performance and style.', '<h2>Blue & Gray Training Shoes</h2><p>Performance-driven sneakers with cool, modern color balance. Pairs with blue outfits.</p>', '["training shoes", "blue sneakers", "sport shoes", "activewear", "athletic gear", "minimal sneakers"]', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', true, 'All-Black Leather Sneakers', 'All-Black Leather Sneakers bring a minimalist edge to any outfit. Crafted from smooth matte leather, they exude understated confidence. The tonal design pairs seamlessly with the Midnight Black Hoodie and Cargo Pants for a complete monochrome streetwear look.\n\nKey details:\n- Material: 100% Leather upper, rubber sole\n- Fit: Standard\n- Color: Matte black\n- Features: Cushioned insole, tonal laces, low profile\n- Use: Streetwear, casual wear, travel\n\nSleek, timeless, and versatile for everyday wear.', '<h2>All-Black Leather Sneakers</h2><p>Matte black sneakers that embody modern minimalism and all-day comfort.</p>', '["black sneakers", "leather shoes", "streetwear footwear", "minimalist sneakers", "unisex shoes", "casual fashion"]', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW()),

-- Accessories
('dddddddd-dddd-dddd-dddd-dddddddddeee', true, 'Light Gray Performance Cap', 'The Light Gray Performance Cap completes vibrant, sporty looks such as the Classic Red Hoodie and Charcoal Joggers combo. Crafted from lightweight, breathable polyester twill, it''s designed for comfort, sun protection, and modern streetwear appeal.\n\nThe six-panel design features reinforced stitching, a curved brim, and an adjustable strap for a secure fit. The neutral gray tone balances bold outfit colors, adding contrast without overpowering the ensemble. Its moisture-wicking inner band ensures dryness during workouts or warm weather.\n\nFunctional yet stylish, this cap bridges athletic practicality with everyday casual aesthetics.', '<h2>Light Gray Performance Cap</h2><p>A breathable, adjustable cap that complements sporty or bright outfits, especially red-themed sets.</p>', '["cap", "gray hat", "sportswear accessory", "athletic gear", "streetwear", "unisex accessory"]', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', true, 'Chestnut Brown Leather Belt', 'The Chestnut Brown Leather Belt adds refined craftsmanship and organic charm to the Forest Green Hoodie and Beige Chino combination. Handcrafted from genuine full-grain leather, it features a matte brushed-metal buckle and edge stitching for durability.\n\nThe warm chestnut tone pairs beautifully with earth-toned apparel, complementing natural greens, tans, and creams. With its soft texture and subtle sheen, this belt bridges rugged authenticity and polished casualwear.', '<h2>Chestnut Brown Leather Belt</h2><p>Full-grain leather belt with a brushed-metal buckle — the perfect organic complement to green and beige outfits.</p>', '["leather belt", "brown belt", "handcrafted accessory", "casual belt", "earth tone fashion"]', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', true, 'Graphite Sport Smartwatch', 'The Graphite Sport Smartwatch merges technology and style, perfectly complementing the Ocean Blue Hoodie and Graphite Track Pants. Built for performance, it features a lightweight aluminum case, soft silicone strap, and an ultra-clear AMOLED display. It tracks fitness, heart rate, and sleep while maintaining a minimalist aesthetic.', '<h2>Graphite Sport Smartwatch</h2><p>A stylish, feature-rich smartwatch that complements blue or gray athletic outfits.</p>', '["smartwatch", "wearable tech", "sport accessory", "blue outfit accessory", "fitness tracker"]', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW()),
('11111111-1111-1111-1111-111111111112', true, 'Black Urban Canvas Backpack', 'The Black Urban Canvas Backpack complements the Midnight Black Hoodie and Cargo Pants with a sleek, minimalist edge. Crafted from heavy-duty canvas with leather trim accents, it offers durability, structure, and subtle sophistication. The matte black color enhances monochrome outfits and suits daily commuting or travel use.', '<h2>Black Urban Canvas Backpack</h2><p>Durable, stylish, and functional backpack designed for urban or minimalist outfits.</p>', '["backpack", "black bag", "streetwear accessory", "urban carry", "minimalist backpack"]', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW());
--> statement-breakpoint

-- Insert Product Options
INSERT INTO product_options (product_id, name, position, values, created_at, updated_at) VALUES
-- Hoodie sizes
('11111111-1111-1111-1111-111111111111', 'Size', 0, '["XS", "S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Size', 0, '["XS", "S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Size', 0, '["XS", "S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Size', 0, '["XS", "S", "M", "L", "XL", "XXL"]', NOW(), NOW()),

-- Pants sizes (letter sizes for most, except joggers/track which can be numeric)
('55555555-5555-5555-5555-555555555555', 'Size', 0, '["S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Size', 0, '["28", "30", "32", "34", "36"]', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Size', 0, '["S", "M", "L", "XL", "XXL"]', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Size', 0, '["S", "M", "L", "XL", "XXL"]', NOW(), NOW()),

-- Shoe sizes
('99999999-9999-9999-9999-999999999999', 'Size', 0, '["7", "8", "9", "10", "11", "12"]', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Size', 0, '["7", "8", "9", "10", "11", "12"]', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'Size', 0, '["7", "8", "9", "10", "11", "12"]', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', 'Size', 0, '["7", "8", "9", "10", "11", "12"]', NOW(), NOW());
--> statement-breakpoint

-- Insert Product Variants (with size variants)
INSERT INTO product_variants (product_id, title, available_for_sale, selected_options, price, currency_code, inventory_quantity, weight, weight_unit, created_at, updated_at) VALUES
-- Hoodies (base price $39.99, variations max $5 difference)
('11111111-1111-1111-1111-111111111111', 'XS', true, '[{"name": "Size", "value": "XS"}]', 3499, 'USD', 25, 0.45, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111111', 'S', true, '[{"name": "Size", "value": "S"}]', 3799, 'USD', 40, 0.47, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111111', 'M', true, '[{"name": "Size", "value": "M"}]', 3999, 'USD', 50, 0.5, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111111', 'L', true, '[{"name": "Size", "value": "L"}]', 3999, 'USD', 45, 0.52, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111111', 'XL', true, '[{"name": "Size", "value": "XL"}]', 4299, 'USD', 35, 0.55, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111111', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 4499, 'USD', 20, 0.58, 'kg', NOW(), NOW()),

('22222222-2222-2222-2222-222222222222', 'XS', true, '[{"name": "Size", "value": "XS"}]', 3499, 'USD', 25, 0.45, 'kg', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'S', true, '[{"name": "Size", "value": "S"}]', 3799, 'USD', 40, 0.47, 'kg', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'M', true, '[{"name": "Size", "value": "M"}]', 3999, 'USD', 50, 0.5, 'kg', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'L', true, '[{"name": "Size", "value": "L"}]', 3999, 'USD', 45, 0.52, 'kg', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'XL', true, '[{"name": "Size", "value": "XL"}]', 4299, 'USD', 35, 0.55, 'kg', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 4499, 'USD', 20, 0.58, 'kg', NOW(), NOW()),

('33333333-3333-3333-3333-333333333333', 'XS', true, '[{"name": "Size", "value": "XS"}]', 3499, 'USD', 25, 0.45, 'kg', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'S', true, '[{"name": "Size", "value": "S"}]', 3799, 'USD', 40, 0.47, 'kg', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'M', true, '[{"name": "Size", "value": "M"}]', 3999, 'USD', 50, 0.5, 'kg', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'L', true, '[{"name": "Size", "value": "L"}]', 3999, 'USD', 45, 0.52, 'kg', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'XL', true, '[{"name": "Size", "value": "XL"}]', 4299, 'USD', 35, 0.55, 'kg', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 4499, 'USD', 20, 0.58, 'kg', NOW(), NOW()),

('44444444-4444-4444-4444-444444444444', 'XS', true, '[{"name": "Size", "value": "XS"}]', 3499, 'USD', 25, 0.45, 'kg', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'S', true, '[{"name": "Size", "value": "S"}]', 3799, 'USD', 40, 0.47, 'kg', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'M', true, '[{"name": "Size", "value": "M"}]', 3999, 'USD', 50, 0.5, 'kg', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'L', true, '[{"name": "Size", "value": "L"}]', 3999, 'USD', 45, 0.52, 'kg', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'XL', true, '[{"name": "Size", "value": "XL"}]', 4299, 'USD', 35, 0.55, 'kg', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 4499, 'USD', 20, 0.58, 'kg', NOW(), NOW()),

-- Pants (base price $34.99, variations max $5 difference)
('55555555-5555-5555-5555-555555555555', 'S', true, '[{"name": "Size", "value": "S"}]', 3199, 'USD', 30, 0.38, 'kg', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'M', true, '[{"name": "Size", "value": "M"}]', 3499, 'USD', 40, 0.4, 'kg', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'L', true, '[{"name": "Size", "value": "L"}]', 3499, 'USD', 45, 0.42, 'kg', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'XL', true, '[{"name": "Size", "value": "XL"}]', 3799, 'USD', 35, 0.44, 'kg', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 3999, 'USD', 20, 0.46, 'kg', NOW(), NOW()),

('66666666-6666-6666-6666-666666666666', '28', true, '[{"name": "Size", "value": "28"}]', 3199, 'USD', 25, 0.38, 'kg', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', '30', true, '[{"name": "Size", "value": "30"}]', 3499, 'USD', 35, 0.4, 'kg', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', '32', true, '[{"name": "Size", "value": "32"}]', 3499, 'USD', 40, 0.42, 'kg', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', '34', true, '[{"name": "Size", "value": "34"}]', 3799, 'USD', 30, 0.44, 'kg', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', '36', true, '[{"name": "Size", "value": "36"}]', 3999, 'USD', 15, 0.46, 'kg', NOW(), NOW()),

('77777777-7777-7777-7777-777777777777', 'S', true, '[{"name": "Size", "value": "S"}]', 3199, 'USD', 30, 0.38, 'kg', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'M', true, '[{"name": "Size", "value": "M"}]', 3499, 'USD', 40, 0.4, 'kg', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'L', true, '[{"name": "Size", "value": "L"}]', 3499, 'USD', 45, 0.42, 'kg', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'XL', true, '[{"name": "Size", "value": "XL"}]', 3799, 'USD', 35, 0.44, 'kg', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 3999, 'USD', 20, 0.46, 'kg', NOW(), NOW()),

('88888888-8888-8888-8888-888888888888', 'S', true, '[{"name": "Size", "value": "S"}]', 3199, 'USD', 30, 0.38, 'kg', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'M', true, '[{"name": "Size", "value": "M"}]', 3499, 'USD', 40, 0.4, 'kg', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'L', true, '[{"name": "Size", "value": "L"}]', 3499, 'USD', 45, 0.42, 'kg', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'XL', true, '[{"name": "Size", "value": "XL"}]', 3799, 'USD', 35, 0.44, 'kg', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'XXL', true, '[{"name": "Size", "value": "XXL"}]', 3999, 'USD', 20, 0.46, 'kg', NOW(), NOW()),

-- Shoes (base price $79.99, variations max $5 difference)
('99999999-9999-9999-9999-999999999999', '7', true, '[{"name": "Size", "value": "7"}]', 7499, 'USD', 15, 0.58, 'kg', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', '8', true, '[{"name": "Size", "value": "8"}]', 7799, 'USD', 25, 0.59, 'kg', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', '9', true, '[{"name": "Size", "value": "9"}]', 7999, 'USD', 35, 0.6, 'kg', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', '10', true, '[{"name": "Size", "value": "10"}]', 7999, 'USD', 40, 0.61, 'kg', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', '11', true, '[{"name": "Size", "value": "11"}]', 8299, 'USD', 30, 0.62, 'kg', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', '12', true, '[{"name": "Size", "value": "12"}]', 8499, 'USD', 20, 0.63, 'kg', NOW(), NOW()),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '7', true, '[{"name": "Size", "value": "7"}]', 7499, 'USD', 15, 0.58, 'kg', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '8', true, '[{"name": "Size", "value": "8"}]', 7799, 'USD', 25, 0.59, 'kg', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '9', true, '[{"name": "Size", "value": "9"}]', 7999, 'USD', 35, 0.6, 'kg', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '10', true, '[{"name": "Size", "value": "10"}]', 7999, 'USD', 40, 0.61, 'kg', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '11', true, '[{"name": "Size", "value": "11"}]', 8299, 'USD', 30, 0.62, 'kg', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '12', true, '[{"name": "Size", "value": "12"}]', 8499, 'USD', 20, 0.63, 'kg', NOW(), NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '7', true, '[{"name": "Size", "value": "7"}]', 7499, 'USD', 15, 0.58, 'kg', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '8', true, '[{"name": "Size", "value": "8"}]', 7799, 'USD', 25, 0.59, 'kg', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '9', true, '[{"name": "Size", "value": "9"}]', 7999, 'USD', 35, 0.6, 'kg', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '10', true, '[{"name": "Size", "value": "10"}]', 7999, 'USD', 40, 0.61, 'kg', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '11', true, '[{"name": "Size", "value": "11"}]', 8299, 'USD', 30, 0.62, 'kg', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '12', true, '[{"name": "Size", "value": "12"}]', 8499, 'USD', 20, 0.63, 'kg', NOW(), NOW()),

('cccccccc-cccc-cccc-cccc-cccccccccccd', '7', true, '[{"name": "Size", "value": "7"}]', 7499, 'USD', 15, 0.58, 'kg', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', '8', true, '[{"name": "Size", "value": "8"}]', 7799, 'USD', 25, 0.59, 'kg', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', '9', true, '[{"name": "Size", "value": "9"}]', 7999, 'USD', 35, 0.6, 'kg', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', '10', true, '[{"name": "Size", "value": "10"}]', 7999, 'USD', 40, 0.61, 'kg', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', '11', true, '[{"name": "Size", "value": "11"}]', 8299, 'USD', 30, 0.62, 'kg', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccd', '12', true, '[{"name": "Size", "value": "12"}]', 8499, 'USD', 20, 0.63, 'kg', NOW(), NOW()),

-- Accessories (single variants, no sizes needed)
('dddddddd-dddd-dddd-dddd-dddddddddeee', 'Default', true, '[]', 1999, 'USD', 100, 0.1, 'kg', NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'Default', true, '[]', 2999, 'USD', 100, 0.2, 'kg', NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Default', true, '[]', 14999, 'USD', 100, 0.1, 'kg', NOW(), NOW()),
('11111111-1111-1111-1111-111111111112', 'Default', true, '[]', 5999, 'USD', 100, 0.5, 'kg', NOW(), NOW());
--> statement-breakpoint

-- Insert Product Images with placeholders
INSERT INTO product_images (id, product_id, url, alt_text, "order", width, height, created_at, updated_at) VALUES
-- Hoodies
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', '11111111-1111-1111-1111-111111111111', 'NULL', 'Classic Red Pullover Hoodie - Main Image', 0, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', '11111111-1111-1111-1111-111111111111', 'NULL', 'Classic Red Pullover Hoodie - Detail View', 1, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa21', '22222222-2222-2222-2222-222222222222', 'NULL', 'Forest Green Pullover Hoodie - Main Image', 0, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa22', '22222222-2222-2222-2222-222222222222', 'NULL', 'Forest Green Pullover Hoodie - Detail View', 1, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa31', '33333333-3333-3333-3333-333333333333', 'NULL', 'Ocean Blue Hoodie - Main Image', 0, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa32', '33333333-3333-3333-3333-333333333333', 'NULL', 'Ocean Blue Hoodie - Detail View', 1, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa41', '44444444-4444-4444-4444-444444444444', 'NULL', 'Midnight Black Hoodie - Main Image', 0, NULL, NULL, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa42', '44444444-4444-4444-4444-444444444444', 'NULL', 'Midnight Black Hoodie - Detail View', 1, NULL, NULL, NOW(), NOW()),

-- Pants
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', '55555555-5555-5555-5555-555555555555', 'NULL', 'Charcoal Gray Jogger Pants - Main Image', 0, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb12', '55555555-5555-5555-5555-555555555555', 'NULL', 'Charcoal Gray Jogger Pants - Detail View', 1, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb21', '66666666-6666-6666-6666-666666666666', 'NULL', 'Beige Slim Chinos - Main Image', 0, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb22', '66666666-6666-6666-6666-666666666666', 'NULL', 'Beige Slim Chinos - Detail View', 1, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb31', '77777777-7777-7777-7777-777777777777', 'NULL', 'Graphite Blue Track Pants - Main Image', 0, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb32', '77777777-7777-7777-7777-777777777777', 'NULL', 'Graphite Blue Track Pants - Detail View', 1, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb41', '88888888-8888-8888-8888-888888888888', 'NULL', 'Black Cargo Pants - Main Image', 0, NULL, NULL, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb42', '88888888-8888-8888-8888-888888888888', 'NULL', 'Black Cargo Pants - Detail View', 1, NULL, NULL, NOW(), NOW()),

-- Shoes
('cccccccc-cccc-cccc-cccc-cccccccc0011', '99999999-9999-9999-9999-999999999999', 'NULL', 'White & Red Running Sneakers - Main Image', 0, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0012', '99999999-9999-9999-9999-999999999999', 'NULL', 'White & Red Running Sneakers - Detail View', 1, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0021', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'NULL', 'Olive Green Low-Top Sneakers - Main Image', 0, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0022', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'NULL', 'Olive Green Low-Top Sneakers - Detail View', 1, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0031', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'NULL', 'Blue & Gray Training Shoes - Main Image', 0, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0032', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'NULL', 'Blue & Gray Training Shoes - Detail View', 1, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0041', 'cccccccc-cccc-cccc-cccc-cccccccccccd', 'NULL', 'All-Black Leather Sneakers - Main Image', 0, NULL, NULL, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccc0042', 'cccccccc-cccc-cccc-cccc-cccccccccccd', 'NULL', 'All-Black Leather Sneakers - Detail View', 1, NULL, NULL, NOW(), NOW()),

-- Accessories
('dddddddd-dddd-dddd-dddd-dddddddd0011', 'dddddddd-dddd-dddd-dddd-dddddddddeee', 'NULL', 'Light Gray Performance Cap - Main Image', 0, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0012', 'dddddddd-dddd-dddd-dddd-dddddddddeee', 'NULL', 'Light Gray Performance Cap - Detail View', 1, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0021', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'NULL', 'Chestnut Brown Leather Belt - Main Image', 0, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0022', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'NULL', 'Chestnut Brown Leather Belt - Detail View', 1, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0031', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'NULL', 'Graphite Sport Smartwatch - Main Image', 0, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0032', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'NULL', 'Graphite Sport Smartwatch - Detail View', 1, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0041', '11111111-1111-1111-1111-111111111112', 'NULL', 'Black Urban Canvas Backpack - Main Image', 0, NULL, NULL, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddd0042', '11111111-1111-1111-1111-111111111112', 'NULL', 'Black Urban Canvas Backpack - Detail View', 1, NULL, NULL, NOW(), NOW());