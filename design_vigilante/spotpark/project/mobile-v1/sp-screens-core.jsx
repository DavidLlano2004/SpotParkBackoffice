/* sp-screens-core.jsx — Splash, Onboarding, Auth, Home, Search */
const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR } = React;

/* ─────────── SPLASH ─────────── */
function Splash() {
  const { replace } = useNav();
  uE(() => { const t = setTimeout(() => replace('onboarding'), 2300); return () => clearTimeout(t); }, []);
  const dots = uM(() => [...Array(25)].map(() => ({
    x: Math.random()*100, y: Math.random()*100, d: Math.random()*3, dur: 6+Math.random()*5 })), []);
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--ink)', overflow:'hidden',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <Chrome onDark />
      {dots.map((p,i)=>(
        <span key={i} style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`, width:3, height:3, borderRadius:'50%',
          background:'var(--blue)', opacity:.12, animation:`sp-drift ${p.dur}s ease-in-out infinite`, animationDelay:`${p.d}s` }}/>
      ))}
      <div className="zoom" style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:2 }}>
        <div style={{ width:80, height:80, borderRadius:24, background:'var(--blue)', display:'flex',
          alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)', animation:'sp-float 3s ease-in-out infinite' }}>
          <span style={{ color:'var(--ink)', fontSize:40, fontWeight:700, fontFamily:'var(--display)' }}>P</span>
        </div>
        <div className="t-h1 rise-s d2" style={{ marginTop:18, color:'#fff' }}>SpotPark</div>
        <div className="t-small rise-s d4" style={{ color:'var(--blue)', marginTop:4 }}>El Waze del parqueo</div>
      </div>
    </div>
  );
}

/* ─────────── ONBOARDING ─────────── */
const ONB = [
  { ic:'location', title:'Encuentra en 5 segundos', body:'Ve todos los parqueaderos cercanos en tiempo real. Verde libre, amarillo pocos cupos, rojo lleno.' },
  { ic:'check', title:'Reserva con un toque', body:'Elige tu vehículo, el tiempo que necesitas y paga de forma segura. Sin filas, sin llamadas.' },
  { ic:'qr', title:'Llega y escanea', body:'Tu código QR abre la barrera. Directo, sin papel, sin estrés.' },
];

/* per-slide floating concept card over the map */
function OnbScene({ i }) {
  if (i === 0) return (
    <>
      {/* scanning ring on active pin */}
      <div style={{ position:'absolute', left:'26%', top:'30%', transform:'translate(-50%,-50%)', width:90, height:90, borderRadius:'50%', border:'1.5px solid rgba(198,242,78,.5)', animation:'sp-ping 2.2s ease-out infinite' }}/>
      <div className="rise-s" style={{ position:'absolute', left:24, right:24, bottom:54, background:'#fff', borderRadius:18, padding:13, display:'flex', gap:12, alignItems:'center', boxShadow:'var(--sh-pop)', animation:'sp-float 3.4s ease-in-out infinite' }}>
        <div style={{ width:52, height:52, borderRadius:13, background:'#2C3340', flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="t-h3" style={{ color:'var(--ink)' }}>Chapinero 63</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:5 }}>
            <span className="badge badge-avail"><span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }}/>12 cupos</span>
            <span className="t-small" style={{ color:'var(--t2)' }}>180 m · 2 min</span>
          </div>
        </div>
        <div style={{ textAlign:'right' }}><div className="t-h3 tnum" style={{ color:'#3E6B12' }}>$3.000</div><div className="t-micro" style={{ color:'var(--t2)' }}>/hora</div></div>
      </div>
    </>
  );
  if (i === 1) return (
    <div className="zoom" style={{ position:'absolute', left:30, right:30, top:'30%', background:'#fff', borderRadius:20, padding:18, boxShadow:'var(--sh-pop)', animation:'sp-float 3.4s ease-in-out infinite' }}>
      <div style={{ display:'flex', alignItems:'center', gap:11 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:'#EEF7D4', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="car" s={24} c="#3E6B12"/></div>
        <div style={{ flex:1 }}><div className="t-h3" style={{ color:'var(--ink)' }}>Renault Sandero</div><div className="t-small tnum" style={{ color:'var(--t2)' }}>ZXC 123 · 14:00–18:00</div></div>
      </div>
      <div style={{ height:'1px', background:'var(--separator)', margin:'14px 0' }}/>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="t-small" style={{ color:'var(--t2)' }}>Total</span>
        <span className="t-h3 tnum" style={{ color:'var(--ink)' }}>$13.800</span>
      </div>
      <button className="btn btn-primary btn-block" style={{ height:46, marginTop:14, pointerEvents:'none' }}>
        <Icon n="check" s={18} c="var(--ink)"/> Reservado</button>
      {/* tap ripple */}
      <div style={{ position:'absolute', right:36, bottom:24, width:26, height:26, borderRadius:'50%', border:'2px solid var(--blue)', animation:'sp-ping 1.8s ease-out infinite' }}/>
    </div>
  );
  return (
    <div className="zoom" style={{ position:'absolute', left:'50%', top:'34%', transform:'translateX(-50%)', background:'#fff', borderRadius:22, padding:20, boxShadow:'var(--sh-pop)', animation:'sp-float 3.4s ease-in-out infinite', overflow:'hidden' }}>
      <div style={{ position:'relative', width:148, height:148, borderRadius:14, background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon n="qr" s={108} c="#fff"/>
        {/* scan beam */}
        <div style={{ position:'absolute', left:8, right:8, height:3, borderRadius:3, background:'var(--blue)', boxShadow:'0 0 14px 3px rgba(198,242,78,.7)', top:10, animation:'sp-scan 2.2s ease-in-out infinite' }}/>
      </div>
      <div className="mono" style={{ textAlign:'center', color:'var(--t3)', fontSize:12, marginTop:12 }}>SPK-7F2A-9X41</div>
    </div>
  );
}

function Onboarding() {
  const { replace } = useNav();
  const [i, setI] = uS(0);
  const last = i === ONB.length-1;
  const o = ONB[i];
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--ink)', display:'flex', flexDirection:'column' }}>
      <Chrome onDark />
      {!last && <button onClick={()=>replace('auth')} style={{ position:'absolute', top:58, right:18, zIndex:6,
        background:'none', border:'none', color:'rgba(255,255,255,.55)', fontSize:15, fontWeight:500, cursor:'pointer' }}>Saltar</button>}
      {/* illustration */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        <div key={i} className="fade" style={{ position:'absolute', inset:0 }}>
          <MapMock dark>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(380px 300px at 50% 40%, rgba(198,242,78,.16), transparent 70%)' }}/>
            <UserDot x={50} y={72}/>
            <ParkingPin x={26} y={30} status="available" count={12} active={i===0} delay={.1}/>
            <ParkingPin x={70} y={24} status="few" count={3} delay={.2}/>
            <ParkingPin x={68} y={56} status="available" count={9} delay={.3}/>
            <ParkingPin x={32} y={58} status="full" delay={.4}/>
          </MapMock>
          {/* bottom scrim into the sheet */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 55%, rgba(15,17,21,.5) 80%, var(--ink) 100%)' }}/>
          <OnbScene i={i}/>
        </div>
      </div>
      {/* sheet */}
      <div style={{ background:'var(--surface)', borderRadius:'28px 28px 0 0', padding:'28px 24px 34px' }}>
        <div style={{ display:'flex', gap:7, marginBottom:22 }}>
          {ONB.map((_,k)=>(
            <div key={k} style={{ height:6, borderRadius:9, width: k===i?24:6,
              background: k===i?'var(--ink)':'var(--elevated)', transition:'all .35s' }}/>
          ))}
        </div>
        <h1 key={'t'+i} className="t-h1 rise-s" style={{ margin:'0 0 12px' }}>{o.title}</h1>
        <p key={'b'+i} className="t-body rise-s d1" style={{ color:'var(--t2)', margin:'0 0 24px', maxWidth:320 }}>{o.body}</p>
        <button className="btn btn-primary btn-block" onClick={()=> last?replace('auth'):setI(i+1)}>
          {last?'Comenzar':'Continuar'}
        </button>
      </div>
    </div>
  );
}

/* ─────────── AUTH (immersive) ─────────── */
function Auth() {
  const { replace } = useNav();
  const [mode, setMode] = uS('login');
  const [show, setShow] = uS(false);
  const reg = mode==='register';
  return (
    <div className="scr-scroll no-sb" style={{ position:'absolute', inset:0, background:'var(--ink)' }}>
      <Chrome onDark />
      {/* hero: live map */}
      <div style={{ position:'relative', height:330, flexShrink:0 }}>
        <MapMock dark>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(320px 240px at 30% 28%, rgba(198,242,78,.18), transparent 70%)' }}/>
          <UserDot x={52} y={70}/>
          <ParkingPin x={30} y={26} status="available" count={12} active delay={.15}/>
          <ParkingPin x={66} y={20} status="few" count={3} delay={.28}/>
          <ParkingPin x={48} y={44} status="available" count={9} delay={.4}/>
          <ParkingPin x={78} y={48} status="full" delay={.52}/>
        </MapMock>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(15,17,21,.35) 0%, transparent 32%, rgba(15,17,21,.6) 72%, var(--ink) 100%)' }}/>
        <div className="rise" style={{ position:'absolute', top:92, left:24, right:24 }}>
          <div style={{ width:54, height:54, borderRadius:16, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}>
            <span style={{ color:'var(--ink)', fontSize:28, fontWeight:700, fontFamily:'var(--display)' }}>P</span></div>
          <h1 className="t-hero" style={{ color:'#fff', margin:'18px 0 0', lineHeight:1.02 }}>Aparca sin<br/>dar vueltas.</h1>
          <p className="t-body" style={{ color:'rgba(255,255,255,.6)', margin:'8px 0 0' }}>Tu plaza en Bogotá, reservada en segundos.</p>
        </div>
      </div>

      {/* sheet */}
      <div style={{ background:'var(--ink)', padding:'4px 24px 36px', display:'flex', flexDirection:'column', minHeight:'calc(100% - 330px)' }}>
        {/* social-first */}
        <div className="rise-s" style={{ display:'flex', flexDirection:'column', gap:11 }}>
          <button className="btn btn-block" style={{ background:'#fff', color:'var(--ink)' }} onClick={()=>replace('home')}>
            <Icon n="apple" s={20} c="var(--ink)"/> Continuar con Apple</button>
          <button className="btn btn-block" style={{ background:'#fff', color:'var(--ink)' }} onClick={()=>replace('home')}>
            <Icon n="google" s={19}/> Continuar con Google</button>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0 18px' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.12)' }}/>
          <span className="t-small" style={{ color:'rgba(255,255,255,.45)', whiteSpace:'nowrap' }}>o con tu correo</span>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.12)' }}/>
        </div>

        <div className="fade" key={mode} style={{ display:'flex', flexDirection:'column', gap:11 }}>
          {reg && <FocusInput ic="user" ph="Nombre completo"/>}
          <FocusInput ic="mail" ph="Correo electrónico"/>
          {reg && <FocusInput ic="phone" ph="Teléfono" prefix="+57"/>}
          <FocusInput ic="lock" ph="Contraseña" type={show?'text':'password'}
            trailing={<button onClick={()=>setShow(s=>!s)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Icon n={show?'eyeOff':'eye'} s={20} c="var(--t3)"/></button>}/>
          {!reg && <button style={{ alignSelf:'flex-end', background:'none', border:'none', color:'var(--blue)', fontSize:13, fontWeight:500, cursor:'pointer', marginTop:-1 }}>¿Olvidaste tu contraseña?</button>}
        </div>

        <button className="btn btn-primary btn-block" style={{ marginTop:16 }} onClick={()=>replace('home')}>
          {reg?'Crear cuenta':'Entrar'} <Icon n="arrR" s={19} c="var(--ink)"/></button>

        {/* elegant text-link toggle */}
        <button onClick={()=>setMode(reg?'login':'register')} style={{ background:'none', border:'none', cursor:'pointer', margin:'20px auto 0', fontSize:14 }}>
          <span style={{ color:'rgba(255,255,255,.55)' }}>{reg?'¿Ya tienes cuenta? ':'¿Nuevo en SpotPark? '}</span>
          <span style={{ color:'var(--blue)', fontWeight:600 }}>{reg?'Inicia sesión':'Crea tu cuenta'}</span>
        </button>

        <p className="t-micro" style={{ textAlign:'center', color:'rgba(255,255,255,.4)', marginTop:'auto', paddingTop:22, lineHeight:1.5 }}>
          Al continuar aceptas los Términos y la Política de privacidad de SpotPark.</p>
      </div>
    </div>
  );
}
function FocusInput({ ic, ph, type='text', trailing, prefix }) {
  const [f, setF] = uS(false);
  return (
    <div className={'input'+(f?' focus':'')}>
      <Icon n={ic} s={20} c={f?'var(--blue-light)':'var(--t3)'}/>
      {prefix && <span style={{ color:'var(--t2)', fontSize:15 }}>{prefix}</span>}
      <input type={type} placeholder={ph} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
      {trailing}
    </div>
  );
}

/* ─────────── HOME ─────────── */
function Home() {
  const { push } = useNav();
  const [active, setActive] = uS('s1');
  const [filter, setF] = uS('all');
  const [layer, setLayer] = uS(0);
  const spots = SP.spots;
  const act = SP.byId(active);
  const filters = ['Todos','🚗 Carro','🏍️ Moto','🚲 Bici','🚙 SUV','$ Precio','⭐ Rating','24h','Techado'];
  const layers = ['Estándar','Satélite','Tráfico'];
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Chrome />
      <MapMock>
        <UserDot x={50} y={62}/>
        {spots.map((s,k)=>(
          <ParkingPin key={s.id} x={s.x} y={s.y} status={s.status} count={s.status==='full'?0:s.cars[0]}
            active={s.id===active} stale={s.reliability!=='verified'} delay={.1+k*.06}
            onClick={()=>setActive(s.id)}/>
        ))}
      </MapMock>

      {/* top overlay: greeting + icons */}
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
          <Icon n="search" s={20} c="var(--t3)"/>
          <span style={{ flex:1, color:'var(--t4)', fontSize:15 }}>¿Dónde quieres parquear?</span>
          <Icon n="filter" s={20} c="var(--t2)"/>
        </button>
      </div>

      {/* filter chips */}
      <div className="no-sb" style={{ position:'absolute', top:186, left:0, right:0, zIndex:10, display:'flex', gap:8, overflowX:'auto', padding:'0 16px' }}>
        {filters.map((f,k)=>(
          <button key={f} className={'chip'+(filter===(k===0?'all':f)?' on':'')} onClick={()=>setF(k===0?'all':f)}>{f}</button>
        ))}
      </div>

      {/* map controls */}
      <button onClick={()=>setLayer((layer+1)%3)} style={{ position:'absolute', right:16, top:236, zIndex:11, width:36, height:36, borderRadius:'50%',
        background:'var(--surface)', border:'.5px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon n="layers" s={18} c="var(--blue-light)"/></button>
      <RoundBtn size={44} style={{ position:'absolute', right:16, bottom:330, zIndex:11 }}><Icon n="location" s={21} c="var(--blue-light)"/></RoundBtn>

      {/* AI predict card + legend */}
      <div style={{ position:'absolute', left:16, right:16, bottom:268, zIndex:10 }}>
        <AIInsightCard body={SP.ai.home.body} onPress={()=>push('ai')} delay={.4}/>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {['available','few','full'].map(s=>(
            <span key={s} className="chip" style={{ cursor:'default', height:28, fontSize:11 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:AVAIL[s] }}/>{AVAIL_LABEL[s]}</span>
          ))}
        </div>
      </div>

      {/* preview sheet */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:20, padding:'0 12px 96px' }}>
        <div key={active} className="rise-s card" style={{ padding:14 }}>
          <div style={{ display:'flex', gap:13 }}>
            <div style={{ width:80, height:80, borderRadius:14, background:act.img, flexShrink:0, position:'relative' }}>
              <span className="tnum" style={{ position:'absolute', bottom:6, left:6, background:'rgba(0,0,0,.5)', color:'#fff', fontSize:10, fontWeight:500, padding:'2px 6px', borderRadius:6 }}>{act.dist}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ minWidth:0 }}><div className="t-h3" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{act.name}</div>
                  <div className="t-small" style={{ color:'var(--t2)', marginTop:1 }}>{act.zone} · {act.walk}</div></div>
                <Icon n="heart" s={21} c="var(--t3)"/>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:9 }}>
                <Badge status={act.status} count={act.status==='full'?null:act.cars[0]}/>
                <Rating value={act.rating}/>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:13, paddingTop:13, borderTop:'.5px solid var(--separator)' }}>
            <div><span className="t-h2 tnum" style={{ color:'var(--blue-light)' }}>{SP.COP(act.price)}</span><span className="t-small" style={{ color:'var(--t2)' }}> /hora</span></div>
            <button className="btn btn-primary btn-sm" style={{ height:44, padding:'0 22px' }} onClick={()=>push('detail',{ id:act.id })}>Ver detalle</button>
          </div>
        </div>
      </div>

      <TabBar/>
    </div>
  );
}

/* ─────────── SEARCH ─────────── */
function Search() {
  const { pop, push } = useNav();
  const [q, setQ] = uS('');
  const [view, setView] = uS('list');
  const recents = ['Cra 13 #63-21, Chapinero','Universidad Javeriana','CC Andino'];
  const conversational = q.length>10 && /cerca|barato|para|mañana|hoy|que tenga|con|econ/i.test(q);
  const results = SP.spots.filter(s => !q || (s.name+s.addr+s.zone).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <div style={{ padding:'58px 16px 10px', display:'flex', gap:10, alignItems:'center' }}>
        <RoundBtn onClick={pop}><Icon n="chevL" s={20} c="#fff"/></RoundBtn>
        <div className="input focus" style={{ flex:1 }}>
          <Icon n="search" s={20} c="var(--blue-light)"/>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Destino, dirección o zona"/>
          {q && <button onClick={()=>setQ('')} style={{ border:'none', background:'none', cursor:'pointer', display:'flex' }}><Icon n="x" s={18} c="var(--t3)"/></button>}
        </div>
      </div>

      {q && (
        <div style={{ display:'flex', gap:8, padding:'0 16px 8px' }}>
          {[['list','Lista'],['map','Mapa']].map(([k,l])=>(
            <button key={k} className={'chip'+(view===k?' on':'')} onClick={()=>setView(k)}>
              <Icon n={k==='map'?'pin':'list'} s={15} c={view===k?'var(--blue-light)':'var(--t2)'}/>{l}</button>
          ))}
        </div>
      )}

      {conversational && (
        <div className="in-left" style={{ margin:'2px 16px 10px', position:'relative', overflow:'hidden', background:'var(--blue-bg)', border:'.5px solid var(--blue-tint)', borderRadius:12, padding:'12px 14px' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--blue)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <Icon n="sparkle" s={15} c="var(--blue-light)"/>
            <span style={{ fontSize:13, color:'var(--blue-light)', fontWeight:500 }}>Entendí:</span>
            {['Moto','Precio bajo','Zona universitaria'].map(t=>(
              <span key={t} style={{ fontSize:12, color:'var(--blue-light)', background:'var(--blue-tint)', padding:'3px 8px', borderRadius:'var(--r-pill)' }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      <div className="scr-scroll no-sb" style={{ padding:'4px 16px 24px' }}>
        {!q && (<>
          <button className="rise-s" onClick={()=>push('home')} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
            background:'var(--blue-tint)', border:'.5px solid var(--blue)', borderRadius:14, cursor:'pointer', marginBottom:20 }}>
            <Icon n="location" s={20} c="var(--blue-light)"/><span style={{ fontWeight:500, fontSize:15, color:'var(--blue-light)' }}>Buscar cerca de mí</span>
            <Icon n="chevR" s={18} c="var(--blue-light)" style={{ marginLeft:'auto' }}/></button>
          <div className="t-micro" style={{ color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.1em', margin:'4px 2px 8px' }}>Recientes</div>
          {recents.map((r,i)=>(
            <button key={r} className="rise-s" style={{ animationDelay:`${i*.05}s`, width:'100%', display:'flex', alignItems:'center', gap:13, padding:'13px 2px',
              background:'none', border:'none', borderBottom:'.5px solid var(--separator)', cursor:'pointer', textAlign:'left' }} onClick={()=>setQ(r)}>
              <Icon n="clock" s={19} c="var(--t3)"/><span style={{ fontSize:15, color:'var(--t1)', flex:1 }}>{r}</span>
              <Icon n="x" s={16} c="var(--t4)"/></button>
          ))}
        </>)}
        {q && results.map((s,i)=>(
          <button key={s.id} className="rise-s" style={{ animationDelay:`${i*.05}s`, width:'100%', display:'flex', alignItems:'center', gap:13, padding:'13px 2px',
            background:'none', border:'none', borderBottom:'.5px solid var(--separator)', cursor:'pointer', textAlign:'left' }} onClick={()=>push('detail',{ id:s.id })}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:AVAIL[s.status], flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:15, fontWeight:500 }}>{s.name}</div>
              <div className="t-small" style={{ color:'var(--t2)' }}>{s.addr} · {s.dist}</div></div>
            <Badge status={s.status} count={s.status==='full'?null:s.cars[0]}/>
          </button>
        ))}
        {q && results.length===0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--t2)' }}>
            <Icon n="search" s={40} c="var(--t4)"/><p style={{ marginTop:14 }}>Sin resultados para «{q}»</p></div>
        )}
      </div>
    </div>
  );
}

Object.assign(window.SP_SCREENS, { splash:Splash, onboarding:Onboarding, auth:Auth, home:Home, search:Search });
