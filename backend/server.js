const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'amber_db'
});

// Funzione che ripristina la quantità di tutte le birre a 10 unità
const resetQuantitaBirre = () => {
  const sqlReset = "UPDATE birre SET quantita = 10";
  db.query(sqlReset, (err, result) => {
    if (err) {
      console.error('Errore durante il reset automatico delle quantità:', err);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] Quantità delle birre ripristinate automaticamente a 10 unità!`);
    }
  });
};

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connesso al database amber_db con successo.');

  // 1. Reset immediato all'avvio del server backend
  resetQuantitaBirre();

  // 2. Timer ciclico: esegue il reset ogni 24 ore (86.400.000 millisecondi)
  const VENTIQUATTRO_ORE = 24 * 60 * 60 * 1000;
  setInterval(() => {
    console.log("Timer scattato: avvio il reset automatico delle 24 ore...");
    resetQuantitaBirre();
  }, VENTIQUATTRO_ORE);
});

// API per leggere il catalogo delle birre
app.get('/api/birre', (req, res) => {
  const sql = "SELECT * FROM birre";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// API per scalare la quantità dal database al momento dell'acquisto
app.post('/api/acquista', (req, res) => {
  const { id } = req.body;
  const sql = "UPDATE birre SET quantita = quantita - 1 WHERE id = ? AND quantita > 0";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Scorta aggiornata sul database" });
  });
});

app.listen(5000, () => {
  console.log("Server backend attivo sulla porta 5000");
});