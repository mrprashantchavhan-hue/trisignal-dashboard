const express = require('express');
const { default: YahooFinance } = require('yahoo-finance2');
const yahooFinance = new YahooFinance();
const cors = require('cors');
const path = require('path');
const Sentiment = require('sentiment');

const app = express();
const sentiment = new Sentiment();

sentiment.registerLanguage('en', {
  labels: {
    'bullish': 3, 'bearish': -3, 'surge': 2, 'surges': 2, 'slump': -2, 'crash': -3,
    'buyback': 2, 'dividend': 1, 'lawsuit': -2, 'plunge': -2, 'plunges': -2, 'rally': 2,
    'rallies': 2, 'breakout': 2, 'outperform': 2, 'underperform': -2, 'downgrade': -2,
    'upgrade': 2, 'soar': 2, 'soars': 2, 'tumble': -2, 'tumbles': -2, 'record': 1
  }
});
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const STOCKS = [
  // Nifty 50
  {s:'ADANIENT', n:'Adani Enterprises', sec:'Conglomerate'},
  {s:'ADANIPORTS', n:'Adani Ports', sec:'Infra'},
  {s:'RELIANCE', n:'Reliance Industries', sec:'Energy'},
  {s:'ONGC', n:'ONGC', sec:'Energy'},
  {s:'BPCL', n:'BPCL', sec:'Energy'},
  {s:'IOC', n:'Indian Oil Corp', sec:'Energy'},
  {s:'HDFCBANK', n:'HDFC Bank', sec:'Banking'},
  {s:'ICICIBANK', n:'ICICI Bank', sec:'Banking'},
  {s:'SBIN', n:'State Bank of India', sec:'Banking'},
  {s:'AXISBANK', n:'Axis Bank', sec:'Banking'},
  {s:'KOTAKBANK', n:'Kotak Mahindra Bank', sec:'Banking'},
  {s:'INDUSINDBK', n:'IndusInd Bank', sec:'Banking'},
  {s:'BAJFINANCE', n:'Bajaj Finance', sec:'NBFC'},
  {s:'BAJAJFINSV', n:'Bajaj Finserv', sec:'NBFC'},
  {s:'SHRIRAMFIN', n:'Shriram Finance', sec:'NBFC'},
  {s:'TCS', n:'TCS', sec:'IT'},
  {s:'INFY', n:'Infosys', sec:'IT'},
  {s:'WIPRO', n:'Wipro', sec:'IT'},
  {s:'HCLTECH', n:'HCL Technologies', sec:'IT'},
  {s:'TECHM', n:'Tech Mahindra', sec:'IT'},
  {s:'LTIM', ys:'LTIM.NS', n:'LTIMindtree', sec:'IT'},
  {s:'MARUTI', n:'Maruti Suzuki', sec:'Auto'},
  {s:'TATAMOTORS', ys:'TMCV.NS', n:'Tata Motors', sec:'Auto'},
  {s:'M&M', n:'Mahindra & Mahindra', sec:'Auto'},
  {s:'HEROMOTOCO', n:'Hero MotoCorp', sec:'Auto'},
  {s:'EICHERMOT', n:'Eicher Motors', sec:'Auto'},
  {s:'BAJAJ-AUTO', n:'Bajaj Auto', sec:'Auto'},
  {s:'HINDUNILVR', n:'Hindustan Unilever', sec:'FMCG'},
  {s:'NESTLEIND', n:'Nestle India', sec:'FMCG'},
  {s:'BRITANNIA', n:'Britannia', sec:'FMCG'},
  {s:'TATACONSUM', n:'Tata Consumer', sec:'FMCG'},
  {s:'SUNPHARMA', n:'Sun Pharma', sec:'Pharma'},
  {s:'DRREDDY', n:'Dr Reddys Labs', sec:'Pharma'},
  {s:'CIPLA', n:'Cipla', sec:'Pharma'},
  {s:'DIVISLAB', n:'Divis Labs', sec:'Pharma'},
  {s:'APOLLOHOSP', n:'Apollo Hospitals', sec:'Healthcare'},
  {s:'TATASTEEL', n:'Tata Steel', sec:'Metals'},
  {s:'JSWSTEEL', n:'JSW Steel', sec:'Metals'},
  {s:'HINDALCO', n:'Hindalco', sec:'Metals'},
  {s:'COALINDIA', n:'Coal India', sec:'Metals'},
  {s:'LT', n:'Larsen & Toubro', sec:'Infra'},
  {s:'NTPC', n:'NTPC', sec:'Power'},
  {s:'POWERGRID', n:'Power Grid Corp', sec:'Power'},
  {s:'ASIANPAINT', n:'Asian Paints', sec:'Consumer'},
  {s:'TITAN', n:'Titan Company', sec:'Consumer'},
  {s:'TRENT', n:'Trent', sec:'Consumer'},
  {s:'ULTRACEMCO', n:'UltraTech Cement', sec:'Cement'},
  {s:'GRASIM', n:'Grasim Industries', sec:'Cement'},
  {s:'BHARTIARTL', n:'Bharti Airtel', sec:'Telecom'},
  {s:'HDFCLIFE', n:'HDFC Life Insurance', sec:'Insurance'},
  
  // Expanded F&O Coverage (High Volume / Liquidity)
  {s:'ZOMATO', ys:'ETERNAL.NS', n:'Zomato (Eternal)', sec:'Consumer'},
  {s:'HAL', n:'Hindustan Aeronautics', sec:'Defense'},
  {s:'BEL', n:'Bharat Electronics', sec:'Defense'},
  {s:'BDL', n:'Bharat Dynamics', sec:'Defense'},
  {s:'BHEL', n:'Bharat Heavy Electricals', sec:'Power'},
  {s:'IRCTC', n:'IRCTC', sec:'Consumer'},
  {s:'DIXON', n:'Dixon Tech', sec:'Electronics'},
  {s:'POLYCAB', n:'Polycab', sec:'Infra'},
  {s:'HAVELLS', n:'Havells', sec:'Infra'},
  {s:'CROMPTON', n:'Crompton', sec:'Consumer'},
  {s:'DLF', n:'DLF', sec:'Real Estate'},
  {s:'GODREJPROP', n:'Godrej Properties', sec:'Real Estate'},
  {s:'OBEROIRLTY', n:'Oberoi Realty', sec:'Real Estate'},
  {s:'PRESTIGE', n:'Prestige Estates', sec:'Real Estate'},
  {s:'PAGEIND', n:'Page Industries', sec:'Consumer'},
  {s:'BATAINDIA', n:'Bata India', sec:'Consumer'},
  {s:'JUBLFOOD', n:'Jubilant FoodWorks', sec:'Consumer'},
  {s:'PVRINOX', n:'PVR INOX', sec:'Consumer'},
  {s:'PIDILITIND', n:'Pidilite', sec:'Chemicals'},
  {s:'SRF', n:'SRF', sec:'Chemicals'},
  {s:'TATACHEM', n:'Tata Chemicals', sec:'Chemicals'},
  {s:'DEEPAKNTR', n:'Deepak Nitrite', sec:'Chemicals'},
  {s:'AARTIIND', n:'Aarti Industries', sec:'Chemicals'},
  {s:'PIIND', n:'PI Industries', sec:'Chemicals'},
  {s:'CHAMBLFERT', n:'Chambal Fertilisers', sec:'Chemicals'},
  {s:'GNFC', n:'GNFC', sec:'Chemicals'},
  {s:'PNB', n:'Punjab National Bank', sec:'Banking'},
  {s:'BANKBARODA', n:'Bank of Baroda', sec:'Banking'},
  {s:'CANBK', n:'Canara Bank', sec:'Banking'},
  {s:'IDFCFIRSTB', n:'IDFC First Bank', sec:'Banking'},
  {s:'FEDERALBNK', n:'Federal Bank', sec:'Banking'},
  {s:'AUBANK', n:'AU Small Finance', sec:'Banking'},
  {s:'BANDHANBNK', n:'Bandhan Bank', sec:'Banking'},
  {s:'RBLBANK', n:'RBL Bank', sec:'Banking'},
  {s:'CUB', n:'City Union Bank', sec:'Banking'},
  {s:'CHOLAFIN', n:'Chola Finance', sec:'NBFC'},
  {s:'MUTHOOTFIN', n:'Muthoot Finance', sec:'NBFC'},
  {s:'MANAPPURAM', n:'Manappuram Finance', sec:'NBFC'},
  {s:'M&MFIN', n:'M&M Financial', sec:'NBFC'},
  {s:'L&TFH', ys:'LTF.NS', n:'L&T Finance', sec:'NBFC'},
  {s:'LICHSGFIN', n:'LIC Housing', sec:'NBFC'},
  {s:'RECLTD', n:'REC Ltd', sec:'Power'},
  {s:'PFC', n:'Power Finance Corp', sec:'Power'},
  {s:'SBICARD', n:'SBI Cards', sec:'NBFC'},
  {s:'SBILIFE', n:'SBI Life', sec:'Insurance'},
  {s:'ICICIPRULI', n:'ICICI Pru Life', sec:'Insurance'},
  {s:'ICICIGI', n:'ICICI Lombard', sec:'Insurance'},
  {s:'MCX', n:'MCX', sec:'Financial'},
  {s:'IEX', n:'Indian Energy Exchange', sec:'Financial'},
  {s:'LUPIN', n:'Lupin', sec:'Pharma'},
  {s:'AUROPHARMA', n:'Aurobindo Pharma', sec:'Pharma'},
  {s:'BIOCON', n:'Biocon', sec:'Pharma'},
  {s:'GLENMARK', n:'Glenmark', sec:'Pharma'},
  {s:'TORNTPHARM', n:'Torrent Pharma', sec:'Pharma'},
  {s:'ALKEM', n:'Alkem Labs', sec:'Pharma'},
  {s:'LAURUSLABS', n:'Laurus Labs', sec:'Pharma'},
  {s:'GRANULES', n:'Granules India', sec:'Pharma'},
  {s:'IPCALAB', n:'Ipca Labs', sec:'Pharma'},
  {s:'SYNGENE', n:'Syngene', sec:'Pharma'},
  {s:'ABBOTINDIA', n:'Abbott India', sec:'Pharma'},
  {s:'ITC', n:'ITC', sec:'FMCG'},
  {s:'DABUR', n:'Dabur', sec:'FMCG'},
  {s:'GODREJCP', n:'Godrej Consumer', sec:'FMCG'},
  {s:'MARICO', n:'Marico', sec:'FMCG'},
  {s:'COLPAL', n:'Colgate Palmolive', sec:'FMCG'},
  {s:'UBL', n:'United Breweries', sec:'FMCG'},
  {s:'MCDOWELL-N', ys:'UNITDSPR.NS', n:'United Spirits', sec:'FMCG'},
  {s:'BALRAMCHIN', n:'Balrampur Chini', sec:'FMCG'},
  {s:'TVSMOTOR', n:'TVS Motor', sec:'Auto'},
  {s:'ASHOKLEY', n:'Ashok Leyland', sec:'Auto'},
  {s:'ESCORTS', n:'Escorts Kubota', sec:'Auto'},
  {s:'BOSCHLTD', n:'Bosch', sec:'Auto'},
  {s:'MRF', n:'MRF', sec:'Auto'},
  {s:'APOLLOTYRE', n:'Apollo Tyres', sec:'Auto'},
  {s:'BALKRISIND', n:'Balkrishna Ind', sec:'Auto'},
  {s:'BHARATFORG', n:'Bharat Forge', sec:'Auto'},
  {s:'MOTHERSON', n:'Samvardhana Motherson', sec:'Auto'},
  {s:'VEDL', n:'Vedanta', sec:'Metals'},
  {s:'JINDALSTEL', n:'Jindal Steel', sec:'Metals'},
  {s:'NMDC', n:'NMDC', sec:'Metals'},
  {s:'SAIL', n:'SAIL', sec:'Metals'},
  {s:'NATIONALUM', n:'National Aluminium', sec:'Metals'},
  {s:'HINDPETRO', n:'HPCL', sec:'Energy'},
  {s:'OIL', n:'Oil India', sec:'Energy'},
  {s:'GAIL', n:'GAIL', sec:'Energy'},
  {s:'PETRONET', n:'Petronet LNG', sec:'Energy'},
  {s:'IGL', n:'Indraprastha Gas', sec:'Energy'},
  {s:'MGL', n:'Mahanagar Gas', sec:'Energy'},
  {s:'GUJGASLTD', n:'Gujarat Gas', sec:'Energy'},
  {s:'TATAPOWER', n:'Tata Power', sec:'Power'},
  {s:'JSWENERGY', n:'JSW Energy', sec:'Power'},
  {s:'NHPC', n:'NHPC', sec:'Power'},
  {s:'SIEMENS', n:'Siemens', sec:'Infra'},
  {s:'ABB', n:'ABB India', sec:'Infra'},
  {s:'CUMMINSIND', n:'Cummins', sec:'Infra'},
  {s:'VOLTAS', n:'Voltas', sec:'Consumer'},
  {s:'COFORGE', n:'Coforge', sec:'IT'},
  {s:'PERSISTENT', n:'Persistent Systems', sec:'IT'},
  {s:'LTTS', n:'L&T Tech', sec:'IT'},
  {s:'MPHASIS', n:'Mphasis', sec:'IT'},
  {s:'OFSS', n:'Oracle Financial', sec:'IT'},
  {s:'BSOFT', n:'Birlasoft', sec:'IT'},
  {s:'CYIENT', n:'Cyient', sec:'IT'},
  {s:'AMBUJACEM', n:'Ambuja Cements', sec:'Cement'},
  {s:'ACC', n:'ACC', sec:'Cement'},
  {s:'SHREECEM', n:'Shree Cement', sec:'Cement'},
  {s:'DALBHARAT', n:'Dalmia Bharat', sec:'Cement'},
  {s:'RAMCOCEM', n:'Ramco Cements', sec:'Cement'},
  {s:'IDEA', n:'Vodafone Idea', sec:'Telecom'},
  {s:'INDUSTOWER', n:'Indus Towers', sec:'Telecom'}
];

const CRYPTO = [
  {s:'BTC-USD', n:'Bitcoin', sec:'Crypto'},
  {s:'ETH-USD', n:'Ethereum', sec:'Crypto'},
  {s:'SOL-USD', n:'Solana', sec:'Crypto'},
  {s:'BNB-USD', n:'Binance Coin', sec:'Crypto'},
  {s:'XRP-USD', n:'XRP', sec:'Crypto'},
  {s:'DOGE-USD', n:'Dogecoin', sec:'Crypto'},
  {s:'ADA-USD', n:'Cardano', sec:'Crypto'},
  {s:'AVAX-USD', n:'Avalanche', sec:'Crypto'},
  {s:'LINK-USD', n:'Chainlink', sec:'Crypto'},
  {s:'DOT-USD', n:'Polkadot', sec:'Crypto'}
];

function ema(px, p) {
  const r = new Array(px.length).fill(null);
  if (px.length < p) return r;
  const k = 2 / (p + 1);
  let s = 0;
  for (let i = 0; i < p; i++) s += px[i];
  r[p - 1] = s / p;
  for (let i = p; i < px.length; i++) {
    r[i] = px[i] * k + r[i - 1] * (1 - k);
  }
  return r;
}

function calcRSI(px, p) {
  const r = new Array(px.length).fill(null);
  if (px.length <= p) return r;
  let ag = 0, al = 0;
  for (let i = 1; i <= p; i++) {
    const d = px[i] - px[i - 1];
    if (d > 0) ag += d; else al -= d;
  }
  ag /= p; al /= p;
  r[p] = 100 - 100 / (1 + ag / (al || 1e-9));
  for (let i = p + 1; i < px.length; i++) {
    const d = px[i] - px[i - 1];
    ag = (ag * (p - 1) + Math.max(d, 0)) / p;
    al = (al * (p - 1) + Math.max(-d, 0)) / p;
    r[i] = 100 - 100 / (1 + ag / (al || 1e-9));
  }
  return r;
}

function calcMACD(px, f, s, sig) {
  const ef = ema(px, f), es = ema(px, s);
  const ml = px.map((_, i) => ef[i] != null && es[i] != null ? ef[i] - es[i] : null);
  const si = ml.findIndex(v => v != null);
  const vm = ml.slice(si).map(v => v ?? 0);
  const se = ema(vm, sig);
  const sl = new Array(px.length).fill(null);
  se.forEach((v, i) => { if (v != null) sl[i + si] = v; });
  return { ml, sl };
}

function calcATR(px, p) {
  const r = new Array(px.length).fill(null);
  const tr = px.map((v, i) => i === 0 ? 0 : Math.abs(v - px[i - 1]));
  let s = 0;
  for (let i = 1; i <= p; i++) s += tr[i];
  r[p] = s / p;
  for (let i = p + 1; i < px.length; i++) {
    r[i] = (r[i - 1] * (p - 1) + tr[i]) / p;
  }
  return r;
}

function calcSMA(px, p) {
  const r = new Array(px.length).fill(null);
  if (px.length < p) return r;
  let s = 0;
  for (let i = 0; i < p; i++) s += px[i];
  r[p - 1] = s / p;
  for (let i = p; i < px.length; i++) {
    s += px[i] - px[i - p];
    r[i] = s / p;
  }
  return r;
}

function calcBB(px, p, std) {
  const up = new Array(px.length).fill(null);
  const low = new Array(px.length).fill(null);
  const sma = calcSMA(px, p);
  if (px.length < p) return { up, low };
  for (let i = p - 1; i < px.length; i++) {
    const avg = sma[i];
    let varSum = 0;
    for (let j = 0; j < p; j++) {
      varSum += Math.pow(px[i - j] - avg, 2);
    }
    const dev = Math.sqrt(varSum / p);
    up[i] = avg + std * dev;
    low[i] = avg - std * dev;
  }
  return { up, low };
}

function backtest(px, ts, vl, params) {
  const { emaF, emaS, atrM, rrR, minS, rsiL=14, rsiLow=35, rsiHigh=65, macdF=12, macdS=26, timeStop=25, bbMode=0, volM=0, direction='BOTH', interval='15m' } = params;
  if (!px || px.length < Math.max(emaS + 5, 35)) {
    return { trades: 0, wins: 0, winRate: 0, pf: 0, netPct: 0, maxDD: 0, signal: 'FLAT', signalDetails: '', tradeDetails: [] };
  }
  const N = px.length;
  const e9 = ema(px, emaF), e21 = ema(px, emaS);
  const rsi = calcRSI(px, rsiL);
  const { ml, sl } = calcMACD(px, macdF, macdS, 9);
  const atr = calcATR(px, 14);
  const { up: bbUp, low: bbLow } = calcBB(px, 20, 2.0);
  const volSma = calcSMA(vl, 20);
  let trades = [];
  let tradeDir = 0, entry = 0, stpl = 0, tp = 0, eb = 0;
  let lastSignalScore = 0; // Track quality of latest signal
  const start = Math.max(emaS + 5, 35);

  let currentSignal = 'FLAT';
  let signalDetails = '';

  for (let i = start; i < N; i++) {
    let closedOnThisBar = false;
    let closeReason = '';

    // Reset signal to FLAT if not in a position (Fixes Sticky Signal Bug)
    if (tradeDir === 0) {
      currentSignal = 'FLAT';
      signalDetails = '';
    }

    // Timezone-aware EOD detection for IST (Fixes Bug 2)
    const dateStr = new Date(ts[i]).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    const nextDateStr = ts[i+1] ? new Date(ts[i+1]).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) : '';
    const isLastBarOfDay = interval === '15m' && (i === N - 1 || dateStr !== nextDateStr);

    if (tradeDir !== 0 && isLastBarOfDay) {
      const pnl = tradeDir === 1 ? (px[i] - entry) : (entry - px[i]);
      // EOD square-off: only cut losing positions, let winners run
      if (pnl < 0) {
        trades.push({
          type: tradeDir === 1 ? 'LONG' : 'SHORT',
          win: false, entry, exit: px[i],
          // pnl is already directional: positive for longs going up, negative for going down
          // For SHORT EOD: entry - exit (negative if price went up)
          pnl: tradeDir === 1 ? (px[i] - entry) : (entry - px[i]),
          bars: i - eb, entryTime: ts[eb], exitTime: ts[i],
          closeReason: 'EOD Square-off'
        });
        tradeDir = 0;
        closedOnThisBar = true;
        continue;
      }
    }

    if (tradeDir !== 0) {
      if (tradeDir === 1) {
        if (px[i] <= stpl) {
          // LONG SL: price dropped to stpl → exit = px[i] ≈ stpl, pnl = exit - entry (negative)
          trades.push({ type:'LONG', win:false, entry, exit:px[i], pnl:px[i]-entry, bars:i-eb, entryTime:ts[eb], exitTime:ts[i], closeReason:'Stop Loss' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Stop Loss';
        } else if (px[i] >= tp) {
          trades.push({ type:'LONG', win:true, entry, exit:tp, pnl:tp-entry, bars:i-eb, entryTime:ts[eb], exitTime:ts[i], closeReason:'Take Profit' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Take Profit';
        } else if (i - eb >= timeStop) {
          const pnl = px[i] - entry;
          trades.push({ type:'LONG', win:pnl>0, entry, exit:px[i], pnl, bars:timeStop, entryTime:ts[eb], exitTime:ts[i], closeReason:'Time Stop' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Time Stop';
        }
        if (i === N - 1) {
          if (tradeDir === 1) { currentSignal = 'HOLD_LONG'; signalDetails = `Entry: ${entry.toFixed(2)} | TP: ${tp.toFixed(2)} | SL: ${stpl.toFixed(2)}`; }
          else if (closedOnThisBar) { currentSignal = 'EXIT_LONG'; signalDetails = `Hit ${closeReason}`; }
        }
      } else if (tradeDir === -1) {
        if (px[i] >= stpl) {
          // SHORT SL: price rose to stpl → exit = px[i] ≈ stpl, pnl = entry - exit (negative, since exit > entry)
          trades.push({ type:'SHORT', win:false, entry, exit:px[i], pnl:entry-px[i], bars:i-eb, entryTime:ts[eb], exitTime:ts[i], closeReason:'Stop Loss' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Stop Loss';
        } else if (px[i] <= tp) {
          trades.push({ type:'SHORT', win:true, entry, exit:tp, pnl:entry-tp, bars:i-eb, entryTime:ts[eb], exitTime:ts[i], closeReason:'Take Profit' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Take Profit';
        } else if (i - eb >= timeStop) {
          const pnl = entry - px[i];
          trades.push({ type:'SHORT', win:pnl>0, entry, exit:px[i], pnl, bars:timeStop, entryTime:ts[eb], exitTime:ts[i], closeReason:'Time Stop' });
          tradeDir = 0; closedOnThisBar = true; closeReason = 'Time Stop';
        }
        if (i === N - 1) {
          if (tradeDir === -1) { currentSignal = 'HOLD_SHORT'; signalDetails = `Entry: ${entry.toFixed(2)} | TP: ${tp.toFixed(2)} | SL: ${stpl.toFixed(2)}`; }
          else if (closedOnThisBar) { currentSignal = 'EXIT_SHORT'; signalDetails = `Hit ${closeReason}`; }
        }
      }
      continue;
    }

    if (!e9[i] || !e21[i] || !rsi[i] || !ml[i] || !sl[i]) continue;

    // ── Require EMA crossover AND that trend was established ≥2 bars ────────
    const ecLong  = e9[i] >  e21[i] && (e9[i-1] || 0)  <= (e21[i-1] || 0);
    const ecShort = e9[i] <  e21[i] && (e9[i-1] || Infinity) >= (e21[i-1] || 0);
    const mcLong  = ml[i] >  sl[i]  && (ml[i-1] || 0)  <= (sl[i-1] || 0);
    const mcShort = ml[i] <  sl[i]  && (ml[i-1] || Infinity) >= (sl[i-1] || 0);

    // ── Momentum: price above/below recent 5-bar average ────────────────────
    const recentAvgLong  = i >= 5 ? (px.slice(i-5, i).reduce((a,b)=>a+b,0)/5) : null;
    const recentAvgShort = recentAvgLong;
    const momentumLong  = recentAvgLong  !== null && px[i] > recentAvgLong;
    const momentumShort = recentAvgShort !== null && px[i] < recentAvgShort;

    let newEntryOnThisBar = 0;

    // ── LONG entry ──────────────────────────────────────────────────────────
    if (tradeDir === 0 && (ecLong || mcLong) && (direction === 'BOTH' || direction === 'LONG_ONLY')) {
      let score = 0;
      if (e9[i] > e21[i]) score++;                                       // EMA trend up
      if (rsi[i] > rsiLow && rsi[i] < 60) score++;                       // RSI healthy long zone
      if (ml[i] > sl[i]) score++;                                         // MACD bullish
      if (momentumLong) score++;                                           // Price above 5-bar avg
      if (bbMode === 1 && bbUp[i] !== null && px[i] > bbUp[i]) score++;  // BB breakout
      if (bbMode === 2 && bbLow[i] !== null && px[i] > bbLow[i] && px[i-1] <= bbLow[i-1]) score++;
      if (volM > 0 && volSma[i] !== null && vl[i] > volSma[i] * volM) score++; // Volume surge

      // QUALITY GATE: All 3 core conditions must agree (no conflicting signals)
      const coreAligned = e9[i] > e21[i] && ml[i] > sl[i] && rsi[i] > rsiLow && rsi[i] < 65;

      if (score >= minS && coreAligned) {
        tradeDir = 1; entry = px[i]; lastSignalScore = score;
        const a = atr[i] || px[i] * 0.015;
        stpl = entry - a * atrM; tp = entry + a * atrM * rrR; eb = i;
        newEntryOnThisBar = 1;
      }
    }

    // ── SHORT entry ─────────────────────────────────────────────────────────
    if (tradeDir === 0 && (ecShort || mcShort) && (direction === 'BOTH' || direction === 'SHORT_ONLY')) {
      let score = 0;
      if (e9[i] < e21[i]) score++;                                         // EMA trend down
      if (rsi[i] < rsiHigh && rsi[i] > 40) score++;                       // RSI healthy short zone
      if (ml[i] < sl[i]) score++;                                          // MACD bearish
      if (momentumShort) score++;                                           // Price below 5-bar avg
      if (bbMode === 1 && bbLow[i] !== null && px[i] < bbLow[i]) score++;
      if (bbMode === 2 && bbUp[i] !== null && px[i] < bbUp[i] && px[i-1] >= bbUp[i-1]) score++;
      if (volM > 0 && volSma[i] !== null && vl[i] > volSma[i] * volM) score++;

      // QUALITY GATE: All 3 core conditions must agree
      const coreAligned = e9[i] < e21[i] && ml[i] < sl[i] && rsi[i] < rsiHigh && rsi[i] > 35;

      if (score >= minS && coreAligned) {
        tradeDir = -1; entry = px[i]; lastSignalScore = score;
        const a = atr[i] || px[i] * 0.015;
        stpl = entry + a * atrM; tp = entry - a * atrM * rrR; eb = i;
        newEntryOnThisBar = -1;
      }
    }

    if (i === N - 1) {
      if (newEntryOnThisBar === 1) {
        currentSignal = 'BUY_NEW';
        signalDetails = `Entry: ${entry.toFixed(2)} | TP: ${tp.toFixed(2)} | SL: ${stpl.toFixed(2)}`;
      } else if (newEntryOnThisBar === -1) {
        currentSignal = 'SELL_NEW';
        signalDetails = `Entry: ${entry.toFixed(2)} | TP: ${tp.toFixed(2)} | SL: ${stpl.toFixed(2)}`;
      }
    }
  }
  
  if (!trades.length) return { trades: 0, wins: 0, winRate: 0, pf: 0, netPct: 0, maxDD: 0, signal: currentSignal, signalDetails, tradeDetails: [], sigE: entry, sigTP: tp, sigSL: stpl };
  const wins = trades.filter(t => t.win).length;
  const gp = trades.filter(t => t.win).reduce((a, t) => a + t.pnl, 0);
  const gl = Math.abs(trades.filter(t => !t.win).reduce((a, t) => a + t.pnl, 0));
  const net = trades.reduce((a, t) => a + t.pnl, 0);
  let eq = 0, peak = 0, mdd = 0;
  for (const t of trades) { eq += t.pnl; if (eq > peak) peak = eq; mdd = Math.max(mdd, peak - eq); }
  
  const tradeDetails = trades.map(t => ({
     type: t.type,
     win: t.win,
     entry: t.entry,
     exit: t.exit,
     pnl: t.pnl,
     pnlPct: (t.pnl / t.entry * 100),
     bars: t.bars,
     entryTime: t.entryTime,
     exitTime: t.exitTime
  }));

  return {
    trades: trades.length, wins,
    winRate: +(wins / trades.length * 100).toFixed(1),
    pf: +Math.min(gl > 0 ? gp / gl : gp > 0 ? 9.99 : 0, 9.99).toFixed(2),
    netPct: +(net / px[0] * 100).toFixed(1),
    maxDD: +(mdd / px[0] * 100).toFixed(1),
    signal: currentSignal,
    signalDetails,
    signalScore: lastSignalScore,
    tradeDetails: tradeDetails.reverse(),
    sigE: entry, sigTP: tp, sigSL: stpl,
    sigTime: tradeDir !== 0 ? ts[eb] : null
  };
}

function getGrade(r) {
  // Grade D — too few trades or unprofitable: suppress signals
  if (r.trades < 4) return { g: 'D', n: 3 };
  if (r.pf < 1.0)  return { g: 'D', n: 3 };   // Net losing strategy
  if (r.netPct < 0) return { g: 'D', n: 3 };   // Negative total return
  // Grade A — high conviction
  if (r.winRate >= 55 && r.pf >= 1.6 && r.trades >= 8 && r.netPct > 5) return { g: 'A', n: 0 };
  // Grade B — good
  if (r.winRate >= 48 && r.pf >= 1.3 && r.trades >= 5) return { g: 'B', n: 1 };
  // Grade C — marginal but profitable
  if (r.winRate >= 42 && r.pf >= 1.05 && r.trades >= 4) return { g: 'C', n: 2 };
  return { g: 'D', n: 3 };
}

// Store RAW prices
const rawCache = {};
const isFetching = {};
const lastFetchTime = {}; // Bug 5 Fix: Prevent spamming Yahoo

// Removed deprecated fetchWithRetry function

async function fetchRealtimeData(market, interval, range, period1, period2) {
  const cacheKey = `${market}_${interval}_${range}_${period1}_${period2}`;
  if (isFetching[cacheKey]) return;

  // Bug 5 Fix: Don't fetch if data is less than 10 seconds old
  const now = Date.now();
  if (lastFetchTime[cacheKey] && (now - lastFetchTime[cacheKey] < 10000)) {
    return;
  }

  isFetching[cacheKey] = true;
  console.log(`Fetching raw Yahoo Finance data for ${cacheKey}...`);
  
  try {
    const newRawData = [];
    const list = market === 'crypto' ? CRYPTO : STOCKS;
    const chunkSize = 20; // Increased chunk size for faster fetching
    for (let i = 0; i < list.length; i += chunkSize) {
      const chunk = list.slice(i, i + chunkSize);
      const promises = chunk.map(async (st) => {
        try {
          let symbol = market === 'crypto' ? st.s : (st.ys ? st.ys : `${st.s}.NS`);
          
          let queryOptions = { interval: interval };
          if (period1 && period2) {
            queryOptions.period1 = new Date(period1 * 1000);
            queryOptions.period2 = new Date(period2 * 1000);
          } else {
            // Convert range to period1
            const d = new Date();
            if (range === '60d') d.setDate(d.getDate() - 60);
            else if (range === '5y') d.setFullYear(d.getFullYear() - 5);
            else d.setDate(d.getDate() - 20); // fallback '20d'
            queryOptions.period1 = d;
          }

          const chart = await yahooFinance.chart(symbol, queryOptions);
          if (!chart || !chart.quotes || chart.quotes.length === 0) throw new Error('No data');
          
          const px = [], ts = [], vl = [];
          for (const q of chart.quotes) {
            if (q.close !== null && q.close !== undefined) {
              px.push(q.close);
              ts.push(q.date.getTime());
              vl.push(q.volume || 0);
            }
          }
          
          let priceStr = px.length > 0 ? px[px.length - 1].toFixed(market === 'crypto' && px[px.length - 1] < 10 ? 4 : 2) : 0;
          return { st, px, ts, vl, priceStr };
        } catch (err) {
          console.error(`Failed ${st.s} (${interval}):`, err.message);
          const old = rawCache[cacheKey] ? rawCache[cacheKey].find(x => x.st.s === st.s) : null;
          if (old) return old;
          return { st, px: [], ts: [], vl: [], priceStr: 0 };
        }
      });

      const results = await Promise.all(promises);
      newRawData.push(...results);
      await new Promise(r => setTimeout(r, 100)); // 100ms breather
    }
  
    rawCache[cacheKey] = newRawData;
    lastFetchTime[cacheKey] = Date.now(); // Update last fetch time
    console.log(`Raw fetch complete for ${cacheKey}.`);
  } finally {
    isFetching[cacheKey] = false; // Always release lock
  }
}


function computeResults(cacheKey, params) {
  const rawData = rawCache[cacheKey] || [];
  const interval = cacheKey.includes('_15m_') ? '15m' : '1d';
  return rawData.map(item => {
    const r = backtest(item.px, item.ts, item.vl, {...params, interval});
    const { g, n } = getGrade(r);

    // Suppress live signals for Grade D stocks — strategy is unprofitable
    if (g === 'D' && (r.signal === 'BUY_NEW' || r.signal === 'SELL_NEW')) {
      r.signal = 'FLAT';
      r.signalDetails = '';
    }

    let chgPct = 0;
    if (item.px && item.px.length > 25) {
      const isDaily = cacheKey.includes('_1d_');
      const lookback = isDaily ? 2 : 25; 
      const prevPx = item.px[item.px.length - lookback];
      const lastPx = item.px[item.px.length - 1];
      if (prevPx > 0) chgPct = ((lastPx - prevPx) / prevPx) * 100;
    }

    return {
      ...item.st,
      ...r,
      grade: g,
      gradeN: n,
      p: item.priceStr,
      chg: chgPct
    };
  });
}

app.post('/api/screener', express.json(), async (req, res) => {
  try {
    // Refined default params — tighter entries, better R:R
    const params = req.body.params || { emaF: 9, emaS: 21, atrM: 1.8, rrR: 2.5, minS: 3, rsiL: 14, rsiLow: 40, rsiHigh: 60, macdF: 12, macdS: 26, timeStop: 20, bbMode: 0, volM: 0 };
    const market = req.body.market || 'nifty';
    const interval = req.body.interval || '15m';
    const range = req.body.range || '20d';
    const period1 = req.body.period1 || null;
    const period2 = req.body.period2 || null;
    const cacheKey = `${market}_${interval}_${range}_${period1}_${period2}`;
    
    if (!rawCache[cacheKey]) rawCache[cacheKey] = [];
    
    if (rawCache[cacheKey].length === 0 && !isFetching[cacheKey]) {
      await fetchRealtimeData(market, interval, range, period1, period2);
      res.json(computeResults(cacheKey, params));
    } else if (!isFetching[cacheKey]) {
      res.json(computeResults(cacheKey, params));
      fetchRealtimeData(market, interval, range, period1, period2).catch(e => console.error(e));
    } else {
      res.json(computeResults(cacheKey, params));
    }
  } catch (err) {
    console.error('Screener API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

app.post('/api/optimize', express.json(), async (req, res) => {
  const market = req.body.market || 'nifty';
  const interval = req.body.interval || '15m';
  const range = req.body.range || '20d';
  const period1 = req.body.period1 || null;
  const period2 = req.body.period2 || null;
  const goal = req.body.goal || 'max_pf';
  const cacheKey = `${market}_${interval}_${range}_${period1}_${period2}`;
  
  if (!rawCache[cacheKey] || rawCache[cacheKey].length === 0) {
    return res.status(400).json({ error: 'Data not cached. Poll first.' });
  }

  const rawData = rawCache[cacheKey];

  const emaFs = [5, 9, 15];
  const emaSs = [21, 34];
  const atrMs = [1.5, 2.5];
  const rrRs = [1.5, 2.0];
  const bbModes = [0, 1]; // 0: Disabled, 1: Breakout
  const volMs = [0, 1.5]; // 0: Disabled, 1.5: Surge
  
  let bestParams = null;
  let bestScore = -999999;
  let bestProfile = { wr: 0, pf: 0 };
  const topResults = [];
  
  for (const emaF of emaFs) {
    for (const emaS of emaSs) {
      if (emaF >= emaS) continue;
      for (const atrM of atrMs) {
        for (const rrR of rrRs) {
          for (const bbMode of bbModes) {
            for (const volM of volMs) {
              const params = { emaF, emaS, atrM, rrR, minS: 2, rsiL: 14, rsiLow: 35, rsiHigh: 65, macdF: 12, macdS: 26, timeStop: 25, bbMode, volM };
              
              let totalPF = 0, totalWR = 0, validAssets = 0, sumTrades = 0, totalNetPct = 0;
              const assetNetPcts = [];
              for (const item of rawData) {
                const r = backtest(item.px, item.ts, item.vl, {...params, interval});
                if (r.trades > 0) {
                  totalPF += r.pf;
                  totalWR += r.winRate;
                  sumTrades += r.trades;
                  totalNetPct += r.netPct;
                  assetNetPcts.push({ s: item.st.s, netPct: r.netPct });
                  validAssets++;
                }
              }
              
              if (validAssets === 0) continue;
              const avgPF = totalPF / validAssets;
              const avgWR = totalWR / validAssets;
              const avgTrades = sumTrades / validAssets;
              const avgNetPct = totalNetPct / validAssets;
              
              let score = -1;
              if (goal === 'max_pf') score = avgPF;
              else if (goal === 'max_wr') score = avgWR;
              else if (goal === 'balanced') score = avgPF * (avgWR / 100);
              else if (goal === 'max_trades') score = avgTrades * (avgPF > 1.2 ? 1 : 0.01);
              else if (goal === 'double_capital') {
                assetNetPcts.sort((a, b) => b.netPct - a.netPct);
                // Score based on the sum of top 3 assets (portfolio combination)
                score = assetNetPcts.slice(0, 3).reduce((sum, val) => sum + val.netPct, 0);
              }
              
              assetNetPcts.sort((a, b) => b.netPct - a.netPct);
              const top3Stocks = assetNetPcts.slice(0, 3).map(x => x.s);
              
              topResults.push({ score, params, profile: { wr: avgWR, pf: avgPF }, top3Stocks });
              
              if (score > bestScore) {
                bestScore = score;
                bestParams = params;
                bestProfile = { wr: avgWR, pf: avgPF };
              }
            }
          }
        }
      }
    }
  }

  // Sort and filter for unique combinations of top 3 stocks
  topResults.sort((a, b) => b.score - a.score);
  const uniqueSets = [];
  const seenCombinations = new Set();
  
  for (const res of topResults) {
    const comboKey = [...res.top3Stocks].sort().join(',');
    if (!seenCombinations.has(comboKey)) {
      seenCombinations.add(comboKey);
      uniqueSets.push(res);
    }
    if (uniqueSets.length >= 3) break;
  }

  if (!bestParams) {
    bestParams = { emaF: 9, emaS: 21, atrM: 2.0, rrR: 2.0, minS: 2, rsiL: 14, rsiLow: 35, rsiHigh: 65, macdF: 12, macdS: 26, timeStop: 25, bbMode: 0, volM: 0 };
  }

  let name = 'General Momentum';
  let desc = 'A balanced approach to trend following.';
  if (goal === 'max_pf') {
    if (bestParams.emaF <= 9) { name = 'The Volatility Sniper'; desc = 'Aggressive fast entries to catch massive breakouts.'; }
    else { name = 'The Trend Rider'; desc = 'Ignores chop to capture sustained, highly profitable trends.'; }
  } else if (goal === 'max_wr') {
    name = 'The Precision Edge'; desc = 'Extremely strict entry criteria ensuring high consistency.';
  } else if (goal === 'balanced') {
    name = 'The Golden Mean'; desc = 'Perfect mathematical balance between steady wins and outsized returns.';
  } else if (goal === 'max_trades') {
    name = 'The Hyper-Scalper'; desc = 'Fires rapidly on every momentum shift while keeping a baseline profit factor.';
  } else if (goal === 'double_capital') {
    name = 'The Wealth Multiplier'; desc = 'Aggressively searches for parameters that maximize total percentage growth to double your capital!';
  }

  res.json({
    params: bestParams,
    aiProfile: { name, desc, expectedWr: bestProfile.wr.toFixed(1), expectedPf: bestProfile.pf.toFixed(2) },
    top3Sets: uniqueSets.map(r => ({
      params: r.params,
      stocks: r.top3Stocks,
      score: r.score.toFixed(1)
    }))
  });
});

app.post('/api/news', express.json(), async (req, res) => {
  const tickers = req.body.tickers || [];
  if (!tickers.length) return res.json([]);
  
  try {
    let allNews = [];
    const promises = tickers.map(async (t) => {
      try {
        const symbol = t.includes('.NS') ? t : `${t}.NS`;
        const response = await yahooFinance.search(symbol, { newsCount: 2 });
        const newsArr = response.news || [];
        return newsArr.map(n => ({ ...n, relatedTicker: t }));
      } catch (err) {
        console.error(`Failed news for ${t}:`, err.message);
        return [];
      }
    });
    
    const results = await Promise.all(promises);
    results.forEach(arr => allNews.push(...arr));
    
    const processed = [];
    const seenTitles = new Set();
    
    for (const item of allNews) {
      if (!item.title || seenTitles.has(item.title)) continue;
      seenTitles.add(item.title);
      
      const result = sentiment.analyze(item.title);
      let impact = 'Neutral';
      if (result.score > 0) impact = 'Bullish';
      else if (result.score < 0) impact = 'Bearish';
      
      processed.push({
        title: item.title,
        link: item.link,
        time: item.providerPublishTime,
        ticker: item.relatedTicker,
        score: result.score,
        impact
      });
    }
    
    processed.sort((a, b) => b.time - a.time);
    res.json(processed.slice(0, 8));
  } catch (err) {
    console.error('Error fetching news:', err.message);
    res.json([]);
  }
});

async function prewarmCache() {
  const warmups = [
    { market: 'nifty', interval: '15m', range: '60d' },
    { market: 'nifty', interval: '1d',  range: '5y'  },
    { market: 'crypto', interval: '15m', range: '60d' },
    { market: 'crypto', interval: '1d',  range: '5y'  }
  ];
  for (const w of warmups) {
    const key = `${w.market}_${w.interval}_${w.range}_null_null`;
    if (!rawCache[key]) rawCache[key] = [];
    console.log(`Pre-warming ${key}...`);
    const t0 = Date.now();
    try {
      await fetchRealtimeData(w.market, w.interval, w.range, null, null);
      console.log(`Pre-warm ${key} done in ${((Date.now()-t0)/1000).toFixed(1)}s (${rawCache[key].length} symbols)`);
    } catch (err) {
      console.error(`Pre-warm ${key} failed:`, err.message);
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    prewarmCache();
    // Auto-fetch in the background every 10 seconds
    setInterval(prewarmCache, 10000);
  });
}

module.exports = app;
