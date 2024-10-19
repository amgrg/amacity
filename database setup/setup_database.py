import sqlite3
import datetime
import os

def create_database():
    db_path = os.path.join('C:', 'amacity', 'database', 'amacity.db')
    
    try:
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        print(f"Successfully connected to database at {db_path}")

        # Create Users table
        c.execute('''CREATE TABLE IF NOT EXISTS users
                     (id INTEGER PRIMARY KEY,
                      username TEXT NOT NULL UNIQUE,
                      email TEXT NOT NULL UNIQUE,
                      password_hash TEXT NOT NULL,
                      created_at DATETIME NOT NULL)''')
        print("Users table created successfully")

        # Create Shops table with country
        c.execute('''CREATE TABLE IF NOT EXISTS shops
                     (id INTEGER PRIMARY KEY,
                      name TEXT NOT NULL,
                      description TEXT,
                      owner_id INTEGER NOT NULL,
                      country TEXT NOT NULL,
                      created_at DATETIME NOT NULL,
                      FOREIGN KEY (owner_id) REFERENCES users (id))''')
        print("Shops table created successfully")

        # Create Locations table
        c.execute('''CREATE TABLE IF NOT EXISTS locations
                     (id INTEGER PRIMARY KEY,
                      shop_id INTEGER NOT NULL,
                      latitude REAL NOT NULL,
                      longitude REAL NOT NULL,
                      address TEXT,
                      city TEXT,
                      state TEXT,
                      country TEXT,
                      postal_code TEXT,
                      FOREIGN KEY (shop_id) REFERENCES shops (id))''')
        print("Locations table created successfully")

        # Create Categories table
        c.execute('''CREATE TABLE IF NOT EXISTS categories
                     (id INTEGER PRIMARY KEY,
                      name TEXT NOT NULL UNIQUE)''')
        print("Categories table created successfully")

        # Create Items table
        c.execute('''CREATE TABLE IF NOT EXISTS items
                     (id INTEGER PRIMARY KEY,
                      name TEXT NOT NULL,
                      description TEXT,
                      price REAL NOT NULL,
                      stock_quantity INTEGER NOT NULL,
                      shop_id INTEGER NOT NULL,
                      category_id INTEGER NOT NULL,
                      created_at DATETIME NOT NULL,
                      FOREIGN KEY (shop_id) REFERENCES shops (id),
                      FOREIGN KEY (category_id) REFERENCES categories (id))''')
        print("Items table created successfully")

        conn.commit()
        print("All tables created successfully")
        return conn
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def insert_sample_data(conn):
    if conn is None:
        print("Cannot insert sample data: database connection is None")
        return

    c = conn.cursor()

    try:
        # Insert sample users
        users = [
            ('john_doe', 'john@example.com', 'password_hash_1', datetime.datetime.now()),
            ('jane_smith', 'jane@example.com', 'password_hash_2', datetime.datetime.now()),
            ('mario_rossi', 'mario@example.it', 'password_hash_3', datetime.datetime.now()),
        ]
        c.executemany('INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)', users)
        print("Sample users inserted successfully")

        # Insert sample shops with country
        shops = [
            ("The Artisan's Corner", "Handcrafted goods and unique artworks", 1, "USA", datetime.datetime.now()),
            ("Green Grocer", "Fresh, locally-sourced produce and groceries", 2, "USA", datetime.datetime.now()),
            ("Pizzeria Napoli", "Authentic Neapolitan pizza", 3, "Italy", datetime.datetime.now()),
            ("Gelateria Roma", "Traditional Italian gelato", 3, "Italy", datetime.datetime.now()),
        ]
        c.executemany('INSERT INTO shops (name, description, owner_id, country, created_at) VALUES (?, ?, ?, ?, ?)', shops)
        print("Sample shops inserted successfully")

        # Insert sample locations
        locations = [
            (1, 40.7200, -74.0100, "123 Craft St", "New York", "NY", "USA", "10001"),
            (2, 40.7150, -74.0050, "456 Green Ave", "New York", "NY", "USA", "10002"),
            (3, 41.9028, 12.4964, "78 Via Roma", "Rome", "Lazio", "Italy", "00184"),
            (4, 45.4642, 9.1900, "45 Via Dante", "Milan", "Lombardy", "Italy", "20121"),
        ]
        c.executemany('INSERT INTO locations (shop_id, latitude, longitude, address, city, state, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', locations)
        print("Sample locations inserted successfully")

        # Insert sample categories
        categories = [
            ('Artisan Crafts',),
            ('Fresh Produce',),
            ('Italian Cuisine',),
            ('Desserts',),
        ]
        c.executemany('INSERT INTO categories (name) VALUES (?)', categories)
        print("Sample categories inserted successfully")

        # Insert sample items
        items = [
            ("Handmade Pottery", "Beautiful handcrafted ceramic bowl", 29.99, 10, 1, 1, datetime.datetime.now()),
            ("Organic Apples", "Freshly picked organic apples", 3.99, 100, 2, 2, datetime.datetime.now()),
            ("Margherita Pizza", "Classic Neapolitan pizza", 12.99, 50, 3, 3, datetime.datetime.now()),
            ("Stracciatella Gelato", "Creamy gelato with chocolate chips", 5.99, 30, 4, 4, datetime.datetime.now()),
        ]
        c.executemany('INSERT INTO items (name, description, price, stock_quantity, shop_id, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', items)
        print("Sample items inserted successfully")

        conn.commit()
        print("All sample data inserted successfully")
    except sqlite3.Error as e:
        print(f"An error occurred while inserting sample data: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while inserting sample data: {e}")

def main():
    conn = create_database()
    if conn:
        insert_sample_data(conn)
        conn.close()
        print("Database setup completed.")
    else:
        print("Database setup failed.")

if __name__ == "__main__":
    main()