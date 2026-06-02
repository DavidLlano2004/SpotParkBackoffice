/* sp-features.jsx — F1 Navegación · F3 Estimador · F4 Mapa de precios. Same lime/ink DS. */
const { useState: fS, useEffect: fE, useRef: fR, useMemo: fM } = React;

/* ── data augmentation (same SP object) ── */
SP.social = {
  contacts: [
    { init:'M', ago:'hace 3 días', name:'María L.' }, { init:'A', ago:'hace 1 semana' },
    { init:'D', ago:'ayer', name:'Daniel R.' }, { init:'C', ago:'hace 2 semanas' },
    { init:'V', ago:'hace 4 días' },
  ],
  networkRating: 4.7, networkCount: 12,
  parkedNow: { spot:'s4', init:'R' },
  spotSocial: { s1:3, s4:12, s5:2 },
  activity: [
    { init:'M', name:'Un contacto', text:'reservó en Chapinero 63', ago:'hace 2 h', rating:4.8, spot:'s1' },
    { init:'D', name:'Un contacto', text:'parqueó en CC Andino', ago:'hace 5 h', rating:5.0, spot:'s4' },
    { init:'V', name:'Un contacto', text:'guardó Quinta Camacho', ago:'ayer', rating:4.6, spot:'s5' },
    { init:'A', name:'Un contacto', text:'reservó en Zona T Premium', ago:'ayer', rating:4.9, spot:'s2' },
  ],
  referralLink: 'spotpark.co/r/julian-m',
  referrals: [
    { who:'+57 311 ···· 4420', status:'reservó', pts:300 },
    { who:'andres@gmail.com', status:'registrado', pts:0 },
    { who:'+57 320 ···· 1180', status:'pendiente', pts:0 },
  ],
};
SP.timePatterns = [
  { zone:'Chapinero', mins:105, label:'1h 45min' },
  { zone:'Centro', mins:150, label:'2h 30min' },
  { zone:'Zona Rosa', mins:75, label:'1h 15min' },
  { zone:'Usaquén', mins:45, label:'45min' },
];
SP.events = [
  { id:'e1', name:'Andrés Cepeda en concierto', kind:'🎵 Concierto', venue:'Movistar Arena', when:'Hoy · 8:00 PM', date:'1 jun', people:'14.000', x:56, y:30, color:'#C6F24E', spots:['s4','s2','s1'], note:'Alta demanda cerca del venue desde las 6 PM. Reserva con anticipación.' },
  { id:'e2', name:'Millonarios vs. Nacional', kind:'⚽ Fútbol', venue:'Estadio El Campín', when:'Sáb · 6:00 PM', date:'7 jun', people:'36.000', x:40, y:46, color:'#A3E635', spots:['s3','s5','s1'], note:'Cupos limitados en la zona. Llega temprano.' },
  { id:'e3', name:'ANDICOM 2025', kind:'🎤 Congreso', venue:'Ágora Bogotá', when:'15–17 jun', date:'15 jun', people:'8.000', x:62, y:60, color:'#7BE08A', spots:['s4','s2'], note:'Tarifas de evento disponibles los 3 días.' },
];
SP.eventById = id => SP.events.find(e=>e.id===id);

/* ─────────── FEATURE 1 · NAVEGACIÓN "VOY DE CAMINO" ─────────── */
const NAV_ROUTE = [[50,84],[50,67],[37,61],[39,45],[58,39],[55,23]];
const NAV_STEPS = [
  { at:0,   dir:0,   text:'Continúa por la Cra 13',        dist:'300 m' },
  { at:.22, dir:-90, text:'Gira a la izquierda en Cl 63',  dist:'200 m' },
  { at:.46, dir:0,   text:'Sigue derecho 400 m',           dist:'400 m' },
  { at:.66, dir:90,  text:'Gira a la derecha en Cra 7',     dist:'150 m' },
  { at:.85, dir:90,  text:'Llegando a tu destino',          dist:'50 m'  },
];
function ptAt(t) { // point + which segment index along NAV_ROUTE
  const segs=[]; let total=0;
  for (let i=0;i<NAV_ROUTE.length-1;i++){ const a=NAV_ROUTE[i],b=NAV_ROUTE[i+1]; const d=Math.hypot(b[0]-a[0],b[1]-a[1]); segs.push(d); total+=d; }
  let dist=t*total, k=0;
  while (k<segs.length && dist>segs[k]) { dist-=segs[k]; k++; }
  if (k>=segs.length) return { x:NAV_ROUTE[NAV_ROUTE.length-1][0], y:NAV_ROUTE[NAV_ROUTE.length-1][1], k:segs.length };
  const a=NAV_ROUTE[k],b=NAV_ROUTE[k+1], f=segs[k]?dist/segs[k]:0;
  return { x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f, k };
}
function Navigate({ id='s1', start='14:00', space='A2' }) {
  const { pop, replace, push } = useNav();
  const s = SP.byId(id);
  const [prog, setProg] = fS(0);
  const [voice, setVoice] = fS(true);
  const [cd, setCd] = fS(3);
  const arrived = prog>=1;
  fE(()=>{ if(arrived) return; const t=setInterval(()=>setProg(p=>Math.min(1,+(p+0.06).toFixed(3))),1000); return ()=>clearInterval(t); },[arrived]);
  fE(()=>{ if(!arrived) return; const t=setInterval(()=>setCd(c=>c-1),1000); return ()=>clearInterval(t); },[arrived]);
  fE(()=>{ if(arrived && cd<=0) replace('active',{ id, start, hours:4, space }); },[arrived,cd]);

  const u = ptAt(prog);
  const step = NAV_STEPS.filter(st=>st.at<=prog).pop()||NAV_STEPS[0];
  const eta = Math.max(1, Math.ceil((1-prog)*9));
  const km = Math.max(0.05,(1-prog)*1.4).toFixed(1);
  const W=390,H=844, P=(arr)=>arr.map(([x,y])=>`${x/100*W},${y/100*H}`).join(' ');
  // split route: passed (up to u) dim, remaining lime
  const passed=[...NAV_ROUTE.slice(0,u.k+1).map(p=>[p[0],p[1]]),[u.x,u.y]];
  const remain=[[u.x,u.y],...NAV_ROUTE.slice(u.k+1)];

  return (
    <div style={{ position:'absolute', inset:0, background:'var(--ink)', overflow:'hidden' }}>
      <MapMock dark>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          <polyline points={P(passed)} fill="none" stroke="#3A4256" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".7"/>
          <polyline points={P(remain)} fill="none" stroke="var(--blue)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* destination pin */}
        <div style={{ position:'absolute', left:`${NAV_ROUTE[NAV_ROUTE.length-1][0]}%`, top:`${NAV_ROUTE[NAV_ROUTE.length-1][1]}%`, transform:'translate(-50%,-50%)', zIndex:6 }}>
          <div style={{ position:'absolute', inset:-8, borderRadius:'50%', background:'var(--blue)', opacity:.25, animation:'sp-pulse 1.8s ease-in-out infinite' }}/>
          <div style={{ width: arrived?54:46, height: arrived?54:46, borderRadius:'50%', background:'var(--blue)', border:'3px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)', transition:'all .4s cubic-bezier(.3,1.4,.5,1)' }}>
            <span style={{ color:'var(--ink)', fontWeight:700, fontSize:20, fontFamily:'var(--display)' }}>P</span></div>
          <div style={{ position:'absolute', top:'105%', left:'50%', transform:'translateX(-50%)', marginTop:4, background:'var(--ink)', color:'#fff', fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:7, whiteSpace:'nowrap' }}>Espacio {space}</div>
        </div>
        {/* moving user dot */}
        <div style={{ position:'absolute', left:`${u.x}%`, top:`${u.y}%`, transform:'translate(-50%,-50%)', zIndex:5, transition:'left 1s linear, top 1s linear' }}>
          <div style={{ position:'absolute', inset:-7, borderRadius:'50%', background:'#2F6BE0', opacity:.22, animation:'sp-ping 2.4s ease-out infinite' }}/>
          <div style={{ width:18, height:18, borderRadius:'50%', background:'#2F6BE0', border:'3px solid #fff', boxShadow:'0 2px 6px rgba(47,107,224,.5)' }}/>
        </div>
      </MapMock>
      <Chrome onDark />

      {/* top overlay */}
      <div style={{ position:'absolute', top:56, left:16, right:16, zIndex:12, display:'flex', alignItems:'flex-start', gap:10 }}>
        <RoundBtn glass onClick={pop}><Icon n="chevL" s={21} c="#fff"/></RoundBtn>
        <div style={{ flex:1, background:'rgba(24,27,34,.92)', backdropFilter:'blur(12px)', borderRadius:18, padding:'12px 16px', boxShadow:'var(--sh-ink)' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span className="t-h1 tnum" style={{ color:'#fff' }}>{arrived?'0':eta}</span>
            <span className="t-small" style={{ color:'rgba(255,255,255,.7)' }}>min</span>
            <span className="t-small tnum" style={{ color:'rgba(255,255,255,.55)', marginLeft:'auto' }}>{arrived?'0.0':km} km · 2:47 PM</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:5 }}>
            <Icon n="clock" s={13} c="var(--orange)"/>
            <span className="t-micro" style={{ color:'var(--orange)' }}>Reserva {start} · llegas a tiempo</span>
          </div>
        </div>
        <RoundBtn glass onClick={()=>setVoice(v=>!v)}><Icon n={voice?'bell':'info'} s={19} c={voice?'var(--blue)':'#fff'}/></RoundBtn>
      </div>

      {/* bottom card */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:12 }}>
        {!arrived ? (
          <div className="rise-s" style={{ background:'rgba(24,27,34,.96)', backdropFilter:'blur(12px)', borderRadius:'28px 28px 0 0', padding:'20px 22px 30px', boxShadow:'0 -10px 30px rgba(0,0,0,.3)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:'rgba(198,242,78,.16)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon n="arrR" s={26} c="var(--blue)" style={{ transform:`rotate(${step.dir}deg)` }}/></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div key={step.text} className="fade" style={{ color:'#fff', fontSize:16, fontWeight:600 }}>{step.text}</div>
                <div className="t-small" style={{ color:'rgba(255,255,255,.55)', marginTop:2 }}>en {step.dist}</div>
              </div>
              <button onClick={()=>setVoice(v=>!v)} style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:'50%', width:38, height:38, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon n={voice?'bell':'info'} s={18} c={voice?'var(--blue)':'rgba(255,255,255,.6)'}/></button>
            </div>
            <div style={{ height:5, borderRadius:5, background:'rgba(255,255,255,.12)', marginTop:16, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${prog*100}%`, background:'var(--blue)', borderRadius:5, transition:'width 1s linear' }}/></div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:14 }}>
              <span className="t-small" style={{ color:'rgba(255,255,255,.7)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</span>
              <span className="tnum" style={{ background:'rgba(198,242,78,.16)', color:'var(--blue)', fontWeight:600, padding:'3px 9px', borderRadius:8, fontSize:13 }}>{space}</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, color:'#5BD08A', fontSize:12, fontWeight:600 }}><span style={{ width:6, height:6, borderRadius:'50%', background:'#5BD08A' }}/>Cupo reservado</span>
            </div>
          </div>
        ) : (
          <div className="zoom" style={{ background:'rgba(24,27,34,.97)', backdropFilter:'blur(12px)', borderRadius:'28px 28px 0 0', padding:'26px 22px 32px', textAlign:'center', boxShadow:'0 -10px 30px rgba(0,0,0,.3)' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', boxShadow:'var(--sh-lime)' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="30" style={{ animation:'sp-dash .6s .2s ease forwards' }}/></svg></div>
            <h1 className="t-h1" style={{ color:'#fff', margin:'16px 0 6px' }}>¡Llegaste!</h1>
            <p className="t-small" style={{ color:'rgba(255,255,255,.6)', margin:0 }}>Escanea el QR en la entrada · espacio {space}</p>
            <button className="btn btn-primary btn-block" style={{ marginTop:18 }} onClick={()=>replace('active',{ id, start, hours:4, space })}>
              <Icon n="qr" s={20} c="var(--ink)"/>Ver QR ahora</button>
            <div className="t-micro" style={{ color:'rgba(255,255,255,.4)', marginTop:10 }}>Abriendo en {Math.max(0,cd)}…</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── FEATURE 3 · ESTIMADOR DE DURACIÓN (components) ─────────── */
function DurationSuggestion({ hours, setHours, zone='Chapinero' }) {
  const [dismiss, setDismiss] = fS(false);
  if (dismiss) return null;
  const opts=[['1h',1],['1h 30m',1.5],['2h',2],['3h',3]];
  const suggested=2;
  return (
    <div className="in-left" style={{ animationDelay:'.3s', position:'relative', overflow:'hidden', background:'var(--blue-bg)', border:'.5px solid var(--blue-tint)', borderRadius:16, padding:'14px 16px 14px 18px', marginBottom:18 }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--blue)' }}/>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
        <Icon n="sparkle" s={15} c="var(--blue-light)"/><span style={{ fontSize:13, fontWeight:500, color:'var(--blue-light)' }}>SpotPark AI</span></div>
      <p style={{ fontSize:13, color:'var(--t2)', margin:'0 0 12px', lineHeight:1.45 }}>Cuando vas a {zone} un martes, normalmente estás <b style={{ color:'var(--t1)' }}>1h 45min</b>. ¿Reservar 2 horas?</p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {opts.map(([l,h])=>{ const on=hours===h, sug=h===suggested;
          return <button key={l} onClick={()=>setHours(h)} style={{ height:38, padding:'0 14px', borderRadius:'var(--r-pill)', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'var(--font)',
            background:on?'var(--ink)':'var(--surface)', color:on?'#fff':'var(--t1)',
            border: sug&&!on?'1.5px solid var(--blue)':'.5px solid var(--border)',
            boxShadow: sug?'0 0 0 3px rgba(198,242,78,.25)':'none' }}>{l}{sug&&!on?' ✦':''}</button>; })}
      </div>
      <button onClick={()=>setDismiss(true)} style={{ background:'none', border:'none', color:'var(--t3)', fontSize:12, fontWeight:500, cursor:'pointer', marginTop:10, padding:0 }}>No, elegir manualmente</button>
    </div>
  );
}
function PriceImpact({ rate, hours }) {
  const total = useCounter(rate*hours);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, padding:'10px 14px', background:'var(--elevated)', borderRadius:12 }}>
      <Icon n="card" s={17} c="var(--blue-light)"/>
      <span className="t-small" style={{ color:'var(--t2)' }}>{hours}h →</span>
      <span className="t-h3 tnum" style={{ color:'var(--ink)' }}>{SP.COP(Math.round(total))}</span>
      <span className="t-micro" style={{ color:'var(--t3)', marginLeft:'auto' }}>+{SP.COP(rate)} por hora extra</span>
    </div>
  );
}

/* ─────────── FEATURE 4 · PRICE PIN ─────────── */
function priceTone(p) {
  if (p<2500) return { bg:'var(--green-bg)', c:'#1F7A3D', br:'var(--green)' };
  if (p<=4000) return { bg:'var(--blue-tint)', c:'var(--blue-light)', br:'var(--blue)' };
  return { bg:'var(--yellow-bg)', c:'#9A5B0E', br:'var(--orange)' };
}
function PricePin({ x, y, price, active, dim, onClick, delay=0 }) {
  const t=priceTone(price);
  return (
    <button onClick={onClick} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)', border:'none', background:'none', cursor: dim?'default':'pointer', padding:0,
      zIndex: active?7:5, opacity: dim?.28:1, transition:'opacity .25s', animation:`sp-zoom .45s cubic-bezier(.2,.9,.3,1.2) both`, animationDelay:`${delay}s` }}>
      <div style={{ position:'relative' }}>
        <div style={{ background:t.bg, border:`1.5px solid ${active?'var(--ink)':t.br}`, color:t.c, borderRadius:'var(--r-pill)', padding:'5px 11px',
          fontSize:13, fontWeight:700, boxShadow:'var(--sh-card)', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums', transform: active?'scale(1.08)':'scale(1)', transition:'transform .2s' }}>
          {SP.COP(price)}</div>
        <div style={{ position:'absolute', left:'50%', bottom:-5, transform:'translateX(-50%)', width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`6px solid ${t.bg}` }}/>
      </div>
    </button>
  );
}

/* ─────────── ENHANCED HOME (F2 social + F4 price + F6 event banner) ─────────── */
function HomePro() {
  const { push } = useNav();
  const [active, setActive] = fS('s1');
  const [filter, setF] = fS('all');
  const [mode, setMode] = fS('avail');   // avail | price
  const [budget, setBudget] = fS(5000);
  const [showEvent, setShowEvent] = fS(true);
  const spots = SP.spots;
  const act = SP.byId(active);
  const filters = ['Todos','🚗 Carro','🏍️ Moto','🚲 Bici','🚙 SUV','⭐ Rating','24h','Techado'];
  const inBudget = spots.filter(s=>s.price<=budget).length;
  const ev = SP.events[0];
  const social = SP.social.spotSocial[act.id];
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Chrome />
      <MapMock>
        <UserDot x={50} y={62}/>
        {mode==='avail'
          ? spots.map((s,k)=>(<ParkingPin key={s.id} x={s.x} y={s.y} status={s.status} count={s.status==='full'?0:s.cars[0]} active={s.id===active} stale={s.reliability!=='verified'} delay={.1+k*.06} onClick={()=>setActive(s.id)}/>))
          : spots.map((s,k)=>(<PricePin key={s.id} x={s.x} y={s.y} price={s.price} active={s.id===active} dim={s.price>budget} delay={.05+k*.05} onClick={()=> s.price<=budget && setActive(s.id)}/>))}
        {/* F2: a contact parked now */}
        {(()=>{ const pn=SP.social.parkedNow, sp=SP.byId(pn.spot);
          return <div style={{ position:'absolute', left:`${sp.x}%`, top:`${sp.y}%`, transform:'translate(14px,-22px)', zIndex:8 }}>
            <div style={{ width:18, height:18, borderRadius:'50%', background:'var(--ink)', color:'var(--blue)', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, boxShadow:'var(--sh-card)' }}>{pn.init}</div>
          </div>; })()}
      </MapMock>

      {/* top greeting */}
      <div style={{ position:'absolute', top:58, left:16, right:16, zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div className="t-micro" style={{ color:'var(--t3)' }}>{SP.greeting}</div>
          <div className="rise-s d1" style={{ fontSize:22, fontWeight:500, letterSpacing:'-.4px', marginTop:2 }}>¿A dónde vamos?</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <RoundBtn onClick={()=>push('notifications')}>
            <span style={{ position:'relative' }}><Icon n="bell" s={21} c="#fff"/>
              <span style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:'50%', background:'var(--blue)', border:'1.5px solid var(--bg)' }}/></span>
          </RoundBtn>
          <button onClick={()=>push('profile')} style={{ border:'none', padding:0, cursor:'pointer', borderRadius:'50%' }}><Avatar size={40}/></button>
        </div>
      </div>

      {/* search */}
      <div style={{ position:'absolute', top:120, left:16, right:16, zIndex:10 }}>
        <button onClick={()=>push('search')} className="input" style={{ width:'100%', cursor:'pointer', textAlign:'left' }}>
          <Icon n="search" s={20} c="var(--t3)"/><span style={{ flex:1, color:'var(--t4)', fontSize:15 }}>¿Dónde quieres parquear?</span><Icon n="filter" s={20} c="var(--t2)"/>
        </button>
      </div>

      {/* F4: mode toggle */}
      <div style={{ position:'absolute', top:184, left:16, right:16, zIndex:10 }}>
        <div style={{ display:'flex', background:'var(--surface)', borderRadius:'var(--r-pill)', padding:4, gap:3, boxShadow:'var(--sh-card)' }}>
          {[['avail','📍 Disponibilidad'],['price','💰 Precios']].map(([k,l])=>{ const on=mode===k;
            return <button key={k} onClick={()=>setMode(k)} style={{ flex:1, height:38, border:'none', cursor:'pointer', borderRadius:'var(--r-pill)', background:on?'var(--ink)':'transparent', color:on?'#fff':'var(--t2)', fontWeight:600, fontSize:13.5, transition:'all .25s' }}>{l}</button>; })}
        </div>
      </div>

      {/* filter chips */}
      <div className="no-sb" style={{ position:'absolute', top:236, left:0, right:0, zIndex:10, display:'flex', gap:8, overflowX:'auto', padding:'0 16px' }}>
        {filters.map((f,k)=>(<button key={f} className={'chip'+(filter===(k===0?'all':f)?' on':'')} onClick={()=>setF(k===0?'all':f)}>{f}</button>))}
      </div>

      <RoundBtn size={44} style={{ position:'absolute', right:16, bottom:430, zIndex:11 }}><Icon n="location" s={21} c="var(--blue-light)"/></RoundBtn>

      {/* F6: event banner */}
      {showEvent && (
        <button onClick={()=>push('evento',{ id:ev.id })} className="rise-s" style={{ position:'absolute', left:16, right:16, top:286, zIndex:10, textAlign:'left', cursor:'pointer',
          background:'var(--ink)', border:'none', borderRadius:16, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:'var(--sh-ink)', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-20, right:-10, width:80, height:80, borderRadius:'50%', background:'rgba(198,242,78,.14)' }}/>
          <div style={{ width:38, height:38, borderRadius:11, background:'rgba(198,242,78,.16)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>🎵</div>
          <div style={{ flex:1, minWidth:0, position:'relative' }}>
            <div style={{ color:'#fff', fontSize:14, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Evento hoy · {ev.venue}</div>
            <div className="t-micro" style={{ color:'rgba(255,255,255,.6)', marginTop:1 }}>{ev.when} · parqueaderos cercanos</div>
          </div>
          <span onClick={e=>{ e.stopPropagation(); setShowEvent(false); }} style={{ display:'flex' }}><Icon n="x" s={16} c="rgba(255,255,255,.5)"/></span>
        </button>
      )}

      {/* bottom cluster: AI (avail) / budget (price) + legend */}
      <div style={{ position:'absolute', left:16, right:16, bottom:300, zIndex:10 }}>
        {mode==='avail'
          ? <AIInsightCard body={SP.ai.home.body} onPress={()=>push('ai')} delay={.4}/>
          : <div className="rise-s card" style={{ padding:'13px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span className="t-small" style={{ color:'var(--t2)' }}>Presupuesto máximo</span>
                <span className="t-h3 tnum" style={{ color:'var(--blue-light)' }}>{SP.COP(budget)}/h</span>
              </div>
              <input type="range" min="1000" max="10000" step="500" value={budget} onChange={e=>setBudget(+e.target.value)}
                style={{ width:'100%', marginTop:10, accentColor:'var(--lime-deep)' }}/>
              <div className="t-micro" style={{ color:'var(--t3)', marginTop:4 }}>{inBudget} parqueaderos en tu presupuesto</div>
            </div>}
        {mode==='avail' && <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {['available','few','full'].map(s=>(<span key={s} className="chip" style={{ cursor:'default', height:28, fontSize:11 }}><span style={{ width:7, height:7, borderRadius:'50%', background:AVAIL[s] }}/>{AVAIL_LABEL[s]}</span>))}
        </div>}
      </div>

      {/* preview sheet (+ F2 social proof) */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:20, padding:'0 12px 88px' }}>
        <div key={active} className="rise-s card" style={{ padding:14 }}>
          <div style={{ display:'flex', gap:13 }}>
            <div style={{ width:80, height:80, borderRadius:14, background:act.img, flexShrink:0, position:'relative' }}>
              <span className="tnum" style={{ position:'absolute', bottom:6, left:6, background:'rgba(0,0,0,.5)', color:'#fff', fontSize:10, fontWeight:500, padding:'2px 6px', borderRadius:6 }}>{act.dist}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ minWidth:0 }}><div className="t-h3" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{act.name}</div>
                  <div className="t-small" style={{ color:'var(--t2)', marginTop:1 }}>{act.zone} · {act.walk}</div></div>
                {mode==='price' && act.price<3000 && <span className="badge badge-avail" style={{ flexShrink:0 }}>15% bajo tu media</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:9 }}>
                <Badge status={act.status} count={act.status==='full'?null:act.cars[0]}/><Rating value={act.rating}/>
              </div>
            </div>
          </div>
          {social>0 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, paddingTop:12, borderTop:'.5px solid var(--separator)' }}>
              <div style={{ display:'flex' }}>{SP.social.contacts.slice(0,3).map((c,i)=>(<div key={i} style={{ width:24, height:24, borderRadius:'50%', background:'var(--ink)', color:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, marginLeft:i?-7:0, border:'2px solid var(--surface)' }}>{c.init}</div>))}</div>
              <span className="t-small" style={{ color:'var(--t2)' }}>{social} contactos han parqueado aquí</span>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:13, paddingTop:13, borderTop:'.5px solid var(--separator)' }}>
            <div><span className="t-h2 tnum" style={{ color:'var(--ink)' }}>{SP.COP(act.price)}</span><span className="t-small" style={{ color:'var(--t2)' }}> /hora</span></div>
            <button className="btn btn-primary btn-sm" style={{ height:44, padding:'0 22px' }} onClick={()=>push('detail',{ id:act.id })}>Ver detalle</button>
          </div>
        </div>
      </div>

      <TabBar/>
    </div>
  );
}

Object.assign(window, { Navigate, DurationSuggestion, PriceImpact, PricePin, HomePro, priceTone });
Object.assign(window.SP_SCREENS, { navigate:Navigate, home:HomePro });
