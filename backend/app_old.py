from flask import Flask, render_template, jsonify, request
import sqlite3
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    db_path = os.path.join('C:', 'amacity', 'database', 'amacity.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search')
def search_shops():
    query = request.args.get('q', '').strip().lower()
    app.logger.info(f"Received search query: {query}")
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        sql_query = '''
            SELECT shops.id, shops.name, shops.description, 
                   locations.address, locations.city
            FROM shops
            JOIN locations ON shops.id = locations.shop_id
            WHERE LOWER(shops.name) LIKE ? OR LOWER(shops.description) LIKE ?
            LIMIT 20
        '''
        search_param = f'%{query}%'
        app.logger.info(f"Executing SQL query: {sql_query} with params: {search_param}")
        cursor.execute(sql_query, (search_param, search_param))
        shops = cursor.fetchall()
        
        shops_list = []
        for shop in shops:
            shops_list.append({
                'id': shop['id'],
                'name': shop['name'],
                'description': shop['description'] or 'No description available',
                'address': shop['address'],
                'city': shop['city']
            })
        
        app.logger.info(f"Found {len(shops_list)} results for query: {query}")
        return jsonify(shops_list)
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
        cursor.execute("SELECT COUNT(*) FROM shops")
        shops_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM locations")
        locations_count = cursor.fetchone()[0]
        cursor.execute("SELECT * FROM shops LIMIT 1")
        sample_shop = cursor.fetchone()
        return jsonify({
            "status": "success",
            "shops_count": shops_count,
            "locations_count": locations_count,
            "sample_shop": dict(sample_shop) if sample_shop else None
        })
    except sqlite3.Error as e:
        app.logger.error(f"Database test failed: {str(e)}")
        return jsonify({"error": f"Database test failed: {str(e)}"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
