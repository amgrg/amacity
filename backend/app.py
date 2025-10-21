from flask import Flask, render_template, jsonify, request
import sqlite3
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    # Use relative path from backend directory to database
    # Works cross-platform (Windows, Linux, Mac)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, '..', 'amacity', 'database', 'amacity.db')
    db_path = os.path.normpath(db_path)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search')
def search_items():
    query = request.args.get('q', '').strip().lower()
    app.logger.info(f"Received search query: {query}")
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        sql_query = '''
            SELECT items.id, items.name, items.description, items.price,
                   shops.id AS shop_id, shops.name AS shop_name,
                   locations.city, locations.address
            FROM items
            JOIN shops ON items.shop_id = shops.id
            JOIN locations ON shops.id = locations.shop_id
            WHERE LOWER(items.name) LIKE ? OR LOWER(items.description) LIKE ?
            LIMIT 20
        '''
        search_param = f'%{query}%'
        app.logger.info(f"Executing SQL query: {sql_query} with params: {search_param}")
        cursor.execute(sql_query, (search_param, search_param))
        items = cursor.fetchall()
        
        items_list = []
        for item in items:
            items_list.append({
                'id': item['id'],
                'name': item['name'],
                'description': item['description'] or 'No description available',
                'price': item['price'],
                'shop_id': item['shop_id'],
                'shop_name': item['shop_name'],
                'city': item['city'],
                'address': item['address']
            })
        
        app.logger.info(f"Found {len(items_list)} results for query: {query}")
        return jsonify(items_list)
    except sqlite3.Error as e:
        app.logger.error(f"An error occurred during search: {str(e)}")
        return jsonify({"error": f"An error occurred during search: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/test_db')
def test_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM items")
        items_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM shops")
        shops_count = cursor.fetchone()[0]
        cursor.execute("SELECT * FROM items LIMIT 1")
        sample_item = cursor.fetchone()
        return jsonify({
            "status": "success",
            "items_count": items_count,
            "shops_count": shops_count,
            "sample_item": dict(sample_item) if sample_item else None
        })
    except sqlite3.Error as e:
        app.logger.error(f"Database test failed: {str(e)}")
        return jsonify({"error": f"Database test failed: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/featured')
def featured_items():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Get 8 random featured items from different shops
        sql_query = '''
            SELECT items.id, items.name, items.description, items.price,
                   shops.id AS shop_id, shops.name AS shop_name,
                   locations.city, locations.address,
                   categories.name AS category_name
            FROM items
            JOIN shops ON items.shop_id = shops.id
            JOIN locations ON shops.id = locations.shop_id
            JOIN categories ON items.category_id = categories.id
            ORDER BY RANDOM()
            LIMIT 8
        '''
        cursor.execute(sql_query)
        items = cursor.fetchall()

        items_list = []
        for item in items:
            items_list.append({
                'id': item['id'],
                'name': item['name'],
                'description': item['description'] or 'No description available',
                'price': item['price'],
                'shop_id': item['shop_id'],
                'shop_name': item['shop_name'],
                'city': item['city'],
                'address': item['address'],
                'category': item['category_name']
            })

        app.logger.info(f"Returned {len(items_list)} featured items")
        return jsonify(items_list)
    except sqlite3.Error as e:
        app.logger.error(f"An error occurred while fetching featured items: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
