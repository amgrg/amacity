import requests

url = "https://local-business-data.p.rapidapi.com/search-in-area"

querystring = {"query":"pizza","lat":"37.359428","lng":"-121.925337","zoom":"13","limit":"20","language":"en","region":"us","extract_emails_and_contacts":"false"}

headers = {
	"x-rapidapi-key": "aaiohyif8u4a1e1nkauur1a7vpuphx",
	"x-rapidapi-host": "local-business-data.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())