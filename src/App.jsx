import { useState, useRef, useEffect, useCallback } from "react";
import {
  Home, Calendar, Gamepad2, Users, Bell, Send, Heart, MessageCircle,
  Share2, ChevronDown, ChevronUp, Plus, CheckCircle, X, Mail,
  Utensils, Dumbbell, Trophy, Clock, MapPin, UserPlus, Wifi, WifiOff,
  Dice5, Image, Flame, Coffee, Smile, ArrowLeft, Star, User,
  Settings, Edit3, Camera, Award, LogOut, ChevronRight,
  Hash, AtSign, BookOpen, ChefHat, Apple, Bookmark, ThumbsUp
} from "lucide-react";

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#f8f5ff", bgDeep:"#ede8fa", card:"#ffffff", cardWarm:"#fbf9ff",
  accent:"#7c3aed", accentLight:"#a78bfa", accentSoft:"#ede9fe",
  pink:"#db2777", pinkSoft:"#fce7f3",
  green:"#059669", greenSoft:"#d1fae5",
  orange:"#ea580c", orangeSoft:"#ffedd5",
  blue:"#2563eb", blueSoft:"#dbeafe",
  teal:"#0d9488", tealSoft:"#ccfbf1",
  text:"#1e1030", muted:"#6b7280", mutedLight:"#a78bfa",
  border:"#e5e0f8", shadow:"rgba(124,58,237,0.10)",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app:{ background:C.bg, minHeight:"100vh", fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", color:C.text, display:"flex", flexDirection:"column", maxWidth:430, width:"100%", margin:"0 auto", position:"relative" },
  header:{ padding:"14px 16px 12px", background:"rgba(248,245,255,0.97)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:20, borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" },
  logo:{ fontSize:20, fontWeight:"bold", color:C.accent, letterSpacing:"-0.5px", fontStyle:"italic", display:"flex", alignItems:"center", gap:8 },
  avatar:(color=C.accent,size=38)=>({ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.max(size*0.28,10), fontWeight:"bold", color:"white", flexShrink:0, boxShadow:`0 2px 8px ${C.shadow}`, letterSpacing:"-0.5px" }),
  card:(borderColor)=>({ background:C.card, borderRadius:16, border:`1px solid ${borderColor||C.border}`, boxShadow:`0 2px 12px ${C.shadow}`, overflow:"hidden" }),
  pill:(bg,color)=>({ display:"inline-flex", alignItems:"center", gap:4, background:bg, color:color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:"bold" }),
  btn:(bg,color="white",ghost)=>({ background:ghost?"transparent":bg, color:ghost?bg:color, border:ghost?`1.5px solid ${bg}`:"none", borderRadius:22, padding:"9px 16px", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:6, boxShadow:ghost?"none":`0 2px 10px ${C.shadow}`, transition:"all 0.18s", whiteSpace:"nowrap" }),
  nav:{ display:"flex", background:C.card, borderTop:`1px solid ${C.border}`, position:"sticky", bottom:0, zIndex:20, boxShadow:"0 -4px 20px rgba(124,58,237,0.08)" },
  navBtn:(active)=>({ flex:1, padding:"10px 2px 8px", background:active?C.accentSoft:"none", border:"none", color:active?C.accent:C.muted, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontSize:9, fontFamily:"inherit", fontWeight:active?"bold":"normal", minWidth:0 }),
  content:{ flex:1, overflowY:"auto", padding:"14px", display:"flex", flexDirection:"column", gap:14 },
  input:{ background:C.bgDeep, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"10px 13px", color:C.text, fontFamily:"inherit", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none" },
};

// ─── USERS ────────────────────────────────────────────────────────────────────
const USERS = [
  { name:"Iris",  fullName:"Iris Arnaiz", initials:"IA", color:C.accent  },
  { name:"Gemma", fullName:"Gemma Gili",  initials:"GG", color:C.pink    },
  { name:"Fatou", fullName:"Fatou",       initials:"FA", color:C.teal    },
  { name:"Alba",  fullName:"Alba López",  initials:"AL", color:C.orange  },
  { name:"Wifi",  fullName:"Wifi",        initials:"WF", color:C.blue    },
  { name:"Ali",   fullName:"Ali",         initials:"AL", color:C.green   },
];

// ─── NOTIFICATION SYSTEM ─────────────────────────────────────────────────────
function useNotifications() {
  const [toasts, setToasts] = useState([]);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const p = await Notification.requestPermission();
      setPermission(p);
      return p;
    }
  };

  const notify = useCallback((title, body, icon) => {
    // In-app toast
    const id = Date.now();
    setToasts(t => [...t, { id, title, body, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    // OS notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo512.png" });
    }
  }, []);

  return { toasts, notify, permission, requestPermission };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position:"fixed", top:70, right:12, zIndex:100, display:"flex", flexDirection:"column", gap:8, maxWidth:320 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`4px solid ${C.accent}`, borderRadius:14, padding:"11px 14px", boxShadow:`0 8px 24px ${C.shadow}`, display:"flex", gap:10, alignItems:"flex-start", animation:"slideIn 0.3s ease" }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{t.icon || "🔔"}</span>
          <div>
            <div style={{ fontWeight:"bold", fontSize:13 }}>{t.title}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{t.body}</div>
          </div>
        </div>
      ))}
      <style>{`@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

// ─── CALENDAR EXPORT ─────────────────────────────────────────────────────────
function exportToCalendar(plan, type) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 2);
  const pad = n => String(n).padStart(2, "0");
  const fmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  if (type === "google") {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: plan.title,
      details: `Plan del Equipo Malo: ${plan.title}`,
      location: plan.location || "",
      dates: `${fmt(startDate)}/${fmt(endDate)}`,
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
  } else if (type === "apple") {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//EquipoMalo//ES",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(startDate)}`,
      `DTEND:${fmt(endDate)}`,
      `SUMMARY:${plan.title}`,
      `DESCRIPTION:Plan del Equipo Malo`,
      `LOCATION:${plan.location || ""}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${plan.title}.ics`; a.click();
    URL.revokeObjectURL(url);
  }
}

// ─── FEED ─────────────────────────────────────────────────────────────────────
const INIT_POSTS = [
  { id:1, user:USERS[1], time:"hace 20 min", type:"food",  title:"Pasta a la carbonara",    desc:"Sin nata por favor 🙏 Os traigo tupper el martes.", Icon:Utensils, iconBg:C.pinkSoft,   iconColor:C.pink,   likes:11, comments:4 },
  { id:2, user:USERS[2], time:"hace 1h",     type:"plan",  title:"Playa el domingo — 11:00",desc:"¿Alguien se apunta? Que hace bueno.",                  Icon:Flame,    iconBg:C.tealSoft,   iconColor:C.teal,   likes:5,  comments:7, going:2, total:6 },
  { id:3, user:USERS[3], time:"hace 3h",     type:"food",  title:"Arroz con leche",         desc:"Lo hice anoche y sobró mucho 🍚",                       Icon:Coffee,   iconBg:C.orangeSoft, iconColor:C.orange, likes:17, comments:9 },
];

function FeedTab({ notify }) {
  const [liked, setLiked] = useState({});
  const [going, setGoing] = useState({});
  const [compose, setCompose] = useState(false);
  const [ctype, setCtype] = useState("food");
  const [posts, setPosts] = useState(INIT_POSTS);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const publish = () => {
    if (!newTitle.trim()) return;
    const p = { id:Date.now(), user:USERS[0], time:"ahora mismo", type:ctype, title:newTitle, desc:newDesc, Icon:ctype==="food"?Utensils:ctype==="plan"?Calendar:Image, iconBg:C.accentSoft, iconColor:C.accent, likes:0, comments:0 };
    setPosts(prev => [p, ...prev]);
    setNewTitle(""); setNewDesc(""); setCompose(false);
    notify("¡Publicado!", `Tu ${ctype==="food"?"plato":"plan"} "${newTitle}" ya está visible`, "✨");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
        {USERS.map((u,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
            <div style={{ padding:2.5, borderRadius:"50%", background:i===0?C.border:`linear-gradient(135deg,${u.color}dd,${u.color}88)` }}>
              <div style={{ ...S.avatar(i===0?C.bgDeep:u.color,46), border:`2.5px solid ${C.bg}` }}>
                {i===0?<Plus size={18} strokeWidth={2} color={C.muted}/>:u.initials[0]}
              </div>
            </div>
            <span style={{ fontSize:10, color:C.muted, maxWidth:48, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</span>
          </div>
        ))}
      </div>

      {!compose ? (
        <div onClick={()=>setCompose(true)} style={{ ...S.card(), padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, background:C.cardWarm }}>
          <div style={S.avatar(C.accent,36)}>IA</div>
          <span style={{ color:C.muted, fontSize:13, flex:1, fontStyle:"italic" }}>¿Qué hay de nuevo? Comparte algo…</span>
          <Image size={18} color={C.accentLight} strokeWidth={1.6}/>
        </div>
      ) : (
        <div style={{ ...S.card(C.accentLight+"60"), padding:14, display:"flex", flexDirection:"column", gap:10, background:C.cardWarm }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["food",Utensils,"Plato"],["plan",Calendar,"Plan"],["photo",Image,"Foto"]].map(([t,Ico,lbl])=>(
              <button key={t} onClick={()=>setCtype(t)} style={{ ...S.pill(ctype===t?C.accentSoft:C.bgDeep,ctype===t?C.accent:C.muted), border:`1.5px solid ${ctype===t?C.accentLight:C.border}`, cursor:"pointer", padding:"6px 12px" }}>
                <Ico size={12} strokeWidth={1.8}/> {lbl}
              </button>
            ))}
          </div>
          <input placeholder="Título" value={newTitle} onChange={e=>setNewTitle(e.target.value)} style={S.input}/>
          <textarea placeholder="Descripción…" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={{ ...S.input, resize:"none", height:70 }}/>
          <div style={{ display:"flex", gap:8 }}>
            <button style={S.btn(C.accent)} onClick={publish}><Send size={13} strokeWidth={2}/> Publicar</button>
            <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setCompose(false)}><X size={13} strokeWidth={2}/> Cancelar</button>
          </div>
        </div>
      )}

      {posts.map(p=>(
        <div key={p.id} style={{ ...S.card(), background:C.cardWarm }}>
          <div style={{ padding:"13px 14px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:11 }}>
              <div style={S.avatar(p.user.color,38)}>{p.user.initials[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:"bold", fontSize:13 }}>{p.user.fullName}</div>
                <div style={{ fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:3, marginTop:1 }}>
                  <Clock size={10} strokeWidth={1.8} color={C.accentLight}/> {p.time}
                </div>
              </div>
              <span style={S.pill(p.type==="food"?C.pinkSoft:C.tealSoft,p.type==="food"?C.pink:C.teal)}>
                {p.type==="food"?<><Utensils size={10} strokeWidth={1.8}/> Cocina</>:<><Calendar size={10} strokeWidth={1.8}/> Plan</>}
              </span>
            </div>
            <div style={{ background:`linear-gradient(135deg,${p.iconBg},${p.user.color}18)`, borderRadius:12, height:130, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, marginBottom:11, border:`1px solid ${C.border}` }}>
              <div style={{ width:50,height:50,borderRadius:"50%",background:"white",boxShadow:`0 4px 16px ${C.shadow}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <p.Icon size={24} color={p.iconColor} strokeWidth={1.4}/>
              </div>
              <span style={{ fontSize:11,color:C.muted,fontStyle:"italic" }}>Foto compartida</span>
            </div>
            <div style={{ fontWeight:"bold", fontSize:14, marginBottom:4 }}>{p.title}</div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:11 }}>{p.desc}</div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, display:"flex" }}>
            {[
              { Ic:Heart,  label:p.likes+(liked[p.id]?1:0), active:liked[p.id], color:C.pink,  action:()=>{ setLiked(l=>({...l,[p.id]:!l[p.id]})); if(!liked[p.id]) notify("❤️ Like","A "+p.user.name+" le ha gustado tu publicación","❤️"); } },
              { Ic:MessageCircle, label:p.comments, active:false, color:C.muted, action:()=>{} },
              { Ic:Share2, label:"Compartir", active:false, color:C.muted, action:()=>{} },
            ].map((b,i)=>(
              <button key={i} onClick={b.action} style={{ flex:1,padding:"10px 4px",background:"none",border:"none",color:b.active?b.color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                <b.Ic size={15} strokeWidth={b.active?2.2:1.6} color={b.active?b.color:C.muted} fill={b.active&&b.Ic===Heart?b.color:"none"}/>
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
const INIT_PLANS = [
  { id:1, title:"Playa — El Arbeyal",   date:"Dom 9 Mar · 11:00",  location:"El Arbeyal, Gijón", Icon:Flame,    color:C.teal,   colorSoft:C.tealSoft,   going:["GG","FA"],       pending:["AL","WF","Ali"], max:6 },
  { id:2, title:"Cena en casa de Iris", date:"Vie 14 Mar · 21:00", location:"Casa de Iris",       Icon:Utensils, color:C.accent, colorSoft:C.accentSoft, going:["GG","FA","AL","WF","Ali"], pending:[], max:6 },
  { id:3, title:"Gym · Día de piernas", date:"Lun 10 Mar · 8:00",  location:"Gym Gijón",          Icon:Dumbbell, color:C.blue,   colorSoft:C.blueSoft,   going:["WF","Ali"],      pending:["FA"], max:6 },
];

function PlanesTab({ notify }) {
  const [plans, setPlans] = useState(INIT_PLANS);
  const [open, setOpen] = useState(null);
  const [newPlan, setNewPlan] = useState(false);
  const [joined, setJoined] = useState({});
  const [calModal, setCalModal] = useState(null);
  const [form, setForm] = useState({ title:"", location:"", date:"" });

  const createPlan = () => {
    if (!form.title) return;
    const p = { id:Date.now(), title:form.title, date:form.date||"Por confirmar", location:form.location, Icon:Calendar, color:C.accent, colorSoft:C.accentSoft, going:["IA"], pending:[], max:6 };
    setPlans(prev=>[p,...prev]);
    setForm({ title:"",location:"",date:"" }); setNewPlan(false);
    notify("📅 Plan creado", `"${p.title}" ya está visible para el equipo`, "📅");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <button style={S.btn(C.accent)} onClick={()=>setNewPlan(true)}><Plus size={14} strokeWidth={2.2}/> Crear plan</button>

      {newPlan && (
        <div style={{ ...S.card(C.accentLight+"50"), padding:16, display:"flex", flexDirection:"column", gap:10, background:C.cardWarm }}>
          <div style={{ fontWeight:"bold", fontSize:15, display:"flex", alignItems:"center", gap:7 }}><Calendar size={17} color={C.accent} strokeWidth={1.7}/> Nuevo plan</div>
          <input placeholder="Nombre del plan" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={S.input}/>
          <input placeholder="Lugar" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} style={S.input}/>
          <input type="datetime-local" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={S.input}/>
          <div style={{ display:"flex", gap:8 }}>
            <button style={S.btn(C.accent)} onClick={createPlan}><CheckCircle size={13} strokeWidth={2}/> Crear</button>
            <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setNewPlan(false)}><X size={13} strokeWidth={2}/> Cancelar</button>
          </div>
        </div>
      )}

      {/* Calendar modal */}
      {calModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={()=>setCalModal(null)}>
          <div style={{ ...S.card(), padding:20, width:"100%", maxWidth:320, background:C.card }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:"bold", fontSize:16, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <Calendar size={18} color={C.accent} strokeWidth={1.7}/> Añadir al calendario
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button style={{ ...S.btn(C.blue), width:"100%", justifyContent:"center" }} onClick={()=>{ exportToCalendar(calModal,"google"); setCalModal(null); notify("📅 Añadido","Plan guardado en Google Calendar","📅"); }}>
                <Calendar size={15} strokeWidth={2}/> Google Calendar
              </button>
              <button style={{ ...S.btn(C.text), width:"100%", justifyContent:"center" }} onClick={()=>{ exportToCalendar(calModal,"apple"); setCalModal(null); notify("📅 Añadido","Archivo .ics descargado para Apple Calendar","📅"); }}>
                <Apple size={15} strokeWidth={2}/> Apple Calendar
              </button>
            </div>
            <button style={{ ...S.btn(C.muted,C.muted,true), marginTop:10, width:"100%", justifyContent:"center" }} onClick={()=>setCalModal(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {plans.map(pl=>(
        <div key={pl.id} style={{ ...S.card(), background:C.cardWarm, cursor:"pointer" }} onClick={()=>setOpen(open===pl.id?null:pl.id)}>
          <div style={{ padding:14, display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:46,height:46,borderRadius:12,flexShrink:0,background:pl.colorSoft,border:`1px solid ${pl.color}33`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <pl.Icon size={20} color={pl.color} strokeWidth={1.5}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:"bold", fontSize:14 }}>{pl.title}</div>
              <div style={{ fontSize:11,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:4 }}><MapPin size={10} strokeWidth={1.8} color={C.accentLight}/> {pl.date}</div>
              <div style={{ display:"flex",gap:4,marginTop:7,flexWrap:"wrap" }}>
                {pl.going.map(i=><span key={i} style={S.pill(C.greenSoft,C.green)}><CheckCircle size={9} strokeWidth={2}/> {i}</span>)}
                {pl.pending.map(i=><span key={i} style={S.pill(C.bgDeep,C.muted)}><Clock size={9} strokeWidth={1.8}/> {i}</span>)}
              </div>
            </div>
            {open===pl.id?<ChevronUp size={16} color={C.muted} strokeWidth={1.8} style={{ marginTop:3,flexShrink:0 }}/>:<ChevronDown size={16} color={C.muted} strokeWidth={1.8} style={{ marginTop:3,flexShrink:0 }}/>}
          </div>
          {open===pl.id && (
            <div style={{ padding:"0 14px 14px", borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <div style={{ fontSize:12,color:C.muted,marginBottom:10,display:"flex",alignItems:"center",gap:4 }}>
                <Users size={13} strokeWidth={1.7} color={C.accentLight}/> {pl.going.length} de {pl.max} confirmadas
              </div>
              <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                <button style={S.btn(joined[pl.id]?C.green:C.accent)} onClick={e=>{e.stopPropagation();setJoined(j=>({...j,[pl.id]:!j[pl.id]}));if(!joined[pl.id])notify("✅ Apuntada",`Te has apuntado a "${pl.title}"`,"✅");}}>
                  {joined[pl.id]?<><CheckCircle size={13} strokeWidth={2}/> Apuntada</>:<><Plus size={13} strokeWidth={2}/> Me apunto</>}
                </button>
                <button style={S.btn(C.blue,"white",true)} onClick={e=>{e.stopPropagation();setCalModal(pl);}}>
                  <Calendar size={13} strokeWidth={1.8}/> Calendario
                </button>
                <button style={S.btn(C.pink,"white",true)} onClick={e=>e.stopPropagation()}><X size={13} strokeWidth={2}/> No puedo</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PARCHÍS GAME ─────────────────────────────────────────────────────────────
const BOARD_SIZE = 11;
const HOME_ZONES = [
  { rows:[0,3], cols:[0,3], idx:0 },
  { rows:[0,3], cols:[7,10], idx:1 },
  { rows:[7,10], cols:[0,3], idx:2 },
  { rows:[7,10], cols:[7,10], idx:3 },
];

function ParcheesiGame({ onBack, notify }) {
  const pColors = [C.accent, C.pink, C.teal, C.orange];
  const pNames = USERS.slice(0,4).map(u=>u.name);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [diceRolled, setDiceRolled] = useState(false);
  const [pieces, setPieces] = useState(() =>
    pColors.map((_,pi) => [
      { id:0, pos:-1, home:true },
      { id:1, pos:-1, home:true },
      { id:2, pos:-1, home:true },
      { id:3, pos:-1, home:true },
    ])
  );
  const DOTS = {1:[[50,50]],2:[[28,28],[72,72]],3:[[28,28],[50,50],[72,72]],4:[[28,28],[72,28],[28,72],[72,72]],5:[[28,28],[72,28],[50,50],[28,72],[72,72]],6:[[28,28],[72,28],[28,50],[72,50],[28,72],[72,72]]};

  const roll = () => {
    if (rolling || diceRolled) return;
    setRolling(true);
    let n = 0, val;
    const iv = setInterval(() => {
      val = Math.ceil(Math.random() * 6);
      setDice(val);
      if (++n > 9) {
        clearInterval(iv);
        setRolling(false);
        setDiceRolled(true);
        if (val === 6) notify("🎲 ¡Seis!", `${pNames[turn]} sacó un 6 — puede sacar ficha`, "🎲");
      }
    }, 90);
  };

  const movePiece = (pi, pieceIdx) => {
    if (pi !== turn || !diceRolled) return;
    setPieces(prev => {
      const next = prev.map(p => p.map(pc => ({...pc})));
      const piece = next[pi][pieceIdx];
      if (piece.home && dice === 6) { piece.home = false; piece.pos = 0; }
      else if (!piece.home) { piece.pos = (piece.pos + dice) % 56; }
      return next;
    });
    setDiceRolled(false);
    setDice(null);
    if (dice !== 6) setTurn(t => (t + 1) % 4);
    else notify("🎲 Turno extra", `${pNames[turn]} sacó 6 y repite turno`, "🎲");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button style={{ ...S.btn(C.muted,C.muted,true), padding:"8px 12px" }} onClick={onBack}><ArrowLeft size={14} strokeWidth={2}/> Volver</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontWeight:"bold", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}><Dice5 size={20} color={C.accent} strokeWidth={1.5}/> Parchís</div>
          <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Turno de <strong style={{ color:pColors[turn] }}>{pNames[turn]}</strong></div>
        </div>
      </div>

      {/* Board */}
      <div style={{ background:C.card, borderRadius:16, padding:8, border:`1px solid ${C.border}`, boxShadow:`0 4px 20px ${C.shadow}`, aspectRatio:"1", width:"100%" }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${BOARD_SIZE},1fr)`, gap:2, height:"100%" }}>
          {Array(BOARD_SIZE*BOARD_SIZE).fill(0).map((_,i) => {
            const r = Math.floor(i/BOARD_SIZE), c = i%BOARD_SIZE;
            const homeZone = HOME_ZONES.find(h => r>=h.rows[0]&&r<=h.rows[1]&&c>=h.cols[0]&&c<=h.cols[1]);
            const isCenter = r>=4&&r<=6&&c>=4&&c<=6;
            const isPath = !homeZone && !isCenter;
            const piecesHere = pieces.flatMap((pp,pi) => pp.filter(pc => !pc.home && Math.abs((pc.pos % BOARD_SIZE) - c) < 1).map(pc => ({...pc,pi})));

            return (
              <div key={i} style={{ borderRadius:3, aspectRatio:"1", background: isCenter?`linear-gradient(135deg,${C.accentSoft},${C.pinkSoft})`: homeZone?pColors[homeZone.idx]+"25":C.bgDeep, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                {homeZone && <div style={{ width:8,height:8,borderRadius:"50%",background:pColors[homeZone.idx],opacity:0.5 }}/>}
                {isCenter && r===5&&c===5 && <Star size={10} color={C.accent} strokeWidth={2} fill={C.accentSoft}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pieces */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {pColors.map((color,pi)=>(
          <div key={pi} style={{ ...S.card(pi===turn?color+"70":undefined), padding:"10px 12px", background:pi===turn?color+"12":C.cardWarm }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:color,flexShrink:0 }}/>
              <span style={{ fontSize:12,flex:1,fontWeight:pi===turn?"bold":"normal" }}>{pNames[pi]}</span>
              {pi===turn&&<span style={S.pill(C.accentSoft,C.accent)}><Dice5 size={9} strokeWidth={2}/> Turno</span>}
            </div>
            <div style={{ display:"flex", gap:5 }}>
              {pieces[pi].map((pc,idx)=>(
                <div key={idx} onClick={()=>movePiece(pi,idx)} style={{ width:22,height:22,borderRadius:"50%",background:pc.home?"white":color,border:`2px solid ${color}`,cursor:pi===turn&&diceRolled?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:"bold",color:pc.home?color:"white",boxShadow:pi===turn&&diceRolled?`0 0 0 2px ${color}44`:"none",transition:"all 0.15s" }}>
                  {pc.home?"⌂":pc.pos}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dice */}
      <div style={{ display:"flex", alignItems:"center", gap:14, justifyContent:"center" }}>
        <div style={{ width:64,height:64,borderRadius:14,background:"white",boxShadow:`0 6px 24px ${C.shadow}`,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${C.border}`,transform:rolling?"rotate(12deg) scale(1.08)":"rotate(0deg) scale(1)",transition:"transform 0.09s" }}>
          {dice?<svg width="44" height="44" viewBox="0 0 100 100">{(DOTS[dice]||[]).map(([cx,cy],j)=><circle key={j} cx={cx} cy={cy} r="9" fill={C.accent}/>)}</svg>:<Dice5 size={34} color={C.accentLight} strokeWidth={1.2}/>}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <button style={S.btn(diceRolled?C.muted:C.accent)} onClick={roll} disabled={rolling||diceRolled}>
            <Dice5 size={14} strokeWidth={2}/> {rolling?"Tirando…":diceRolled?"Mueve ficha":"Tirar dado"}
          </button>
          {diceRolled&&dice&&<div style={{ fontSize:11,color:C.muted,textAlign:"center" }}>Sacaste un <strong style={{ color:C.accent }}>{dice}</strong> — pulsa tu ficha</div>}
        </div>
      </div>
    </div>
  );
}

// ─── WORDLE ───────────────────────────────────────────────────────────────────
const WORDLE_WORDS = [
  "PLAYA","AMIGA","FIESTA","TARDE","NOCHE","ENERO","MARZO","JUEGO","LIBRO","BRISA",
  "CAMPO","DANCE","DULCE","FERIA","GANAS","HIELO","JARDN","LIMON","LLUVIA","MANGO",
  "MEDIA","MUNDO","NADIE","NEGRO","NIVEL","NORTE","NOVIA","NUEVE","OCEAN","OLIVE",
  "ORDEN","OSCAR","OVEJA","PABLO","PADRE","PARED","PARIS","PASTA","PIANO","PINTA",
  "PISTA","PIZZA","PLATO","PLAZA","POETA","PONTE","PRIOR","PRIMO","QUESO","RADIO",
  "REINA","REINO","RELOJ","RESTA","RIVAL","RIZAR","ROBLE","ROMPE","ROSCA","RUBIA",
  "SABOR","SALSA","SALUD","SALVO","SAMBA","SAUCE","SEÑAL","SEXTO","SIETE","SIGLO",
  "SOBRE","SOLAR","SUELO","SUENA","SUELA","TABLA","TANGO","TARDE","TARTA","TECHO",
  "TEMA","TIGRE","TIMBA","TINTO","TIRAR","TIRSO","TOMAR","TORNO","TORRE","TOTAL",
  "TRAJE","TRAMA","TRIGO","TRUCO","TUNEL","ÚNICO","VALLE","VAPOR","VASCO","VECIN",
  "VELAR","VERDE","VERSO","VIAJE","VIDAS","VIENTO","VIGOR","VIRAL","VISTA","VITAL",
  "VOCAL","VOLCO","VUELO","YATES","ZUMOS","ZUECO","BAILE","BARCO","BARRO","BELLO",
  "BESAR","CACAO","CAJON","CALOR","CANTO","CARNE","CARTA","CASCO","CIELO","CINCO",
  "CIRCO","CLARO","CLASE","CLAVE","CLIMA","COBRE","COCER","COCHE","COCOA","COLOR",
];

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

function WordleGame({ onBack, notify }) {
  const wordLength = 5;
  const maxGuesses = 6;

  const [target] = useState(() => {
    const words5 = WORDLE_WORDS.filter(w => w.length === 5);
    return words5[Math.floor(Math.random() * words5.length)];
  });
  const [guesses, setGuesses] = useState([]); // array of strings
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [revealed, setRevealed] = useState([]); // which rows are revealed

  // letter state map: correct / present / absent
  const letterStates = {};
  guesses.forEach((g, gi) => {
    g.split("").forEach((ch, ci) => {
      const state = getLetterState(g, target, ci);
      const prev = letterStates[ch];
      if (prev === "correct") return;
      if (prev === "present" && state !== "correct") return;
      letterStates[ch] = state;
    });
  });

  function getLetterState(guess, target, idx) {
    if (guess[idx] === target[idx]) return "correct";
    if (target.includes(guess[idx])) return "present";
    return "absent";
  }

  function getTileColor(state, revealed) {
    if (!revealed) return C.card;
    if (state === "correct") return C.green;
    if (state === "present") return C.orange;
    return C.muted;
  }

  function getKeyColor(ch) {
    const s = letterStates[ch];
    if (s === "correct") return C.green;
    if (s === "present") return C.orange;
    if (s === "absent") return "#9ca3af";
    return C.bgDeep;
  }

  const pressKey = (key) => {
    if (gameOver) return;
    if (key === "⌫") {
      setCurrent(c => c.slice(0, -1));
    } else if (key === "ENTER") {
      if (current.length < wordLength) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      const newGuesses = [...guesses, current];
      setGuesses(newGuesses);
      setRevealed(r => [...r, newGuesses.length - 1]);
      setCurrent("");
      if (current === target) {
        setTimeout(() => { setWon(true); setGameOver(true); notify("🎉 ¡Ganaste!", `Adivinaste "${target}" en ${newGuesses.length} intentos`, "🎉"); }, 400);
      } else if (newGuesses.length >= maxGuesses) {
        setTimeout(() => { setGameOver(true); notify("😢 Fin del juego", `La palabra era "${target}"`, "😢"); }, 400);
      }
    } else {
      if (current.length < wordLength) setCurrent(c => c + key);
    }
  };

  // Render grid
  const rows = [];
  for (let i = 0; i < maxGuesses; i++) {
    let word = i < guesses.length ? guesses[i] : i === guesses.length ? current : "";
    let isActive = i === guesses.length && !gameOver;
    let isRevealed = i < guesses.length;
    rows.push({ word, isActive, isRevealed, idx: i });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, alignItems:"center" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%" }}>
        <button style={{ ...S.btn(C.muted,C.muted,true), padding:"8px 12px" }} onClick={onBack}><ArrowLeft size={14} strokeWidth={2}/> Volver</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontWeight:"bold", fontSize:18 }}>🟣 Adivina la Palabra</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Palabra de {wordLength} letras · {maxGuesses} intentos</div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display:"flex", gap:6, transform: row.isActive && shake ? "translateX(-6px)" : "none", transition:"transform 0.1s" }}>
            {Array(wordLength).fill(0).map((_,ci) => {
              const ch = row.word[ci] || "";
              const state = row.isRevealed ? getLetterState(row.word, target, ci) : null;
              const bg = getTileColor(state, row.isRevealed);
              const isFilled = !!ch;
              return (
                <div key={ci} style={{ width:54, height:54, borderRadius:10, background: row.isRevealed ? bg : C.card, border: `2px solid ${row.isRevealed ? bg : isFilled ? C.accent : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold", fontSize:22, color: row.isRevealed ? "white" : C.text, transition:"background 0.3s", boxShadow: isFilled && !row.isRevealed ? `0 0 0 2px ${C.accentSoft}` : "none" }}>
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Result banner */}
      {gameOver && (
        <div style={{ ...S.card(won ? C.green+"60" : C.pink+"60"), padding:"14px 20px", background: won ? C.greenSoft : C.pinkSoft, textAlign:"center", width:"100%" }}>
          <div style={{ fontWeight:"bold", fontSize:16 }}>{won ? "🎉 ¡Genial!" : "😢 ¡Casi!"}</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{won ? `Adivinaste en ${guesses.length} intento${guesses.length>1?"s":""}` : `La palabra era `}<strong>{!won && target}</strong></div>
          <button style={{ ...S.btn(won ? C.green : C.accent), marginTop:10 }} onClick={()=>{ setGuesses([]); setCurrent(""); setGameOver(false); setWon(false); setRevealed([]); onBack(); }}>
            Jugar otra vez
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display:"flex", gap:5, justifyContent:"center" }}>
            {row.map(key => (
              <button key={key} onClick={() => pressKey(key)} style={{ height:44, minWidth: key.length > 1 ? (key==="ENTER"?52:44) : 32, flex: key.length===1 ? 1 : undefined, maxWidth: key.length===1 ? 40 : undefined, borderRadius:8, background: key==="ENTER" ? C.accent : key==="⌫" ? C.pink : getKeyColor(key), color: letterStates[key] || key==="ENTER" || key==="⌫" ? "white" : C.text, border:"none", fontWeight:"bold", fontSize: key.length>1 ? 11 : 14, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 2px 4px ${C.shadow}`, transition:"background 0.2s" }}>
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize:11, color:C.muted, textAlign:"center" }}>
        🟢 Letra correcta · 🟠 Letra en otra posición · ⬜ No está
      </div>
    </div>
  );
}

// ─── JUEGOS ───────────────────────────────────────────────────────────────────
const GAMES_LIST=[
  { id:"parcheesi", name:"Parchís",            Icon:Dice5,    players:"1–4", online:2, color:C.accent, colorSoft:C.accentSoft, available:true  },
  { id:"wordle",    name:"Adivina la Palabra",  Icon:BookOpen, players:"1",   online:0, color:C.teal,   colorSoft:C.tealSoft,   available:true  },
  { id:"trivia",    name:"Trivia Equipo",        Icon:Smile,    players:"2–6", online:3, color:C.orange, colorSoft:C.orangeSoft, available:false },
  { id:"rummy",     name:"Rummikub",             Icon:Star,     players:"2–4", online:1, color:C.pink,   colorSoft:C.pinkSoft,   available:false },
  { id:"domino",    name:"Dominó",               Icon:Gamepad2, players:"2–4", online:0, color:C.blue,   colorSoft:C.blueSoft,   available:false },
];

function JuegosTab({ notify }) {
  const [active,setActive]=useState(null);
  if(active==="parcheesi") return <ParcheesiGame onBack={()=>setActive(null)} notify={notify}/>;
  if(active==="wordle")    return <WordleGame    onBack={()=>setActive(null)} notify={notify}/>;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div>
        <div style={{ fontWeight:"bold",fontSize:16,display:"flex",alignItems:"center",gap:7 }}><Gamepad2 size={19} color={C.accent} strokeWidth={1.6}/> Juegos del Equipo Malo</div>
        <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Juega directamente aquí, sin salir de la app</div>
      </div>
      {GAMES_LIST.map(g=>(
        <div key={g.id} style={{ ...S.card(), background:C.cardWarm, display:"flex", gap:12, alignItems:"center", padding:14, opacity:g.available?1:0.7 }}>
          <div style={{ width:50,height:50,borderRadius:12,flexShrink:0,background:g.colorSoft,border:`1px solid ${g.color}33`,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <g.Icon size={22} color={g.color} strokeWidth={1.4}/>
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:"bold",fontSize:14 }}>{g.name}</div>
            <div style={{ fontSize:11,color:C.muted,marginTop:1,display:"flex",alignItems:"center",gap:3 }}><Users size={10} strokeWidth={1.8} color={C.accentLight}/> {g.players} jugadoras</div>
            <div style={{ marginTop:5 }}>
              {g.available
                ? <span style={S.pill(g.online>0?C.greenSoft:C.bgDeep,g.online>0?C.green:C.muted)}><Wifi size={9} strokeWidth={2}/> {g.online>0?`${g.online} online`:"Nadie online"}</span>
                : <span style={S.pill(C.bgDeep,C.muted)}>🔜 Próximamente</span>}
            </div>
          </div>
          {g.available
            ? <button style={S.btn(g.color)} onClick={()=>setActive(g.id)}>Jugar</button>
            : <button style={S.btn(C.muted,C.muted,true)} disabled>Pronto</button>}
        </div>
      ))}
      <div style={{ ...S.card(),padding:14,background:C.cardWarm }}>
        <div style={{ fontWeight:"bold",fontSize:14,marginBottom:11,display:"flex",alignItems:"center",gap:7 }}><Trophy size={16} color={C.orange} strokeWidth={1.6}/> Ranking semanal</div>
        {[{name:"Fatou",pts:420,user:USERS[2]},{name:"Gemma",pts:380,user:USERS[1]},{name:"Iris",pts:310,user:USERS[0]},{name:"Alba",pts:290,user:USERS[3]},{name:"Wifi",pts:210,user:USERS[4]},{name:"Ali",pts:180,user:USERS[5]}].map((p,i)=>(
          <div key={p.name} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<5?`1px solid ${C.border}`:undefined }}>
            <span style={{ width:20,textAlign:"center",fontSize:14 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{ fontSize:12,color:C.muted }}>{i+1}</span>}</span>
            <div style={S.avatar(p.user.color,30)}>{p.user.initials[0]}</div>
            <span style={{ flex:1,fontSize:13 }}>{p.name}</span>
            <span style={{ fontWeight:"bold",color:p.user.color,fontSize:13 }}>{p.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COCINA ───────────────────────────────────────────────────────────────────
const INIT_RECIPES = [
  { id:1, author:USERS[1], title:"Pasta carbonara de la abuela", ingredients:["200g pasta","2 huevos","100g panceta","Parmesano","Pimienta negra"], steps:["Cocer la pasta al dente","Freír la panceta","Mezclar huevos con queso","Juntar todo sin fuego"], saved:false, votes:8, category:"pasta" },
  { id:2, author:USERS[3], title:"Arroz con leche asturiano",    ingredients:["200g arroz","1L leche","150g azúcar","Canela","Limón"],              steps:["Hervir la leche con canela","Añadir el arroz","Cocer 40 min removiendo","Enfriar y espolvorear canela"], saved:true, votes:12, category:"postre" },
  { id:3, author:USERS[2], title:"Thiéboudienne de Fatou",       ingredients:["500g arroz","1kg pescado","Tomate","Cebolla","Especias senegalesas"], steps:["Marinar el pescado","Sofreír verduras","Añadir agua y arroz","Cocer hasta absorber el caldo"], saved:false, votes:15, category:"arroces" },
];

const CONTEST = {
  reto: "🍝 Reto de la semana: Mejor plato de pasta",
  ends: "Termina el domingo",
  entries: [
    { user:USERS[1], dish:"Carbonara sin nata", votes:14, winner:false },
    { user:USERS[2], dish:"Pasta con gambas",   votes:9,  winner:false },
    { user:USERS[3], dish:"Cacio e pepe",        votes:17, winner:true  },
  ]
};

function CocinaTab({ notify }) {
  const [recipes, setRecipes] = useState(INIT_RECIPES);
  const [view, setView] = useState("recipes"); // recipes | contest | detail | new
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState({});
  const [newRecipe, setNewRecipe] = useState({ title:"", ingredients:"", steps:"", category:"pasta" });
  const [filter, setFilter] = useState("todas");

  const categories = ["todas","pasta","postre","arroces","carnes","otros"];

  const toggleSave = (id) => {
    setRecipes(r => r.map(rc => rc.id===id ? {...rc,saved:!rc.saved} : rc));
    const r = recipes.find(rc=>rc.id===id);
    if (!r.saved) notify("🔖 Receta guardada", `"${r.title}" guardada en tus recetas`, "🔖");
  };

  const addRecipe = () => {
    if (!newRecipe.title) return;
    const r = { id:Date.now(), author:USERS[0], title:newRecipe.title, ingredients:newRecipe.ingredients.split("\n").filter(Boolean), steps:newRecipe.steps.split("\n").filter(Boolean), saved:false, votes:0, category:newRecipe.category };
    setRecipes(prev=>[r,...prev]);
    setNewRecipe({title:"",ingredients:"",steps:"",category:"pasta"});
    setView("recipes");
    notify("👩‍🍳 Receta publicada",`"${r.title}" ya visible para el equipo`,"👩‍🍳");
  };

  const filtered = filter==="todas" ? recipes : recipes.filter(r=>r.category===filter);
  const saved = recipes.filter(r=>r.saved);

  if (view==="detail" && selected) {
    const r = recipes.find(rc=>rc.id===selected);
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <button style={{ ...S.btn(C.muted,C.muted,true),padding:"8px 12px" }} onClick={()=>setView("recipes")}><ArrowLeft size={14} strokeWidth={2}/> Volver</button>
          <div style={{ flex:1,fontWeight:"bold",fontSize:15 }}>{r.title}</div>
          <button onClick={()=>toggleSave(r.id)} style={{ background:"none",border:"none",cursor:"pointer" }}>
            <Bookmark size={20} strokeWidth={1.8} color={r.saved?C.accent:C.muted} fill={r.saved?C.accent:"none"}/>
          </button>
        </div>
        <div style={{ ...S.card(),padding:14,background:C.cardWarm }}>
          <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
            <div style={S.avatar(r.author.color,36)}>{r.author.initials[0]}</div>
            <div>
              <div style={{ fontWeight:"bold",fontSize:13 }}>{r.author.fullName}</div>
              <div style={{ fontSize:11,color:C.muted }}>Receta de {r.author.name}</div>
            </div>
            <span style={{ ...S.pill(C.pinkSoft,C.pink),marginLeft:"auto" }}><ThumbsUp size={9} strokeWidth={2}/> {r.votes}</span>
          </div>
          <div style={{ fontWeight:"bold",fontSize:13,color:C.accent,marginBottom:8 }}>Ingredientes</div>
          {r.ingredients.map((ing,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:C.accent,flexShrink:0 }}/>
              <span style={{ fontSize:13 }}>{ing}</span>
            </div>
          ))}
          <div style={{ fontWeight:"bold",fontSize:13,color:C.accent,marginTop:14,marginBottom:8 }}>Preparación</div>
          {r.steps.map((step,i)=>(
            <div key={i} style={{ display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:22,height:22,borderRadius:"50%",background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:"bold",color:C.accent }}>{i+1}</div>
              <span style={{ fontSize:13,lineHeight:1.5,paddingTop:3 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view==="new") return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <button style={{ ...S.btn(C.muted,C.muted,true),padding:"8px 12px" }} onClick={()=>setView("recipes")}><ArrowLeft size={14} strokeWidth={2}/> Volver</button>
        <div style={{ fontWeight:"bold",fontSize:15 }}>Nueva receta</div>
      </div>
      <div style={{ ...S.card(),padding:14,display:"flex",flexDirection:"column",gap:10,background:C.cardWarm }}>
        <input placeholder="Nombre de la receta" value={newRecipe.title} onChange={e=>setNewRecipe(r=>({...r,title:e.target.value}))} style={S.input}/>
        <select value={newRecipe.category} onChange={e=>setNewRecipe(r=>({...r,category:e.target.value}))} style={{ ...S.input }}>
          {categories.filter(c=>c!=="todas").map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
        <div>
          <div style={{ fontSize:12,color:C.muted,marginBottom:4,fontWeight:"bold" }}>INGREDIENTES (uno por línea)</div>
          <textarea placeholder={"200g pasta\n2 huevos\n..."} value={newRecipe.ingredients} onChange={e=>setNewRecipe(r=>({...r,ingredients:e.target.value}))} style={{ ...S.input,resize:"none",height:100 }}/>
        </div>
        <div>
          <div style={{ fontSize:12,color:C.muted,marginBottom:4,fontWeight:"bold" }}>PASOS (uno por línea)</div>
          <textarea placeholder={"Cocer la pasta...\nFreír la panceta...\n..."} value={newRecipe.steps} onChange={e=>setNewRecipe(r=>({...r,steps:e.target.value}))} style={{ ...S.input,resize:"none",height:100 }}/>
        </div>
        <button style={S.btn(C.accent)} onClick={addRecipe}><ChefHat size={14} strokeWidth={2}/> Publicar receta</button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      {/* Tabs */}
      <div style={{ display:"flex",gap:0,background:C.bgDeep,borderRadius:12,padding:3 }}>
        {[["recipes","🍽 Recetas"],["contest","🏆 Concurso"],["saved","🔖 Guardadas"]].map(([v,lbl])=>(
          <button key={v} onClick={()=>setView(v)} style={{ flex:1,padding:"8px 4px",background:view===v?C.card:"transparent",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:view===v?"bold":"normal",color:view===v?C.accent:C.muted,fontFamily:"inherit",transition:"all 0.15s" }}>{lbl}</button>
        ))}
      </div>

      {view==="recipes" && <>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",gap:5,overflowX:"auto",flex:1,paddingBottom:2 }}>
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)} style={{ ...S.pill(filter===cat?C.accentSoft:C.bgDeep,filter===cat?C.accent:C.muted),border:`1px solid ${filter===cat?C.accentLight:C.border}`,cursor:"pointer",flexShrink:0,padding:"5px 11px" }}>{cat}</button>
            ))}
          </div>
          <button style={{ ...S.btn(C.accent),marginLeft:8,flexShrink:0,padding:"8px 12px" }} onClick={()=>setView("new")}><Plus size={13} strokeWidth={2}/></button>
        </div>
        {filtered.map(r=>(
          <div key={r.id} style={{ ...S.card(),background:C.cardWarm,cursor:"pointer" }} onClick={()=>{setSelected(r.id);setView("detail");}}>
            <div style={{ padding:14,display:"flex",gap:11,alignItems:"center" }}>
              <div style={{ width:50,height:50,borderRadius:12,background:C.pinkSoft,border:`1px solid ${C.pink}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <ChefHat size={22} color={C.pink} strokeWidth={1.4}/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:"bold",fontSize:13 }}>{r.title}</div>
                <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>por {r.author.name}</div>
                <div style={{ display:"flex",gap:6,marginTop:5 }}>
                  <span style={S.pill(C.accentSoft,C.accent)}>{r.category}</span>
                  <span style={S.pill(C.pinkSoft,C.pink)}><ThumbsUp size={9} strokeWidth={2}/> {r.votes}</span>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();toggleSave(r.id);}} style={{ background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0 }}>
                <Bookmark size={18} strokeWidth={1.8} color={r.saved?C.accent:C.muted} fill={r.saved?C.accent:"none"}/>
              </button>
            </div>
          </div>
        ))}
      </>}

      {view==="contest" && <>
        <div style={{ ...S.card(C.orange+"44"),padding:16,background:C.orangeSoft }}>
          <div style={{ fontWeight:"bold",fontSize:16 }}>{CONTEST.reto}</div>
          <div style={{ fontSize:12,color:C.muted,marginTop:3,display:"flex",alignItems:"center",gap:4 }}><Clock size={11} strokeWidth={1.8}/> {CONTEST.ends}</div>
        </div>
        {CONTEST.entries.map((e,i)=>(
          <div key={i} style={{ ...S.card(e.winner?C.orange+"50":undefined),padding:14,background:e.winner?C.orangeSoft:C.cardWarm,display:"flex",alignItems:"center",gap:11 }}>
            <div style={S.avatar(e.user.color,40)}>{e.user.initials[0]}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:"bold",fontSize:13 }}>{e.dish}</div>
              <div style={{ fontSize:11,color:C.muted }}>por {e.user.name}</div>
              {e.winner && <span style={{ ...S.pill(C.orangeSoft,C.orange),marginTop:5 }}>🏆 Líder</span>}
            </div>
            <button onClick={()=>{if(!voted[i]){setVoted(v=>({...v,[i]:true}));notify("👍 Votado",`Has votado por "${e.dish}"`,"👍");}}} style={{ ...S.btn(voted[i]?C.muted:C.pink),padding:"8px 13px",fontSize:12 }}>
              <ThumbsUp size={13} strokeWidth={2}/> {e.votes+(voted[i]?1:0)}
            </button>
          </div>
        ))}
        <button style={{ ...S.btn(C.orange),alignSelf:"flex-start" }} onClick={()=>notify("📸 Próximamente","Subir fotos al concurso llegará pronto","📸")}>
          <Camera size={14} strokeWidth={2}/> Subir mi plato
        </button>
      </>}

      {view==="saved" && <>
        {saved.length === 0 ? (
          <div style={{ textAlign:"center",padding:"40px 20px",color:C.muted }}>
            <Bookmark size={40} color={C.border} strokeWidth={1.2} style={{ margin:"0 auto 12px",display:"block" }}/>
            <div style={{ fontSize:14 }}>Aún no tienes recetas guardadas</div>
            <div style={{ fontSize:12,marginTop:4 }}>Pulsa el marcador en cualquier receta</div>
          </div>
        ) : saved.map(r=>(
          <div key={r.id} style={{ ...S.card(),background:C.cardWarm,cursor:"pointer" }} onClick={()=>{setSelected(r.id);setView("detail");}}>
            <div style={{ padding:14,display:"flex",gap:11,alignItems:"center" }}>
              <div style={{ width:46,height:46,borderRadius:12,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <ChefHat size={20} color={C.accent} strokeWidth={1.4}/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:"bold",fontSize:13 }}>{r.title}</div>
                <div style={{ fontSize:11,color:C.muted }}>por {r.author.name}</div>
              </div>
              <Bookmark size={16} color={C.accent} strokeWidth={1.8} fill={C.accent}/>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const INIT_MSGS = [
  { id:1, user:USERS[1], text:"Chicas, ¿alguien para la playa el domingo? ☀️", time:"09:14", mine:false },
  { id:2, user:USERS[2], text:"YO YO YO!! Llevo semanas sin ir", time:"09:21", mine:false },
  { id:3, user:USERS[0], text:"Me apunto también, ¿a qué hora quedamos?", time:"09:23", mine:true },
  { id:4, user:USERS[3], text:"A las 11 en el Arbeyal? Así nos da tiempo a desayunar", time:"09:45", mine:false },
  { id:5, user:USERS[4], text:"Perfecto, yo llevo las sillas 🪑", time:"10:02", mine:false },
  { id:6, user:USERS[5], text:"Yo llevo la nevera con algo frío 🧃", time:"10:15", mine:false },
  { id:7, user:USERS[0], text:"Qué equipazo somos 😂❤️", time:"10:16", mine:true },
];

function ChatTab({ notify }) {
  const [messages,setMessages]=useState(INIT_MSGS);
  const [draft,setDraft]=useState("");
  const [showEmoji,setShowEmoji]=useState(false);
  const bottomRef=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send=()=>{
    if(!draft.trim())return;
    const msg={ id:Date.now(),user:USERS[0],text:draft.trim(),time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),mine:true };
    setMessages(m=>[...m,msg]);
    setDraft("");
    const replies=[
      {user:USERS[1],text:"Jajaja siempre igual Iris 😂"},
      {user:USERS[2],text:"¡Qué buena idea! Me apunto 🙋‍♀️"},
      {user:USERS[3],text:"Ays qué ganas de veros ❤️"},
      {user:USERS[4],text:"Equipo Malo al poder 🔥"},
      {user:USERS[5],text:"Contad conmigo!"},
    ];
    const r=replies[Math.floor(Math.random()*replies.length)];
    setTimeout(()=>{
      setMessages(m=>[...m,{ id:Date.now()+1,user:r.user,text:r.text,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),mine:false }]);
      notify(`💬 ${r.user.name}`,r.text,"💬");
    },1400);
  };

  const emojis=["😄","👌","🔥","❤️","😂","🎉","👏","🙌","☀️","🏖️","💪","🎮","🍝","🥘","🍺"];
  const grouped=messages.map((msg,i)=>({...msg,isFirst:i===0||messages[i-1].user.name!==msg.user.name,isLast:i===messages.length-1||messages[i+1].user.name!==msg.user.name}));

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"calc(100svh - 118px)",minHeight:400 }}>
      <div style={{ padding:"10px 14px",background:C.cardWarm,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9,flexShrink:0 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Hash size={16} color="white" strokeWidth={2}/>
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontWeight:"bold",fontSize:13 }}>equipo-malo</div>
          <div style={{ fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:3 }}><div style={{ width:6,height:6,borderRadius:"50%",background:C.green }}/> 4 amigas en línea</div>
        </div>
        <div style={{ display:"flex" }}>
          {USERS.map((u,i)=><div key={i} style={{ ...S.avatar(u.color,24),marginLeft:i===0?0:-7,border:`2px solid ${C.bg}`,fontSize:8,zIndex:6-i }}>{u.initials[0]}</div>)}
        </div>
      </div>

      <div style={{ flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:2,background:C.bg }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,margin:"6px 0 12px" }}>
          <div style={{ flex:1,height:1,background:C.border }}/><span style={{ fontSize:10,color:C.muted,fontStyle:"italic" }}>Hoy</span><div style={{ flex:1,height:1,background:C.border }}/>
        </div>
        {grouped.map(msg=>(
          <div key={msg.id} style={{ display:"flex",flexDirection:msg.mine?"row-reverse":"row",gap:7,alignItems:"flex-end",marginBottom:msg.isLast?7:2 }}>
            <div style={{ width:28,flexShrink:0 }}>
              {!msg.mine&&msg.isLast&&<div style={S.avatar(msg.user.color,28)}>{msg.user.initials[0]}</div>}
            </div>
            <div style={{ maxWidth:"74%",display:"flex",flexDirection:"column",alignItems:msg.mine?"flex-end":"flex-start",gap:1 }}>
              {!msg.mine&&msg.isFirst&&<span style={{ fontSize:10,fontWeight:"bold",color:msg.user.color,marginLeft:3,marginBottom:2 }}>{msg.user.name}</span>}
              <div style={{ background:msg.mine?`linear-gradient(135deg,${C.accent},${C.pink})`:C.card,color:msg.mine?"white":C.text,borderRadius:msg.mine?`14px 14px ${msg.isLast?3:14}px 14px`:`14px 14px 14px ${msg.isLast?3:14}px`,padding:"8px 12px",fontSize:13,lineHeight:1.5,border:msg.mine?"none":`1px solid ${C.border}`,boxShadow:`0 1px 4px ${C.shadow}` }}>
                {msg.text}
              </div>
              {msg.isLast&&<span style={{ fontSize:9,color:C.muted,marginTop:1,marginLeft:3,marginRight:3 }}>{msg.time}</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {showEmoji&&(
        <div style={{ padding:"8px 12px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",gap:6,flexWrap:"wrap" }}>
          {emojis.map(e=><button key={e} onClick={()=>{setDraft(d=>d+e);setShowEmoji(false);inputRef.current?.focus();}} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",padding:3,borderRadius:6 }}>{e}</button>)}
        </div>
      )}

      <div style={{ padding:"8px 12px 10px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
        <button onClick={()=>setShowEmoji(s=>!s)} style={{ background:"none",border:"none",cursor:"pointer",padding:3,color:showEmoji?C.accent:C.muted,flexShrink:0 }}>
          <Smile size={20} strokeWidth={1.6}/>
        </button>
        <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Escribe un mensaje…" style={{ ...S.input,borderRadius:20,padding:"9px 13px",flex:1 }}/>
        <button onClick={send} disabled={!draft.trim()} style={{ width:38,height:38,borderRadius:"50%",background:draft.trim()?`linear-gradient(135deg,${C.accent},${C.pink})`:C.border,border:"none",cursor:draft.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:draft.trim()?`0 2px 10px ${C.shadow}`:"none",transition:"all 0.18s" }}>
          <Send size={15} color={draft.trim()?"white":C.muted} strokeWidth={2} style={{ transform:"translateX(1px)" }}/>
        </button>
      </div>
    </div>
  );
}

// ─── AMIGOS ───────────────────────────────────────────────────────────────────
function AmigosTab({ notify }) {
  const [showInvite,setShowInvite]=useState(false);
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const FRIENDS=[
    { user:USERS[1], status:"online",  activity:"Viendo series 📺"  },
    { user:USERS[2], status:"online",  activity:"Jugando al Parchís" },
    { user:USERS[3], status:"away",    activity:"Hace 30 minutos"    },
    { user:USERS[4], status:"online",  activity:"En el gym 💪"       },
    { user:USERS[5], status:"offline", activity:"Hace 2 horas"       },
  ];
  const statusColor={online:C.green,away:C.orange,offline:C.muted};
  const statusLabel={online:"En línea",away:"Ausente",offline:"Desconectada"};
  const StatusIcon={online:Wifi,away:Clock,offline:WifiOff};
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <button style={S.btn(C.accent)} onClick={()=>{setShowInvite(true);setSent(false);setEmail("");}}><UserPlus size={14} strokeWidth={2}/> Invitar amiga</button>
      {showInvite && (
        <div style={{ ...S.card(C.accentLight+"50"),padding:16,display:"flex",flexDirection:"column",gap:10,background:C.cardWarm }}>
          <div style={{ fontWeight:"bold",fontSize:15,display:"flex",alignItems:"center",gap:7 }}><Mail size={16} color={C.accent} strokeWidth={1.7}/> Invitar por correo</div>
          {!sent?(<>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" style={S.input}/>
            <div style={{ display:"flex",gap:7 }}>
              <button style={S.btn(C.accent)} onClick={()=>{if(email){setSent(true);notify("✉️ Invitación enviada",`Enlace enviado a ${email}`,"✉️");}}}><Send size={13} strokeWidth={2}/> Enviar</button>
              <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setShowInvite(false)}><X size={13} strokeWidth={2}/> Cancelar</button>
            </div>
          </>):(
            <div style={{ background:C.greenSoft,color:C.green,borderRadius:10,padding:"10px 14px",fontSize:13,display:"flex",alignItems:"center",gap:7 }}>
              <CheckCircle size={15} strokeWidth={2} color={C.green}/> Enviada a <strong>{email}</strong>
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize:10,color:C.muted,fontWeight:"bold",letterSpacing:1.2 }}>EL EQUIPO ({FRIENDS.length})</div>
      {FRIENDS.map(f=>{
        const SIcon=StatusIcon[f.status];
        return (
          <div key={f.user.name} style={{ ...S.card(),background:C.cardWarm,padding:13,display:"flex",gap:11,alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <div style={S.avatar(f.user.color,44)}>{f.user.initials[0]}</div>
              <div style={{ position:"absolute",bottom:1,right:1,width:13,height:13,borderRadius:"50%",background:statusColor[f.status],border:`2px solid ${C.card}` }}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:"bold",fontSize:13 }}>{f.user.fullName}</div>
              <div style={{ fontSize:11,color:C.muted,marginTop:1 }}>{f.activity}</div>
              <span style={{ ...S.pill(statusColor[f.status]+"18",statusColor[f.status]),marginTop:5,fontSize:10,display:"inline-flex" }}><SIcon size={9} strokeWidth={2}/> {statusLabel[f.status]}</span>
            </div>
            <button style={S.btn(f.user.color,"white",true)}><MessageCircle size={14} strokeWidth={1.8}/></button>
          </div>
        );
      })}
    </div>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────────
function PerfilTab({ notify, permission, requestPermission }) {
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState("Iris Arnaiz");
  const [bio,setBio]=useState("Fundadora del Equipo Malo 😈 Amante de la playa, la pasta y el gym (cuando me apetece)");
  const [tempName,setTempName]=useState(name);
  const [tempBio,setTempBio]=useState(bio);

  const stats=[{label:"Planes",value:24,Icon:Calendar,color:C.accent},{label:"Recetas",value:8,Icon:Utensils,color:C.pink},{label:"Victorias",value:13,Icon:Trophy,color:C.orange}];
  const achievements=[
    {label:"Fundadora del Equipo Malo",Icon:Users,color:C.accent,bg:C.accentSoft,earned:true},
    {label:"Chef de la pandilla",Icon:ChefHat,color:C.pink,bg:C.pinkSoft,earned:true},
    {label:"100 mensajes",Icon:MessageCircle,color:C.teal,bg:C.tealSoft,earned:true},
    {label:"Organizadora pro",Icon:Calendar,color:C.green,bg:C.greenSoft,earned:false},
    {label:"Leyenda de los juegos",Icon:Gamepad2,color:C.orange,bg:C.orangeSoft,earned:false},
  ];
  const menuItems=[
    {label:"Editar perfil",Icon:Edit3,action:()=>setEditing(true)},
    {label:"Notificaciones",Icon:Bell,action:async()=>{const p=await requestPermission();notify("🔔 Notificaciones",p==="granted"?"¡Activadas! Te avisaremos de todo":"Actívalas en Ajustes del móvil","🔔");}},
    {label:"Privacidad",Icon:Settings,action:()=>{}},
    {label:"Cerrar sesión",Icon:LogOut,action:()=>{},danger:true},
  ];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
      <div style={{ height:100,background:`linear-gradient(135deg,${C.accent}44,${C.pink}33)`,position:"relative",borderRadius:"0 0 24px 24px",border:`1px solid ${C.border}` }}>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",gap:18,opacity:0.2 }}>
          {[Utensils,Flame,Dice5,Coffee,Dumbbell].map((I,i)=><I key={i} size={26} color={C.accent} strokeWidth={1.2}/>)}
        </div>
        <div style={{ position:"absolute",bottom:-34,left:16 }}>
          <div style={{ ...S.avatar(C.accent,72),fontSize:22,border:`4px solid ${C.bg}`,boxShadow:`0 4px 20px ${C.shadow}` }}>IA</div>
          <div style={{ position:"absolute",bottom:3,right:3,width:16,height:16,borderRadius:"50%",background:C.green,border:`2.5px solid ${C.bg}` }}/>
        </div>
        <button style={{ position:"absolute",bottom:8,right:12,...S.btn(C.card,C.accent,true),padding:"5px 11px",fontSize:11,borderColor:C.border }}>
          <Camera size={12} strokeWidth={1.8}/> Foto
        </button>
      </div>

      <div style={{ padding:"44px 14px 0",display:"flex",flexDirection:"column",gap:14 }}>
        {!editing?(
          <div style={{ ...S.card(),padding:"13px 14px",background:C.cardWarm }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:"bold",fontSize:17 }}>{name}</div>
                <div style={{ fontSize:11,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:4 }}><AtSign size={10} strokeWidth={1.8} color={C.accentLight}/> iris.arnaiz</div>
              </div>
              <button style={{ ...S.btn(C.accent,"white",true),padding:"6px 12px",fontSize:11 }} onClick={()=>{setTempName(name);setTempBio(bio);setEditing(true)}}>
                <Edit3 size={12} strokeWidth={1.8}/> Editar
              </button>
            </div>
            <p style={{ fontSize:13,color:C.muted,marginTop:9,lineHeight:1.6 }}>{bio}</p>
            {permission!=="granted"&&(
              <div style={{ marginTop:10,padding:"9px 12px",background:C.accentSoft,borderRadius:10,fontSize:12,color:C.accent,display:"flex",alignItems:"center",gap:7 }}>
                <Bell size={14} strokeWidth={2} color={C.accent}/>
                <span style={{ flex:1 }}>Activa las notificaciones para no perderte nada</span>
                <button style={{ ...S.btn(C.accent),padding:"5px 11px",fontSize:11 }} onClick={async()=>{const p=await requestPermission();notify("🔔",p==="granted"?"¡Notificaciones activadas!":"Ve a Ajustes para activarlas","🔔");}}>Activar</button>
              </div>
            )}
          </div>
        ):(
          <div style={{ ...S.card(C.accentLight+"50"),padding:14,display:"flex",flexDirection:"column",gap:10,background:C.cardWarm }}>
            <div style={{ fontWeight:"bold",fontSize:14,display:"flex",alignItems:"center",gap:7 }}><Edit3 size={15} color={C.accent} strokeWidth={1.8}/> Editar perfil</div>
            <input value={tempName} onChange={e=>setTempName(e.target.value)} placeholder="Nombre" style={S.input}/>
            <textarea value={tempBio} onChange={e=>setTempBio(e.target.value)} placeholder="Bio" style={{ ...S.input,resize:"none",height:70 }}/>
            <div style={{ display:"flex",gap:7 }}>
              <button style={S.btn(C.accent)} onClick={()=>{setName(tempName);setBio(tempBio);setEditing(false);notify("✅ Perfil actualizado","Tus cambios se han guardado","✅")}}><CheckCircle size={13} strokeWidth={2}/> Guardar</button>
              <button style={S.btn(C.muted,C.muted,true)} onClick={()=>setEditing(false)}><X size={13} strokeWidth={2}/> Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9 }}>
          {stats.map(s=>(
            <div key={s.label} style={{ ...S.card(),padding:"12px 8px",background:C.cardWarm,textAlign:"center" }}>
              <div style={{ width:34,height:34,borderRadius:9,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 7px" }}><s.Icon size={16} color={s.color} strokeWidth={1.5}/></div>
              <div style={{ fontWeight:"bold",fontSize:18,color:C.text }}>{s.value}</div>
              <div style={{ fontSize:10,color:C.muted,marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card(),padding:14,background:C.cardWarm }}>
          <div style={{ fontWeight:"bold",fontSize:14,marginBottom:11,display:"flex",alignItems:"center",gap:7 }}><Award size={16} color={C.orange} strokeWidth={1.6}/> Logros</div>
          {achievements.map(a=>(
            <div key={a.label} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`,opacity:a.earned?1:0.4 }}>
              <div style={{ width:36,height:36,borderRadius:9,background:a.bg,border:`1px solid ${a.color}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><a.Icon size={16} color={a.color} strokeWidth={1.4}/></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:a.earned?"bold":"normal" }}>{a.label}</div>
                {!a.earned&&<div style={{ fontSize:10,color:C.muted,marginTop:1 }}>Aún no conseguido</div>}
              </div>
              {a.earned&&<CheckCircle size={15} color={C.green} strokeWidth={2}/>}
            </div>
          ))}
        </div>

        <div style={{ ...S.card(),background:C.cardWarm,overflow:"hidden" }}>
          {menuItems.map((item,i)=>(
            <button key={item.label} onClick={item.action} style={{ width:"100%",padding:"13px 14px",background:"none",border:"none",borderBottom:i<menuItems.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"inherit",textAlign:"left" }}>
              <div style={{ width:32,height:32,borderRadius:9,background:item.danger?`${C.pink}15`:C.bgDeep,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <item.Icon size={15} color={item.danger?C.pink:C.muted} strokeWidth={1.7}/>
              </div>
              <span style={{ flex:1,fontSize:13,color:item.danger?C.pink:C.text,fontWeight:item.danger?"bold":"normal" }}>{item.label}</span>
              {!item.danger&&<ChevronRight size={15} color={C.muted} strokeWidth={1.6}/>}
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
  { id:"feed",   label:"Inicio",  Icon:Home        },
  { id:"planes", label:"Planes",  Icon:Calendar    },
  { id:"chat",   label:"Chat",    Icon:MessageCircle },
  { id:"cocina", label:"Cocina",  Icon:ChefHat     },
  { id:"juegos", label:"Juegos",  Icon:Gamepad2    },
  { id:"perfil", label:"Perfil",  Icon:User        },
];

export default function App() {
  const [tab,setTab]=useState("feed");
  const { toasts, notify, permission, requestPermission } = useNotifications();

  // Request notification permission on first load
  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default"){
      setTimeout(()=>notify("👋 ¡Bienvenida!","Activa las notificaciones para estar al día del Equipo Malo","👋"),2000);
    }
  },[]);

  const fullScreenTabs=["chat"];

  return (
    <div style={S.app}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        input, textarea, select { font-size: 16px !important; }
      `}</style>

      <ToastContainer toasts={toasts}/>

      <div style={S.header}>
        <div style={S.logo}>
          <div style={{ width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${C.accent},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 12px ${C.shadow}` }}>
            <Users size={14} color="white" strokeWidth={2}/>
          </div>
          equipo malo
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <div style={{ position:"relative",cursor:"pointer" }} onClick={()=>notify("🔔 Notificaciones","Tienes 3 planes nuevos esta semana","🔔")}>
            <Bell size={20} color={C.muted} strokeWidth={1.6}/>
            <div style={{ position:"absolute",top:0,right:0,width:7,height:7,borderRadius:"50%",background:C.pink,border:`2px solid ${C.bg}` }}/>
          </div>
          <div style={{ ...S.avatar(C.accent,36),cursor:"pointer" }} onClick={()=>setTab("perfil")}>IA</div>
        </div>
      </div>

      {fullScreenTabs.includes(tab)?(
        <ChatTab notify={notify}/>
      ):(
        <div style={S.content}>
          {tab==="feed"   && <FeedTab   notify={notify}/>}
          {tab==="planes" && <PlanesTab notify={notify}/>}
          {tab==="cocina" && <CocinaTab notify={notify}/>}
          {tab==="juegos" && <JuegosTab notify={notify}/>}
          {tab==="amigos" && <AmigosTab notify={notify}/>}
          {tab==="perfil" && <PerfilTab notify={notify} permission={permission} requestPermission={requestPermission}/>}
        </div>
      )}

      <nav style={S.nav}>
        {TABS.map(t=>(
          <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>
            <div style={{ position:"relative" }}>
              <t.Icon size={20} strokeWidth={tab===t.id?2.2:1.5}/>
              {t.id==="chat"&&<div style={{ position:"absolute",top:-3,right:-3,width:7,height:7,borderRadius:"50%",background:C.pink,border:`1.5px solid ${C.card}` }}/>}
            </div>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}