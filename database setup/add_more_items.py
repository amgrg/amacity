import sqlite3
import os
from datetime import datetime

def get_db_connection():
    # Use relative path from database setup directory to database
    # Works cross-platform (Windows, Linux, Mac)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, '..', 'amacity', 'database', 'amacity.db')
    db_path = os.path.normpath(db_path)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def add_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # More items for The Artisan's Corner (shop_id: 1, category_id: 1)
        artisan_items = [
            ("Handwoven Basket", "Traditional woven basket made from natural materials", 34.99, 15, 1, 1),
            ("Ceramic Vase", "Elegant ceramic vase with hand-painted design", 42.50, 8, 1, 1),
            ("Wooden Cutting Board", "Premium oak cutting board with custom engraving", 28.00, 20, 1, 1),
            ("Handmade Candles", "Set of 3 scented soy candles", 19.99, 30, 1, 1),
            ("Leather Journal", "Handcrafted leather-bound journal", 45.00, 12, 1, 1),
            ("Pottery Mug Set", "Set of 4 handmade ceramic mugs", 52.00, 10, 1, 1),
            ("Macrame Wall Hanging", "Bohemian style wall decoration", 38.00, 6, 1, 1),
            ("Hand-painted Plates", "Set of 6 decorative ceramic plates", 89.99, 5, 1, 1),
            ("Knitted Wool Scarf", "Soft merino wool scarf in various colors", 32.00, 25, 1, 1),
            ("Clay Planter", "Handcrafted terracotta planter", 24.50, 18, 1, 1),
            ("Beaded Jewelry Set", "Handmade necklace and earring set", 55.00, 8, 1, 1),
            ("Woven Table Runner", "Handwoven cotton table runner", 36.00, 12, 1, 1),
            ("Glass Terrarium", "Hand-blown glass terrarium for succulents", 48.00, 7, 1, 1),
            ("Embroidered Pillows", "Set of 2 hand-embroidered cushions", 64.00, 10, 1, 1),
            ("Ceramic Tea Set", "Complete handmade tea set with teapot and cups", 95.00, 4, 1, 1),
        ]

        # More items for Green Grocer (shop_id: 2, category_id: 2)
        produce_items = [
            ("Organic Bananas", "Fresh organic bananas from local farms", 2.99, 150, 2, 2),
            ("Fresh Strawberries", "Sweet locally-grown strawberries", 4.99, 80, 2, 2),
            ("Heirloom Tomatoes", "Colorful heirloom tomato variety pack", 5.49, 60, 2, 2),
            ("Baby Spinach", "Organic baby spinach leaves", 3.99, 90, 2, 2),
            ("Avocados", "Ripe Hass avocados", 1.99, 120, 2, 2),
            ("Red Bell Peppers", "Crisp organic red peppers", 4.29, 70, 2, 2),
            ("Fresh Carrots", "Organic carrots with greens", 2.79, 100, 2, 2),
            ("Organic Blueberries", "Fresh blueberries", 6.99, 50, 2, 2),
            ("Mixed Salad Greens", "Organic mixed greens", 4.49, 65, 2, 2),
            ("Cherry Tomatoes", "Sweet cherry tomatoes on the vine", 3.99, 75, 2, 2),
            ("Organic Lemons", "Fresh Meyer lemons", 0.99, 200, 2, 2),
            ("Sweet Corn", "Fresh sweet corn on the cob", 0.79, 150, 2, 2),
            ("Broccoli Crowns", "Fresh organic broccoli", 3.49, 55, 2, 2),
            ("Red Grapes", "Seedless red grapes", 4.99, 80, 2, 2),
            ("Organic Cucumbers", "Crisp English cucumbers", 2.49, 90, 2, 2),
            ("Fresh Herbs Bundle", "Basil, parsley, and cilantro bundle", 5.99, 40, 2, 2),
            ("Organic Potatoes", "Russet potatoes 5lb bag", 4.99, 100, 2, 2),
            ("Fresh Mushrooms", "Mixed gourmet mushrooms", 6.49, 35, 2, 2),
            ("Organic Zucchini", "Fresh green zucchini", 2.99, 70, 2, 2),
            ("Watermelon", "Sweet seedless watermelon", 7.99, 25, 2, 2),
        ]

        # More items for Pizzeria Napoli (shop_id: 3, category_id: 3)
        pizza_items = [
            ("Quattro Formaggi Pizza", "Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan", 14.99, 50, 3, 3),
            ("Pepperoni Pizza", "Classic pepperoni with extra cheese", 13.99, 60, 3, 3),
            ("Vegetarian Pizza", "Fresh vegetables and mozzarella", 12.99, 45, 3, 3),
            ("Prosciutto e Funghi", "Prosciutto and mushroom pizza", 15.99, 40, 3, 3),
            ("Diavola Pizza", "Spicy salami and chili flakes", 14.49, 35, 3, 3),
            ("Capricciosa Pizza", "Ham, mushrooms, artichokes, and olives", 15.49, 38, 3, 3),
            ("Marinara Pizza", "Traditional tomato, garlic, and oregano", 10.99, 50, 3, 3),
            ("Calzone Napoletano", "Folded pizza with ricotta and salami", 11.99, 30, 3, 3),
            ("Bruschetta", "Grilled bread with tomatoes and basil", 6.99, 40, 3, 3),
            ("Arancini", "Sicilian rice balls with meat sauce", 7.99, 35, 3, 3),
            ("Pasta Carbonara", "Creamy pasta with pancetta and eggs", 13.99, 30, 3, 3),
            ("Lasagna", "Traditional layered pasta with meat sauce", 14.99, 25, 3, 3),
            ("Penne Arrabbiata", "Spicy tomato sauce with penne pasta", 11.99, 35, 3, 3),
            ("Caprese Salad", "Fresh mozzarella, tomatoes, and basil", 8.99, 40, 3, 3),
            ("Tiramisu", "Classic Italian coffee dessert", 6.99, 20, 3, 3),
        ]

        # More items for Gelateria Roma (shop_id: 4, category_id: 4)
        gelato_items = [
            ("Pistachio Gelato", "Rich pistachio gelato from Sicily", 6.49, 40, 4, 4),
            ("Chocolate Hazelnut Gelato", "Creamy Nutella-style gelato", 6.49, 45, 4, 4),
            ("Lemon Sorbet", "Refreshing lemon sorbet", 5.99, 35, 4, 4),
            ("Vanilla Bean Gelato", "Classic Madagascar vanilla", 5.99, 50, 4, 4),
            ("Strawberry Gelato", "Fresh strawberry gelato", 6.29, 38, 4, 4),
            ("Tiramisu Gelato", "Coffee and mascarpone flavored", 6.99, 32, 4, 4),
            ("Salted Caramel Gelato", "Sweet and salty caramel", 6.79, 35, 4, 4),
            ("Mint Chocolate Chip", "Fresh mint with dark chocolate", 6.29, 40, 4, 4),
            ("Mango Sorbet", "Tropical mango sorbet", 5.99, 30, 4, 4),
            ("Amaretto Gelato", "Almond-flavored Italian gelato", 6.49, 28, 4, 4),
            ("Coconut Gelato", "Creamy coconut gelato", 6.29, 33, 4, 4),
            ("Affogato", "Vanilla gelato with espresso shot", 7.99, 25, 4, 4),
            ("Gelato Sandwich", "Gelato between two wafer cookies", 4.99, 50, 4, 4),
            ("Cannoli", "Sicilian pastry filled with sweet ricotta", 5.49, 30, 4, 4),
            ("Panna Cotta", "Italian cream dessert with berry sauce", 6.99, 25, 4, 4),
        ]

        # Combine all items
        all_items = artisan_items + produce_items + pizza_items + gelato_items

        # Insert all items
        for item in all_items:
            cursor.execute('''
                INSERT INTO items (name, description, price, stock_quantity, shop_id, category_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (*item, datetime.now()))

        conn.commit()
        print(f"Successfully added {len(all_items)} new items to the database!")
        print(f"  - The Artisan's Corner: {len(artisan_items)} items")
        print(f"  - Green Grocer: {len(produce_items)} items")
        print(f"  - Pizzeria Napoli: {len(pizza_items)} items")
        print(f"  - Gelateria Roma: {len(gelato_items)} items")

        # Show total items in database
        cursor.execute("SELECT COUNT(*) FROM items")
        total_items = cursor.fetchone()[0]
        print(f"\nTotal items in database: {total_items}")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_items()
