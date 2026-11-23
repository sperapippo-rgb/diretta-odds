# Diretta Odds — prototipo PWA

Interfaccia mobile installabile con:
- selezione della data;
- quota minima e massima facoltative (nessun minimo preimpostato);
- ricerca squadra/campionato;
- filtro per mercato;
- importazione locale di dati JSON o CSV;
- funzionamento offline della sola interfaccia.

## Stato importante: collegamento Diretta.it
Questo pacchetto **non contiene un collegamento automatico a Diretta.it** e non simula quote reali. Prima di automatizzare il recupero occorre un feed/API o un'autorizzazione esplicita del titolare dei dati. Le condizioni pubblicate da Livesport limitano lo scraping e l'uso automatizzato non autorizzato; la FAQ Diretta chiarisce inoltre che mostra soltanto i mercati più popolari e che la copertura dipende dai dati forniti dai bookmaker.

## Formato JSON supportato
```json
[
  {
    "date": "2026-11-23",
    "time": "20:45",
    "league": "Serie A",
    "home": "Squadra A",
    "away": "Squadra B",
    "market": "1X2",
    "selection": "1",
    "odds": 1.85,
    "bookmaker": "Operatore"
  }
]
```

Campi equivalenti CSV: `date,time,league,home,away,market,selection,odds,bookmaker`.

## Pubblicazione gratuita su GitHub Pages
1. Crea un repository GitHub.
2. Carica tutti i file mantenendo la struttura.
3. In Settings → Pages scegli Deploy from a branch e seleziona `main` / root.
4. Apri l'indirizzo Pages da Chrome Android e scegli “Aggiungi a schermata Home”.

## Prossimo passaggio
Ottenere un accesso dati autorizzato da Diretta/Livesport o un feed ufficiale compatibile. Senza questo passaggio non è corretto promettere aggiornamento automatico delle quote.
