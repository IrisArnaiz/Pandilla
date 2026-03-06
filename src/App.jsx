import { useState, useRef, useEffect } from "react";
import {
  Home, Calendar, Gamepad2, Users, Bell, Send, Heart, MessageCircle,
  Share2, ChevronDown, ChevronUp, Plus, CheckCircle, X, Mail,
  Utensils, Dumbbell, Trophy, Clock, MapPin, UserPlus, Wifi, WifiOff,
  Dice5, Image, Flame, Coffee, Smile, ArrowLeft, Star, User,
  Settings, Edit3, Camera, Award, LogOut, ChevronRight,
  Hash, AtSign
} from "lucide-react";

const C = {
  bg: "#f8f5ff",
  bgDeep: "#ede8fa",
  card: "#ffffff",
  cardWarm: "#fbf9ff",
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  accentSoft: "#ede9fe",
  pink: "#db2777",
  pinkSoft: "#fce7f3",
  green: "#059669",
  greenSoft: "#d1fae5",
  orange: "#ea580c",
  orangeSoft: "#ffedd5",
  blue: "#2563eb",
  blueSoft: "#dbeafe",
  teal: "#0d9488",
  tealSoft: "#ccfbf1",
  text: "#1e1030",
  muted: "#6b7280",
  mutedLight: "#a78bfa",
  border: "#e5e0f8",
  shadow: "rgba(124,58,237,0.10)",
};

const S = {
  app: { background: C.bg, minHeight: "100vh", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", color: C.text, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" },
  header: { padding: "16px 20px 14px", background: "rgba(248,245,255,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 20, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 22, fontWeight: "bold", color: C.accent, letterSpacing: "-0.5px", fontStyle: "italic", display: "flex", alignItems: "center", gap: 8 },
  avatar: (color = C.accent, size = 38) => ({ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: "bold", color: "white", flexShrink: 0, boxShadow: `0 2px 8px ${C.shadow}`, letterSpacing: "-0.5px" }),
  card: (borderColor) => ({ background: C.card, borderRadius: 18, border: `1px solid ${borderColor || C.border}`, boxShadow: `0 2px 12px ${C.shadow}`, overflow: "hidden" }),
  pill: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color: color, borderRadius: 20, padding: "4px 11px", fontSize: 12, fontWeight: "bold" }),
  btn: (bg, color = "white", ghost) => ({ background: ghost ? "transparent" : bg, color: ghost ? bg : color, border: ghost ? `1.5px solid ${bg}` : "none", borderRadius: 24, padding: "10px 18px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7, boxShadow: ghost ? "none" : `0 2px 10px ${C.shadow}`, transition: "all 0.18s" }),
  nav: { display: "flex", background: C.card, borderTop: `1px solid ${C.border}`, position: "sticky", bottom: 0, zIndex: 20, boxShadow: "0 -4px 20px rgba(124,58,237,0.08)" },
  navBtn: (active) => ({ flex: 1, padding: "11px 4px 9px", background: active ? C.accentSoft : "none", border: "none", color: active ? C.accent : C.muted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontFamily: "inherit", fontWeight: active ? "bold" : "normal" }),
  content: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 16 },
  input: { background: C.bgDeep, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" },
};

const USERS = [
  { name: "Iris",   fullName: "Iris Arnaiz",  initials: "IA", color: C.accent   },
  { name: "Gemma",  fullName: "Gemma Gili",   initials: "GG", color: C.pink     },
  { name: "Fatou",  fullName: "Fatou",         initials: "FA", color: C.teal     },
  { name: "Alba",   fullName: "Alba López",   initials: "AL", color: C.orange   },
  { name: "Wifi",   fullName: "Wifi",          initials: "WF", color: C.blue     },
  { name: "Ali",    fullName: "Ali",           initials: "AL", color: C.green    },
];

// ─── FEED ─────────────────────────────────────────────────────────────────────
const POSTS = [
  { id:1, user:USERS[1], time:"hace 20 min", type:"food",  title:"Pasta a la carbonara",    desc:"Receta de mi abuela, sin nata por favor 🙏 Os traigo tupper el martes.",       Icon:Utensils, iconBg:C.pinkSoft,   iconColor:C.pink,   likes:11, comments:4 },
  { id:2, user:USERS[2], time:"hace 1h",     type:"plan",  title:"Playa el domingo — 11:00",desc:"¿Alguien se apunta? Que hace bueno y me muero en casa.",                       Icon:Flame,    iconBg:C.tealSoft,   iconColor:C.teal,   likes:5,  comments:7, going:2, total:6 },
  { id:3, user:USERS[3], time:"hace 3h",     type:"food",  title:"Arroz con leche",         desc:"Lo hice anoche y sobró mucho, quien quiera que venga a casa 🍚",               Icon:Coffee,   iconBg:C.orangeSoft, iconColor:C.orange, likes:17, comments:9 },
  { id:4, user:USERS[4], time:"hace 5h",     type:"plan",  title:"Gym mañana — 8:00",       desc:"Día de piernas. La que no venga paga las cañas, ya sabéis.",                   Icon:Dumbbell, iconBg:C.blueSoft,   iconColor:C.blue,   likes:3,  comments:2, going:3, total:6 },
];

function FeedTab() {
  const [liked, setLiked] = useState({});
  const [going, setGoing] = useState({});
  const [compose, setCompose] = useState(false);
  const [ctype, setCtype] = useState("food");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:15 }}>
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}>
        {USERS.map((u,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
            <div style={{ padding:2.5, borderRadius:"50%", background: i===0 ? C.border : `linear-gradient(135deg,${u.color}dd,${u.color}88)` }}>
              <div style={{ ...S.avatar(i===0?C.bgDeep:u.color,50), border:`2.5px solid ${C.bg}` }}>
                {i===0 ? <Plus size={20} strokeWidth={2} color={C.muted}/> : u.initials[0]}
              </div>
            </div>
            <span style={{ fontSize:11, color:C.muted, maxWidth:52, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</span>
          </div>
        ))}
      </div>
      {!compose ? (
        <div onClick={()=>setCompose(true)} style={{ ...S.card(), padding:"13px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, background:C.cardWarm }}>
          <div style={S.avatar(C.accent,38)}>IA</div>
          <span style={{ color:C.muted, fontSize:14, flex:1, fontStyle:"italic" }}>¿Qué hay de nuevo? Comparte algo…</span>
          <Image size={20} color={C.accentLight} strokeWidth={1.6}/>
        </div>
      ) : (
        <div style={{ ...S.card(C.accentLight+"60"), padding:16, display:"flex", flexDirection:"column", gap:12, background:C.cardWarm }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[["food",Utensils,"Plato"],["plan",Calendar,"Plan"],["photo",Image,"Foto"]].map(([t,Ico,lbl])=>(
              <button key={t} onClick={()=>setCtype(t)} style={{ ...S.pill(ctype===t?C.accentSoft:C.bgDeep, ctype===t?C.accent:C.muted), border:`1.5px solid ${ctype===t?C.accentLight:C.border}`, cursor:"pointer", padding:"6px 13px" }}>
                <Ico size={13} strokeWidth={1.8}/> {lbl}
              </button>
            ))}
          </div>
          <textarea placeholder={ctype==="food"?"¿Qué has cocinado hoy?":ctype==="plan"?"Describe el plan…":"Describe tu foto…"} style={{ ...S.input, resize:"none", height:80 }}/>
          <div style={{ display:"flex", gap:8 }}>
            <button style={S.btn(C.accent)}><Send size={14} strokeWidth={2}/> Publicar</button>
            <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setCompose(false)}><X size={14} strokeWidth={2}/> Cancelar</button>
          </div>
        </div>
      )}
      {POSTS.map(p=>(
        <div key={p.id} style={{ ...S.card(), background:C.cardWarm }}>
          <div style={{ padding:"15px 16px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
              <div style={S.avatar(p.user.color,40)}>{p.user.initials[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:"bold", fontSize:14 }}>{p.user.fullName}</div>
                <div style={{ fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                  <Clock size={11} strokeWidth={1.8} color={C.accentLight}/> {p.time}
                </div>
              </div>
              <span style={S.pill(p.type==="food"?C.pinkSoft:C.tealSoft, p.type==="food"?C.pink:C.teal)}>
                {p.type==="food"?<><Utensils size={11} strokeWidth={1.8}/> Cocina</>:<><Calendar size={11} strokeWidth={1.8}/> Plan</>}
              </span>
            </div>
            <div style={{ background:`linear-gradient(135deg,${p.iconBg},${p.user.color}18)`, borderRadius:14, height:148, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, marginBottom:13, border:`1px solid ${C.border}` }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"white", boxShadow:`0 4px 16px ${C.shadow}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <p.Icon size={26} color={p.iconColor} strokeWidth={1.4}/>
              </div>
              <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>Foto compartida</span>
            </div>
            <div style={{ fontWeight:"bold", fontSize:15, marginBottom:5 }}>{p.title}</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:13 }}>{p.desc}</div>
            {p.type==="plan" && (
              <div style={{ background:C.bgDeep, borderRadius:12, padding:"10px 14px", marginBottom:13, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.muted, display:"flex", alignItems:"center", gap:6 }}>
                  <Users size={14} strokeWidth={1.8} color={C.accentLight}/> {p.going}/{p.total} apuntadas
                </span>
                <button style={S.btn(going[p.id]?C.green:C.accent)} onClick={()=>setGoing(g=>({...g,[p.id]:!g[p.id]}))}>
                  {going[p.id]?<><CheckCircle size={14} strokeWidth={2}/> Apuntada</>:<><Plus size={14} strokeWidth={2}/> Me apunto</>}
                </button>
              </div>
            )}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, display:"flex" }}>
            {[
              { Ic:Heart, label:p.likes+(liked[p.id]?1:0), active:liked[p.id], color:C.pink, action:()=>setLiked(l=>({...l,[p.id]:!l[p.id]})) },
              { Ic:MessageCircle, label:p.comments, active:false, color:C.muted, action:()=>{} },
              { Ic:Share2, label:"Compartir", active:false, color:C.muted, action:()=>{} },
            ].map((b,i)=>(
              <button key={i} onClick={b.action} style={{ flex:1, padding:"11px 4px", background:"none", border:"none", color:b.active?b.color:C.muted, cursor:"pointer", fontFamily:"inherit", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <b.Ic size={16} strokeWidth={b.active?2.2:1.6} color={b.active?b.color:C.muted} fill={b.active&&b.Ic===Heart?b.color:"none"}/>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PLANES ───────────────────────────────────────────────────────────────────
const PLANS = [
  { id:1, title:"Playa — El Arbeyal",      date:"Dom 9 Mar · 11:00",  Icon:Flame,    color:C.teal,   colorSoft:C.tealSoft,   going:["GG","FA"],          pending:["AL","WF","Ali"], max:6 },
  { id:2, title:"Cena en casa de Iris",    date:"Vie 14 Mar · 21:00", Icon:Utensils, color:C.accent, colorSoft:C.accentSoft, going:["GG","FA","AL","WF","Ali"], pending:[], max:6 },
  { id:3, title:"Gym · Día de piernas",    date:"Lun 10 Mar · 8:00",  Icon:Dumbbell, color:C.blue,   colorSoft:C.blueSoft,   going:["WF","Ali"],         pending:["FA"],       max:6 },
  { id:4, title:"Vermut de domingo",       date:"Dom 16 Mar · 13:00", Icon:Coffee,   color:C.orange, colorSoft:C.orangeSoft, going:["GG"],               pending:["FA","AL","WF","Ali"], max:6 },
];
function PlanesTab() {
  const [open,setOpen]=useState(null);
  const [newPlan,setNewPlan]=useState(false);
  const [joined,setJoined]=useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <button style={S.btn(C.accent)} onClick={()=>setNewPlan(true)}><Plus size={15} strokeWidth={2.2}/> Crear plan</button>
      {newPlan && (
        <div style={{ ...S.card(C.accentLight+"50"), padding:18, display:"flex", flexDirection:"column", gap:12, background:C.cardWarm }}>
          <div style={{ fontWeight:"bold", fontSize:16, display:"flex", alignItems:"center", gap:8 }}><Calendar size={18} color={C.accent} strokeWidth={1.7}/> Nuevo plan</div>
          {["Nombre del plan","Lugar o dirección"].map(ph=><input key={ph} placeholder={ph} style={S.input}/>)}
          <input type="datetime-local" style={S.input}/>
          <textarea placeholder="Descripción…" style={{ ...S.input, resize:"none", height:70 }}/>
          <div style={{ display:"flex", gap:8 }}>
            <button style={S.btn(C.accent)} onClick={()=>setNewPlan(false)}><CheckCircle size={14} strokeWidth={2}/> Crear</button>
            <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setNewPlan(false)}><X size={14} strokeWidth={2}/> Cancelar</button>
          </div>
        </div>
      )}
      {PLANS.map(pl=>(
        <div key={pl.id} style={{ ...S.card(), background:C.cardWarm, cursor:"pointer" }} onClick={()=>setOpen(open===pl.id?null:pl.id)}>
          <div style={{ padding:16, display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:50,height:50,borderRadius:14,flexShrink:0,background:pl.colorSoft,border:`1px solid ${pl.color}33`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <pl.Icon size={22} color={pl.color} strokeWidth={1.5}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"bold", fontSize:14 }}>{pl.title}</div>
              <div style={{ fontSize:12,color:C.muted,marginTop:3,display:"flex",alignItems:"center",gap:5 }}><MapPin size={11} strokeWidth={1.8} color={C.accentLight}/> {pl.date}</div>
              <div style={{ display:"flex",gap:5,marginTop:9,flexWrap:"wrap" }}>
                {pl.going.map(i=><span key={i} style={S.pill(C.greenSoft,C.green)}><CheckCircle size={10} strokeWidth={2}/> {i}</span>)}
                {pl.pending.map(i=><span key={i} style={S.pill(C.bgDeep,C.muted)}><Clock size={10} strokeWidth={1.8}/> {i}</span>)}
              </div>
            </div>
            {open===pl.id?<ChevronUp size={18} color={C.muted} strokeWidth={1.8} style={{ marginTop:4 }}/>:<ChevronDown size={18} color={C.muted} strokeWidth={1.8} style={{ marginTop:4 }}/>}
          </div>
          {open===pl.id && (
            <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
              <div style={{ fontSize:13,color:C.muted,marginBottom:12,display:"flex",alignItems:"center",gap:5 }}>
                <Users size={14} strokeWidth={1.7} color={C.accentLight}/> {pl.going.length} de {pl.max} confirmadas
              </div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                <button style={S.btn(joined[pl.id]?C.green:C.accent)} onClick={e=>{e.stopPropagation();setJoined(j=>({...j,[pl.id]:!j[pl.id]}))}}>
                  {joined[pl.id]?<><CheckCircle size={14} strokeWidth={2}/> Apuntada</>:<><Plus size={14} strokeWidth={2}/> Me apunto</>}
                </button>
                <button style={S.btn(C.pink,"white",true)} onClick={e=>e.stopPropagation()}><X size={14} strokeWidth={2}/> No puedo</button>
                <button style={S.btn(C.teal,"white",true)} onClick={e=>e.stopPropagation()}><MessageCircle size={14} strokeWidth={1.8}/> Chat</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── JUEGOS ───────────────────────────────────────────────────────────────────
const GAMES=[
  { id:"parcheesi", name:"Parchís",       Icon:Dice5,    players:"2–4", online:2, color:C.accent, colorSoft:C.accentSoft },
  { id:"rummy",     name:"Rummikub",      Icon:Star,     players:"2–4", online:1, color:C.pink,   colorSoft:C.pinkSoft   },
  { id:"domino",    name:"Dominó",        Icon:Gamepad2, players:"2–4", online:0, color:C.teal,   colorSoft:C.tealSoft   },
  { id:"trivia",    name:"Trivia Equipo", Icon:Smile,    players:"2–6", online:3, color:C.orange, colorSoft:C.orangeSoft },
];
const DOTS={1:[[50,50]],2:[[28,28],[72,72]],3:[[28,28],[50,50],[72,72]],4:[[28,28],[72,28],[28,72],[72,72]],5:[[28,28],[72,28],[50,50],[28,72],[72,72]],6:[[28,28],[72,28],[28,50],[72,50],[28,72],[72,72]]};

function ParcheesiGame({onBack}){
  const [dice,setDice]=useState(null);
  const [rolling,setRolling]=useState(false);
  const [turn,setTurn]=useState(0);
  const players=USERS.slice(0,4).map(u=>({name:u.name,color:u.color}));
  const roll=()=>{
    if(rolling)return; setRolling(true); let n=0;
    const iv=setInterval(()=>{ setDice(Math.ceil(Math.random()*6)); if(++n>9){clearInterval(iv);setRolling(false);setTurn(t=>(t+1)%4);} },90);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <button style={{ ...S.btn(C.muted,C.muted,true), alignSelf:"flex-start" }} onClick={onBack}><ArrowLeft size={14} strokeWidth={2}/> Volver</button>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontWeight:"bold", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Dice5 size={22} color={C.accent} strokeWidth={1.5}/> Parchís</div>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>Turno de <strong style={{ color:players[turn].color }}>{players[turn].name}</strong></div>
      </div>
      <div style={{ background:C.card,borderRadius:18,padding:10,border:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"repeat(11,1fr)",gap:2.5,aspectRatio:"1",boxShadow:`0 4px 20px ${C.shadow}` }}>
        {Array(121).fill(0).map((_,i)=>{
          const r=Math.floor(i/11),c=i%11;
          const ci=[r<4&&c<4,r<4&&c>6,r>6&&c<4,r>6&&c>6].findIndex(Boolean);
          const isCenter=r>=4&&r<=6&&c>=4&&c<=6;
          return <div key={i} style={{ borderRadius:4,aspectRatio:"1",background:isCenter?`linear-gradient(135deg,${C.accentSoft},${C.pinkSoft})`:ci>=0?players[ci].color+"28":C.bgDeep,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center" }}>{ci>=0&&<div style={{ width:7,height:7,borderRadius:"50%",background:players[ci].color,opacity:0.8 }}/>}</div>;
        })}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
        {players.map((p,i)=>(
          <div key={p.name} style={{ ...S.card(i===turn?p.color+"70":undefined),padding:"10px 13px",display:"flex",alignItems:"center",gap:8,background:i===turn?p.color+"14":C.cardWarm }}>
            <div style={{ width:11,height:11,borderRadius:"50%",background:p.color,flexShrink:0 }}/>
            <span style={{ fontSize:13,flex:1 }}>{p.name}</span>
            {i===turn&&<span style={S.pill(C.accentSoft,C.accent)}><Dice5 size={10} strokeWidth={2}/> Turno</span>}
          </div>
        ))}
      </div>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
        <div style={{ width:72,height:72,borderRadius:16,background:"white",boxShadow:`0 6px 24px ${C.shadow}`,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${C.border}`,transform:rolling?"rotate(10deg) scale(1.05)":"rotate(0deg) scale(1)",transition:"transform 0.09s" }}>
          {dice?<svg width="48" height="48" viewBox="0 0 100 100">{(DOTS[dice]||[]).map(([cx,cy],j)=><circle key={j} cx={cx} cy={cy} r="9" fill={C.accent}/>)}</svg>:<Dice5 size={38} color={C.accentLight} strokeWidth={1.2}/>}
        </div>
        <button style={S.btn(C.accent)} onClick={roll} disabled={rolling}><Dice5 size={15} strokeWidth={2}/> {rolling?"Tirando…":"Tirar dado"}</button>
      </div>
    </div>
  );
}

function JuegosTab(){
  const [active,setActive]=useState(null);
  if(active==="parcheesi") return <ParcheesiGame onBack={()=>setActive(null)}/>;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
      <div>
        <div style={{ fontWeight:"bold",fontSize:17,display:"flex",alignItems:"center",gap:8 }}><Gamepad2 size={20} color={C.accent} strokeWidth={1.6}/> Juegos del Equipo Malo</div>
        <div style={{ fontSize:13,color:C.muted,marginTop:3 }}>Reta a tus amigas en tiempo real</div>
      </div>
      {GAMES.map(g=>(
        <div key={g.id} style={{ ...S.card(),background:C.cardWarm,cursor:"pointer",display:"flex",gap:14,alignItems:"center",padding:16 }} onClick={()=>setActive(g.id)}>
          <div style={{ width:54,height:54,borderRadius:14,flexShrink:0,background:g.colorSoft,border:`1px solid ${g.color}33`,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <g.Icon size={24} color={g.color} strokeWidth={1.4}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:"bold",fontSize:15 }}>{g.name}</div>
            <div style={{ fontSize:12,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:4 }}><Users size={11} strokeWidth={1.8} color={C.accentLight}/> {g.players} jugadoras</div>
            <div style={{ marginTop:7 }}>
              <span style={S.pill(g.online>0?C.greenSoft:C.bgDeep,g.online>0?C.green:C.muted)}>
                {g.online>0?<><Wifi size={10} strokeWidth={2}/> {g.online} online</>:<><WifiOff size={10} strokeWidth={2}/> Nadie online</>}
              </span>
            </div>
          </div>
          <button style={S.btn(g.color)}>Jugar</button>
        </div>
      ))}
      <div style={{ ...S.card(),padding:16,background:C.cardWarm }}>
        <div style={{ fontWeight:"bold",fontSize:15,marginBottom:13,display:"flex",alignItems:"center",gap:8 }}><Trophy size={17} color={C.orange} strokeWidth={1.6}/> Ranking semanal</div>
        {[
          {name:"Fatou",   pts:420, user:USERS[2]},
          {name:"Gemma",   pts:380, user:USERS[1]},
          {name:"Iris",    pts:310, user:USERS[0]},
          {name:"Alba",    pts:290, user:USERS[3]},
          {name:"Wifi",    pts:210, user:USERS[4]},
          {name:"Ali",     pts:180, user:USERS[5]},
        ].map((p,i)=>(
          <div key={p.name} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<5?`1px solid ${C.border}`:undefined }}>
            <span style={{ width:22,textAlign:"center" }}>
              {i===0?<Trophy size={16} color="#f59e0b" strokeWidth={1.8} fill="#f59e0b33"/>:i===1?<Trophy size={16} color="#8a9aaa" strokeWidth={1.8}/>:i===2?<Trophy size={16} color="#b07a30" strokeWidth={1.8}/>:<span style={{ fontSize:13,color:C.muted }}>{i+1}</span>}
            </span>
            <div style={S.avatar(p.user.color,32)}>{p.user.initials[0]}</div>
            <span style={{ flex:1,fontSize:14 }}>{p.name}</span>
            <span style={{ fontWeight:"bold",color:p.user.color,fontSize:14 }}>{p.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AMIGOS ───────────────────────────────────────────────────────────────────
const FRIENDS=[
  { user:USERS[1], status:"online",  activity:"Viendo series 📺"      },
  { user:USERS[2], status:"online",  activity:"Jugando al Parchís"     },
  { user:USERS[3], status:"away",    activity:"Hace 30 minutos"        },
  { user:USERS[4], status:"online",  activity:"En el gym 💪"           },
  { user:USERS[5], status:"offline", activity:"Hace 2 horas"           },
];
function AmigosTab(){
  const [showInvite,setShowInvite]=useState(false);
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const statusColor={online:C.green,away:C.orange,offline:C.muted};
  const statusLabel={online:"En línea",away:"Ausente",offline:"Desconectada"};
  const StatusIcon={online:Wifi,away:Clock,offline:WifiOff};
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
      <button style={S.btn(C.accent)} onClick={()=>{setShowInvite(true);setSent(false);setEmail("");}}><UserPlus size={15} strokeWidth={2}/> Invitar a una amiga</button>
      {showInvite && (
        <div style={{ ...S.card(C.accentLight+"50"),padding:18,display:"flex",flexDirection:"column",gap:12,background:C.cardWarm }}>
          <div style={{ fontWeight:"bold",fontSize:16,display:"flex",alignItems:"center",gap:8 }}><Mail size={17} color={C.accent} strokeWidth={1.7}/> Invitar por correo</div>
          <div style={{ fontSize:13,color:C.muted,lineHeight:1.65 }}>Tu amiga recibirá un enlace para unirse al Equipo Malo.</div>
          {!sent?(<>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" style={S.input}/>
            <div style={{ display:"flex",gap:8 }}>
              <button style={S.btn(C.accent)} onClick={()=>{if(email)setSent(true);}}><Send size={14} strokeWidth={2}/> Enviar</button>
              <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setShowInvite(false)}><X size={14} strokeWidth={2}/> Cancelar</button>
            </div>
          </>):(
            <div style={{ background:C.greenSoft,color:C.green,borderRadius:12,padding:"12px 16px",fontSize:13,display:"flex",alignItems:"center",gap:8 }}>
              <CheckCircle size={16} strokeWidth={2} color={C.green}/> Invitación enviada a <strong>{email}</strong>
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize:11,color:C.muted,fontWeight:"bold",letterSpacing:1.2 }}>EL EQUIPO ({FRIENDS.length})</div>
      {FRIENDS.map(f=>{
        const SIcon=StatusIcon[f.status];
        return (
          <div key={f.user.name} style={{ ...S.card(),background:C.cardWarm,padding:14,display:"flex",gap:13,alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <div style={S.avatar(f.user.color,48)}>{f.user.initials[0]}</div>
              <div style={{ position:"absolute",bottom:1,right:1,width:14,height:14,borderRadius:"50%",background:statusColor[f.status],border:`2.5px solid ${C.card}` }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"bold",fontSize:14 }}>{f.user.fullName}</div>
              <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>{f.activity}</div>
              <span style={{ ...S.pill(statusColor[f.status]+"18",statusColor[f.status]),marginTop:6,fontSize:11,display:"inline-flex" }}><SIcon size={10} strokeWidth={2}/> {statusLabel[f.status]}</span>
            </div>
            <button style={S.btn(f.user.color,"white",true)}><MessageCircle size={15} strokeWidth={1.8}/></button>
          </div>
        );
      })}
    </div>
  );
}

// ─── CHAT GRUPAL ──────────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  { id:1, user:USERS[1], text:"Chicas, ¿alguien para la playa el domingo? ☀️", time:"09:14", mine:false },
  { id:2, user:USERS[2], text:"YO YO YO!! Llevo semanas sin ir", time:"09:21", mine:false },
  { id:3, user:USERS[0], text:"Me apunto también, ¿a qué hora quedamos?", time:"09:23", mine:true },
  { id:4, user:USERS[3], text:"A las 11 en el Arbeyal? Así nos da tiempo a desayunar antes", time:"09:45", mine:false },
  { id:5, user:USERS[4], text:"Perfecto, yo llevo las sillas", time:"10:02", mine:false },
  { id:6, user:USERS[5], text:"Yo llevo la nevera con algo frío 🧃", time:"10:15", mine:false },
  { id:7, user:USERS[0], text:"Qué equipazo somos 😂❤️", time:"10:16", mine:true },
];

function ChatTab() {
  const [messages,setMessages]=useState(INITIAL_MESSAGES);
  const [draft,setDraft]=useState("");
  const [showEmoji,setShowEmoji]=useState(false);
  const bottomRef=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send=()=>{
    if(!draft.trim())return;
    setMessages(m=>[...m,{ id:Date.now(),user:USERS[0],text:draft.trim(),time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),mine:true }]);
    setDraft("");
    const replies=[
      {user:USERS[1],text:"Jajaja siempre igual Iris 😂"},
      {user:USERS[2],text:"¡Qué buena idea! Me apunto"},
      {user:USERS[3],text:"Ays qué ganas de veros ❤️"},
      {user:USERS[4],text:"Equipo Malo al poder 🔥"},
      {user:USERS[5],text:"Contad conmigo!"},
    ];
    const r=replies[Math.floor(Math.random()*replies.length)];
    setTimeout(()=>{
      setMessages(m=>[...m,{ id:Date.now()+1,user:r.user,text:r.text,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),mine:false }]);
    },1200);
  };

  const emojis=["😄","👌","🔥","❤️","😂","🎉","👏","🙌","☀️","🏖️","💪","🎮"];
  const grouped=messages.map((msg,i)=>({
    ...msg,
    isFirst:i===0||messages[i-1].user.name!==msg.user.name,
    isLast:i===messages.length-1||messages[i+1].user.name!==msg.user.name,
  }));

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 120px)",minHeight:400 }}>
      <div style={{ padding:"12px 16px",background:C.cardWarm,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
        <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Hash size={18} color="white" strokeWidth={2}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:"bold",fontSize:14 }}>equipo-malo</div>
          <div style={{ fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:4 }}>
            <div style={{ width:7,height:7,borderRadius:"50%",background:C.green }}/> 4 amigas en línea
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {USERS.map((u,i)=>(
            <div key={i} style={{ ...S.avatar(u.color,26),marginLeft:i===0?0:-8,border:`2px solid ${C.bg}`,fontSize:9,zIndex:6-i }}>{u.initials[0]}</div>
          ))}
        </div>
      </div>

      <div style={{ flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:2,background:C.bg }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,margin:"8px 0 14px" }}>
          <div style={{ flex:1,height:1,background:C.border }}/>
          <span style={{ fontSize:11,color:C.muted,fontStyle:"italic" }}>Hoy</span>
          <div style={{ flex:1,height:1,background:C.border }}/>
        </div>
        {grouped.map(msg=>(
          <div key={msg.id} style={{ display:"flex",flexDirection:msg.mine?"row-reverse":"row",gap:8,alignItems:"flex-end",marginBottom:msg.isLast?8:2 }}>
            <div style={{ width:32,flexShrink:0 }}>
              {!msg.mine&&msg.isLast&&<div style={S.avatar(msg.user.color,32)}>{msg.user.initials[0]}</div>}
            </div>
            <div style={{ maxWidth:"72%",display:"flex",flexDirection:"column",alignItems:msg.mine?"flex-end":"flex-start",gap:1 }}>
              {!msg.mine&&msg.isFirst&&<span style={{ fontSize:11,fontWeight:"bold",color:msg.user.color,marginLeft:4,marginBottom:2 }}>{msg.user.name}</span>}
              <div style={{ background:msg.mine?`linear-gradient(135deg,${C.accent},${C.pink})`:C.card,color:msg.mine?"white":C.text,borderRadius:msg.mine?`16px 16px ${msg.isLast?4:16}px 16px`:`16px 16px 16px ${msg.isLast?4:16}px`,padding:"9px 13px",fontSize:14,lineHeight:1.5,border:msg.mine?"none":`1px solid ${C.border}`,boxShadow:`0 1px 6px ${C.shadow}` }}>
                {msg.text}
              </div>
              {msg.isLast&&<span style={{ fontSize:10,color:C.muted,marginTop:2,marginLeft:4,marginRight:4 }}>{msg.time}</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {showEmoji&&(
        <div style={{ padding:"10px 14px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexWrap:"wrap" }}>
          {emojis.map(e=>(
            <button key={e} onClick={()=>{setDraft(d=>d+e);setShowEmoji(false);inputRef.current?.focus();}} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",padding:4,borderRadius:8 }}>{e}</button>
          ))}
        </div>
      )}

      <div style={{ padding:"10px 14px 12px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
        <button onClick={()=>setShowEmoji(s=>!s)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,color:showEmoji?C.accent:C.muted,flexShrink:0 }}>
          <Smile size={22} strokeWidth={1.6}/>
        </button>
        <div style={{ flex:1,position:"relative" }}>
          <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Escribe un mensaje…" style={{ ...S.input,borderRadius:22,padding:"10px 14px" }}/>
        </div>
        <button onClick={send} disabled={!draft.trim()} style={{ width:40,height:40,borderRadius:"50%",background:draft.trim()?`linear-gradient(135deg,${C.accent},${C.pink})`:`${C.border}`,border:"none",cursor:draft.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:draft.trim()?`0 2px 10px ${C.shadow}`:"none",transition:"all 0.18s" }}>
          <Send size={16} color={draft.trim()?"white":C.muted} strokeWidth={2} style={{ transform:"translateX(1px)" }}/>
        </button>
      </div>
    </div>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────────
function PerfilTab() {
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState("Iris Arnaiz");
  const [bio,setBio]=useState("Fundadora del Equipo Malo 😈 Amante de la playa, la pasta y el gym (cuando me apetece)");
  const [tempName,setTempName]=useState(name);
  const [tempBio,setTempBio]=useState(bio);

  const stats=[
    {label:"Planes",   value:24, Icon:Calendar,  color:C.accent },
    {label:"Recetas",  value:8,  Icon:Utensils,  color:C.pink   },
    {label:"Victorias",value:13, Icon:Trophy,    color:C.orange },
  ];
  const achievements=[
    {label:"Fundadora del Equipo Malo", Icon:Users,         color:C.accent, bg:C.accentSoft, earned:true  },
    {label:"Chef de la pandilla",       Icon:Utensils,      color:C.pink,   bg:C.pinkSoft,   earned:true  },
    {label:"100 mensajes",              Icon:MessageCircle, color:C.teal,   bg:C.tealSoft,   earned:true  },
    {label:"Organizadora pro",          Icon:Calendar,      color:C.green,  bg:C.greenSoft,  earned:false },
    {label:"Leyenda de los juegos",     Icon:Gamepad2,      color:C.orange, bg:C.orangeSoft, earned:false },
  ];
  const menuItems=[
    {label:"Editar perfil",   Icon:Edit3,    action:()=>setEditing(true)  },
    {label:"Notificaciones",  Icon:Bell,     action:()=>{}                },
    {label:"Privacidad",      Icon:Settings, action:()=>{}                },
    {label:"Cerrar sesión",   Icon:LogOut,   action:()=>{}, danger:true   },
  ];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
      <div style={{ height:110,background:`linear-gradient(135deg,${C.accent}44,${C.pink}33)`,position:"relative",borderRadius:"0 0 28px 28px",border:`1px solid ${C.border}`,marginBottom:0 }}>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",gap:20,opacity:0.2 }}>
          {[Utensils,Flame,Dice5,Coffee,Dumbbell].map((I,i)=><I key={i} size={28} color={C.accent} strokeWidth={1.2}/>)}
        </div>
        <div style={{ position:"absolute",bottom:-36,left:20 }}>
          <div style={{ ...S.avatar(C.accent,76),fontSize:24,border:`4px solid ${C.bg}`,boxShadow:`0 4px 20px ${C.shadow}` }}>IA</div>
          <div style={{ position:"absolute",bottom:4,right:4,width:18,height:18,borderRadius:"50%",background:C.green,border:`2.5px solid ${C.bg}` }}/>
        </div>
        <button style={{ position:"absolute",bottom:10,right:14,...S.btn(C.card,C.accent,true),padding:"6px 13px",fontSize:12,borderColor:C.border }}>
          <Camera size={13} strokeWidth={1.8}/> Foto
        </button>
      </div>

      <div style={{ padding:"48px 16px 0",display:"flex",flexDirection:"column",gap:16 }}>
        {!editing?(
          <div style={{ ...S.card(),padding:"14px 16px",background:C.cardWarm }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:"bold",fontSize:18 }}>{name}</div>
                <div style={{ fontSize:12,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:5 }}>
                  <AtSign size={11} strokeWidth={1.8} color={C.accentLight}/> iris.arnaiz
                </div>
              </div>
              <button style={{ ...S.btn(C.accent,"white",true),padding:"7px 14px",fontSize:12 }} onClick={()=>{setTempName(name);setTempBio(bio);setEditing(true)}}>
                <Edit3 size={13} strokeWidth={1.8}/> Editar
              </button>
            </div>
            <p style={{ fontSize:14,color:C.muted,marginTop:10,lineHeight:1.6 }}>{bio}</p>
          </div>
        ):(
          <div style={{ ...S.card(C.accentLight+"50"),padding:16,display:"flex",flexDirection:"column",gap:12,background:C.cardWarm }}>
            <div style={{ fontWeight:"bold",fontSize:15,display:"flex",alignItems:"center",gap:8 }}><Edit3 size={16} color={C.accent} strokeWidth={1.8}/> Editar perfil</div>
            <div>
              <label style={{ fontSize:12,color:C.muted,fontWeight:"bold",letterSpacing:0.8 }}>NOMBRE</label>
              <input value={tempName} onChange={e=>setTempName(e.target.value)} style={{ ...S.input,marginTop:6 }}/>
            </div>
            <div>
              <label style={{ fontSize:12,color:C.muted,fontWeight:"bold",letterSpacing:0.8 }}>BIO</label>
              <textarea value={tempBio} onChange={e=>setTempBio(e.target.value)} style={{ ...S.input,marginTop:6,resize:"none",height:72 }}/>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={S.btn(C.accent)} onClick={()=>{setName(tempName);setBio(tempBio);setEditing(false)}}><CheckCircle size={14} strokeWidth={2}/> Guardar</button>
              <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setEditing(false)}><X size={14} strokeWidth={2}/> Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {stats.map(s=>(
            <div key={s.label} style={{ ...S.card(),padding:"14px 10px",background:C.cardWarm,textAlign:"center" }}>
              <div style={{ width:36,height:36,borderRadius:10,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px" }}>
                <s.Icon size={18} color={s.color} strokeWidth={1.5}/>
              </div>
              <div style={{ fontWeight:"bold",fontSize:20,color:C.text }}>{s.value}</div>
              <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card(),padding:16,background:C.cardWarm }}>
          <div style={{ fontWeight:"bold",fontSize:15,marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
            <Award size={17} color={C.orange} strokeWidth={1.6}/> Logros
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {achievements.map(a=>(
              <div key={a.label} style={{ display:"flex",alignItems:"center",gap:12,opacity:a.earned?1:0.4 }}>
                <div style={{ width:38,height:38,borderRadius:10,background:a.bg,border:`1px solid ${a.color}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <a.Icon size={18} color={a.color} strokeWidth={1.4}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:a.earned?"bold":"normal" }}>{a.label}</div>
                  {!a.earned&&<div style={{ fontSize:11,color:C.muted,marginTop:1 }}>Aún no conseguido</div>}
                </div>
                {a.earned&&<CheckCircle size={16} color={C.green} strokeWidth={2}/>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...S.card(),background:C.cardWarm,overflow:"hidden" }}>
          {menuItems.map((item,i)=>(
            <button key={item.label} onClick={item.action} style={{ width:"100%",padding:"14px 16px",background:"none",border:"none",borderBottom:i<menuItems.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left" }}>
              <div style={{ width:34,height:34,borderRadius:10,background:item.danger?`${C.pink}15`:C.bgDeep,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <item.Icon size={17} color={item.danger?C.pink:C.muted} strokeWidth={1.7}/>
              </div>
              <span style={{ flex:1,fontSize:14,color:item.danger?C.pink:C.text,fontWeight:item.danger?"bold":"normal" }}>{item.label}</span>
              {!item.danger&&<ChevronRight size={16} color={C.muted} strokeWidth={1.6}/>}
            </button>
          ))}
        </div>
        <div style={{ height:8 }}/>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"feed",   label:"Inicio", Icon:Home          },
  {id:"planes", label:"Planes", Icon:Calendar      },
  {id:"chat",   label:"Chat",   Icon:MessageCircle },
  {id:"juegos", label:"Juegos", Icon:Gamepad2      },
  {id:"perfil", label:"Perfil", Icon:User          },
];

export default function App() {
  const [tab,setTab]=useState("feed");
  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo}>
          <div style={{ width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 12px ${C.shadow}` }}>
            <Users size={16} color="white" strokeWidth={2}/>
          </div>
          equipo malo
        </div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <div style={{ position:"relative",cursor:"pointer" }}>
            <Bell size={22} color={C.muted} strokeWidth={1.6}/>
            <div style={{ position:"absolute",top:0,right:0,width:8,height:8,borderRadius:"50%",background:C.pink,border:`2px solid ${C.bg}` }}/>
          </div>
          <div style={S.avatar(C.accent,38)} onClick={()=>setTab("perfil")}>IA</div>
        </div>
      </div>

      {tab==="chat"?(
        <ChatTab/>
      ):(
        <div style={S.content}>
          {tab==="feed"   && <FeedTab/>}
          {tab==="planes" && <PlanesTab/>}
          {tab==="juegos" && <JuegosTab/>}
          {tab==="amigos" && <AmigosTab/>}
          {tab==="perfil" && <PerfilTab/>}
        </div>
      )}

      <nav style={S.nav}>
        {TABS.map(t=>(
          <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>
            <div style={{ position:"relative" }}>
              <t.Icon size={22} strokeWidth={tab===t.id?2.2:1.5}/>
              {t.id==="chat"&&<div style={{ position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:C.pink,border:`1.5px solid ${C.card}` }}/>}
            </div>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
