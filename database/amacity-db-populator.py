import sqlite3
import requests
import os
from datetime import datetime

# API details
API_URL = "https://local-business-data.p.rapidapi.com/search"
API_KEY = "aaiohyif8u4a1e1nkauur1a7vpuphx"
API_HOST = "local-business-data.p.rapidapi.com"

def get_db_connection():
    db_path = os.path.join('C:', 'amacity', 'database', 'amacity.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def fetch_shop_data(api_url, api_key, api_host):
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": api_host
    }
    
    querystring = {
        "query": "shops in ravenna italy",
        "limit": "100",
        "zoom": "13",
        "language": "en",
        "extract_emails_and_contacts": "false"
    }
    
    try:
        response = requests.get(api_url, headers=headers, params=querystring)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def populate_database(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Clear existing data
        cursor.execute("DELETE FROM locations")
        cursor.execute("DELETE FROM shops")
        cursor.execute("DELETE FROM users")

        for index, shop in enumerate(data['data'], start=1):
            # Insert user (assuming one user per shop for simplicity)
            cursor.execute('''
                INSERT INTO users (id, username, email, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (index, f"user_{shop['place_id']}", f"user_{shop['place_id']}@example.com", "dummy_hash", datetime.now()))

            # Insert shop
            cursor.execute('''
                INSERT INTO shops (id, name, description, owner_id, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (index, shop['name'], shop.get('description', ''), index, datetime.now()))

            # Insert location
            cursor.execute('''
                INSERT INTO locations (id, shop_id, latitude, longitude, address, city, state, country, postal_code)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (index, index, shop['latitude'], shop['longitude'], 
                  shop.get('address', ''), 'Ravenna', 'Emilia-Romagna', 'Italy', shop.get('postal_code', '')))

        conn.commit()
        print("Database populated successfully")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

def main():
    print("Fetching shop data from API...")
    api_data = fetch_shop_data(API_URL, API_KEY, API_HOST)
    if api_data and 'data' in api_data:
        print(f"Fetched {len(api_data['data'])} shops.")
        print("Populating database with fetched data...")
        populate_database(api_data)
    else:
        print("Failed to fetch data from API or no data returned.")

if __name__ == "__main__":
    main()
