import sqlite3
import os

def get_db_connection():
    # Use relative path from database setup directory to database
    # Works cross-platform (Windows, Linux, Mac)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, '..', 'amacity', 'database', 'amacity.db')
    db_path = os.path.normpath(db_path)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def verify_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get total count by shop
        print("=" * 60)
        print("ITEMS BY SHOP")
        print("=" * 60)
        cursor.execute('''
            SELECT shops.name, COUNT(items.id) as item_count
            FROM shops
            LEFT JOIN items ON shops.id = items.shop_id
            GROUP BY shops.id, shops.name
            ORDER BY shops.id
        ''')

        for row in cursor.fetchall():
            print(f"{row['name']}: {row['item_count']} items")

        # Get total count by category
        print("\n" + "=" * 60)
        print("ITEMS BY CATEGORY")
        print("=" * 60)
        cursor.execute('''
            SELECT categories.name, COUNT(items.id) as item_count
            FROM categories
            LEFT JOIN items ON categories.id = items.category_id
            GROUP BY categories.id, categories.name
            ORDER BY categories.id
        ''')

        for row in cursor.fetchall():
            print(f"{row['name']}: {row['item_count']} items")

        # Show sample items from each shop
        print("\n" + "=" * 60)
        print("SAMPLE ITEMS FROM EACH SHOP")
        print("=" * 60)
        cursor.execute('''
            SELECT items.name, items.price, shops.name as shop_name, items.shop_id
            FROM items
            JOIN shops ON items.shop_id = shops.id
            ORDER BY items.shop_id, items.name
        ''')

        current_shop = None
        shop_item_count = {}
        for row in cursor.fetchall():
            shop_name = row['shop_name']
            if shop_name not in shop_item_count:
                shop_item_count[shop_name] = 0

            if shop_item_count[shop_name] < 5:  # Show only first 5 items per shop
                if current_shop != shop_name:
                    current_shop = shop_name
                    print(f"\n{current_shop}:")
                print(f"  - {row['name']} (${row['price']:.2f})")
                shop_item_count[shop_name] += 1

        # Total count
        cursor.execute("SELECT COUNT(*) as total FROM items")
        total = cursor.fetchone()['total']
        print("\n" + "=" * 60)
        print(f"TOTAL ITEMS IN DATABASE: {total}")
        print("=" * 60)

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    verify_items()
