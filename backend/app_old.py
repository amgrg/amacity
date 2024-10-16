from flask import Flask, render_template, jsonify
import sqlite3
import os

app = Flask(__name__)

def get_db_connection():
    db_path = os.path.join('C:', 'amacity', 'database', 'amacity.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/api/shops')
def get_shops():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT shops.id, shops.name, shops.description, 
               locations.latitude, locations.longitude, 
               locations.address, locations.city, locations.state, locations.country
        FROM shops
        JOIN locations ON shops.id = locations.shop_id
    ''')
    shops = cursor.fetchall()
    conn.close()
    
    shops_list = []
    for shop in shops:
        shops_list.append({
            'id': shop['id'],
            'name': shop['name'],
            'description': shop['description'],
            'lat': shop['latitude'],
            'lng': shop['longitude'],
            'address': shop['address'],
            'city': shop['city'],
            'state': shop['state'],
            'country': shop['country']
        })
    
    return jsonify(shops_list)

@app.route('/api/products')
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, name, description, price, stock_quantity, shop_id
        FROM items
    ''')
    products = cursor.fetchall()
    conn.close()
    
    products_list = []
    for product in products:
        products_list.append({
            'id': product['id'],
            'name': product['name'],
            'description': product['description'],
            'price': product['price'],
            'stock_quantity': product['stock_quantity'],
            'shop_id': product['shop_id'],
            'image_url': f"/api/placeholder/400/250"  # Placeholder image
        })
    
    return jsonify(products_list)

if __name__ == '__main__':
    app.run(debug=True)
