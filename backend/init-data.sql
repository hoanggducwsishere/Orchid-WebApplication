-- 0. Create Tables if not exist
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS orchids (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    origin VARCHAR(255),
    color VARCHAR(255),
    rating DOUBLE PRECISION DEFAULT 5.0,
    img VARCHAR(1000),
    video_url VARCHAR(1000),
    description TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    is_natural BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    rating DOUBLE PRECISION NOT NULL,
    comment TEXT,
    author VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT FALSE,
    date TIMESTAMP,
    orchid_id BIGINT REFERENCES orchids(id) ON DELETE CASCADE
);

-- Clear existing data
TRUNCATE TABLE feedback, orchids, categories, users RESTART IDENTITY CASCADE;

-- 1. Insert Users (Password: admin123 for admin, 123456 for members)
INSERT INTO users (name, email, password, is_admin) VALUES
('System Administrator', 'admin@orchid.vn', '$2a$10$c6nvhn0EGQdzA3DvBVxvqOZv6D8RWxl3BlOVTQdrV3qhzbz0wninO', true),
('User 1', '1@gmail.com', '$2a$10$QyqLUGWy7CxFMm3DyL3MoOq6pFqLA.MWZUxr448l2yN0gyfAh4h4G', false),
('Duc Member', 'duc@gmail.com', '$2a$10$QyqLUGWy7CxFMm3DyL3MoOq6pFqLA.MWZUxr448l2yN0gyfAh4h4G', false),
('NSK Vecta 1', 'nskvecta1@gmail.com', '$2a$10$QyqLUGWy7CxFMm3DyL3MoOq6pFqLA.MWZUxr448l2yN0gyfAh4h4G', false),
('Nasa Kitoru', 'nasakitoru@gmail.com', '$2a$10$QyqLUGWy7CxFMm3DyL3MoOq6pFqLA.MWZUxr448l2yN0gyfAh4h4G', false),
('NSK Vecta', 'nskvecta@gmail.com', '$2a$10$QyqLUGWy7CxFMm3DyL3MoOq6pFqLA.MWZUxr448l2yN0gyfAh4h4G', false);

-- 2. Insert Categories
INSERT INTO categories (name, description) VALUES
('Moth Orchid', 'Known as Phalaenopsis, one of the most popular and easy-to-grow orchids.'),
('Boat Orchid', 'Cymbidium orchids prized for their long-lasting sprays of flowers.'),
('Dendrobium', 'Popular orchid genus with prolific blooming along the cane.'),
('Corsage Orchid', 'Cattleya orchids famous for their large, fragrant blooms.'),
('Vanda', 'Monopodial orchids known for vibrant and fragrant flowers.'),
('Dancing Lady', 'Oncidium orchids named for the unique dancing shape of their blooms.'),
('Slipper Orchid', 'Paphiopedilum orchids characterized by pouch-like lips.'),
('Pansy Orchid', 'Miltoniopsis orchids with flat open faces resembling pansy flowers.'),
('Spider Orchid', 'Brassia orchids known for long, spreading spider-like tepals.'),
('Zygopetalum', 'Famous for highly fragrant, waxy, and intricately patterned flowers.'),
('Crucifix Orchid', 'Epidendrum orchids with small, brilliantly colored clusters.'),
('Jewel Orchid', 'Ludisia discolor grown for stunning velvety foliage with striking veins.'),
('Darwin''s Orchid', 'Angraecum sesquipedale with long nectar spur predicted by Charles Darwin.'),
('Masdevallia', 'Cool-growing orchids with vibrant, triangular-shaped flowers.'),
('Maxillaria', 'Coconut Orchid with flowers that smell remarkably like roasted coconut.'),
('Vanilla Orchid', 'Primary source of the popular natural vanilla flavoring.');

-- 3. Insert Orchids
INSERT INTO orchids (id, name, rating, is_natural, is_special, origin, color, category, img, video_url, description) VALUES
(1, 'Phalaenopsis Orchid', 4.7, true, true, 'Southeast Asia', 'Pink', 'Moth Orchid', 'src/assets/1.png', 'https://www.youtube.com/embed/_Mxr6Gqt7Gg?si=ZojYwXWTgcVOMKXC', 'Known as the Moth Orchid, it is one of the most popular and easy-to-grow orchids in the world.'),
(2, 'Cymbidium Orchid', 4.0, true, false, 'Himalayas', 'Yellow', 'Boat Orchid', 'src/assets/2.png', 'https://www.youtube.com/embed/HFLBjhQVjWw?si=CuJQ2szXQHBM6shZ', 'Cymbidium orchids are prized for their beautiful, long-lasting sprays of flowers.'),
(3, 'Dendrobium Nobile', 4.0, false, false, 'Hybrid', 'White', 'Dendrobium', 'src/assets/3.png', 'https://www.youtube.com/embed/4fz5BuIKb3g?si=IAvoNDJ-rC5oryZ7', 'A very popular hybrid orchid known for its prolific blooming along the cane.'),
(4, 'Cattleya Orchid', 5.0, true, true, 'South America', 'Purple', 'Corsage Orchid', 'src/assets/4.png', 'https://www.youtube.com/embed/s4G8mawk1LA?si=wiwuv1FcOtJGGwrz', 'Often called the Queen of Orchids, famous for their large, fragrant blooms.'),
(5, 'Vanda Orchid', 5.0, true, true, 'Southeast Asia', 'Blue', 'Vanda', 'src/assets/5.png', 'https://www.youtube.com/embed/Y-AUhijwl30', 'Vandas are monopodial orchids known for their large, vibrant, and sometimes fragrant flowers.'),
(6, 'Oncidium Orchid', 4.0, true, false, 'Central America', 'Yellow', 'Dancing Lady', 'src/assets/6.png', 'https://www.youtube.com/embed/2h8JudeDNzA', 'Often referred to as the Dancing Lady orchid due to the unique shape of its flowers.'),
(7, 'Paphiopedilum', 5.0, true, true, 'Asia', 'Green/Brown', 'Slipper Orchid', 'src/assets/7.png', 'https://www.youtube.com/embed/ATLgJIhE0rY', 'Characterized by a unique pouch-like lip, they are highly sought after by collectors.'),
(8, 'Miltoniopsis', 3.0, true, false, 'Andes Mountains', 'Red/White', 'Pansy Orchid', 'src/assets/8.png', 'https://www.youtube.com/embed/OodFkEW4IdM', 'These orchids have flat, open faces that strongly resemble pansy flowers.'),
(9, 'Brassia', 4.0, true, false, 'Tropical America', 'Yellow/Green', 'Spider Orchid', 'src/assets/9.png', 'https://www.youtube.com/embed/PDsT6DcRGKo', 'Known as Spider Orchids because of their long, spreading tepals.'),
(10, 'Zygopetalum', 4.0, false, false, 'Hybrid', 'Purple/Green', 'Zygopetalum', 'src/assets/10.png', 'https://www.youtube.com/embed/rG4dvg5n6Kk', 'Famous for their highly fragrant, waxy, and intricately patterned flowers.'),
(11, 'Epidendrum', 3.0, true, false, 'Americas', 'Orange', 'Crucifix Orchid', 'src/assets/11.png', 'https://www.youtube.com/embed/vK62kKyFuCU', 'Tough, reed-stemmed orchids that produce clusters of small, brilliantly colored flowers.'),
(12, 'Ludisia discolor', 4.0, true, false, 'Southeast Asia', 'White', 'Jewel Orchid', 'src/assets/12.png', 'https://www.youtube.com/embed/6z25Vh1ZgDA', 'Grown more for its stunning velvety foliage with striking veins than for its small flowers.'),
(13, 'Angraecum sesquipedale', 5.0, true, true, 'Madagascar', 'White', 'Darwin''s Orchid', 'src/assets/13.png', 'https://www.youtube.com/embed/RxiGlUCgSuc', 'Famous for its incredibly long nectar spur, predicted by Charles Darwin to be pollinated by a specific moth.'),
(14, 'Masdevallia', 3.0, true, false, 'Cloud Forests of Andes', 'Red', 'Masdevallia', 'src/assets/14.png', 'https://www.youtube.com/embed/DZBZtPkfYUA', 'Cool-growing orchids with vibrant, triangular-shaped flowers that lack typical pseudobulbs.'),
(15, 'Maxillaria tenuifolia', 4.0, true, false, 'Central America', 'Red/Dark Orange', 'Maxillaria', 'src/assets/15.png', 'https://www.youtube.com/embed/lAxIN3ICcKk', 'Commonly called the Coconut Orchid because its dark red flowers smell remarkably like roasted coconut.'),
(16, 'Vanilla planifolia', 5.0, true, true, 'Mesoamerica', 'Green/Yellow', 'Vanilla Orchid', 'src/assets/16.png', 'https://www.youtube.com/embed/1RdoTcDD2EU', 'A vining orchid species that is the primary source of the popular vanilla flavoring.');

SELECT setval('orchids_id_seq', (SELECT MAX(id) FROM orchids));

-- 4. Insert Feedback
INSERT INTO feedback (rating, comment, author, is_anonymous, date, orchid_id) VALUES
(4.0, 'good', 'nskvecta1@gmail.com', false, '2026-07-07 14:10:33.285', 1),
(5.0, 'goood', 'nasakitoru@gmail.com', true, '2026-07-14 00:10:07.317', 1),
(5.0, 'good', 'nskvecta@gmail.com', true, '2026-07-07 14:56:48.307', 1),
(4.0, 'good', 'nasakitoru@gmail.com', true, '2026-07-07 15:01:59.717', 2);
