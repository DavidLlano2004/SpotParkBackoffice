/* bo-pages-core.jsx — Login, Dashboard, Mapa. window.BO_PAGES */
window.BO_PAGES = window.BO_PAGES || {};
const { useState:pS, useMemo:pM } = React;

/* shared: zone grid */
function ZoneGrid({ zones, selId, onSelect, cols }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      {zones.map(z=>{
        const free=z.cells.filter(c=>c.status==='free').length;
        return (
          <div key={z.id}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:11 }}>
              <span className="t-h3" style={{ color:'var(--t2)' }}>{z.name}</span>
              <span className="t-micro upper" style={{ color:'var(--t4)' }}>{BO.TYPE_LABEL[z.type]}</span>
              <div style={{ flex:1, height:1, background:'var(--separator)' }}/>
              <span className="t-small tnum" style={{ color:'var(--t3)' }}>{free}/{z.cells.length} libres</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols||'auto-fill'}, minmax(56px, 1fr))`, gap:9 }}>
              {z.cells.map((c,i)=>(
                <div key={c.id} className="rise-s" style={{ animationDelay:`${Math.min(i*0.012,0.3)}s` }}>
                  <SpaceCell cell={c} selected={selId===c.id} onClick={()=>onSelect&&onSelect(c)}/>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── LOGIN ───────── */
function Login() {
  const { go } = useBO();
  const [show,setShow]=pS(false);
  const [email,setEmail]=pS('carlos@spotpark.co');
  const [pass,setPass]=pS('••••••••');
  return (
    <div style={{ height:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', background:'var(--bg)' }}>
      {/* left ink */}
      <div className="inleft" style={{ background:'var(--ink)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:240, height:240, borderRadius:'50%', background:'rgba(198,242,78,.10)' }}/>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:2 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}>
            <span style={{ color:'var(--ink)', fontFamily:'var(--display)', fontWeight:700, fontSize:34 }}>P</span></div>
          <div className="t-h1" style={{ color:'#fff', marginTop:16 }}>SpotPark</div>
          <div className="t-small" style={{ color:'var(--lime)', marginTop:4 }}>Panel de Operaciones</div>
          {/* aerial lot illustration */}
          <svg width="320" height="220" viewBox="0 0 320 220" style={{ marginTop:34 }}>
            <rect width="320" height="220" rx="16" fill="#15171F"/>
            <g stroke="#283042" strokeWidth="2">
              <line x1="20" y1="60" x2="300" y2="60"/><line x1="20" y1="120" x2="300" y2="120"/><line x1="20" y1="180" x2="300" y2="180"/>
              {[...Array(11)].map((_,i)=><line key={i} x1={20+i*26} y1="22" x2={20+i*26} y2="60"/>)}
              {[...Array(11)].map((_,i)=><line key={'b'+i} x1={20+i*26} y1="120" x2={20+i*26} y2="180"/>)}
            </g>
            {/* occupied cars */}
            {[1,3,4,7].map(i=><rect key={i} x={24+i*26} y="28" width="18" height="26" rx="3" fill="#283042"/>)}
            {[0,2,5,8,9].map(i=><rect key={'c'+i} x={24+i*26} y="126" width="18" height="26" rx="3" fill="#283042"/>)}
            {/* free (lime) */}
            <rect x={24+6*26} y="28" width="18" height="26" rx="3" fill="none" stroke="#C6F24E" strokeWidth="1.5"/>
            {/* booth + barrier */}
            <rect x="140" y="86" width="40" height="26" rx="4" fill="#C6F24E"/>
            <line x1="184" y1="99" x2="240" y2="99" stroke="#C6F24E" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="184" cy="99" r="3" fill="#C6F24E"/>
          </svg>
          <p className="t-small" style={{ color:'rgba(255,255,255,.5)', textAlign:'center', maxWidth:260, marginTop:26 }}>Tu parqueadero, organizado y eficiente.</p>
        </div>
      </div>
      {/* right form */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:48 }}>
        <div style={{ maxWidth:360, margin:'0 auto', width:'100%' }}>
          <h1 className="t-h1 rise-s">Bienvenido</h1>
          <p className="t-body rise-s d1" style={{ color:'var(--t2)', margin:'6px 0 30px' }}>Ingresa tus credenciales para continuar.</p>
          <div className="rise-s d2" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label className="t-micro upper" style={{ color:'var(--t3)', display:'block', marginBottom:7 }}>Correo</label>
              <Field ic="mail" ph="tu@spotpark.co" lg value={email} onChange={setEmail}/>
            </div>
            <div>
              <label className="t-micro upper" style={{ color:'var(--t3)', display:'block', marginBottom:7 }}>Contraseña</label>
              <Field ic="lock" ph="••••••••" lg value={pass} onChange={setPass} trailing={
                <button onClick={()=>setShow(s=>!s)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Icon n={show?'eyeOff':'eye'} s={19} c="var(--t3)"/></button>}/>
              <div style={{ textAlign:'right', marginTop:7 }}><button style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer' }}>¿Olvidaste tu contraseña?</button></div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block rise-s d3" style={{ marginTop:24 }} onClick={()=>go('preturno')}>Ingresar</button>
          <p className="t-micro rise-s d4" style={{ color:'var(--t4)', textAlign:'center', marginTop:24 }}>SpotPark Backoffice · v2.4 · Universidad de Caldas</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── DASHBOARD ───────── */
function Dashboard() {
  const { go, openModal } = useBO();
  const s = BO.stats;
  const StatCard = ({ label, st, color, big }) => {
    const free=useCountUp(st.free), used=useCountUp(st.used);
    const pct = st.cap? st.used/st.cap : 0;
    return (
      <div className="card rise-s" style={{ padding:18, gridColumn: big?'1 / -1':'auto', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ flex:1 }}>
          <div className="t-micro upper" style={{ color:'var(--t3)' }}>{label}</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:4 }}>
            <span className="t-hero tnum">{used}</span><span className="t-body" style={{ color:'var(--t2)' }}>/ {st.cap} espacios</span></div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, marginTop:8, background:'var(--green-bg)', color:'var(--green-tx)', padding:'3px 9px', borderRadius:100, fontSize:12, fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }}/>{free} disponibles</div>
        </div>
        <Ring pct={pct} size={big?92:64} color={big?'var(--lime-deep)':undefined}>
          <span className="t-h3 tnum" style={{ fontSize: big?20:14 }}>{Math.round(pct*100)}%</span>
        </Ring>
      </div>
    );
  };
  const recent = BO.records.slice(0,5);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, height:'100%' }}>
      {/* left */}
      <div className="no-sb" style={{ overflowY:'auto', paddingRight:4 }}>
        <div style={{ marginBottom:20 }}>
          <div className="t-micro upper" style={{ color:'var(--t3)' }}>Turno activo</div>
          <h1 className="t-h1" style={{ margin:'4px 0 2px' }}>Buenos días, Carlos</h1>
          <p className="t-small" style={{ color:'var(--t2)' }}>{BO.guard.parking} · {BO.guard.shift}</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          <StatCard label="Carros" st={s.car}/>
          <StatCard label="Motos" st={s.moto}/>
          <StatCard label="Bicicletas" st={s.bike}/>
          <StatCard label="Total general" st={s.total} big/>
        </div>
        <div className="t-small" style={{ color:'var(--t3)', fontWeight:600, marginBottom:10 }}>Acciones rápidas</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:22 }}>
          <button className="btn btn-primary btn-lg" onClick={()=>openModal({ type:'entry', vtype:'car' })}><Icon n="car" s={20} c="var(--ink)"/>Entrada Carro</button>
          <button className="btn btn-primary btn-lg" onClick={()=>openModal({ type:'entry', vtype:'moto' })}><Icon n="moto" s={20} c="var(--ink)"/>Entrada Moto</button>
          <button className="btn btn-green btn-lg" style={{ gridColumn:'1 / -1' }} onClick={()=>go('mapa')}><Icon n="logout" s={20} c="var(--green-tx)"/>Registrar Salida</button>
          <button className="btn btn-ghost btn-lg" style={{ gridColumn:'1 / -1' }} onClick={()=>openModal({ type:'qr' })}><Icon n="qr" s={20} c="var(--ink)"/>Escanear QR de reserva</button>
        </div>
        <div className="card" style={{ padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
            <span className="t-h3">Actividad reciente</span>
            <button onClick={()=>go('registros')} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Ver todos →</button>
          </div>
          {recent.map((r,i)=>(
            <div key={r.id} className="rise-s" style={{ animationDelay:`${i*.05}s`, display:'flex', alignItems:'center', gap:11, height:50, borderBottom:i<4?'1px solid var(--separator)':'none' }}>
              <span className="badge" style={{ background: r.active?'var(--lime-bg)':'var(--green-bg)', color:r.active?'var(--lime-deep)':'var(--green-tx)' }}>{r.active?'ENT':'SAL'}</span>
              <span className="mono" style={{ fontSize:14, fontWeight:600 }}>{BO.fmtPlate(r.plate)}</span>
              <span className="t-small" style={{ color:'var(--t3)' }}>{r.space}</span>
              <span className="t-small" style={{ color:'var(--t3)', marginLeft:'auto' }}>{r.active?r.inT:r.outT}</span>
            </div>
          ))}
        </div>
      </div>
      {/* right */}
      <DashRight/>
    </div>
  );
}
function DashRight() {
  const { go } = useBO();
  const [tab,setTab]=pS('all');
  const zones = tab==='all'?BO.zones : BO.zones.filter(z=>z.type===tab);
  const tabs=[['all','Todos'],['car','🚗 Carros'],['moto','🏍️ Motos'],['bike','🚲 Bicis']];
  return (
    <div className="card" style={{ display:'flex', flexDirection:'column', overflow:'hidden', padding:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span className="t-h3">Vista en tiempo real</span>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', animation:'pulse 1.8s infinite' }}/>
        <span className="t-micro" style={{ color:'var(--t3)', marginLeft:'auto' }}>Actualizado hace 4 seg</span>
      </div>
      <div style={{ display:'flex', gap:6, margin:'14px 0' }}>
        {tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{ height:32, padding:'0 12px', borderRadius:9, border:'none', cursor:'pointer',
          background:tab===k?'var(--ink)':'var(--elevated)', color:tab===k?'#fff':'var(--t2)', fontSize:12.5, fontWeight:600 }}>{l}</button>)}
      </div>
      <div className="no-sb" style={{ flex:1, overflowY:'auto', paddingRight:4 }}>
        <ZoneGrid zones={zones} onSelect={()=>go('mapa')}/>
      </div>
      <div style={{ display:'flex', gap:16, padding:'12px 0', borderTop:'1px solid var(--separator)', marginTop:12 }}>
        {[['var(--green)','Libre'],['var(--red)','Ocupado'],['var(--blue)','Reservado'],['var(--t4)','Fuera de servicio']].map(([c,l])=>(
          <span key={l} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t3)' }}><span style={{ width:9, height:9, borderRadius:3, background:c }}/>{l}</span>
        ))}
      </div>
      <AIInsightCard body={BO.ai.dashboard}/>
      <HeatmapMini/>
    </div>
  );
}

/* ───────── MAPA ───────── */
function Mapa() {
  const { openModal } = useBO();
  const [zones,setZones]=pS(()=>BO.zones.map(z=>({ ...z, cells: z.cells.map(c=>{
    const al = BO.alerts.find(a=>a.space===c.id);
    return al ? { ...c, status:'occupied', plate:al.plate, since:al.mins, flag:al.type } : { ...c };
  }) })));
  const [tab,setTab]=pS('car');
  const [sel,setSel]=pS(null);
  const [q,setQ]=pS('');
  const view = zones.filter(z=>z.type===tab);
  const flat = zones.flatMap(z=>z.cells);
  const counts = { free:flat.filter(c=>c.status==='free').length, occ:flat.filter(c=>c.status==='occupied').length, resv:flat.filter(c=>c.status==='reserved').length };

  const mutate = (id, patch) => setZones(zs=>zs.map(z=>({ ...z, cells:z.cells.map(c=>c.id===id?{ ...c, ...patch }:c) })));
  const doEntry = (cell, plate) => { mutate(cell.id, { status:'occupied', plate:plate.replace('-',''), since:0, resv:null }); setSel({ ...cell, status:'occupied', plate:plate.replace('-',''), since:0 }); };
  const doExit = (cell) => { mutate(cell.id, { status:'free', plate:null, since:null, flag:null }); setSel(null); };
  const selectBySpace = (space) => { const z=zones.find(z=>z.cells.some(c=>c.id===space)); if(z){ setTab(z.type); const c=z.cells.find(c=>c.id===space); if(c)setSel(c); } };

  const filtered = q ? view.map(z=>({ ...z, cells:z.cells.filter(c=>(c.plate||'').includes(q.toUpperCase().replace('-','')) || c.label.includes(q.toUpperCase())) })).filter(z=>z.cells.length) : view;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'56% 44%', height:'100%', margin:-24, border:'none' }}>
      {/* left */}
      <div style={{ borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {[['car','🚗 Automóviles'],['moto','🏍️ Motos'],['bike','🚲 Bicis']].map(([k,l])=>(
              <button key={k} onClick={()=>{setTab(k);setSel(null);}} style={{ height:34, padding:'0 13px', borderRadius:10, border:'none', cursor:'pointer',
                background:tab===k?'var(--ink)':'var(--elevated)', color:tab===k?'#fff':'var(--t2)', fontSize:13, fontWeight:600 }}>{l}</button>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto', height:36 }} onClick={()=>openModal({ type:'entry', vtype:tab })}><Icon n="plus" s={17} c="var(--ink)"/>Entrada</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:12 }}>
            <div style={{ width:240 }}><Field ic="search" ph="Buscar placa o espacio…" value={q} onChange={setQ} upper/></div>
            <div style={{ display:'flex', gap:7, marginLeft:'auto' }}>
              <span className="badge bg-avail"><span className="dot" style={{ background:'var(--green)' }}/>{counts.free} libres</span>
              <span className="badge bg-full"><span className="dot" style={{ background:'var(--red)' }}/>{counts.occ} ocupados</span>
              <span className="badge bg-resv"><span className="dot" style={{ background:'var(--blue)' }}/>{counts.resv} reservados</span>
            </div>
          </div>
        </div>
        <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'18px 24px' }}>
          <AlertBanner count={BO.alerts.length} onOpen={()=>openModal({ type:'alerts', onGo:selectBySpace })}/>
          <ZoneGrid zones={filtered} selId={sel?.id} onSelect={setSel}/>
        </div>
      </div>
      {/* right */}
      <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <SpaceDetail key={sel?.id||'empty'} cell={sel} counts={counts} onEntry={doEntry} onExit={(c)=>openModal({ type:'exit', cell:c, onDone:()=>doExit(c) })} openModal={openModal}/>
      </div>
    </div>
  );
}

function SpaceDetail({ cell, counts, onEntry, onExit, openModal }) {
  const [plate,setPlate]=pS('');
  const [vtype,setVtype]=pS('car');
  if (!cell) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:32 }}>
      <div style={{ width:72, height:72, borderRadius:20, background:'var(--surface)', boxShadow:'var(--sh-card)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}><Icon n="location" s={34} c="var(--t3)"/></div>
      <div className="t-h2" style={{ color:'var(--t2)' }}>Selecciona un espacio</div>
      <p className="t-small" style={{ color:'var(--t3)', maxWidth:280, marginTop:8 }}>Haz clic en cualquier espacio del mapa para ver su información o registrar un movimiento.</p>
      <div style={{ display:'flex', gap:8, marginTop:22 }}>
        <span className="badge bg-avail">{counts.free} libres</span>
        <span className="badge bg-full">{counts.occ} ocupados</span>
        <span className="badge bg-resv">{counts.resv} reservados</span>
      </div>
    </div>
  );
  const headColor = cell.status==='free'?'var(--green-tx)':cell.status==='occupied'?'var(--red-tx)':'var(--blue-tx)';
  return (
    <div className="fade" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center' }}>
        <div><div className="t-hero" style={{ fontSize:48, color:headColor }}>{cell.label}</div>
          <div className="t-small" style={{ color:'var(--t2)', marginTop:2 }}>{cell.zone==='M'?'Zona M':cell.zone==='V'?'Zona V':'Zona '+cell.zone} · {BO.TYPE_LABEL[cell.type]}</div></div>
        <div style={{ marginLeft:'auto' }}><Badge status={cell.status}/></div>
      </div>
      <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        {cell.status==='free' && (<>
          <div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:12 }}>Registrar entrada</div>
          <Field big ph="Placa del vehículo" value={plate} onChange={v=>setPlate(v.replace(/[^A-Z0-9]/g,'').slice(0,6))} upper autoFocus/>
          <div style={{ margin:'18px 0 10px' }} className="t-small">Tipo de vehículo</div>
          <TypeSelect value={vtype} onChange={setVtype}/>
          <div style={{ marginTop:18 }} className="t-small">Observaciones (opcional)</div>
          <div className="input" style={{ height:'auto', alignItems:'flex-start', padding:'12px 14px', marginTop:8 }}>
            <textarea rows="2" placeholder="Notas del ingreso…" style={{ resize:'none' }}/></div>
        </>)}
        {cell.status==='occupied' && (<>
          <div style={{ background:'var(--elevated)', borderRadius:18, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Icon n={cell.type==='moto'?'moto':'car'} s={30} c="var(--t2)"/>
              <span className="t-h1 mono">{BO.fmtPlate(cell.plate)}</span>
              {BO.loyaltyByPlate[cell.plate] && <span className="badge" style={{ background:BO.TIER_COLOR[BO.loyaltyByPlate[cell.plate]], color:'#fff', marginLeft:'auto' }}><Icon n="bolt" s={12} c="#fff"/>{BO.loyaltyByPlate[cell.plate]}</span>}
              <span className="badge bg-info" style={{ marginLeft: BO.loyaltyByPlate[cell.plate]?0:'auto' }}>{BO.TYPE_LABEL[cell.type]}</span></div>
            {BO.loyaltyByPlate[cell.plate] && <div className="t-micro" style={{ color:'var(--t2)', marginTop:8 }}>Usuario {BO.loyaltyByPlate[cell.plate]} · descuento activo. Atención prioritaria.</div>}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)' }}>
              {[['Entrada', 'Hoy '+(cell.since!=null?'1:30 PM':'—')],['Tiempo', null],['Zona', cell.zone],['Espacio', cell.label]].map(([l,v],i)=>(
                <div key={i}><div className="t-micro upper" style={{ color:'var(--t3)' }}>{l}</div>
                  <div className="t-h3" style={{ marginTop:3, color:i===1?'var(--lime-deep)':'var(--t1)' }}>{i===1?<LiveTimer fromMin={Math.floor((cell.since||40)/60)*60+(cell.since||40)%60}/>:v}</div></div>
              ))}
            </div>
          </div>
          {BO.corporateByPlate[cell.plate] && (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--blue-bg)', border:'1px solid var(--blue-tint)', borderRadius:14, padding:'12px 14px', marginTop:14 }}>
              <Icon n="grid" s={20} c="var(--blue-tx)"/>
              <div><div className="t-small" style={{ fontWeight:600, color:'var(--blue-tx)' }}>Vehículo corporativo · {BO.corporateByPlate[cell.plate]}</div>
                <div className="t-micro" style={{ color:'var(--blue-tx)' }}>Facturación automática a la empresa. No cobrar en sitio.</div></div>
            </div>
          )}
          <AIInsightCard style={{ marginTop:14 }} body={`Tiempo promedio en este espacio: 1h 20min. Este vehículo va dentro del rango habitual.`}/>
        </>)}
        {cell.status==='reserved' && (<>
          <div style={{ background:'var(--elevated)', borderRadius:18, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>LM</div>
              <div><div className="t-h3">{cell.resv.user}</div><div className="t-micro mono" style={{ color:'var(--t3)' }}>{cell.resv.code}</div></div></div>
            <div style={{ display:'flex', gap:10, marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)' }}>
              <div style={{ flex:1 }}><div className="t-micro upper" style={{ color:'var(--t3)' }}>Ventana</div><div className="t-h3" style={{ marginTop:3 }}>{cell.resv.time} – 4:30 PM</div></div>
              <div><div className="t-micro upper" style={{ color:'var(--t3)' }}>Vehículo</div><div className="t-h3 mono" style={{ marginTop:3 }}>{BO.fmtPlate(cell.plate)}</div></div>
            </div>
            <div style={{ marginTop:12, display:'inline-flex', alignItems:'center', gap:6, color:'var(--yellow-tx)', fontSize:13, fontWeight:600 }}><Icon n="clock" s={16} c="var(--yellow-tx)"/>Llega en ~{cell.resv.eta} min</div>
          </div>
        </>)}
      </div>
      {/* footer */}
      <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)' }}>
        {cell.status==='free' && <button className="btn btn-primary btn-lg btn-block" disabled={plate.length<3} onClick={()=>onEntry(cell, plate)}>Registrar Entrada</button>}
        {cell.status==='occupied' && <button className="btn btn-green btn-lg btn-block" onClick={()=>onExit(cell)}><Icon n="logout" s={19} c="var(--green-tx)"/>Registrar Salida</button>}
        {cell.status==='reserved' && <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button className="btn btn-primary btn-lg btn-block" onClick={()=>openModal({ type:'qr' })}><Icon n="qr" s={19} c="var(--ink)"/>Escanear QR de llegada</button>
          <button className="btn btn-ghost btn-block" onClick={()=>onEntry(cell, BO.fmtPlate(cell.plate))}>Entrada manual</button></div>}
      </div>
    </div>
  );
}

Object.assign(window.BO_PAGES, { login:Login, dashboard:Dashboard, mapa:Mapa });
window.ZoneGrid = ZoneGrid;
