# AmberStack — Craft Beer E-Commerce Platform

AmberStack è un'applicazione web Full-Stack progettata per la consultazione, vendita e gestione di un catalogo di birre artigianali internazionali.

---

## Indice
- [Funzionalità Principali](#funzionalità-principali)
- [Architettura e Stack Tecnologico](#architettura-e-stack-tecnologico)
- [Struttura del Progetto](#struttura-del-progetto)
- [Prerequisiti di Sistema](#prerequisiti-di-sistema)
- [Guida all'Avvio Locale](#guida-allavvio-locale)
- [Scelte Implementative e Soluzioni Adottate](#scelte-implementative-e-soluzioni-adottate)

---

## Funzionalità Principali
- **Catalogo Dinamico:** navigazione prodotti con filtri interattivi per nazione e tipologia.
- **Carrello Dinamico:** aggiunta, rimozione e calcolo in tempo reale di quantitativi e totale d'ordine.
- **Checkout Integrato:** acquisizione dati di fatturazione/spedizione e invio sicuro della transazione.
- **Sincronizzazione Giacenze:** decremento automatico e tracciamento dello stock in tempo reale su database relazionale.

---

## Architettura e Stack Tecnologico
L'architettura segue il pattern Client-Server disaccoppiato:
- **Frontend:** React.js, JSX, CSS3 (gestione modulare dei componenti e dello stato applicativo).
- **Backend:** Node.js, Express.js (esposizione di API RESTful per catalogo e gestione ordini, abilitazione CORS).
- **Database:** MySQL (modellazione delle entità prodotti, ordini e scorte di magazzino).

---

## Struttura del Progetto
```text
amberstack-project/
├── backend/            # Server REST API Node.js / Express
│   ├── server.js       # Logica del server e connessione al DB
│   └── package.json    # Dipendenze backend
├── frontend/           # Client Single Page Application React
│   ├── src/            # Componenti, logica UI e fogli di stile
│   ├── public/         # Asset statici (immagini catalogo, icone)
│   └── package.json    # Dipendenze frontend
└── .gitignore          # Esclusione dipendenze (node_modules) e file di ambiente
