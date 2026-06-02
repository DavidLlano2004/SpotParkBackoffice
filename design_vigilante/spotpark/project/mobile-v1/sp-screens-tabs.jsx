/* sp-screens-tabs.jsx — Trips, Saved, Profile, Vehicles, Heatmap, AI Dashboard, Notifications, Review */
const { useState: tS, useEffect: tE, useMemo: tM } = React;

const STATUS_COLOR = { active:'var(--green)', upcoming:'var(--blue)', past:'var(--t3)', cancelled:'var(--red)' };

/* ─────────── RESERVATIONS ─────────── */
function Trips() {
  const { push } = useNav();
  const [seg, setSeg] = tS('all');
  const map = { all:['active','upcoming','past'], active:['active'], upcoming:['upcoming'], past:['past'] };
  const list = SP.trips.filter(t=>map[seg].includes(t.status));
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <div style={{ padding:'62px 20px 10px' }}>
        <h1 className="t-h1" style={{ margin:'0 0 16px' }}>Mis reservas</h1>
        <div className="no-sb" style={{ display:'flex', gap:8, overflowX:'auto' }}>
          {[['all','Todas'],['active','Activas'],['upcoming','Próximas'],['past','Completadas']].map(([k,l])=>(
            <button key={k} className={'chip'+(seg===k?' on':'')} onClick={()=>setSeg(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="scr-scroll no-sb" style={{ padding:'10px 20px 110px' }}>
        {list.length===0 && <Empty ic="ticket" txt="No tienes reservas aquí."/>}
        {list.map((t,i)=>{
          const s=SP.byId(t.spot), active=t.status==='active';
          return (
            <button key={t.id} className="rise-s" style={{ animationDelay:`${i*.06}s`, width:'100%', textAlign:'left', cursor:'pointer',
              background:'var(--surface)', border: active?'.5px solid var(--green)':'.5px solid var(--border-card)', borderRadius:18, padding:0, marginBottom:14, overflow:'hidden', display:'flex' }}
              onClick={()=> active?push('active',{ id:t.spot, space:t.space }):push('tripDetail',{ tid:t.id })}>
              <div style={{ width:3, background:STATUS_COLOR[t.status] }}/>
              <div style={{ display:'flex', gap:13, padding:14, flex:1, minWidth:0 }}>
                <div style={{ width:52, height:52, borderRadius:10, background:s.img, flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
                  <div className="t-small" style={{ color:'var(--t2)', marginTop:2 }}>{t.date} · {t.time}</div>
                  <div style={{ marginTop:7 }}><span className="tnum" style={{ background:'var(--blue-tint)', color:'var(--blue-light)', fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:6 }}>{t.plate}</span></div>
                </div>
                <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                  <span className="t-h3 tnum">{SP.COP(t.total)}</span>
                  {active ? <Badge status="available" count={null}/> : t.status==='upcoming'
                    ? <span className="badge" style={{ background:'var(--blue-bg)', color:'var(--blue-light)', border:'.5px solid var(--blue)' }}>Próxima</span>
                    : <span className="t-micro" style={{ color:'var(--t3)' }}>Completada</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <TabBar/>
    </div>
  );
}

/* ─────────── TRIP DETAIL (timeline) ─────────── */
function TripDetail({ tid }) {
  const { pop, push } = useNav();
  const t = SP.trips.find(x=>x.id===tid); const s=SP.byId(t.spot);
  const events = [
    { c:'var(--blue)', l:'Reserva creada', ts:t.date+' 08:02' },
    { c:'var(--green)', l:`Pago confirmado · ${SP.COP(t.total)}`, ts:t.date+' 08:02' },
    ...(t.status!=='upcoming'?[{ c:'var(--green)', l:'Check-in', ts:t.time.split(' ')[0] }]:[]),
    ...(t.status==='past'?[{ c:'var(--t3)', l:'Check-out', ts:t.time.split(' ')[2] }]:[]),
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <div style={{ height:120, background:s.img, position:'relative', flexShrink:0 }}>
        <Chrome onDark />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,26,.4), transparent 50%, var(--bg))' }}/>
        <div style={{ position:'absolute', top:58, left:16 }}><RoundBtn glass onClick={pop}><Icon n="chevL" s={21} c="#fff"/></RoundBtn></div>
        <div style={{ position:'absolute', bottom:14, left:16, right:16, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div><div className="t-h3">{s.name}</div><div className="t-small" style={{ color:'rgba(255,255,255,.7)' }}>{t.date} · {t.time}</div></div>
        </div>
      </div>
      <div className="scr-scroll no-sb" style={{ padding:'20px 20px 30px' }}>
        <div className="t-h3" style={{ marginBottom:16 }}>Línea de tiempo</div>
        <div style={{ position:'relative', paddingLeft:6 }}>
          {events.map((e,i)=>(
            <div key={i} style={{ display:'flex', gap:14, position:'relative', paddingBottom: i<events.length-1?22:0 }}>
              {i<events.length-1 && <div style={{ position:'absolute', left:9, top:20, bottom:0, width:2, background:'var(--border)' }}/>}
              <div style={{ width:20, height:20, borderRadius:'50%', background:e.c, flexShrink:0, zIndex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--bg)' }}/></div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{e.l}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{e.ts}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:16, marginTop:24, background:'var(--surface)' }}>
          <Row k="Tarifa" v={SP.COP(t.total-Math.round(t.total*0.13))}/><Row k="Comisión" v={SP.COP(Math.round(t.total*0.13))}/>
          <div style={{ height:'.5px', background:'var(--separator)', margin:'10px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between' }}><span className="t-h3">Total</span><span className="t-h3 tnum" style={{ color:'var(--blue-light)' }}>{SP.COP(t.total)}</span></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:20 }}>
          <button className="btn btn-ghost btn-block"><Icon n="download" s={18} c="var(--t2)"/>Descargar factura</button>
          {t.status==='past' && !t.rated && <button className="btn btn-primary btn-block" onClick={()=>push('review',{ reservationId:t.id })}><Icon n="starFill" s={18} c="#fff"/>Calificar experiencia</button>}
          <button style={{ background:'none', border:'none', color:'#FCA5A5', fontSize:13, fontWeight:500, cursor:'pointer', padding:8 }}>Reportar un problema</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── SAVED ─────────── */
function Saved() {
  const { push } = useNav();
  const [sort, setSort] = tS('recent');
  const saved = SP.spots.slice(0,3);
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <div style={{ padding:'62px 20px 10px' }}>
        <h1 className="t-h1" style={{ margin:'0 0 16px' }}>Guardados</h1>
        <div className="no-sb" style={{ display:'flex', gap:8, overflowX:'auto' }}>
          {[['recent','Recientes'],['near','Más cercanos'],['rating','Mejor calificados']].map(([k,l])=>(
            <button key={k} className={'chip'+(sort===k?' on':'')} onClick={()=>setSort(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="scr-scroll no-sb" style={{ padding:'12px 20px 110px' }}>
        {saved.map((s,i)=>(
          <button key={s.id} className="rise-s" style={{ animationDelay:`${i*.06}s`, width:'100%', textAlign:'left', cursor:'pointer',
            background:'var(--surface)', border:'.5px solid var(--border-card)', borderRadius:18, padding:0, marginBottom:14, overflow:'hidden' }} onClick={()=>push('detail',{ id:s.id })}>
            <div style={{ height:110, background:s.img, position:'relative' }}>
              <div style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="heartFill" s={18} c="var(--red)"/></div>
              <div style={{ position:'absolute', bottom:10, left:12 }}><Badge status={s.status} count={s.status==='full'?null:s.cars[0]}/></div>
            </div>
            <div style={{ padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div><div style={{ fontSize:15, fontWeight:500 }}>{s.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}><Rating value={s.rating} s={13}/><span className="t-small" style={{ color:'var(--t2)' }}>· {s.dist}</span></div></div>
              <div style={{ textAlign:'right' }}><span className="t-h3 tnum" style={{ color:'var(--blue-light)' }}>{SP.COP(s.price)}</span><div className="t-micro" style={{ color:'var(--t2)' }}>/hora</div></div>
            </div>
          </button>
        ))}
      </div>
      <TabBar/>
    </div>
  );
}

/* ─────────── PROFILE ─────────── */
function Profile() {
  const { push, replace } = useNav();
  const u = SP.user;
  const [notif, setNotif] = tS({ res:true, ai:true, ofertas:false, record:true });
  const [ai, setAi] = tS({ pred:true, search:true, alerts:true });
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <div className="scr-scroll no-sb" style={{ padding:'58px 16px 110px' }}>
        {/* header */}
        <div className="rise-s" style={{ borderRadius:'var(--r-xl)', padding:22, background:'var(--ink)', boxShadow:'var(--sh-ink)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-30, width:160, height:160, borderRadius:'50%', background:'rgba(198,242,78,.12)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:15, position:'relative' }}>
            <Avatar name={u.initials} size={64} bg="var(--blue)" col="var(--ink)"/>
            <div style={{ flex:1 }}><div className="t-h2" style={{ color:'#fff' }}>{u.name} Martínez</div>
              <div className="t-small" style={{ color:'rgba(255,255,255,.55)', marginTop:2 }}>{u.email}</div></div>
            <button style={{ background:'rgba(255,255,255,.1)', border:'none', borderRadius:'50%', width:38, height:38, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="edit" s={18} c="#fff"/></button>
          </div>
          <div style={{ display:'flex', gap:6, marginTop:14, position:'relative' }}>
            <span className="badge" style={{ background:'var(--blue)', color:'var(--ink)' }}><Icon n="bolt" s={13} c="var(--ink)"/>Gold</span>
            <span style={{ color:'rgba(255,255,255,.5)', fontSize:12, alignSelf:'center' }}>Miembro desde 2024</span>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:18, position:'relative' }}>
            {[[u.reservas,'reservas'],[u.guardados,'guardados'],['12 h','ahorradas']].map(([n,l],i)=>(
              <div key={i} style={{ flex:1, textAlign:'center', background:'rgba(255,255,255,.07)', borderRadius:14, padding:'12px 8px' }}>
                <div className="t-h3 tnum" style={{ color:'#fff' }}>{n}</div><div className="t-micro" style={{ color:'rgba(255,255,255,.55)' }}>{l}</div></div>
            ))}
          </div>
        </div>

        {/* AI dashboard teaser */}
        <button className="rise-s d1" onClick={()=>push('aiDash')} style={{ width:'100%', textAlign:'left', cursor:'pointer', marginTop:14,
          background:'var(--blue-bg)', border:'.5px solid var(--blue-tint)', borderRadius:18, padding:16, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', gap:13 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--blue)' }}/>
          <div style={{ width:42, height:42, borderRadius:12, background:'var(--blue-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="sparkle" s={22} c="var(--blue-light)"/></div>
          <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:500 }}>SpotPark AI</div><div className="t-small" style={{ color:'var(--t2)' }}>Insights y predicciones para ti</div></div>
          <Icon n="chevR" s={18} c="var(--blue-light)"/>
        </button>

        {/* vehicles */}
        <Section title="Mis vehículos" action="Gestionar →" onAction={()=>push('vehicles')}>
          {SP.vehicles.map((v,i)=>(
            <RowItem key={v.id} ic={v.type==='moto'?'moto':'car'} label={v.name} sub={`${v.plate} · ${v.year}`} last={i===SP.vehicles.length-1} chevron/>
          ))}
        </Section>

        {/* payment */}
        <Section title="Métodos de pago">
          <RowItem ic="card" label="Visa ···· 4421" sub="Principal" chevron/>
          <RowItem ic="phone" label="Nequi" sub="···· 0123" last chevron/>
        </Section>

        {/* notifications */}
        <Section title="Notificaciones">
          {[['res','Reservas','Confirmaciones y cambios'],['ai','Predicciones AI','Demanda y tarifas'],['ofertas','Ofertas','Promociones'],['record','Recordatorios','Antes de vencer']].map(([k,l,d],i)=>(
            <ToggleRow key={k} label={l} sub={d} on={notif[k]} onChange={v=>setNotif(n=>({...n,[k]:v}))} last={i===3}/>
          ))}
        </Section>

        {/* SpotPark AI */}
        <Section title="SpotPark AI" badge="beta" icon="sparkle">
          {[['pred','Predicciones personalizadas'],['search','Búsqueda inteligente'],['alerts','Alertas proactivas de tráfico']].map(([k,l],i)=>(
            <ToggleRow key={k} label={l} on={ai[k]} onChange={v=>setAi(a=>({...a,[k]:v}))} last={i===2}/>
          ))}
        </Section>

        <Section title="Soporte">
          <RowItem ic="info" label="Centro de ayuda" chevron/>
          <RowItem ic="warning" label="Reportar un error" chevron/>
          <RowItem ic="starFill" label="Califica la app" last chevron/>
        </Section>

        <button className="btn btn-ghost btn-block" style={{ marginTop:18 }} onClick={()=>replace('auth')}><Icon n="logout" s={18} c="var(--t2)"/>Cerrar sesión</button>
        <button style={{ display:'block', margin:'16px auto 0', background:'none', border:'none', color:'#FCA5A5', fontSize:13, fontWeight:500, cursor:'pointer' }}>Eliminar cuenta</button>
      </div>
      <TabBar/>
    </div>
  );
}
function Section({ title, action, onAction, badge, icon, children }) {
  return (
    <div className="rise-s d2" style={{ marginTop:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, margin:'0 4px 10px' }}>
        {icon && <Icon n={icon} s={16} c="var(--blue-light)"/>}
        <span className="t-h3">{title}</span>
        {badge && <span style={{ background:'var(--blue-tint)', color:'var(--blue-light)', fontSize:10, fontWeight:500, padding:'2px 7px', borderRadius:'var(--r-pill)' }}>{badge}</span>}
        {action && <button onClick={onAction} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer' }}>{action}</button>}
      </div>
      <div className="card" style={{ overflow:'hidden', background:'var(--surface)' }}>{children}</div>
    </div>
  );
}
function RowItem({ ic, label, sub, last, chevron }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:13, padding:'14px 16px', borderBottom: last?'none':'.5px solid var(--separator)' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={ic} s={19} c="var(--blue-light)"/></div>
      <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:500 }}>{label}</div>{sub && <div className="t-small" style={{ color:'var(--t2)' }}>{sub}</div>}</div>
      {chevron && <Icon n="chevR" s={18} c="var(--t3)"/>}
    </div>
  );
}
function ToggleRow({ label, sub, on, onChange, last }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 16px', borderBottom: last?'none':'.5px solid var(--separator)' }}>
      <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:500 }}>{label}</div>{sub && <div className="t-micro" style={{ color:'var(--t3)' }}>{sub}</div>}</div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

/* ─────────── VEHICLES ─────────── */
function Vehicles() {
  const { pop } = useNav();
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Mis vehículos" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'8px 20px 30px' }}>
        {SP.vehicles.map((v,i)=>(
          <div key={v.id} className="rise-s card" style={{ animationDelay:`${i*.06}s`, padding:16, marginBottom:14, background:'var(--surface)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={v.type==='moto'?'moto':'car'} s={26} c="var(--blue-light)"/></div>
              <div style={{ flex:1 }}><div className="t-h3">{v.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                  <span className="tnum" style={{ background:'var(--blue-tint)', color:'var(--blue-light)', fontSize:12, fontWeight:500, padding:'3px 8px', borderRadius:6 }}>{v.plate}</span>
                  <span style={{ width:12, height:12, borderRadius:'50%', background:v.color, border:'1px solid var(--border)' }}/>
                  <span className="t-small" style={{ color:'var(--t2)' }}>{v.year}</span>
                </div></div>
              {v.fav ? <span className="badge" style={{ background:'var(--blue-tint)', color:'var(--blue-light)', border:'.5px solid var(--blue)' }}>Principal</span> : <Icon n="dots" s={20} c="var(--t3)"/>}
            </div>
          </div>
        ))}
        <button className="rise-s" style={{ width:'100%', height:60, borderRadius:16, border:'.5px dashed var(--border)', background:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'var(--blue-light)', fontWeight:500, fontSize:15 }}>
          <Icon n="plus" s={20} c="var(--blue-light)"/>Agregar vehículo</button>
      </div>
    </div>
  );
}

/* ─────────── AI RADAR (search parking with AI) ─────────── */
function AIRadar() {
  const { pop, push } = useNav();
  const [scan, setScan] = tS(true);
  const [q, setQ] = tS('');
  tE(()=>{ const t=setTimeout(()=>setScan(false),2000); return ()=>clearTimeout(t); },[]);
  const rescan = () => { setScan(true); setTimeout(()=>setScan(false),1600); };
  const sugg = [
    { ic:'bolt', tint:'var(--blue)', t:'Tarifa baja ahora', d:'Parqueadero Chapinero 63 a $2.400/h — 20% bajo tu media.', cta:'Reservar', go:()=>push('detail',{ id:'s1' }) },
    { ic:'sparkle', tint:'#7BE08A', t:'94% disponible para ti', d:'CC Andino Subterráneo encaja con tu hora y vehículo habitual.', cta:'Ver plaza', go:()=>push('detail',{ id:'s4' }) },
    { ic:'clock', tint:'#FACC15', t:'Sal 10 min antes', d:'Tráfico denso hacia la Zona Rosa. Llegarás a tiempo a tu reserva.', },
    { ic:'car', tint:'#A3E635', t:'Aparcamiento asistido', d:'Activa el auto-park y SpotPark guiará tu maniobra al llegar al box.' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--ink)', display:'flex', flexDirection:'column' }}>
      <Chrome onDark />
      <TopBar onDark onBack={pop} title="Buscar con IA" right={<RoundBtn glass onClick={rescan}><Icon n="refresh" s={19} c="#fff"/></RoundBtn>}/>

      {/* NL search field */}
      <div style={{ padding:'2px 20px 8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.08)', borderRadius:14, padding:'0 14px', height:50 }}>
          <Icon n="sparkle" s={19} c="var(--blue)"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ej: techado y barato cerca de la U"
            style={{ flex:1, background:'none', border:'none', outline:'none', color:'#fff', fontFamily:'var(--font)', fontSize:15 }}/>
          {q && <button onClick={rescan} style={{ background:'var(--blue)', border:'none', borderRadius:10, width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="arrR" s={18} c="var(--ink)"/></button>}
        </div>
      </div>

      {/* radar viz */}
      <div style={{ position:'relative', height:210, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <div style={{ position:'relative', width:190, height:190 }}>
          {[0,1,2].map(i=>(<div key={i} style={{ position:'absolute', inset:`${i*30}px`, borderRadius:'50%', border:'1px solid rgba(198,242,78,.22)' }}/>))}
          {scan && <div style={{ position:'absolute', inset:0, borderRadius:'50%',
            background:'conic-gradient(from 0deg, transparent 0deg, rgba(198,242,78,.35) 60deg, transparent 85deg)', animation:'sp-spin 1.5s linear infinite' }}/>}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:58, height:58, borderRadius:18, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'var(--sh-lime)', animation:'sp-float 3s ease-in-out infinite' }}><Icon n="sparkFill" s={30} c="var(--ink)"/></div>
          </div>
          {!scan && [[28,30],[72,38],[60,74],[24,66]].map(([x,y],i)=>(
            <div key={i} className="zoom" style={{ animationDelay:`${i*.1}s`, position:'absolute', left:`${x}%`, top:`${y}%`,
              width:12, height:12, borderRadius:'50%', background:'var(--blue)', transform:'translate(-50%,-50%)', boxShadow:'0 0 12px var(--blue)' }}/>
          ))}
        </div>
      </div>
      <div style={{ textAlign:'center', padding:'0 28px 6px' }}>
        <h2 className="t-h2" style={{ color:'#fff', margin:0 }}>{scan?'Analizando tu zona…':'4 oportunidades cerca'}</h2>
        <p className="t-small" style={{ color:'rgba(255,255,255,.55)', margin:'6px 0 0' }}>{scan?'Cruzando disponibilidad, tarifas y tráfico':'Según tus hábitos y la hora actual'}</p>
      </div>

      <div className="scr-scroll no-sb" style={{ padding:'16px 20px 30px' }}>
        {!scan && sugg.map((g,i)=>(
          <div key={i} className="rise-s" style={{ animationDelay:`${i*.09}s`, display:'flex', gap:13, background:'rgba(255,255,255,.06)',
            border:'1px solid rgba(255,255,255,.08)', borderRadius:18, padding:15, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:13, background:g.tint, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon n={g.ic} s={23} c="var(--ink)"/></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="t-h3" style={{ color:'#fff' }}>{g.t}</div>
              <p className="t-small" style={{ color:'rgba(255,255,255,.6)', margin:'4px 0 0', lineHeight:1.45 }}>{g.d}</p>
              {g.cta && <button className="btn btn-primary btn-sm" style={{ marginTop:11 }} onClick={g.go}>{g.cta}</button>}
            </div>
          </div>
        ))}
        {scan && [0,1,2].map(i=>(
          <div key={i} style={{ height:78, borderRadius:18, background:'rgba(255,255,255,.05)', marginBottom:12,
            animation:'sp-pulse 1.4s ease-in-out infinite', animationDelay:`${i*.2}s` }}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────── AI DASHBOARD ─────────── */
function AI() {
  const { pop, push } = useNav();
  const [scan, setScan] = tS(true);
  tE(()=>{ const t=setTimeout(()=>setScan(false),1600); return ()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar onBack={pop} title={<span style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Icon n="sparkle" s={20} c="var(--blue-light)"/>SpotPark AI <span style={{ background:'var(--blue-tint)', color:'var(--blue-light)', fontSize:10, fontWeight:500, padding:'2px 7px', borderRadius:'var(--r-pill)' }}>beta</span></span>}/>
      <div className="scr-scroll no-sb" style={{ padding:'4px 20px 30px' }}>
        <p className="t-small" style={{ color:'var(--t2)', margin:'0 0 18px' }}>Insights para ti hoy</p>

        <SecLabel>Predicciones de hoy</SecLabel>
        <div className="rise-s card" style={{ padding:16, background:'var(--surface)', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:15, fontWeight:500 }}>Demanda en tu zona</span><span className="badge badge-few">Alta 5–7pm</span></div>
          <Bar pct={.82} color="var(--orange)"/>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:12 }}>
            <span className="chip" style={{ cursor:'default', height:28, fontSize:12 }}>Reservar antes de las 4pm</span>
            <span className="t-micro" style={{ color:'var(--t3)' }}>87% confianza</span></div>
        </div>
        <div className="rise-s d1 card" style={{ padding:16, background:'var(--surface)', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><div className="t-micro" style={{ color:'var(--t2)' }}>Precio promedio hoy</div><div className="t-h2 tnum" style={{ color:'var(--blue-light)', marginTop:2 }}>{SP.COP(2800)}/h</div></div>
          <span style={{ display:'flex', alignItems:'center', gap:5, color:'var(--green)', fontSize:13, fontWeight:500 }}><Icon n="trendDown" s={17} c="var(--green)"/>-8% vs ayer</span>
        </div>
        <div className="rise-s d2 card" style={{ padding:16, background:'var(--surface)', marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:500 }}>3 nuevos cerca</span><button onClick={()=>push('home')} style={{ background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer' }}>Ver mapa</button></div>
          {SP.spots.slice(0,3).map((s,i)=>(
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom: i<2?'.5px solid var(--separator)':'none' }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:AVAIL[s.status] }}/>
              <span style={{ flex:1, fontSize:14, fontWeight:500 }}>{s.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={()=>push('detail',{ id:s.id })}>Reservar</button>
            </div>
          ))}
        </div>

        <SecLabel>Tus patrones</SecLabel>
        <div className="rise-s" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[['Zona frecuente','Chapinero','pin'],['Hora pico','8–10am','clock'],['Vehículo','Carro 80%','car'],['Gasto promedio',SP.COP(8400),'card']].map(([l,v,ic],i)=>(
            <div key={i} className="card" style={{ padding:14, background:'var(--surface)' }}>
              <Icon n={ic} s={18} c="var(--blue-light)"/>
              <div className="t-h3 tnum" style={{ marginTop:8 }}>{v}</div><div className="t-micro" style={{ color:'var(--t2)' }}>{l}</div></div>
          ))}
        </div>
        {/* before/after */}
        <div className="rise-s d1 card" style={{ padding:16, background:'var(--surface)', marginBottom:18 }}>
          <div className="t-small" style={{ color:'var(--t2)', marginBottom:12 }}>Tiempo buscando parqueo</div>
          <BeforeAfter label="Antes de SpotPark" value="23 min" pct={1} color="var(--red)"/>
          <BeforeAfter label="Con SpotPark" value="2 min" pct={.1} color="var(--green)"/>
        </div>

        <SecLabel>Mejor momento</SecLabel>
        <div className="rise-s" style={{ background:'var(--blue-tint)', border:'.5px solid var(--blue)', borderRadius:14, padding:16 }}>
          <div style={{ fontSize:15, fontWeight:500 }}>✦ Mejor hora: 9:00 – 11:00 AM</div>
          <div className="t-small" style={{ color:'var(--blue-light)', marginTop:4 }}>78% disponibilidad promedio</div>
        </div>
      </div>
    </div>
  );
}
function SecLabel({ children }) { return <div className="t-micro" style={{ color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.1em', margin:'0 2px 10px' }}>{children}</div>; }
function Bar({ pct, color }) {
  return <div style={{ height:6, borderRadius:9, background:'var(--elevated)', overflow:'hidden' }}>
    <div style={{ height:'100%', width:`${pct*100}%`, background:color, borderRadius:9, transformOrigin:'left', animation:'sp-bar .7s cubic-bezier(.2,.8,.2,1) both' }}/></div>;
}
function BeforeAfter({ label, value, pct, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span className="t-small" style={{ color:'var(--t2)' }}>{label}</span><span className="t-small tnum" style={{ color, fontWeight:500 }}>{value}</span></div>
      <div style={{ height:8, borderRadius:9, background:'var(--elevated)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct*100}%`, background:color, borderRadius:9, transformOrigin:'left', animation:'sp-bar .8s cubic-bezier(.2,.8,.2,1) both' }}/></div>
    </div>
  );
}

/* ─────────── NOTIFICATIONS ─────────── */
const NOTIF_STYLE = {
  reservation:{ ic:'cal', c:'var(--blue)' }, payment:{ ic:'checkC', c:'var(--green)' },
  ai:{ ic:'sparkle', c:'var(--yellow)' }, urgent:{ ic:'warning', c:'var(--red)' }, system:{ ic:'info', c:'var(--t3)' },
};
function Notifications() {
  const { pop } = useNav();
  const [items, setItems] = tS(SP.notifs);
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Notificaciones" onBack={pop} right={<button onClick={()=>setItems(items.map(x=>({...x,unread:false})))} style={{ background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer' }}>Marcar leído</button>}/>
      <div className="scr-scroll no-sb" style={{ padding:'8px 16px 30px' }}>
        {items.map((n,i)=>{
          const st=NOTIF_STYLE[n.type];
          return (
            <div key={i} className="rise-s" style={{ animationDelay:`${i*.05}s`, display:'flex', gap:13, padding:14, marginBottom:10, borderRadius:16,
              background: n.unread?'var(--elevated)':'var(--surface)', border:'.5px solid var(--border-card)' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'color-mix(in srgb,'+'transparent 80%, '+st.c+')', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, backgroundColor:'rgba(255,255,255,.04)' }}>
                <Icon n={st.ic} s={20} c={st.c}/></div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:500 }}>{n.t}</span>
                  {n.unread && <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--blue)', flexShrink:0, marginTop:5 }}/>}</div>
                <p className="t-small" style={{ color:'var(--t2)', margin:'3px 0 0', lineHeight:1.4 }}>{n.d}</p>
                <div className="t-micro" style={{ color:'var(--t3)', marginTop:5 }}>{n.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── REVIEW ─────────── */
function Review({ reservationId }) {
  const { pop } = useNav();
  const [stars, setStars] = tS(0);
  const [aspects, setAspects] = tS([]);
  const [txt, setTxt] = tS('');
  const positive = ['Limpio','Seguro','Fácil acceso','Personal amable','Precio justo','Señalización'];
  const negative = ['Poca seguridad','Difícil acceder','Sucio','Personal grosero','Precio alto','Espacios pequeños'];
  const chips = stars>=4?positive : stars>0&&stars<=2?negative : [...positive.slice(0,3),...negative.slice(0,3)];
  const toggle = a => setAspects(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a]);
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Calificar" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'8px 20px 30px' }}>
        <div className="card" style={{ padding:13, display:'flex', gap:12, alignItems:'center', background:'var(--surface)', marginBottom:24 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:SP.spots[0].img }}/>
          <div><div style={{ fontSize:14, fontWeight:500 }}>{SP.spots[0].name}</div><div className="t-micro" style={{ color:'var(--t2)' }}>Hoy · 14:00–18:00</div></div>
        </div>

        <h2 className="t-h2" style={{ textAlign:'center', margin:'0 0 18px' }}>¿Cómo fue tu experiencia?</h2>
        <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:24 }}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>setStars(n)} style={{ background:'none', border:'none', cursor:'pointer', padding:2,
              transform: stars===n?'scale(1.12)':'scale(1)', transition:'transform .2s cubic-bezier(.3,1.4,.5,1)' }}>
              <Icon n={n<=stars?'starFill':'star'} s={40} c={n<=stars?'var(--yellow)':'var(--t4)'}/></button>
          ))}
        </div>

        {stars>0 && (
          <div className="rise-s" style={{ marginBottom:22 }}>
            <div className="t-small" style={{ color:'var(--t2)', marginBottom:10 }}>¿Qué destacarías?</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {chips.map(a=>(
                <button key={a} className={'chip'+(aspects.includes(a)?' on':'')} onClick={()=>toggle(a)}>{a}</button>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ background:'var(--surface)', padding:14, marginBottom:14 }}>
          <textarea value={txt} onChange={e=>setTxt(e.target.value.slice(0,300))} placeholder="Cuéntanos más (opcional)"
            style={{ width:'100%', minHeight:90, background:'none', border:'none', outline:'none', resize:'none', color:'var(--t1)', fontFamily:'var(--font)', fontSize:15 }}/>
          <div className="t-micro tnum" style={{ textAlign:'right', color:'var(--t3)' }}>{txt.length}/300</div>
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{ width:76, height:76, borderRadius:12, border:'.5px dashed var(--border)', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <Icon n={i===0?'plus':'cam'} s={22} c="var(--t3)"/></div>
          ))}
        </div>

        {txt.length>20 && (
          <AIInsightCard micro body={SP.ai.reviewAssist} delay={0}
            action={<div style={{ display:'flex', gap:8, marginTop:10 }}>
              <button onClick={()=>setTxt(t=>t+' Llegué sin demoras y la entrada fue muy rápida.')} className="btn btn-secondary btn-sm">Añadir sugerencia</button>
              <button className="btn btn-ghost btn-sm">Ignorar</button></div>}/>
        )}
      </div>
      <div style={{ padding:'12px 20px 30px', borderTop:'.5px solid var(--border)' }}>
        <button className="btn btn-primary btn-block" disabled={stars===0} onClick={pop}>Publicar reseña</button>
      </div>
    </div>
  );
}

function Empty({ ic, txt }) {
  return (
    <div style={{ textAlign:'center', padding:'70px 30px', color:'var(--t2)' }}>
      <div style={{ width:72, height:72, borderRadius:20, background:'var(--surface)', border:'.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><Icon n={ic} s={32} c="var(--t3)"/></div>
      <p className="t-body" style={{ margin:0 }}>{txt}</p>
    </div>
  );
}

Object.assign(window.SP_SCREENS, { trips:Trips, tripDetail:TripDetail, saved:Saved, profile:Profile, vehicles:Vehicles, ai:AIRadar, aiDash:AI, notifications:Notifications, review:Review });
