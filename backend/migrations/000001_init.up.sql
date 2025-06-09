CREATE TABLE clients
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    client_name NVARCHAR(20) NOT NULL DEFAULT "",
    email NVARCHAR(50) NOT NULL DEFAULT "",
    phone_number NVARCHAR(15) NOT NULL DEFAULT "",
    client_hashed_password NVARCHAR(100) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE categories
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL DEFAULT ""
);

CREATE TABLE products
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL DEFAULT 1,
    product_name NVARCHAR(50) NOT NULL DEFAULT "",
    price INT CHECK (price >= 0) DEFAULT 0,
    materials NVARCHAR(100) NOT NULL DEFAULT "",
    weight_in_grams INT NOT NULL DEFAULT 0,
    quantity_in_stock INT CHECK (quantity_in_stock >= 0) DEFAULT 0,
    country_of_origin NVARCHAR(50) NOT NULL DEFAULT "",
    image_paths NVARCHAR(500) NOT NULL DEFAULT "",
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET DEFAULT ON UPDATE CASCADE
);

CREATE TABLE orders
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    product_id INT NOT NULL,
    product_quantity INT NOT NULL,
    date_made Date NOT NULL,
    shipping_address NVARCHAR(150) NOT NULL,
    cost INT CHECK (cost >= 0) NOT NULL DEFAULT 0,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE VIEW clients_general AS
SELECT id, client_name, email, phone_number
FROM unidb.clients;

CREATE OR REPLACE VIEW clients_auth AS
SELECT id, client_hashed_password, is_admin
FROM unidb.clients;

INSERT INTO clients (id, client_name, email, client_hashed_password) VALUES
(1, 'Алексей Алексеевич', 'admin', "$2a$10$sKQ4NIN5A7WNJwdwYfg6tOVLOopYdYGGuUODKu.RnXj6/iAsaJB.u");

UPDATE clients_auth SET is_admin=TRUE WHERE clients_auth.id=1;

INSERT INTO categories (id, category_name) VALUES
(1, "Всё"),
(2, 'Кольца'),
(3, 'Серьги');

INSERT INTO products (category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin, image_paths) VALUES
(3, 'Серьги металл', 399, 'металл,пластик', 2, 10, "Россия", "earringsMetal.png"),
(2, 'Кольцо сердца', 349, 'металл', 10, 14, "Россия", "ringHearts.png");

INSERT INTO orders (id, client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES
(1, 1, 2, 2, "2025-05-29", "Take-ово", 798);