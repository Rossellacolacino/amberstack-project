import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [birre, setBirre] = useState([]);
  const [carrello, setCarrello] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [datiSpedizione, setDatiSpedizione] = useState({ nome: '', indirizzo: '', citta: '', cellulare: '' });
  const [datiCarta, setDatiCarta] = useState({ numero: '', scadenza: '', cvc: '' });

  const caricaBirre = () => {
    fetch('http://localhost:5000/api/birre')
      .then(res => res.json())
      .then(data => setBirre(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    caricaBirre();
  }, []);

  const aggiungiAlCarrello = (birra) => {
    if (birra.quantita > 0) {
      setCarrello([...carrello, birra]);
      setBirre(birre.map(b => b.id === birra.id ? { ...b, quantita: b.quantita - 1 } : b));
    }
  };

  const incrementaQuantita = (id) => {
    const birraVetrina = birre.find(b => b.id === id);
    if (birraVetrina.quantita > 0) {
      setCarrello([...carrello, carrello.find(i => i.id === id)]);
      setBirre(birre.map(b => b.id === id ? { ...b, quantita: b.quantita - 1 } : b));
    }
  };

  const decrementaQuantita = (id) => {
    const index = carrello.findLastIndex(item => item.id === id);
    if (index !== -1) {
      const nuovoCarrello = [...carrello];
      nuovoCarrello.splice(index, 1);
      setCarrello(nuovoCarrello);
      setBirre(birre.map(b => b.id === id ? { ...b, quantita: b.quantita + 1 } : b));
    }
  };

  const completaOrdine = async (e) => {
    e.preventDefault();
    if (carrello.length === 0) {
      alert("Il carrello è vuoto!");
      return;
    }

    for (const item of carrello) {
      await fetch('http://localhost:5000/api/acquista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
    }
    alert(`Ordine inviato con successo! Grazie ${datiSpedizione.nome}. Le scorte sono state aggiornate.`);
    setCarrello([]);
    setMetodoPagamento('');
    setDatiCarta({ numero: '', scadenza: '', cvc: '' });
    caricaBirre();
  };

  // Funzione per scorrere fino alla sezione pagamento cliccando sul carrello
  const scorriAChiudi = () => {
    const elemento = document.getElementById('checkout-section');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totale = carrello.reduce((acc, b) => acc + parseFloat(b.prezzo), 0).toFixed(2);
  const carrelloRaggruppato = carrello.reduce((acc, item) => {
    const trovato = acc.find(i => i.id === item.id);
    trovato ? trovato.count += 1 : acc.push({ ...item, count: 1 });
    return acc;
  }, []);

  return (
    <div className="App">
      {/* ICONA DEL CARRELLO IN ALTO A DESTRA */}
      <div className="floating-cart" onClick={scorriAChiudi}>
        <span className="cart-icon">🛒</span>
        {carrello.length > 0 && <span className="cart-badge">{carrello.length}</span>}
      </div>

      <header className="shop-header">
        <h1>AMBERSTACK</h1>
        <p>L'eccellenza brassicola a portata di click</p>
      </header>

      {/* IMMAGINE DI COPERTINA SOTTO IL TITOLO */}
      <div className="shop-banner">
        <div className="banner-overlay">
          <h2>Selezioni Artigianali Esclusive</h2>
          <p>Dal produttore direttamente al tuo bicchiere</p>
        </div>
      </div>

      {/* VETRINA BIRRE */}
      {['Italia', 'Belgio', 'Germania', 'Regno Unito'].map(nazione => {
        const birreFiltrate = birre.filter(b => b.nazione.toLowerCase() === nazione.toLowerCase());
        if (birreFiltrate.length === 0) return null;
        return (
          <section key={nazione} className="nazione-section">
            <h2 className="nazione-title">{nazione}</h2>
            <div className="catalog">
              {birreFiltrate.map(birra => (
                <div key={birra.id} className={`beer-card ${birra.quantita <= 0 ? 'sold-out-card' : ''}`}>
                  <div className="beer-image-container">
                    <img src={birra.immagine} alt={birra.nome} className="beer-image" />
                  </div>
                  <div className="beer-info">
                    <h3>{birra.nome}</h3>
                    <div className="tag">{birra.stile}</div>
                    <div className="abbinamento-box">
                      <strong>🍴 Abbinamento:</strong>
                      <p>{birra.abbinamento || "Ottima con carni, formaggi o dessert."}</p>
                    </div>
                    <div className="card-footer">
                      <span className="price">€ {birra.prezzo}</span>
                      <span className={`stock ${birra.quantita < 5 ? 'low-stock' : ''}`}>Disp: {birra.quantita}</span>
                    </div>
                    <button className="buy-btn" onClick={() => aggiungiAlCarrello(birra)} disabled={birra.quantita <= 0}>
                      {birra.quantita > 0 ? "Aggiungi al carrello" : "Esaurita"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* SEZIONE PAGAMENTO FISSA IN FONDO */}
      <footer id="checkout-section" className="checkout-section">
        <div className="checkout-container">
          <h2>Riepilogo & Pagamento</h2>
          
          <div className="checkout-grid">
            {/* Riepilogo prodotti nel carrello */}
            <div className="checkout-summary">
              <h3>I tuoi articoli ({carrello.length})</h3>
              {carrello.length === 0 ? (
                <p className="empty-msg">Il carrello è vuoto. Scegli le tue birre in vetrina!</p>
              ) : (
                <div className="cart-items-list">
                  {carrelloRaggruppato.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <strong>{item.nome}</strong>
                        <span>€ {(item.prezzo * item.count).toFixed(2)}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => decrementaQuantita(item.id)}>-</button>
                        <span>{item.count}</span>
                        <button onClick={() => incrementaQuantita(item.id)}>+</button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total-box">
                    <strong>Totale Complessivo:</strong>
                    <span className="total-amount">€ {totale}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form dei Dati e di Scelta Pagamento */}
            <div className="checkout-form-box">
              <h3>Dati di Spedizione</h3>
              <form onSubmit={completaOrdine}>
                <div className="form-fields">
                  <input type="text" placeholder="Nome e Cognome" required onChange={(e) => setDatiSpedizione({...datiSpedizione, nome: e.target.value})} />
                  <input type="text" placeholder="Indirizzo di Consegna" required onChange={(e) => setDatiSpedizione({...datiSpedizione, indirizzo: e.target.value})} />
                  <input type="text" placeholder="Città" required onChange={(e) => setDatiSpedizione({...datiSpedizione, citta: e.target.value})} />
                  <input type="text" placeholder="Numero di Cellulare" required onChange={(e) => setDatiSpedizione({...datiSpedizione, cellulare: e.target.value})} />
                </div>

                <div className="payment-methods">
                  <h4>Metodo di Pagamento:</h4>
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="pay" value="Carta" required onChange={(e) => setMetodoPagamento(e.target.value)} />
                      💳 Carta di Credito / Debito
                    </label>
                    <label>
                      <input type="radio" name="pay" value="Contanti" required onChange={(e) => setMetodoPagamento(e.target.value)} />
                      🚚 Contanti alla consegna
                    </label>
                  </div>
                </div>

                {/* COMPOSIZIONE DATI CARTA SE SELEZIONATA */}
                {metodoPagamento === 'Carta' && (
                  <div className="card-details-fields">
                    <h4>Dati della Carta:</h4>
                    <input type="text" placeholder="Numero della Carta (16 cifre)" maxLength="16" required onChange={(e) => setDatiCarta({...datiCarta, numero: e.target.value})} />
                    <div className="card-inline-fields">
                      <input type="text" placeholder="MM/AA" maxLength="5" required onChange={(e) => setDatiCarta({...datiCarta, scadenza: e.target.value})} />
                      <input type="text" placeholder="CVC" maxLength="3" required onChange={(e) => setDatiCarta({...datiCarta, cvc: e.target.value})} />
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-confirm-final" disabled={carrello.length === 0}>
                  CONFERMA ORDINE (€ {totale})
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;