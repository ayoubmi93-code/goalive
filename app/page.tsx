"use client";
import { useState, useEffect, useCallback } from "react";

function convertTime(utcTime: string, offsetHours: number): string {
  const [h, m] = utcTime.split(":").map(Number);
  const newH = (h + offsetHours + 24) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
const ZONES = [
  { key: "MA", label: "Maroc", flag: "🇲🇦", offset: 1 },
  { key: "EU", label: "Paris/Europe", flag: "🇫🇷", offset: 2 },
  { key: "ME", label: "Riyad/Dubai", flag: "🇸🇦", offset: 3 },
  { key: "US_E", label: "New York", flag: "🇺🇸", offset: -4 },
  { key: "US_W", label: "Los Angeles", flag: "🇺🇸", offset: -7 },
];

const MATCHES_DATA = [
  {
    id: 1, league: "Champions League", leagueColor: "#38bdf8",
    home: "Real Madrid", homeAbbr: "RMA", away: "Bayern Munich", awayAbbr: "BMU",
    utcTime: "19:00", date: "7 Avr", status: "upcoming",
    homeProb: 31, awayProb: 45, drawProb: 24,
    homeTactic: "4-3-3", awayTactic: "4-2-3-1",
    homeForm: ["W","W","L","W","D"], awayForm: ["W","W","W","D","W"],
    broadcast: {
      MA: ["beIN Sports 1", "Arryadia"], EU: ["Canal+", "RMC Sport", "DAZN"],
      ME: ["beIN Sports Arabia 1", "SSC Sport 1"], US: ["Paramount+", "CBS Sports"], UK: ["TNT Sports 2", "discovery+"],
    },
    commentary: [
      "⚽ 23' BUUUT ! Bellingham ouvre le score d'une frappe magistrale côté droit !",
      "🟨 31' Carton jaune pour Goretzka — faute grossière sur Camavinga au milieu",
      "⚽ 41' Égalisation de Kane ! Une tête imparable sur corner de Kimmich",
      "⚽ 58' Vinicius Jr. redonne l'avantage au Real ! Contre-attaque express",
      "🟥 64' Goretzka EXPULSÉ — deuxième jaune ! Bayern réduit à 10 hommes",
      "🔄 67' Davies remplacé par Stanisić côté Bayern Munich",
    ],
    homePlayers: [
      { name: "Courtois", pos: "GK", rating: 7.8, fit: 95, goals: 0, assists: 0 },
      { name: "Carvajal", pos: "RB", rating: 7.2, fit: 88, goals: 1, assists: 4 },
      { name: "Militão", pos: "CB", rating: 7.5, fit: 92, goals: 2, assists: 0 },
      { name: "Alaba", pos: "CB", rating: 7.0, fit: 78, goals: 0, assists: 1 },
      { name: "Mendy", pos: "LB", rating: 7.3, fit: 90, goals: 0, assists: 5 },
      { name: "Camavinga", pos: "CM", rating: 7.9, fit: 95, goals: 3, assists: 6 },
      { name: "Tchouaméni", pos: "CDM", rating: 7.4, fit: 85, goals: 1, assists: 2 },
      { name: "Bellingham", pos: "CM", rating: 8.8, fit: 98, goals: 18, assists: 9 },
      { name: "Rodrygo", pos: "RW", rating: 8.0, fit: 92, goals: 12, assists: 7 },
      { name: "Mbappé", pos: "ST", rating: 8.6, fit: 96, goals: 26, assists: 11 },
      { name: "Vinicius Jr.", pos: "LW", rating: 8.7, fit: 94, goals: 22, assists: 14 },
    ],
    awayPlayers: [
      { name: "Neuer", pos: "GK", rating: 7.6, fit: 90, goals: 0, assists: 0 },
      { name: "Kimmich", pos: "RB", rating: 8.2, fit: 95, goals: 4, assists: 10 },
      { name: "Upamecano", pos: "CB", rating: 7.3, fit: 88, goals: 1, assists: 0 },
      { name: "Kim", pos: "CB", rating: 7.5, fit: 92, goals: 2, assists: 1 },
      { name: "Davies", pos: "LB", rating: 7.8, fit: 91, goals: 2, assists: 8 },
      { name: "Goretzka", pos: "CM", rating: 7.6, fit: 82, goals: 5, assists: 4 },
      { name: "Pavlović", pos: "CDM", rating: 7.2, fit: 90, goals: 2, assists: 3 },
      { name: "Müller", pos: "CAM", rating: 7.9, fit: 85, goals: 8, assists: 15 },
      { name: "Sané", pos: "RW", rating: 8.1, fit: 93, goals: 14, assists: 9 },
      { name: "Kane", pos: "ST", rating: 9.0, fit: 98, goals: 31, assists: 8 },
      { name: "Gnabry", pos: "LW", rating: 7.7, fit: 88, goals: 10, assists: 6 },
    ],
    stats: { homeShots: 14, awayShots: 11, homePoss: 52, awayPoss: 48, homeCorners: 7, awayCorners: 5 }
  },
  {
    id: 2, league: "Champions League", leagueColor: "#38bdf8",
    home: "PSG", homeAbbr: "PSG", away: "Liverpool FC", awayAbbr: "LFC",
    utcTime: "19:00", date: "8 Avr", status: "upcoming",
    homeProb: 51, awayProb: 26, drawProb: 23,
    homeTactic: "4-3-3", awayTactic: "4-3-3",
    homeForm: ["W","W","W","W","W"], awayForm: ["L","W","L","W","W"],
    broadcast: {
      MA: ["beIN Sports 1", "Arryadia"], EU: ["Canal+", "TF1", "RMC Sport"],
      ME: ["beIN Sports Arabia 2", "SSC Sport 2"], US: ["Paramount+", "CBS Sports Network"], UK: ["TNT Sports 1", "discovery+"],
    },
    commentary: [
      "🔥 Ambiance électrique au Parc des Princes — sold out 48 000 spectateurs",
      "📋 Salah titulaire côté Liverpool, Dembélé confirmé pour PSG",
      "💬 Luis Enrique : 'Nous sommes la meilleure équipe d'Europe cette saison'",
      "📊 PSG : 5 victoires consécutives en UCL — forme légendaire",
      "⚡ Le duel Dembélé vs Alexander-Arnold sera le match dans le match",
      "🌟 Donnarumma face à Salah — le choc du soir en perspective",
    ],
    homePlayers: [
      { name: "Donnarumma", pos: "GK", rating: 8.0, fit: 95, goals: 0, assists: 0 },
      { name: "Hakimi", pos: "RB", rating: 8.5, fit: 96, goals: 5, assists: 12 },
      { name: "Marquinhos", pos: "CB", rating: 7.8, fit: 90, goals: 3, assists: 2 },
      { name: "Pacho", pos: "CB", rating: 7.5, fit: 92, goals: 1, assists: 0 },
      { name: "N. Mendes", pos: "LB", rating: 8.0, fit: 93, goals: 3, assists: 9 },
      { name: "Vitinha", pos: "CM", rating: 8.2, fit: 94, goals: 7, assists: 8 },
      { name: "Zaire-Emery", pos: "CM", rating: 8.0, fit: 91, goals: 5, assists: 6 },
      { name: "Ruiz", pos: "CM", rating: 7.6, fit: 88, goals: 3, assists: 5 },
      { name: "Dembélé", pos: "RW", rating: 8.8, fit: 97, goals: 20, assists: 16 },
      { name: "Barcola", pos: "LW", rating: 8.3, fit: 95, goals: 17, assists: 10 },
      { name: "Ramos", pos: "ST", rating: 8.1, fit: 89, goals: 19, assists: 6 },
    ],
    awayPlayers: [
      { name: "Alisson", pos: "GK", rating: 7.9, fit: 94, goals: 0, assists: 0 },
      { name: "Alexander-Arnold", pos: "RB", rating: 8.3, fit: 92, goals: 4, assists: 13 },
      { name: "Konate", pos: "CB", rating: 7.6, fit: 90, goals: 2, assists: 1 },
      { name: "Van Dijk", pos: "CB", rating: 8.0, fit: 93, goals: 4, assists: 2 },
      { name: "Robertson", pos: "LB", rating: 7.8, fit: 88, goals: 1, assists: 10 },
      { name: "Mac Allister", pos: "CM", rating: 7.9, fit: 92, goals: 6, assists: 7 },
      { name: "Szoboszlai", pos: "CM", rating: 7.7, fit: 90, goals: 8, assists: 9 },
      { name: "Gravenberch", pos: "CDM", rating: 7.5, fit: 91, goals: 2, assists: 3 },
      { name: "Salah", pos: "RW", rating: 9.1, fit: 97, goals: 24, assists: 14 },
      { name: "Núñez", pos: "ST", rating: 7.8, fit: 87, goals: 15, assists: 5 },
      { name: "Gakpo", pos: "LW", rating: 7.9, fit: 91, goals: 13, assists: 8 },
    ],
    stats: { homeShots: 16, awayShots: 10, homePoss: 55, awayPoss: 45, homeCorners: 8, awayCorners: 4 }
  },
  {
    id: 3, league: "Premier League", leagueColor: "#c084fc",
    home: "Arsenal FC", homeAbbr: "ARS", away: "Bournemouth", awayAbbr: "BOU",
    utcTime: "11:30", date: "11 Avr", status: "upcoming",
    homeProb: 68, awayProb: 13, drawProb: 19,
    homeTactic: "4-3-3", awayTactic: "4-4-2",
    homeForm: ["W","W","D","W","W"], awayForm: ["D","W","D","D","L"],
    broadcast: {
      MA: ["beIN Sports 2", "Arryadia"], EU: ["Canal+", "DAZN", "Sky Sports"],
      ME: ["beIN Sports Arabia 3", "SSC Sport 3"], US: ["Peacock", "NBC Sports"], UK: ["Sky Sports PL", "Sky Go"],
    },
    commentary: [
      "📋 Saka et Odegaard confirmés dans le onze de départ d'Arsenal",
      "🏆 Arsenal leader — 3 points indispensables pour conserver la tête",
      "📊 Bournemouth sans victoire lors de ses 4 derniers déplacements à l'Emirates",
      "💬 Arteta : 'L'équipe est prête, on veut imposer notre jeu dès le début'",
      "⚡ Rice & Odegaard — le meilleur duo de milieu en Premier League 2025",
      "🌟 Saliba en forme olympique : 0 but concédé en 4 matchs à domicile",
    ],
    homePlayers: [
      { name: "Raya", pos: "GK", rating: 7.7, fit: 95, goals: 0, assists: 0 },
      { name: "Ben White", pos: "RB", rating: 7.8, fit: 92, goals: 2, assists: 5 },
      { name: "Saliba", pos: "CB", rating: 8.5, fit: 97, goals: 4, assists: 2 },
      { name: "Gabriel", pos: "CB", rating: 8.0, fit: 93, goals: 6, assists: 1 },
      { name: "Timber", pos: "LB", rating: 7.9, fit: 90, goals: 2, assists: 6 },
      { name: "Partey", pos: "CDM", rating: 7.5, fit: 82, goals: 2, assists: 3 },
      { name: "Odegaard", pos: "CAM", rating: 8.7, fit: 96, goals: 13, assists: 12 },
      { name: "Rice", pos: "CM", rating: 8.6, fit: 97, goals: 8, assists: 7 },
      { name: "Saka", pos: "RW", rating: 9.0, fit: 98, goals: 18, assists: 13 },
      { name: "Havertz", pos: "ST", rating: 8.0, fit: 91, goals: 15, assists: 6 },
      { name: "Trossard", pos: "LW", rating: 7.9, fit: 89, goals: 11, assists: 8 },
    ],
    awayPlayers: [
      { name: "Flekken", pos: "GK", rating: 7.2, fit: 90, goals: 0, assists: 0 },
      { name: "Smith", pos: "RB", rating: 6.9, fit: 85, goals: 0, assists: 3 },
      { name: "Senesi", pos: "CB", rating: 7.0, fit: 88, goals: 1, assists: 0 },
      { name: "Zabarnyi", pos: "CB", rating: 7.1, fit: 90, goals: 2, assists: 1 },
      { name: "Kerkez", pos: "LB", rating: 7.3, fit: 92, goals: 1, assists: 4 },
      { name: "Cook", pos: "CM", rating: 6.8, fit: 87, goals: 1, assists: 2 },
      { name: "Christie", pos: "CM", rating: 7.0, fit: 89, goals: 3, assists: 3 },
      { name: "Billing", pos: "CM", rating: 6.9, fit: 85, goals: 2, assists: 4 },
      { name: "Semenyo", pos: "RW", rating: 7.5, fit: 94, goals: 9, assists: 5 },
      { name: "Evanilson", pos: "ST", rating: 7.4, fit: 88, goals: 12, assists: 3 },
      { name: "Kluivert", pos: "LW", rating: 7.6, fit: 91, goals: 11, assists: 7 },
    ],
    stats: { homeShots: 18, awayShots: 6, homePoss: 62, awayPoss: 38, homeCorners: 9, awayCorners: 2 }
  }
];

const FPOS = {
  "4-3-3": [{x:50,y:91},{x:15,y:72},{x:38,y:75},{x:62,y:75},{x:85,y:72},{x:25,y:52},{x:50,y:48},{x:75,y:52},{x:20,y:25},{x:50,y:18},{x:80,y:25}],
  "4-2-3-1": [{x:50,y:91},{x:15,y:72},{x:38,y:75},{x:62,y:75},{x:85,y:72},{x:33,y:58},{x:67,y:58},{x:15,y:35},{x:50,y:32},{x:85,y:35},{x:50,y:15}],
  "4-4-2": [{x:50,y:91},{x:15,y:72},{x:38,y:75},{x:62,y:75},{x:85,y:72},{x:15,y:50},{x:38,y:50},{x:62,y:50},{x:85,y:50},{x:33,y:20},{x:67,y:20}],
};

const RC = r => r >= 8.5 ? "#4ade80" : r >= 7.5 ? "#facc15" : "#f87171";
const FC = f => f >= 90 ? "#4ade80" : f >= 75 ? "#facc15" : "#f87171";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07080b;--bg2:#0d1018;--bg3:#141820;--bg4:#1b2030;
  --b:rgba(255,255,255,0.06);--b2:rgba(255,255,255,0.11);
  --em:#34d399;--em-d:rgba(52,211,153,.09);
  --sk:#38bdf8;--sk-d:rgba(56,189,248,.09);
  --am:#fbbf24;--vi:#a78bfa;--ro:#f87171;
  --tx:#f0f3fa;--mu:#64748b;--mu2:#94a3b8;
  --fs:Syne,sans-serif;--fi:Inter,sans-serif;
}
body{background:var(--bg);color:var(--tx);font-family:var(--fi);overflow-x:hidden}
.app{min-height:100vh;display:flex;flex-direction:column;padding-bottom:64px}

.hdr{background:rgba(7,8,11,.97);backdrop-filter:blur(24px);border-bottom:1px solid var(--b);position:sticky;top:0;z-index:100}
.hdr-in{max-width:1140px;margin:0 auto;display:flex;align-items:center;gap:14px;height:56px;padding:0 16px}
.logo{font-family:var(--fs);font-size:26px;font-weight:800;letter-spacing:-1px;color:#fff;display:flex;align-items:center;gap:8px;flex-shrink:0}
.logo-g{color:var(--em)}
.logo-pill{font-size:8px;background:linear-gradient(135deg,var(--em),var(--sk));color:#000;padding:2px 8px;border-radius:20px;font-family:var(--fi);font-weight:700;letter-spacing:2px;text-transform:uppercase}
.srch{flex:1;max-width:280px;background:var(--bg3);border:1px solid var(--b2);border-radius:10px;display:flex;align-items:center;gap:8px;padding:0 12px;height:37px}
.srch input{background:none;border:none;outline:none;color:var(--tx);font-size:13px;width:100%;font-family:var(--fi)}
.srch input::placeholder{color:var(--mu)}
.live-chip{margin-left:auto;display:flex;align-items:center;gap:6px;background:var(--em-d);border:1px solid rgba(52,211,153,.22);padding:4px 10px;border-radius:20px}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--em);animation:blink 1.4s ease infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
.ltxt{font-size:11px;color:var(--em);font-weight:700;font-family:var(--fs);letter-spacing:.5px}

/* — MATCH TICKER — bright & readable */
.mticker{height:36px;display:flex;align-items:center;overflow:hidden;background:#0a0f1a;border-bottom:1px solid rgba(56,189,248,.2);position:relative}
.mticker::before,.mticker::after{content:'';position:absolute;top:0;bottom:0;width:60px;z-index:2;pointer-events:none}
.mticker::before{left:0;background:linear-gradient(90deg,#0a0f1a,transparent)}
.mticker::after{right:0;background:linear-gradient(270deg,#0a0f1a,transparent)}
.mt-badge{background:linear-gradient(135deg,var(--sk),var(--em));color:#000;padding:0 13px;font-size:9px;font-weight:800;height:100%;display:flex;align-items:center;flex-shrink:0;text-transform:uppercase;letter-spacing:2px;z-index:3}
.mt-scroll{overflow:hidden;flex:1}
.mt-inner{display:flex;animation:scroll 38s linear infinite;white-space:nowrap}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.ti{display:flex;align-items:center;gap:10px;padding:0 24px;font-size:12px}
.ti-lg{font-size:9px;font-weight:800;letter-spacing:1px;color:#fff;background:rgba(56,189,248,.18);border:1px solid rgba(56,189,248,.25);padding:2px 7px;border-radius:4px}
.ti-tm{color:#e2e8f0;font-weight:500}
.ti-sc{font-family:var(--fs);font-size:15px;font-weight:800;color:var(--em);padding:0 6px;background:rgba(52,211,153,.09);border-radius:5px}
.ti-hr{color:var(--am);font-size:11px;font-weight:700;font-family:var(--fs)}
.ti-sep{color:rgba(255,255,255,.12)}

/* — COMMENTARY TICKER — warm amber */
.cticker{height:33px;display:flex;align-items:center;overflow:hidden;background:#0e0d12;border-bottom:1px solid rgba(251,191,36,.15)}
.ct-badge{display:flex;align-items:center;gap:6px;background:rgba(251,191,36,.09);border-right:1px solid rgba(251,191,36,.18);color:var(--am);padding:0 13px;font-size:9px;font-weight:700;height:100%;flex-shrink:0;text-transform:uppercase;letter-spacing:1.5px}
.ct-dot{width:5px;height:5px;border-radius:50%;background:var(--am);animation:blink 1s ease infinite}
.ct-scroll{overflow:hidden;flex:1}
.ct-inner{display:flex;animation:scroll 65s linear infinite;white-space:nowrap}
.ci{display:flex;align-items:center;gap:9px;padding:0 28px;font-size:12px}
.ci-match{color:#7dd3fc;font-weight:600;font-size:11px;flex-shrink:0}
.ci-txt{color:#cbd5e1}
.ci-sep{color:rgba(255,255,255,.1);font-size:16px}

.nav{background:var(--bg2);border-bottom:1px solid var(--b);overflow-x:auto;scrollbar-width:none}
.nav::-webkit-scrollbar{display:none}
.nav-in{max-width:1140px;margin:0 auto;display:flex;padding:0 12px}
.nt{padding:13px 16px;font-size:12px;font-weight:600;color:var(--mu);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;transition:all .2s;display:flex;align-items:center;gap:6px;letter-spacing:.3px}
.nt:hover{color:var(--mu2)}
.nt.active{color:var(--em);border-bottom-color:var(--em)}
.nb{background:linear-gradient(135deg,var(--em),var(--sk));color:#000;font-size:9px;font-weight:800;padding:1px 6px;border-radius:8px}

.main{flex:1;max-width:1140px;margin:0 auto;width:100%;padding:16px}
.layout{display:grid;grid-template-columns:1fr 268px;gap:18px}
@media(max-width:900px){.layout{grid-template-columns:1fr}.sb{display:none}}

.chips{display:flex;gap:6px;overflow-x:auto;margin-bottom:16px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;border:1px solid var(--b2);color:var(--mu);background:var(--bg2)}
.chip:hover{color:var(--mu2)}
.chip.active{background:var(--em-d);border-color:rgba(52,211,153,.38);color:var(--em)}

.mcard{background:var(--bg2);border:1px solid var(--b);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.mcard::after{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px;background:var(--lc,transparent)}
.mcard:hover{background:var(--bg3);border-color:var(--b2);transform:translateY(-1px)}
.mcard.open{border-color:rgba(52,211,153,.28);background:var(--bg3)}
.mc-top{display:flex;align-items:center;gap:12px}
.mc-time{min-width:50px;text-align:center;flex-shrink:0}
.mc-tm{font-family:var(--fs);font-size:15px;font-weight:700;color:var(--am)}
.mc-dt{font-size:10px;color:var(--mu);margin-top:1px}
.mc-teams{flex:1}
.mc-row{display:flex;align-items:center;gap:8px;padding:3px 0}
.mc-ab{font-size:10px;font-weight:700;color:var(--mu);font-family:var(--fs);width:30px}
.mc-nm{font-size:13px;font-weight:500;color:var(--tx);flex:1}
.mc-tc{font-size:9px;background:var(--bg4);color:var(--sk);padding:1px 6px;border-radius:4px;font-weight:600;flex-shrink:0}
.frow{display:flex;gap:2px;margin-top:3px}
.fp{width:13px;height:13px;border-radius:50%;font-size:6px;font-weight:800;display:flex;align-items:center;justify-content:center;color:#fff}
.fpW{background:#22c55e;color:#052e16}.fpD{background:#475569}.fpL{background:#ef4444}
.mc-vs{font-family:var(--fs);font-size:11px;color:var(--mu);text-align:center;flex-shrink:0;width:22px}
.mc-pr{margin-top:10px}
.pbar{display:flex;height:5px;border-radius:3px;overflow:hidden;gap:1px}
.pbh{background:var(--em)}.pbd{background:var(--mu)}.pba{background:var(--am)}
.plbls{display:flex;justify-content:space-between;margin-top:5px}
.pl{font-size:10px;color:var(--mu2)}
.pl strong{color:var(--tx);font-weight:600}
.open-btn{width:100%;margin-top:10px;background:var(--bg4);border:1px solid var(--b2);border-radius:8px;padding:7px;font-size:11px;color:var(--mu2);cursor:pointer;transition:all .15s;font-family:var(--fi)}
.open-btn:hover{background:var(--bg3);color:var(--tx)}

.ctabs{display:flex;border-bottom:1px solid var(--b);margin:14px 0 12px;overflow-x:auto;scrollbar-width:none}
.ctabs::-webkit-scrollbar{display:none}
.ctab{padding:8px 13px;font-size:11px;font-weight:600;color:var(--mu);cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .15s;text-transform:uppercase;letter-spacing:.4px}
.ctab.active{color:var(--em);border-bottom-color:var(--em)}

.tz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-bottom:14px}
.tz-card{background:var(--bg4);border-radius:10px;padding:10px 12px;border:1px solid var(--b)}
.tz-flag{font-size:18px;margin-bottom:4px;line-height:1}
.tz-lbl{font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.tz-time{font-family:var(--fs);font-size:22px;font-weight:700;color:var(--tx)}
.tz-off{font-size:10px;color:var(--mu);font-family:var(--fi);font-weight:400;margin-left:4px}
.bc-ttl{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.bc-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bc-r{background:var(--bg4);border-radius:8px;padding:9px 11px;border:1px solid var(--b)}
.bc-rh{font-size:9px;color:var(--sk);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:flex;align-items:center;gap:4px}
.bc-ch{font-size:11px;color:var(--mu2);padding:2px 0;display:flex;align-items:center;gap:6px}
.bc-ch::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--em);flex-shrink:0}

.comm-list{display:flex;flex-direction:column;gap:6px;max-height:320px;overflow-y:auto}
.comm-list::-webkit-scrollbar{width:3px}
.comm-list::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:2px}
.comm-item{background:var(--bg4);border-radius:8px;padding:10px 12px;font-size:12px;color:#cbd5e1;line-height:1.65;border-left:3px solid transparent}
.comm-goal{border-left-color:var(--em);background:rgba(52,211,153,.04)}
.comm-card{border-left-color:var(--am)}
.comm-red{border-left-color:var(--ro);background:rgba(248,113,113,.04)}
.comm-info{border-left-color:var(--sk);background:rgba(56,189,248,.04)}
.new-badge{display:inline-flex;align-items:center;gap:4px;background:var(--em-d);color:var(--em);font-size:9px;font-weight:700;padding:1px 7px;border-radius:4px;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}

.ai-box{background:linear-gradient(135deg,rgba(52,211,153,.04),rgba(56,189,248,.04));border:1px solid rgba(52,211,153,.18);border-radius:10px;padding:14px}
.ai-hd{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ai-ico{width:30px;height:30px;background:linear-gradient(135deg,var(--em),var(--sk));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.ai-ttl{font-size:11px;font-weight:700;color:var(--em);text-transform:uppercase;letter-spacing:.8px}
.ai-sub{font-size:10px;color:var(--mu)}
.ai-body{font-size:12px;color:var(--mu2);line-height:1.75;white-space:pre-wrap}
.ai-loading{display:flex;align-items:center;gap:8px;color:var(--mu);font-size:12px}
.spin{width:14px;height:14px;border:2px solid var(--b2);border-top-color:var(--em);border-radius:50%;animation:sp .6s linear infinite;flex-shrink:0}
@keyframes sp{to{transform:rotate(360deg)}}
.gen-btn{width:100%;padding:9px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--fi);border:1px solid}
.gen-green{background:var(--em-d);border-color:rgba(52,211,153,.3);color:var(--em)}
.gen-green:hover{background:rgba(52,211,153,.14)}
.gen-violet{background:rgba(167,139,250,.07);border-color:rgba(167,139,250,.28);color:var(--vi)}
.gen-violet:hover{background:rgba(167,139,250,.13)}

.pred-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px}
.pred-cell{background:var(--bg4);border-radius:10px;padding:10px;text-align:center}
.pred-lbl{font-size:10px;color:var(--mu);margin-bottom:4px}
.pred-pct{font-family:var(--fs);font-size:26px;font-weight:800}
.pred-odd{font-size:9px;color:var(--mu);margin-top:2px}
.pred-score{background:var(--bg4);border-radius:10px;padding:12px;display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:10px}
.pred-num{font-family:var(--fs);font-size:42px;font-weight:900;color:var(--tx)}
.pred-sep{font-size:22px;color:var(--mu)}
.pred-tl{font-size:10px;color:var(--mu);text-align:center;margin-top:2px}
.conf-row{background:var(--bg4);border-radius:8px;padding:9px 12px;display:flex;align-items:center;gap:10px;margin-bottom:12px}
.conf-lbl{font-size:10px;color:var(--mu);flex-shrink:0}
.conf-track{flex:1;height:5px;background:var(--bg3);border-radius:3px;overflow:hidden}
.conf-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--em),var(--sk))}
.conf-pct{font-size:12px;font-weight:700;color:var(--em);flex-shrink:0}

.ply-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:600px){.ply-grid{grid-template-columns:1fr}}
.ply-team{background:var(--bg3);border-radius:10px;padding:10px}
.ply-hd{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.ply-row{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid var(--b)}
.ply-row:last-child{border-bottom:none}
.ply-pos{font-size:9px;font-weight:700;color:var(--sk);background:var(--sk-d);padding:1px 5px;border-radius:3px;width:28px;text-align:center;flex-shrink:0}
.ply-nm{font-size:11px;color:var(--tx);flex:1}
.ply-stat{text-align:right;flex-shrink:0}
.ply-r{font-family:var(--fs);font-size:14px;font-weight:700}
.ply-f{font-size:9px;color:var(--mu)}
.ply-bar{width:36px;height:3px;background:var(--bg4);border-radius:2px;overflow:hidden;margin-top:2px}
.ply-fill{height:100%;border-radius:2px}

.tac-split{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:600px){.tac-split{grid-template-columns:1fr}}
.tac-card{background:var(--bg3);border-radius:10px;padding:12px}
.tac-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.tac-team{font-size:12px;font-weight:700}
.tac-badge{font-family:var(--fs);font-size:20px;font-weight:800}
.str-tag{display:inline-flex;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.2);color:var(--em);padding:2px 7px;border-radius:4px;font-size:10px;margin:2px}
.wk-tag{display:inline-flex;background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);color:var(--ro);padding:2px 7px;border-radius:4px;font-size:10px;margin:2px}
.tac-sec{margin-bottom:8px}
.tac-sec-ttl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--mu);margin-bottom:5px}
.new-tac{background:linear-gradient(135deg,rgba(167,139,250,.05),rgba(56,189,248,.05));border:1px solid rgba(167,139,250,.2);border-radius:10px;padding:12px;margin-top:10px}
.new-tac-hd{font-size:10px;font-weight:700;color:var(--vi);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px}

.pitch{background:linear-gradient(180deg,#13401e,#1a5228 50%,#13401e);border-radius:8px;position:relative;border:2px solid #1d5826;overflow:hidden}
.p-lines{position:absolute;inset:6px;border:1px solid rgba(255,255,255,.13);border-radius:2px}
.p-mid{position:absolute;left:8px;right:8px;top:50%;height:1px;background:rgba(255,255,255,.13)}
.p-cir{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:50px;height:50px;border:1px solid rgba(255,255,255,.13);border-radius:50%}
.pp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:1px}
.pp-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:800;color:#fff;border:1.5px solid rgba(255,255,255,.22)}
.pp-nm{font-size:6px;color:rgba(255,255,255,.78);text-align:center;white-space:nowrap;max-width:34px;overflow:hidden;text-overflow:ellipsis}

.stat-row{display:flex;align-items:center;gap:8px;margin-bottom:9px}
.sv-l{font-size:11px;font-weight:700;color:var(--em);width:28px;text-align:right}
.sv-r{font-size:11px;font-weight:700;color:var(--am);width:28px}
.sc-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.sc-lbl{font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.3px}
.sc-bar{width:100%;height:4px;background:var(--bg4);border-radius:2px;display:flex;overflow:hidden}
.sc-lf{background:var(--em);height:100%}.sc-rt{background:var(--am);height:100%}

.sb{display:flex;flex-direction:column;gap:14px}
.sb-card{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:14px}
.sb-ttl{font-family:var(--fs);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;color:var(--tx)}
.sb-match{padding:8px 0;border-bottom:1px solid var(--b);cursor:pointer;transition:opacity .15s}
.sb-match:last-child{border-bottom:none}
.sb-match:hover{opacity:.75}
.sb-ml{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.sb-mt{font-size:11px;color:var(--mu2);display:flex;justify-content:space-between;gap:8px}
.sb-mtime{font-size:10px;color:var(--am);font-weight:700;font-family:var(--fs);flex-shrink:0}
.scorer{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--b)}
.scorer:last-child{border-bottom:none}
.sc-rank{font-size:10px;color:var(--mu);width:14px}
.sc-ava{width:26px;height:26px;border-radius:50%;background:var(--bg3);border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:var(--em);font-family:var(--fs);flex-shrink:0}
.sc-info{flex:1}
.sc-name{font-size:11px;font-weight:500}
.sc-club{font-size:9px;color:var(--mu)}
.sc-goals{font-family:var(--fs);font-size:18px;font-weight:800;color:var(--em)}

.bnav{position:fixed;bottom:0;left:0;right:0;background:rgba(7,8,11,.97);backdrop-filter:blur(20px);border-top:1px solid var(--b);display:flex;padding:8px 0 12px;z-index:100}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}
.bni-ic{font-size:19px}
.bni-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;transition:color .15s}
.divider{height:1px;background:var(--b);margin:12px 0}
`;

function Pitch({ players, formation, color }) {
  const pos = FPOS[formation] || FPOS["4-3-3"];
  return (
    <div className="pitch" style={{ maxWidth: 148, aspectRatio: "0.68", margin: "0 auto" }}>
      <div className="p-lines"/><div className="p-mid"/><div className="p-cir"/>
      {players.slice(0,11).map((p,i) => {
        const pp = pos[i] || {x:50,y:50};
        return <div key={i} className="pp" style={{left:`${pp.x}%`,top:`${pp.y}%`}}>
          <div className="pp-dot" style={{background:color}}>{p.pos[0]}</div>
          <div className="pp-nm">{p.name.split(" ").pop()}</div>
        </div>;
      })}
    </div>
  );
}

function useAI() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const run = useCallback(async (prompt) => {
    setLoading(true); setContent("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000, stream:true,
          system:"Tu es un analyste football expert UEFA Pro. Réponds en français, paragraphes courts et percutants. Pas de titres ##.",
          messages:[{role:"user",content:prompt}]
        })
      });
      const reader = res.body.getReader(); const dec = new TextDecoder(); let txt="";
      while(true){
        const {done,value} = await reader.read(); if(done) break;
        for(const line of dec.decode(value).split("\n").filter(l=>l.startsWith("data: "))){
          try{ const j=JSON.parse(line.slice(6)); if(j.type==="content_block_delta"&&j.delta?.text){txt+=j.delta.text;setContent(txt);} }catch{}
        }
      }
    } catch{ setContent("Analyse temporairement indisponible."); }
    setLoading(false);
  }, []);
  return {loading, content, run};
}

function BroadcastTab({match}) {
  const RL = {MA:{label:"Maroc",flag:"🇲🇦"},EU:{label:"Europe",flag:"🇪🇺"},ME:{label:"Moyen-Orient",flag:"🇸🇦"},US:{label:"États-Unis",flag:"🇺🇸"},UK:{label:"Royaume-Uni",flag:"🇬🇧"}};
  return <div>
    <div style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
      <span>🕐</span> Horaires locaux — Coup d'envoi {match.utcTime} UTC
    </div>
    <div className="tz-grid">
      {ZONES.map(z=><div key={z.key} className="tz-card">
        <div className="tz-flag">{z.flag}</div>
        <div className="tz-lbl">{z.label}</div>
        <div className="tz-time">{convertTime(match.utcTime,z.offset)}<span className="tz-off">{z.offset>=0?`UTC+${z.offset}`:`UTC${z.offset}`}</span></div>
      </div>)}
    </div>
    <div className="bc-ttl"><span>📺</span> Où regarder ?</div>
    <div className="bc-grid">
      {Object.entries(match.broadcast).map(([r,chs])=>{
        const rl=RL[r]||{label:r,flag:"📡"};
        return <div key={r} className="bc-r">
          <div className="bc-rh">{rl.flag} {rl.label}</div>
          {chs.map((ch,i)=><div key={i} className="bc-ch">{ch}</div>)}
        </div>;
      })}
    </div>
  </div>;
}

function CommentaryTab({match}) {
  const {loading,content,run} = useAI();
  const [aiMode,setAiMode] = useState(false);
  const getType = t => t.includes("BUUUT")||t.includes("⚽")?"comm-goal":t.includes("🟥")||t.includes("EXPULSÉ")?"comm-red":t.includes("🟨")?"comm-card":"comm-info";
  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"var(--am)",animation:"blink 1s infinite"}}/>
        <span style={{fontSize:10,color:"var(--am)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Commentaire en direct</span>
      </div>
      {!aiMode&&<button className="gen-btn gen-green" style={{width:"auto",padding:"4px 10px",fontSize:10}} onClick={()=>{setAiMode(true);run(`Génère 6 commentaires live immersifs pour ${match.home} vs ${match.away}. Format: "XX' — texte court". Séparés par ligne vide. Buts, actions, ambiance.`);}}>✨ Générer IA</button>}
    </div>
    {aiMode&&<div className="ai-box" style={{marginBottom:12}}>
      {loading?<div className="ai-loading"><div className="spin"/>Génération...</div>:<div className="ai-body">{content}</div>}
    </div>}
    <div className="comm-list">
      {match.commentary.map((c,i)=><div key={i} className={`comm-item ${getType(c)}`}>
        {i===0&&<div className="new-badge"><span style={{width:5,height:5,borderRadius:"50%",background:"var(--em)",display:"inline-block"}}/>Dernier événement</div>}
        {c}
      </div>)}
    </div>
  </div>;
}

function PredictionTab({match}) {
  const {loading,content,run} = useAI(); const [done,setDone]=useState(false);
  const conf=Math.max(match.homeProb,match.awayProb,match.drawProb);
  return <div>
    <div className="pred-grid">
      {[{l:match.homeAbbr,p:match.homeProb,c:match.homeProb>match.awayProb?"var(--em)":"var(--mu2)"},{l:"Nul",p:match.drawProb,c:"var(--mu2)"},{l:match.awayAbbr,p:match.awayProb,c:match.awayProb>match.homeProb?"var(--am)":"var(--mu2)"}].map((x,i)=><div key={i} className="pred-cell">
        <div className="pred-lbl">{x.l}</div>
        <div className="pred-pct" style={{color:x.c}}>{x.p}%</div>
        <div className="pred-odd">cote {(100/x.p).toFixed(2)}x</div>
      </div>)}
    </div>
    <div className="pred-score">
      <div><div className="pred-num">{match.homeProb>match.awayProb?2:1}</div><div className="pred-tl">{match.homeAbbr}</div></div>
      <div className="pred-sep">:</div>
      <div><div className="pred-num">{match.homeProb>match.awayProb?1:2}</div><div className="pred-tl">{match.awayAbbr}</div></div>
    </div>
    <div className="conf-row"><span className="conf-lbl">Confiance IA</span><div className="conf-track"><div className="conf-fill" style={{width:`${conf}%`}}/></div><span className="conf-pct">{conf}%</span></div>
    {!done?<button className="gen-btn gen-green" onClick={()=>{setDone(true);run(`Pronostic: ${match.home} vs ${match.away} (${match.league}). Forme: ${match.homeForm.join(",")} vs ${match.awayForm.join(",")}. Tactiques: ${match.homeTactic} vs ${match.awayTactic}. Probs: ${match.homeProb}%/${match.drawProb}%/${match.awayProb}%. 4 paragraphes: score prédit, facteurs, joueur clé, confiance.`);}}>✨ Générer l'analyse IA complète</button>
    :<div className="ai-box"><div className="ai-hd"><div className="ai-ico">🤖</div><div><div className="ai-ttl">Analyse GoaLive</div><div className="ai-sub">Forme · Historique · Tactique</div></div></div>{loading?<div className="ai-loading"><div className="spin"/>Analyse...</div>:<div className="ai-body">{content}</div>}</div>}
  </div>;
}

function PlayersTab({match}) {
  const {loading,content,run}=useAI(); const [done,setDone]=useState(false);
  return <div>
    <div className="ply-grid">
      {[{team:match.home,pl:match.homePlayers,col:"var(--em)"},{team:match.away,pl:match.awayPlayers,col:"var(--am)"}].map(({team,pl,col})=><div key={team} className="ply-team">
        <div className="ply-hd" style={{color:col}}>{team}</div>
        {pl.map((p,i)=><div key={i} className="ply-row">
          <span className="ply-pos">{p.pos}</span>
          <span className="ply-nm">{p.name}</span>
          <div className="ply-stat">
            <div className="ply-r" style={{color:RC(p.rating)}}>{p.rating}</div>
            <div className="ply-f">{p.fit}%</div>
            <div className="ply-bar"><div className="ply-fill" style={{width:`${p.fit}%`,background:FC(p.fit)}}/></div>
          </div>
        </div>)}
      </div>)}
    </div>
    <div className="divider"/>
    {!done?<button className="gen-btn gen-green" onClick={()=>{setDone(true);const th=match.homePlayers.sort((a,b)=>b.rating-a.rating).slice(0,3).map(p=>`${p.name}(${p.rating})`).join(",");const ta=match.awayPlayers.sort((a,b)=>b.rating-a.rating).slice(0,3).map(p=>`${p.name}(${p.rating})`).join(",");run(`Analyse joueurs: ${match.home} top3: ${th} | ${match.away} top3: ${ta}. Duels clés, joueur décisif, condition physique. 3 paragraphes.`);}}>🏃 Analyser les conditions joueurs</button>
    :<div className="ai-box"><div className="ai-hd"><div className="ai-ico">🏃</div><div><div className="ai-ttl">Conditions & Duels</div><div className="ai-sub">Forme physique · Impact</div></div></div>{loading?<div className="ai-loading"><div className="spin"/>Analyse...</div>:<div className="ai-body">{content}</div>}</div>}
  </div>;
}

function TacticsTab({match}) {
  const {loading,content,run}=useAI(); const [done,setDone]=useState(false);
  const TD={"4-3-3":{str:["Largeur","Pressing","Milieu 3"],wk:["Ailes exposées","Transitions"]},"4-2-3-1":{str:["Double pivot","Équilibre","n°10"],wk:["Dépend n°10","Chargé"]},"4-4-2":{str:["Compacité","2 attaquants","Contre"],wk:["Milieu dépassé","Peu créatif"]}};
  return <div>
    <div className="tac-split">
      {[{team:match.home,tac:match.homeTactic,col:"#34d399",pl:match.homePlayers},{team:match.away,tac:match.awayTactic,col:"#fbbf24",pl:match.awayPlayers}].map(({team,tac,col,pl})=>{
        const d=TD[tac]||TD["4-3-3"];
        return <div key={team} className="tac-card">
          <div className="tac-hd"><span className="tac-team">{team}</span><span className="tac-badge" style={{color:col}}>{tac}</span></div>
          <Pitch players={pl} formation={tac} color={col}/>
          <div style={{marginTop:10}}>
            <div className="tac-sec"><div className="tac-sec-ttl">✅ Forces</div><div>{d.str.map((s,i)=><span key={i} className="str-tag">{s}</span>)}</div></div>
            <div className="tac-sec"><div className="tac-sec-ttl">⚠️ Faiblesses</div><div>{d.wk.map((w,i)=><span key={i} className="wk-tag">{w}</span>)}</div></div>
          </div>
        </div>;
      })}
    </div>
    <div className="new-tac">
      <div className="new-tac-hd">💡 Proposition tactique IA</div>
      {!done?<button className="gen-btn gen-violet" onClick={()=>{setDone(true);run(`Analyse tactique: ${match.home}(${match.homeTactic}) vs ${match.away}(${match.awayTactic}). Forces/faiblesses de chaque système, exploits possibles, adaptation recommandée, plan gagnant. 4 paragraphes.`);}}>♟️ Générer l'analyse tactique</button>
      :loading?<div className="ai-loading"><div className="spin"/>Analyse tactique...</div>:<div className="ai-body" style={{fontSize:12,lineHeight:1.75}}>{content}</div>}
    </div>
  </div>;
}

function StatsTab({match}) {
  const rows=[{lbl:"Possession",h:match.stats.homePoss,a:match.stats.awayPoss,u:"%"},{lbl:"Tirs",h:match.stats.homeShots,a:match.stats.awayShots},{lbl:"Corners",h:match.stats.homeCorners,a:match.stats.awayCorners},{lbl:"xG",h:(match.homeProb/42).toFixed(1),a:(match.awayProb/42).toFixed(1)}];
  return <div style={{paddingTop:4}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontSize:12,fontWeight:700,color:"var(--em)"}}>{match.home}</span>
      <span style={{fontSize:12,fontWeight:700,color:"var(--am)"}}>{match.away}</span>
    </div>
    {rows.map((r,i)=>{const tot=parseFloat(r.h)+parseFloat(r.a);const lp=tot>0?(parseFloat(r.h)/tot)*100:50;return <div key={i} className="stat-row">
      <span className="sv-l">{r.h}{r.u||""}</span>
      <div className="sc-c"><span className="sc-lbl">{r.lbl}</span><div className="sc-bar"><div className="sc-lf" style={{width:`${lp}%`}}/><div className="sc-rt" style={{width:`${100-lp}%`}}/></div></div>
      <span className="sv-r">{r.a}{r.u||""}</span>
    </div>;})}
  </div>;
}

function MatchCard({match,open,onToggle}) {
  const [tab,setTab]=useState("broadcast");
  const tabs=[{id:"broadcast",l:"📺 Diffusion"},{id:"commentary",l:"🎙️ Commentaire"},{id:"prediction",l:"🎯 Pronostic"},{id:"players",l:"🏃 Joueurs"},{id:"tactics",l:"♟️ Tactiques"},{id:"stats",l:"📊 Stats"}];
  return <div className={`mcard ${open?"open":""}`} style={{"--lc":match.leagueColor}}>
    <div className="mc-top" onClick={onToggle}>
      <div className="mc-time">
        <div className="mc-tm">{convertTime(match.utcTime,1)}</div>
        <div className="mc-dt">{match.date}</div>
      </div>
      <div className="mc-teams">
        <div style={{marginBottom:5}}><span style={{fontSize:9,color:match.leagueColor,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",background:`${match.leagueColor}18`,padding:"1px 7px",borderRadius:4}}>{match.league}</span></div>
        {[{ab:match.homeAbbr,nm:match.home,tc:match.homeTactic,fm:match.homeForm},{ab:match.awayAbbr,nm:match.away,tc:match.awayTactic,fm:match.awayForm}].map((t,i)=><div key={i} className="mc-row">
          <span className="mc-ab">{t.ab}</span><span className="mc-nm">{t.nm}</span><span className="mc-tc">{t.tc}</span>
          <div className="frow">{t.fm.map((f,j)=><div key={j} className={`fp fp${f}`}>{f}</div>)}</div>
        </div>)}
      </div>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div className="mc-vs">VS</div>
        <div style={{fontSize:10,color:"var(--mu)",marginTop:4}}>{open?"▲":"▼"}</div>
      </div>
    </div>
    <div className="mc-pr">
      <div className="pbar">
        <div className="pbh" style={{width:`${match.homeProb}%`}}/><div className="pbd" style={{width:`${match.drawProb}%`}}/><div className="pba" style={{width:`${match.awayProb}%`}}/>
      </div>
      <div className="plbls">
        <span className="pl"><strong>{match.homeProb}%</strong> {match.homeAbbr}</span>
        <span className="pl">Nul <strong>{match.drawProb}%</strong></span>
        <span className="pl">{match.awayAbbr} <strong>{match.awayProb}%</strong></span>
      </div>
    </div>
    {open?<>
      <div className="ctabs">{tabs.map(t=><div key={t.id} className={`ctab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>)}</div>
      {tab==="broadcast"&&<BroadcastTab match={match}/>}
      {tab==="commentary"&&<CommentaryTab match={match}/>}
      {tab==="prediction"&&<PredictionTab match={match}/>}
      {tab==="players"&&<PlayersTab match={match}/>}
      {tab==="tactics"&&<TacticsTab match={match}/>}
      {tab==="stats"&&<StatsTab match={match}/>}
    </>:<button className="open-btn" onClick={onToggle}>📺 Chaînes · 🕐 Fuseaux horaires · 🎙️ Commentaire · 🎯 Pronostic IA ▼</button>}
  </div>;
}

function Sidebar({onSelect}) {
  const scorers=[{n:"Harry Kane",c:"Bayern Munich",g:31,a:"HK"},{n:"Mohamed Salah",c:"Liverpool FC",g:24,a:"MS"},{n:"Erling Haaland",c:"Man City",g:27,a:"EH"},{n:"Bukayo Saka",c:"Arsenal FC",g:18,a:"BS"},{n:"Ousmane Dembélé",c:"PSG",g:20,a:"OD"}];
  return <div className="sb">
    <div className="sb-card">
      <div className="sb-ttl">⚡ À l'affiche</div>
      {MATCHES_DATA.map(m=><div key={m.id} className="sb-match" onClick={()=>onSelect(m.id)}>
        <div className="sb-ml" style={{color:m.leagueColor}}>{m.league}</div>
        <div className="sb-mt"><span>{m.home} vs {m.away}</span><span className="sb-mtime">{convertTime(m.utcTime,1)}</span></div>
      </div>)}
    </div>
    <div className="sb-card">
      <div className="sb-ttl">🥅 Top Buteurs</div>
      {scorers.map((s,i)=><div key={i} className="scorer">
        <span className="sc-rank">{i+1}</span>
        <div className="sc-ava">{s.a}</div>
        <div className="sc-info"><div className="sc-name">{s.n}</div><div className="sc-club">{s.c}</div></div>
        <span className="sc-goals">{s.g}</span>
      </div>)}
    </div>
    <div className="sb-card" style={{background:"linear-gradient(135deg,rgba(52,211,153,.04),rgba(56,189,248,.04))",border:"1px solid rgba(52,211,153,.16)"}}>
      <div className="sb-ttl" style={{background:"linear-gradient(135deg,var(--em),var(--sk))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 GoaLive IA</div>
      <p style={{fontSize:11,color:"var(--mu2)",lineHeight:1.65}}>Pronostics & analyses propulsés par Claude AI — forme, tactique, joueurs clés.</p>
    </div>
  </div>;
}

export default function GoaLive() {
  const [page,setPage]=useState("home");
  const [openId,setOpenId]=useState(null);
  const navs=[{id:"home",ic:"⚡",l:"Matchs"},{id:"ai",ic:"🤖",l:"IA"},{id:"tactics",ic:"♟️",l:"Tactiques"}];

  const allComm=MATCHES_DATA.flatMap(m=>m.commentary.map(c=>({match:`${m.home} vs ${m.away}`,text:c})));
  const allComm2=[...allComm,...allComm];
  const tItems=[{lg:"UCL",h:"Real Madrid",a:"Bayern",t:convertTime("19:00",1)},{lg:"UCL",h:"PSG",a:"Liverpool",t:convertTime("19:00",1)},{lg:"EPL",h:"Arsenal",a:"Bournemouth",t:convertTime("11:30",1)},{lg:"EPL",h:"Chelsea",a:"Man City",t:convertTime("13:30",1)},{lg:"LA LIGA",h:"Real Madrid",a:"Sevilla",t:"21:00"},{lg:"BOTOLA",h:"Wydad AC",a:"Raja Club",t:"20:00"}];
  const tItems2=[...tItems,...tItems];

  return <>
    <style>{css}</style>
    <div className="app">
      <header className="hdr">
        <div className="hdr-in">
          <div className="logo">Goa<span className="logo-g">Live</span><span className="logo-pill">Beta</span></div>
          <div className="srch"><span style={{color:"var(--mu)",fontSize:13}}>🔍</span><input placeholder="Équipe, compétition…"/></div>
          <div className="live-chip"><div className="ldot"/><span className="ltxt">3 Live</span></div>
        </div>
      </header>

      {/* MATCH TICKER */}
      <div className="mticker">
        <div className="mt-badge">Matchs</div>
        <div className="mt-scroll">
          <div className="mt-inner">
            {tItems2.map((t,i)=><div key={i} className="ti">
              <span className="ti-lg">{t.lg}</span>
              <span className="ti-tm">{t.h}</span>
              <span className="ti-sc">— vs —</span>
              <span className="ti-tm">{t.a}</span>
              <span className="ti-hr">{t.t}</span>
              <span className="ti-sep">|</span>
            </div>)}
          </div>
        </div>
      </div>

      {/* COMMENTARY TICKER */}
      <div className="cticker">
        <div className="ct-badge"><div className="ct-dot"/>Commentaire Live</div>
        <div className="ct-scroll">
          <div className="ct-inner">
            {allComm2.map((c,i)=><div key={i} className="ci">
              <span className="ci-match">{c.match}</span>
              <span className="ci-txt">{c.text}</span>
              <span className="ci-sep">·</span>
            </div>)}
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-in">
          {navs.map(n=><div key={n.id} className={`nt ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
            {n.ic} {n.l}{n.id==="ai"&&<span className="nb">IA</span>}
          </div>)}
        </div>
      </nav>

      <main className="main">
        <div className="layout">
          <div>
            {(page==="home"||page==="ai")&&MATCHES_DATA.map(m=><MatchCard key={m.id} match={m} open={openId===m.id} onToggle={()=>setOpenId(p=>p===m.id?null:m.id)}/>)}
            {page==="tactics"&&MATCHES_DATA.map(m=><div key={m.id} className="mcard" style={{marginBottom:12,"--lc":m.leagueColor}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div><div style={{fontSize:10,color:m.leagueColor,marginBottom:2}}>{m.league} · {m.date}</div><div style={{fontSize:14,fontWeight:700}}>{m.home} <span style={{color:"var(--mu)"}}>vs</span> {m.away}</div></div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontFamily:"var(--fs)",fontSize:18,fontWeight:800,color:"var(--em)"}}>{m.homeTactic}</span>
                  <span style={{color:"var(--mu)"}}>vs</span>
                  <span style={{fontFamily:"var(--fs)",fontSize:18,fontWeight:800,color:"var(--am)"}}>{m.awayTactic}</span>
                </div>
              </div>
              <TacticsTab match={m}/>
            </div>)}
          </div>
          <Sidebar onSelect={id=>{setOpenId(id);setPage("home");setTimeout(()=>document.getElementById(`m${id}`)?.scrollIntoView({behavior:"smooth"}),100);}}/>
        </div>
      </main>

      <nav className="bnav">
        {navs.map(n=><div key={n.id} className="bni" onClick={()=>setPage(n.id)}>
          <span className="bni-ic">{n.ic}</span>
          <span className="bni-lbl" style={{color:page===n.id?"var(--em)":"var(--mu)"}}>{n.l}</span>
        </div>)}
      </nav>
    </div>
  </>;
}
