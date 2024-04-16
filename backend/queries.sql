CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL NOT NULL,
    image TEXT NULL,
    rating DECIMAL NOT NULL,
    category VARCHAR(50) NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    item_id INT REFERENCES items(id),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    total DECIMAL NOT NULL,
    items JSONB NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO items (title, description, price, image, rating, category) 
VALUES 
    ('iPhone 12 Pro', 'The iPhone 12 Pro is a powerful and feature-packed smartphone with a stunning design.', 999, 'https://images.kaina24.lt/43/69/apple-iphone-12-pro-1.jpg', 4.8, 'Electronics'),
    ('Samsung Galaxy S21', 'The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities. The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities. The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities.', 899, 'https://images.kaina24.lt/43/14/samsung-galaxy-s21-128gb-2.jpg', 4.7, 'Electronics'),
    ('Google Pixel 5', 'The Google Pixel 5 is a top-notch Android phone with a clean software experience and impressive camera performance.', 699, 'https://images.kaina24.lt/43/52/google-pixel-5.jpg', 4.5, 'Electronics');


INSERT INTO items (title, description, price, image, rating, category) 
VALUES 
    ('Razer Blade 15', 'The Razer Blade 15 is a high-performance gaming laptop with a sleek design and powerful hardware.', 1499, 'https://www.shop24.lt/images/detailed/790/4zu3_Razer_Blade_15_Advanced_Model_2020.jpg', 4.6, 'Electronics'),
    ('Yamaha YAS-209', 'The Yamaha YAS-209 is a high-quality soundbar with built-in Alexa voice control and immersive sound.', 349, 'https://www.audiocentras.lt/4398-big_default_2x/yamaha-yas-209.jpg', 4.7, 'Electronics'),
    ('Nintendo Switch', 'The Nintendo Switch is a versatile gaming console with a unique design and a wide selection of games.', 299, 'https://ksd-images.lt/display/aikido/cache/79ddf8525126efeffa10a64f34c58bbc.jpeg', 4.8, 'Electronics'),
    ('Apple MacBook Pro', 'The Apple MacBook Pro is a high-performance laptop with a sleek design and powerful hardware.', 1999, 'https://images.kaina24.lt/9/2/apple-macbook-pro-13-m2-1.jpg', 4.7, 'Electronics'),
    ('Samsung QLED TV', 'The Samsung QLED TV is a top-of-the-line television with stunning picture quality and smart features.', 1499, 'https://images.samsung.com/is/image/samsung/p6pim/lt/qe65q80catxxh/gallery/lt-qled-q80c-qe65q80catxxh-535496721?$650_519_PNG$', 4.6, 'Electronics'),
    ('Sony PlayStation 5', 'The Sony PlayStation 5 is a next-generation gaming console with powerful hardware and immersive gaming experiences.', 499, 'https://images.kaina24.lt/167/21/sony-playstation-5.jpg', 4.9, 'Electronics'),
    ('Bose QuietComfort 35 II', 'The Bose QuietComfort 35 II is a premium wireless headphone with excellent noise cancellation and audio quality.', 299, 'https://m.media-amazon.com/images/I/61PzLRRxRbL._AC_UF894,1000_QL80_.jpg', 4.8, 'Electronics'),
    ('Green T-shirt', 'A simple and stylish green t-shirt for everyday wear.', 19, 'https://media.istockphoto.com/id/1209887384/photo/green-t-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=8M4gaRs-fUz6CdYEl4OblIoDvNjcRs8_Sbzs0VxWlMY=', 4.5, 'Clothing'),
    ('Blue Jeans', 'Classic blue jeans for a casual and comfortable look.', 39, 'https://isto.pt/cdn/shop/products/Everyday_Denim_Blue_1.jpg?v=1668613349&width=1946', 4.6, 'Clothing');
