CREATE TABLE clients
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    client_name NVARCHAR(20) NOT NULL DEFAULT '',
    email NVARCHAR(50) NOT NULL DEFAULT '',
    phone_number NVARCHAR(15) NOT NULL DEFAULT '',
    client_password NVARCHAR(50) NOT NULL
);

CREATE TABLE orders
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    product_id INT NOT NULL,
    product_quantity INT NOT NULL,
    date_made DATE NOT NULL,
    shipping_address NVARCHAR(150) NOT NULL,
    cost INT NOT NULL DEFAULT 0 CHECK (cost >= 0),
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE categories
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    category_name NVARCHAR(100)
);

CREATE TABLE products
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name NVARCHAR(50) NOT NULL,
    price INT DEFAULT 0 CHECK (price >= 0),
    materials NVARCHAR(100) NOT NULL,
    weight_in_grams INT NOT NULL DEFAULT 0,
    quantity_in_stock INT DEFAULT 0 CHECK (quantity_in_stock >= 0),
    country_of_origin NVARCHAR(50) NOT NULL,
    image_paths NVARCHAR(500) NOT NULL DEFAULT '',
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO clients (id, client_name, email, client_password) VALUES
(1, 'Никита Аминов', 'kitamin@gmail.com', 'TeykovskiySharm52'),
(2, 'Петр Петров', 'petr@example.com', ''),
(3, 'Мария Смирнова', 'maria@example.com', ''),
(4, 'Сергей Сидоров', 'sergey@example.com', ''),
(5, 'Анна Козлова', 'anna@example.com', ''),
(6, 'Алексей Морозов', 'alexey@example.com', ''),
(7, 'Елена Васильева', 'elena@example.com', ''),
(8, 'Дмитрий Павлов', 'dmitry@example.com', ''),
(9, 'Татьяна Орлова', 'tatiana@example.com', ''),
(10, 'Владимир Федоров', 'vladimir@example.com', '');

INSERT INTO categories (id, category_name) VALUES
(1, 'Кольца'),
(2, 'Серьги');

INSERT INTO products (category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin, image_paths) VALUES
(2, 'Серьги металл', 399, 'металл,пластик', 2, 10, 'Россия', 'earringsMetal.png'),
(1, 'Кольцо сердца', 349, 'металл', 10, 14, 'Россия', 'ringHearts.png');

INSERT INTO orders (id, client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES
(1, 1, 2, 2, '2025-05-29', 'Take-ово', 798);

CREATE OR REPLACE VIEW clients_general AS
SELECT id, client_name, email, phone_number FROM clients;

CREATE OR REPLACE VIEW clients_auth AS
SELECT id, client_password FROM clients;
