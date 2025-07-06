import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Store, LogOut, User, Package, BarChart3, Settings } from 'lucide-react';

const ProductSearchApp = () => {
  // Stati principali
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, login, register, dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Dati simulati
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "TechStore Milano",
      email: "tech@milano.it",
      password: "demo123",
      description: "Elettronica e gadget",
      products: [
        { id: 1, name: "iPhone 15 Pro", price: 1199, category: "Smartphone" },
        { id: 2, name: "MacBook Air M2", price: 1299, category: "Laptop" },
        { id: 3, name: "AirPods Pro", price: 279, category: "Audio" }
      ]
    },
    {
      id: 2,
      name: "Fashion Boutique",
      email: "fashion@boutique.it",
      password: "demo123",
      description: "Abbigliamento di tendenza",
      products: [
        { id: 4, name: "Jeans Premium", price: 89, category: "Abbigliamento" },
        { id: 5, name: "Scarpe Sneakers", price: 120, category: "Calzature" },
        { id: 6, name: "Borsa Designer", price: 350, category: "Accessori" }
      ]
    },
    {
      id: 3,
      name: "Casa & Giardino",
      email: "casa@giardino.it", 
      password: "demo123",
      description: "Tutto per la casa",
      products: [
        { id: 7, name: "Aspirapolvere Robot", price: 299, category: "Elettrodomestici" },
        { id: 8, name: "Set Pentole", price: 159, category: "Cucina" },
        { id: 9, name: "Pianta Monstera", price: 45, category: "Piante" }
      ]
    }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', email: '', password: '', description: '' 
  });

  const searchRef = useRef(null);

  // API simulate
  const searchProducts = (term) => {
    if (!term.trim()) return [];
    
    const allProducts = stores.flatMap(store => 
      store.products.map(product => ({
        ...product,
        storeName: store.name,
        storeId: store.id
      }))
    );
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchProducts(term);
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleLogin = () => {
    const store = stores.find(s => 
      s.email === loginForm.email && s.password === loginForm.password
    );
    
    if (store) {
      setCurrentUser(store);
      setCurrentView('dashboard');
      setLoginForm({ email: '', password: '' });
    } else {
      alert('Credenziali non valide!');
    }
  };

  const handleRegister = () => {
    const newStore = {
      id: Date.now(),
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      description: registerForm.description,
      products: []
    };
    
    setStores([...stores, newStore]);
    setCurrentUser(newStore);
    setCurrentView('dashboard');
    setRegisterForm({ name: '', email: '', password: '', description: '' });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category || 'Generale'
    };
    
    const updatedStores = stores.map(store => 
      store.id === currentUser.id 
        ? { ...store, products: [...store.products, product] }
        : store
    );
    
    setStores(updatedStores);
    setCurrentUser({
      ...currentUser,
      products: [...currentUser.products, product]
    });
    setNewProduct({ name: '', price: '', category: '' });
  };

  const removeProduct = (productId) => {
    const updatedStores = stores.map(store => 
      store.id === currentUser.id 
        ? { ...store, products: store.products.filter(p => p.id !== productId) }
        : store
    );
    
    setStores(updatedStores);
    setCurrentUser({
      ...currentUser,
      products: currentUser.products.filter(p => p.id !== productId)
    });
  };

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Homepage stile Google
  const HomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-normal text-gray-700">Amacity</div>
        <button 
          onClick={() => setCurrentView('login')}
          className="text-blue-600 hover:underline text-sm"
        >
          Accedi come Negozio
        </button>
      </div>

      {/* Centro pagina stile Google */}
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-6xl font-light text-gray-700 mb-8">
          <span className="text-blue-500">Ama</span>
          <span className="text-red-500">city</span>
        </div>
        
        {/* Barra di ricerca */}
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
              placeholder="Cerca prodotti..."
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:shadow-md transition-shadow"
            />
          </div>
          
          {/* Dropdown risultati */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-10">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDropdown(false);
                  }}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.category}</div>
                  <div className="text-sm text-blue-600">€{product.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risultato selezionato */}
        {selectedProduct && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md w-full">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-600 mb-2">{selectedProduct.category}</p>
            <p className="text-2xl font-semibold text-green-600 mb-3">€{selectedProduct.price}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Store className="w-4 h-4 mr-1" />
              <span>Venduto da: {selectedProduct.storeName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-light text-gray-900">
          Accedi al tuo negozio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <button 
            onClick={() => setCurrentView('register')}
            className="text-blue-600 hover:text-blue-500"
          >
            Non hai un account? Registrati
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Accedi
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Account demo:</strong></p>
            <p>Email: tech@milano.it</p>
            <p>Password: demo123</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setCurrentView('home')}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Torna ad Amacity
          </button>
        </div>
      </div>
    </div>
  );

  // Register Page
  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-light text-gray-900">
          Registra il tuo negozio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <button 
            onClick={() => setCurrentView('login')}
            className="text-blue-600 hover:text-blue-500"
          >
            Hai già un account? Accedi
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Negozio</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrizione</label>
              <textarea
                value={registerForm.description}
                onChange={(e) => setRegisterForm({...registerForm, description: e.target.value})}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Registrati
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setCurrentView('home')}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Torna ad Amacity
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Negozio
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Dashboard */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{currentUser.name}</h1>
                <p className="text-sm text-gray-500">{currentUser.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-gray-600 hover:text-gray-900"
              >
                Vai alla ricerca
              </button>
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('home');
                }}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Esci
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Prodotti Totali
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {currentUser.products.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Valore Inventario
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        €{currentUser.products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Status
                      </dt>
                      <dd className="text-lg font-medium text-green-600">
                        Attivo
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Aggiungi Prodotto */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Aggiungi Nuovo Prodotto
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Prodotto</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prezzo (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="es. Elettronica, Abbigliamento..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={addProduct}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Prodotto
                  </button>
                </div>
              </div>
            </div>

            {/* Lista Prodotti */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  I Tuoi Prodotti ({currentUser.products.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {currentUser.products.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nessun prodotto ancora. Aggiungi il primo!
                    </p>
                  ) : (
                    currentUser.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-green-600">€{product.price}</span>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render principale
  return (
    <div className="min-h-screen">
      {currentView === 'home' && <HomePage />}
      {currentView === 'login' && <LoginPage />}
      {currentView === 'register' && <RegisterPage />}
      {currentView === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default ProductSearchApp;