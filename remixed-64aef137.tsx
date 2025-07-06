import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Plus, Store, LogOut, User, Package, BarChart3, Settings, Loader2, Bell, TrendingUp, X } from 'lucide-react';

const ProductSearchApp = () => {
  // Stati principali
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, login, register, dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCache, setSearchCache] = useState({});
  
  // Nuovo: Sistema di suggerimenti
  const [notFoundSearches, setNotFoundSearches] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  
  // Categorie predefinite per mapping intelligente
  const categoryMappings = {
    'cibo|food|mangiare|pasta|pane|formaggio|salume|dolce|gelato|frutta|verdura|carne|pesce': 'Alimentari',
    'vino|birra|acqua|bevanda|drink|caffè|tè|succo': 'Bevande',
    'profumo|cosmetico|crema|trucco|makeup|shampoo|balsamo|smalto|rossetto': 'Bellezza',
    'martello|cacciavite|chiave|vite|chiodo|pittura|vernice|rubinetto|tubo|serratura': 'Ferramenta',
    'casa|arredamento|mobile|lampada|decorazione|cucina|bagno|camera': 'Casa',
    'computer|telefono|tablet|elettronica|cavo|caricatore|cuffie|speaker': 'Tecnologia',
    'libro|romanzo|saggio|fumetto|rivista|quaderno|penna|matita': 'Libri e Cultura',
    'maglietta|pantaloni|scarpe|giacca|vestito|borsa|cappello|cintura': 'Abbigliamento',
    'sport|palestra|calcio|tennis|bici|corsa|nuoto|yoga': 'Sport',
    'default': 'Generale'
  };

  // Funzione per determinare la categoria da una ricerca
  const determineCategoryFromSearch = (searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase();
    for (const [keywords, category] of Object.entries(categoryMappings)) {
      if (keywords !== 'default') {
        const keywordList = keywords.split('|');
        if (keywordList.some(keyword => lowerSearch.includes(keyword))) {
          return category;
        }
      }
    }
    return 'Generale';
  };

  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Ferramenta Mazzotti",
      email: "ferramenta@mazzotti.it",
      password: "demo123",
      description: "Ferramenta tradizionale dal 1952",
      categories: ["Ferramenta", "Casa", "Generale"],
      products: [
        { id: 1, name: "Martello carpentiere 500g", price: 18.50, category: "Utensili" },
        { id: 2, name: "Cacciavite set 12 pezzi", price: 25.90, category: "Utensili" },
        { id: 3, name: "Serratura Yale 3 chiavi", price: 45.00, category: "Sicurezza" },
        { id: 4, name: "Vernice murale bianca 10L", price: 32.50, category: "Pitture" },
        { id: 5, name: "Chiodi acciaio 100pz", price: 8.90, category: "Minuteria" },
        { id: 6, name: "Metro pieghevole 2m", price: 12.00, category: "Utensili" },
        { id: 7, name: "Colla universale tube", price: 4.50, category: "Adesivi" },
        { id: 8, name: "Lampada LED E27 10W", price: 7.80, category: "Elettrico" },
        { id: 9, name: "Rubinetto miscelatore cucina", price: 89.00, category: "Idraulica" },
        { id: 10, name: "Catena antifurto bici", price: 28.50, category: "Sicurezza" },
        { id: 11, name: "Guanti da lavoro pelle", price: 15.90, category: "Protezione" },
        { id: 12, name: "Sega a mano 50cm", price: 22.50, category: "Utensili" },
        { id: 13, name: "Viti legno 4x40 100pz", price: 6.80, category: "Minuteria" },
        { id: 14, name: "Nastro isolante nero", price: 3.20, category: "Elettrico" },
        { id: 15, name: "Pennello piatto 5cm", price: 9.50, category: "Pitture" },
        { id: 16, name: "Lucchetto ottone 40mm", price: 16.50, category: "Sicurezza" },
        { id: 17, name: "Silicone trasparente", price: 5.90, category: "Adesivi" },
        { id: 18, name: "Interruttore luce", price: 8.50, category: "Elettrico" },
        { id: 19, name: "Tubo flessibile 15m", price: 35.00, category: "Giardino" },
        { id: 20, name: "Chiave inglese 25cm", price: 19.90, category: "Utensili" }
      ]
    },
    {
      id: 2,
      name: "Profumeria Elisir",
      email: "elisir@profumeria.it",
      password: "demo123",
      description: "Profumi e cosmetici di qualità",
      categories: ["Bellezza", "Cosmetici", "Generale"],
      products: [
        { id: 21, name: "Profumo Chanel N°5 50ml", price: 89.00, category: "Profumi" },
        { id: 22, name: "Crema viso L'Oreal", price: 24.90, category: "Cosmetici" },
        { id: 23, name: "Rossetto MAC Ruby Woo", price: 32.00, category: "Make-up" },
        { id: 24, name: "Shampoo Kerastase 250ml", price: 28.50, category: "Capelli" },
        { id: 25, name: "Eau de toilette Hugo Boss", price: 65.00, category: "Profumi" },
        { id: 26, name: "Maschera viso purificante", price: 18.90, category: "Cosmetici" },
        { id: 27, name: "Smalto OPI rosso", price: 15.50, category: "Unghie" },
        { id: 28, name: "Balsamo riparatore capelli", price: 22.00, category: "Capelli" },
        { id: 29, name: "Fondotinta Maybelline", price: 16.90, category: "Make-up" },
        { id: 30, name: "Profumo Armani Code", price: 75.00, category: "Profumi" },
        { id: 31, name: "Crema mani Nivea", price: 8.50, category: "Cosmetici" },
        { id: 32, name: "Matita occhi nera", price: 12.50, category: "Make-up" },
        { id: 33, name: "Olio argan puro 30ml", price: 35.00, category: "Capelli" },
        { id: 34, name: "Profumo Dolce Gabbana", price: 68.50, category: "Profumi" },
        { id: 35, name: "Siero vitamina C", price: 42.00, category: "Cosmetici" },
        { id: 36, name: "Mascara waterproof", price: 19.90, category: "Make-up" },
        { id: 37, name: "Shampoo secco Batiste", price: 8.90, category: "Capelli" },
        { id: 38, name: "Profumo Versace Dylan", price: 59.00, category: "Profumi" },
        { id: 39, name: "Contorno occhi anti-età", price: 38.50, category: "Cosmetici" },
        { id: 40, name: "Set pennelli trucco", price: 45.00, category: "Make-up" }
      ]
    },
    {
      id: 3,
      name: "Libreria Dante",
      email: "dante@libreria.it",
      password: "demo123",
      description: "Libri, cultura e passione dal 1978",
      categories: ["Libri e Cultura", "Cartoleria", "Generale"],
      products: [
        { id: 41, name: "Elena Ferrante - L'amica geniale", price: 18.50, category: "Narrativa" },
        { id: 42, name: "Roberto Saviano - Gomorra", price: 16.00, category: "Saggistica" },
        { id: 43, name: "Quaderno Moleskine A5", price: 24.90, category: "Cartoleria" },
        { id: 44, name: "Dante - Divina Commedia", price: 12.50, category: "Classici" },
        { id: 45, name: "Penna Parker blu", price: 35.00, category: "Scrittura" },
        { id: 46, name: "Atlas geografico mondiale", price: 28.90, category: "Geografia" },
        { id: 47, name: "Agatha Christie - Orient Express", price: 14.50, category: "Gialli" },
        { id: 48, name: "Calendario 2025 da tavolo", price: 8.90, category: "Calendari" },
        { id: 49, name: "Dizionario italiano Zingarelli", price: 65.00, category: "Dizionari" },
        { id: 50, name: "Harry Potter - Pietra filosofale", price: 16.90, category: "Fantasy" },
        { id: 51, name: "Matite colorate Faber 24pz", price: 18.50, category: "Cartoleria" },
        { id: 52, name: "Umberto Eco - Nome della rosa", price: 19.50, category: "Narrativa" },
        { id: 53, name: "Agenda 2025 giornaliera", price: 22.00, category: "Agende" },
        { id: 54, name: "Atlante storico DeAgostini", price: 35.50, category: "Storia" },
        { id: 55, name: "Stephen King - IT", price: 21.90, category: "Horror" },
        { id: 56, name: "Evidenziatori Stabilo 4 colori", price: 6.50, category: "Cartoleria" },
        { id: 57, name: "Italo Calvino - Città invisibili", price: 15.50, category: "Narrativa" },
        { id: 58, name: "Blocco notes spiralato A4", price: 4.90, category: "Cartoleria" },
        { id: 59, name: "Enciclopedia Treccani vol.1", price: 89.00, category: "Enciclopedie" },
        { id: 60, name: "Segnalibri magnetici set 6", price: 8.50, category: "Accessori" }
      ]
    },
    {
      id: 4,
      name: "Gastronomia Gourmet",
      email: "gourmet@gastronomia.it",
      password: "demo123",
      description: "Specialità alimentari e prodotti tipici",
      categories: ["Alimentari", "Bevande", "Generale"],
      products: [
        { id: 61, name: "Parmigiano Reggiano 24 mesi 1kg", price: 32.50, category: "Formaggi" },
        { id: 62, name: "Prosciutto Parma DOP 100g", price: 8.90, category: "Salumi" },
        { id: 63, name: "Olio extravergine Taggiasca 500ml", price: 24.50, category: "Oli" },
        { id: 64, name: "Tartufo nero estivo 50g", price: 45.00, category: "Tartufi" },
        { id: 65, name: "Miele millefiori 250g", price: 12.50, category: "Dolci" },
        { id: 66, name: "Aceto balsamico Modena IGP", price: 18.90, category: "Condimenti" },
        { id: 67, name: "Salame piccante calabrese", price: 15.50, category: "Salumi" },
        { id: 68, name: "Conserva pomodori San Marzano", price: 4.80, category: "Conserve" },
        { id: 69, name: "Pasta fresca tortellini 500g", price: 8.50, category: "Pasta" },
        { id: 70, name: "Gorgonzola DOP dolce 200g", price: 6.90, category: "Formaggi" },
        { id: 71, name: "Bresaola Valtellina IGP 100g", price: 12.50, category: "Salumi" },
        { id: 72, name: "Confettura albicocche bio 340g", price: 6.50, category: "Confetture" },
        { id: 73, name: "Pasta di pistacchio 190g", price: 18.50, category: "Creme" },
        { id: 74, name: "Riso Carnaroli 1kg", price: 5.90, category: "Cereali" },
        { id: 75, name: "Mortadella Bologna IGP 200g", price: 7.50, category: "Salumi" },
        { id: 76, name: "Pesto genovese DOP 180g", price: 8.90, category: "Sughi" },
        { id: 77, name: "Pecorino Romano 300g", price: 14.50, category: "Formaggi" },
        { id: 78, name: "Olive taggiasche denocciolate", price: 9.50, category: "Antipasti" },
        { id: 79, name: "Nduja calabrese piccante 200g", price: 11.50, category: "Salumi" },
        { id: 80, name: "Caffè arabica macinato 250g", price: 15.90, category: "Caffè" }
      ]
    },
    {
      id: 5,
      name: "Gelateria Dolce Freddo",
      email: "dolcefreddo@gelateria.it",
      password: "demo123",
      description: "Gelati artigianali e granite",
      categories: ["Alimentari", "Dolci", "Generale"],
      products: [
        { id: 81, name: "Coppetta gelato 3 gusti", price: 4.50, category: "Coppette" },
        { id: 82, name: "Cono grande 2 gusti", price: 3.50, category: "Coni" },
        { id: 83, name: "Torta gelato 8 persone", price: 28.50, category: "Torte gelato" },
        { id: 84, name: "Granita siciliana limone", price: 3.50, category: "Granite" },
        { id: 85, name: "Gelato take away 500ml", price: 8.50, category: "Take away" },
        { id: 86, name: "Affogato al caffè", price: 4.50, category: "Specialità" },
        { id: 87, name: "Sorbetto frutta fresca", price: 3.50, category: "Sorbetti" },
        { id: 88, name: "Semifreddo pistacchio", price: 18.50, category: "Semifreddi" },
        { id: 89, name: "Milkshake banana", price: 5.50, category: "Frappè" },
        { id: 90, name: "Gelato stick cioccolato", price: 2.50, category: "Stecchi" },
        { id: 91, name: "Coppa stracciatella panna", price: 5.50, category: "Coppe" },
        { id: 92, name: "Granita brioche siciliana", price: 4.50, category: "Granite con brioche" },
        { id: 93, name: "Gelato senza lattosio", price: 4.50, category: "Intolleranze" },
        { id: 94, name: "Sundae cioccolato caldo", price: 6.50, category: "Sundae" },
        { id: 95, name: "Granita multigusto", price: 4.50, category: "Granite speciali" },
        { id: 96, name: "Gelato biologico 3 gusti", price: 5.50, category: "Biologici" },
        { id: 97, name: "Cassata gelato siciliana", price: 22.50, category: "Dolci gelato" },
        { id: 98, name: "Frullato di frutta fresca", price: 4.50, category: "Frullati" },
        { id: 99, name: "Gelato vegano 2 gusti", price: 4.50, category: "Vegani" },
        { id: 100, name: "Coppa gelato Nutella", price: 6.50, category: "Coppe speciali" }
      ]
    }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', description: ''
  });

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Ottimizzazione: memorizza tutti i prodotti con indice pre-calcolato
  const allProducts = useMemo(() => {
    return stores.flatMap(store => 
      store.products.map(product => ({
        ...product,
        storeName: store.name,
        storeId: store.id,
        searchText: `${product.name} ${product.category}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      }))
    );
  }, [stores]);

  // Funzione per trovare negozi compatibili con una categoria
  const getStoresForCategory = useCallback((category) => {
    return stores.filter(store => 
      store.categories.includes(category) || 
      store.categories.includes('Generale')
    );
  }, [stores]);

  // API simulate ultra-ottimizzata con cache e pre-filtro
  const searchProducts = useCallback((term) => {
    if (!term.trim()) return [];
    
    const normalizedTerm = term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Controlla cache
    if (searchCache[normalizedTerm]) {
      return searchCache[normalizedTerm];
    }
    
    // Ricerca ottimizzata con pre-filtro
    const results = [];
    const termWords = normalizedTerm.split(' ').filter(w => w.length > 1);
    
    for (const product of allProducts) {
      let score = 0;
      
      // Calcolo score per rilevanza
      for (const word of termWords) {
        if (product.searchText.includes(word)) {
          score += product.searchText.startsWith(word) ? 3 : 1; // Bonus per match iniziale
        }
      }
      
      if (score > 0) {
        results.push({ ...product, relevanceScore: score });
      }
      
      // Limite performance: max 10 risultati
      if (results.length >= 10) break;
    }
    
    // Ordina per rilevanza
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const finalResults = results.slice(0, 8);
    
    // Salva in cache
    setSearchCache(prev => ({
      ...prev,
      [normalizedTerm]: finalResults
    }));
    
    return finalResults;
  }, [allProducts, searchCache]);

  // Gestisci ricerche non trovate
  const handleNotFoundSearch = useCallback((term) => {
    if (!term.trim() || term.length < 3) return;
    
    // Evita duplicati
    const existingSearch = notFoundSearches.find(search => 
      search.term.toLowerCase() === term.toLowerCase()
    );
    
    if (existingSearch) {
      // Incrementa contatore
      setNotFoundSearches(prev => 
        prev.map(search => 
          search.id === existingSearch.id 
            ? { ...search, count: search.count + 1, lastSearched: new Date() }
            : search
        )
      );
    } else {
      // Nuova ricerca non trovata
      const category = determineCategoryFromSearch(term);
      const targetStores = getStoresForCategory(category);
      
      const newSearch = {
        id: Date.now(),
        term: term.trim(),
        category,
        count: 1,
        lastSearched: new Date(),
        targetStores: targetStores.map(store => store.id)
      };
      
      setNotFoundSearches(prev => [...prev, newSearch]);
      
      // Aggiorna suggerimenti per i negozi target
      targetStores.forEach(store => {
        setSuggestions(prev => ({
          ...prev,
          [store.id]: [
            ...(prev[store.id] || []),
            { ...newSearch, suggested: false }
          ].slice(-10) // Mantieni solo ultimi 10 suggerimenti
        }));
      });
    }
  }, [notFoundSearches, getStoresForCategory]);

  // Debounced search ultra-ottimizzato
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Debounce ridotto per velocità
    searchTimeoutRef.current = setTimeout(() => {
      const results = searchProducts(term);
      setSearchResults(results);
      setShowDropdown(true);
      setIsSearching(false);
      
      // Se nessun risultato, registra come ricerca non trovata
      if (results.length === 0) {
        handleNotFoundSearch(term);
      }
    }, 100); // Ridotto da 150ms a 100ms
  }, [searchProducts, handleNotFoundSearch]);

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
      categories: ['Generale'],
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

  // Gestione suggerimenti
  const markSuggestionAsRead = (suggestionId) => {
    setSuggestions(prev => ({
      ...prev,
      [currentUser.id]: prev[currentUser.id]?.map(s => 
        s.id === suggestionId ? { ...s, suggested: true } : s
      ) || []
    }));
  };

  const dismissSuggestion = (suggestionId) => {
    setSuggestions(prev => ({
      ...prev,
      [currentUser.id]: prev[currentUser.id]?.filter(s => s.id !== suggestionId) || []
    }));
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Homepage ultra-veloce
  const HomePage = () => (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-normal text-gray-700">Amacity</div>
        <button 
          onClick={() => setCurrentView('login')}
          className="text-blue-600 hover:underline text-sm"
        >
          Accedi come Negozio
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-6xl font-light text-gray-700 mb-8">
          <span className="text-blue-500">Ama</span>
          <span className="text-red-500">city</span>
        </div>
        
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
            )}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
              placeholder="Cerca prodotti nei negozi di Ravenna..."
              className="w-full pl-12 pr-12 py-3 text-lg border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:shadow-md transition-shadow"
            />
          </div>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-10">
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {searchResults.length} risultat{searchResults.length === 1 ? 'o' : 'i'} 
                    {searchResults.length === 8 ? ' (migliori match)' : ''}
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDropdown(false);
                      }}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.category}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm font-semibold text-green-600">€{product.price}</div>
                        <div className="text-xs text-blue-600">{product.storeName}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                searchTerm && !isSearching && (
                  <div className="p-4 text-center">
                    <div className="text-gray-500 mb-2">
                      Nessun prodotto trovato per "{searchTerm}"
                    </div>
                    <div className="text-xs text-blue-600">
                      ✨ Suggerimento inviato ai negozi compatibili
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {!searchTerm && (
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500 mb-2">Prova a cercare:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {['gelato', 'olio', 'libro', 'profumo', 'martello', 'parmigiano'].map(term => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

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

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🏪 {stores.length} negozi locali • 📦 100 prodotti disponibili</p>
          {notFoundSearches.length > 0 && (
            <p className="mt-1 text-xs text-blue-600">
              💡 {notFoundSearches.length} suggerimenti inviati ai negozi
            </p>
          )}
        </div>
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
            <p>Email: ferramenta@mazzotti.it</p>
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

  // Dashboard con Suggerimenti
  const Dashboard = () => {
    const userSuggestions = suggestions[currentUser?.id] || [];
    const unreadSuggestions = userSuggestions.filter(s => !s.suggested);
    
    return (
      <div className="min-h-screen bg-gray-50">
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
                {unreadSuggestions.length > 0 && (
                  <div className="flex items-center text-blue-600">
                    <Bell className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{unreadSuggestions.length}</span>
                  </div>
                )}
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
            {/* Suggerimenti per prodotti richiesti */}
            {unreadSuggestions.length > 0 && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-blue-900">
                    Prodotti Richiesti dai Clienti
                  </h3>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {unreadSuggestions.length} nuov{unreadSuggestions.length === 1 ? 'o' : 'i'}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  I clienti hanno cercato questi prodotti che non sono ancora disponibili nel tuo inventario:
                </p>
                <div className="space-y-3">
                  {unreadSuggestions.slice(0, 5).map((suggestion) => (
                    <div key={suggestion.id} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">"{suggestion.term}"</h4>
                          <p className="text-sm text-gray-600">Categoria suggerita: {suggestion.category}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Cercato {suggestion.count} volt{suggestion.count === 1 ? 'a' : 'e'} • 
                            Ultimo: {suggestion.lastSearched.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setNewProduct({
                                name: suggestion.term,
                                price: '',
                                category: suggestion.category
                              });
                              markSuggestionAsRead(suggestion.id);
                            }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Aggiungi
                          </button>
                          <button
                            onClick={() => dismissSuggestion(suggestion.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      <Bell className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Suggerimenti
                        </dt>
                        <dd className="text-lg font-medium text-blue-600">
                          {unreadSuggestions.length}
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
  };

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