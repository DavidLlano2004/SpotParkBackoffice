/* adm-shell.jsx — SpotPark Admin shell: context, sidebar, topbar, shared bits. */
const { useState:sS, useEffect:sE, useRef:sR, useCallback:sCb, createContext:sCtx, useContext:sUse } = React;

const ADMCtx = sCtx(null);
const useADM = () => sUse(ADMCtx);

/* ── route → breadcrumb + title meta ── */
const ROUTES = {
  dashboard:   { title:'Dashboard', crumb:['Dashboard'] },
  parqueaderos:{ title:'Parqueaderos', crumb:['Parqueaderos'] },
  nuevo:       { title:'Nuevo parqueadero', crumb:['Parqueaderos','Nuevo'] },
  parking:     { title:'Parqueadero', crumb:['Parqueaderos','Detalle'] },
  espacios:    { title:'Espacios', crumb:['Parqueaderos','Detalle','Espacios'] },
  trabajadores:{ title:'Trabajadores', crumb:['Trabajadores'] },
  trabajador:  { title:'Trabajador', crumb:['Trabajadores','Detalle'] },
  turnos:      { title:'Turnos', crumb:['Trabajadores','Turnos'] },
  notificaciones:{ title:'Notificaciones', crumb:['Notificaciones'] },
  usuarios:    { title:'Usuarios', crumb:['Usuarios app'] },
  usuario:     { title:'Usuario', crumb:['Usuarios app','Detalle'] },
  reportes:    { title:'Reportes', crumb:['Reportes'] },
  tarifas:     { title:'Tarifas', crumb:['Tarifas'] },
  incidentes:  { title:'Incidentes', crumb:['Incidentes'] },
  empresas:    { title:'Empresas', crumb:['Empresa','Empresas'] },
  ajustes:     { title:'Ajustes', crumb:['Ajustes'] },
};

/* ── Sidebar (ink, full labels, groups, role-aware) ── */
function AdmSidebar() {
  const { route, go, role, setRole, openModal } = useADM();
  const unread = ADM.totals.openIncidents;
  const groups = [
    { label:'General', items:[
      { k:'dashboard', ic:'grid', label:'Dashboard' },
      { k:'reportes', ic:'trendUp', label:'Reportes' },
    ]},
    { label:'Operaciones', items:[
      { k:'parqueaderos', ic:'layers', label:'Parqueaderos' },
      { k:'espacios', ic:'qr', label:'Espacios' },
      { k:'tarifas', ic:'ticket', label:'Tarifas' },
    ]},
    { label:'Equipo', items:[
      { k:'trabajadores', ic:'shield', label:'Trabajadores' },
      { k:'turnos', ic:'cal', label:'Turnos' },
      { k:'usuarios', ic:'user', label:'Usuarios app' },
      { k:'incidentes', ic:'warning', label:'Incidentes', badge:unread },
    ]},
    { label:'Empresa', sup:true, items:[
      { k:'empresas', ic:'home', label:'Empresas', lock:role!=='super' },
    ]},
    { label:'Config', items:[
      { k:'ajustes', ic:'cog', label:'Ajustes' },
    ]},
  ];
  const Item = ({ it, sup }) => {
    const active = route===it.k || (it.k==='parqueaderos'&&(route==='parking'||route==='nuevo')) || (it.k==='trabajadores'&&route==='trabajador') || (it.k==='usuarios'&&route==='usuario');
    const locked = it.lock;
    return (
      <button onClick={()=> locked ? openModal({ type:'denied' }) : go(it.k)} style={{
        position:'relative', display:'flex', alignItems:'center', gap:11, width:'100%', height:42, padding:'0 12px',
        borderRadius:12, border:'none', cursor:'pointer', textAlign:'left', marginBottom:2,
        background: active?(sup?'rgba(198,242,78,.14)':'rgba(198,242,78,.12)'):'transparent',
        transition:'background .15s' }}
        onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,.05)'; }}
        onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}>
        {active && <span style={{ position:'absolute', left:0, top:9, bottom:9, width:3, borderRadius:3, background:'var(--lime)' }}/>}
        <Icon n={it.ic} s={19} c={active?'var(--lime)':'rgba(255,255,255,.5)'}/>
        <span style={{ fontSize:13.5, fontWeight: active?600:500, color: active?'#fff':'rgba(255,255,255,.62)', flex:1 }}>{it.label}</span>
        {it.badge>0 && <span className="tnum" style={{ minWidth:18, height:18, borderRadius:9, background:'var(--red)', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{it.badge}</span>}
        {locked && <Icon n="lock" s={13} c="rgba(255,255,255,.32)"/>}
      </button>
    );
  };
  return (
    <div style={{ width:236, flexShrink:0, background:'var(--ink)', display:'flex', flexDirection:'column', height:'100vh' }}>
      {/* brand */}
      <div style={{ padding:'18px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:11 }}>
        <div style={{ width:36, height:36, borderRadius:11, background:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}>
          <span style={{ color:'var(--ink)', fontFamily:'var(--display)', fontWeight:700, fontSize:20 }}>P</span></div>
        <div>
          <div style={{ color:'#fff', fontSize:15, fontWeight:600, fontFamily:'var(--display)' }}>SpotPark</div>
          <div style={{ color:'rgba(255,255,255,.4)', fontSize:10.5, marginTop:1 }}>Panel Administrativo</div>
        </div>
      </div>
      {/* nav */}
      <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'12px 12px' }}>
        {groups.map(g=>(
          (g.sup && role!=='super') ? null : (
          <div key={g.label} style={{ marginBottom:14 }}>
            <div className="t-micro upper" style={{ color: g.sup?'rgba(198,242,78,.55)':'rgba(255,255,255,.28)', padding:'0 12px', marginBottom:6, fontSize:10 }}>{g.label}</div>
            {g.items.map(it=><Item key={it.k} it={it} sup={g.sup}/>)}
          </div>)
        ))}
      </div>
      {/* profile */}
      <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:12, background:'rgba(255,255,255,.04)' }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--lime)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>{ADM.admin.init}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:'#fff', fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ADM.admin.name}</div>
            <RoleBadge role={role}/>
          </div>
          <button onClick={()=>openModal({ type:'confirm', title:'Cerrar sesión', desc:'¿Seguro que deseas salir del panel?', confirm:'Cerrar sesión', danger:true, onConfirm:()=>go('login') })}
            style={{ width:30, height:30, borderRadius:9, border:'none', cursor:'pointer', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.08)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <Icon n="logout" s={16} c="rgba(255,255,255,.5)"/></button>
        </div>
        {/* dev role switch */}
        <button onClick={()=>setRole(role==='super'?'parking':'super')} style={{ width:'100%', marginTop:8, height:30, borderRadius:9, border:'1px dashed rgba(255,255,255,.16)', background:'transparent', color:'rgba(255,255,255,.4)', fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'var(--font)' }}>
          Cambiar a {role==='super'?'Admin de parqueadero':'Super Admin'}
        </button>
      </div>
    </div>
  );
}

function RoleBadge({ role, big }) {
  const sup = role==='super';
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, height:big?22:17, padding:'0 8px', borderRadius:100,
    fontSize:big?11.5:10, fontWeight:600, marginTop:big?0:2,
    background: sup?'var(--lime-tint)':'var(--blue-bg)', color: sup?'var(--lime-deep)':'var(--blue-tx)' }}>
    <span style={{ width:5, height:5, borderRadius:'50%', background: sup?'var(--lime-deep)':'var(--blue-tx)' }}/>
    {sup?'Super Admin':'Administrador'}</span>;
}

/* ── TopBar (breadcrumb + search + bell + avatar) ── */
function AdmTopBar() {
  const { route, go, ctx } = useADM();
  const meta = ROUTES[route] || { crumb:[] };
  let crumb = meta.crumb;
  if ((route==='parking'||route==='espacios') && ctx?.parking) {
    crumb = route==='espacios' ? ['Parqueaderos', ctx.parking.short, 'Espacios'] : ['Parqueaderos', ctx.parking.short];
  }
  if (route==='trabajador' && ctx?.worker) crumb = ['Trabajadores', ctx.worker.name];
  if (route==='usuario' && ctx?.user) crumb = ['Usuarios app', ctx.user.name];
  return (
    <div style={{ height:56, flexShrink:0, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 22px', gap:14, background:'var(--bg)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
        {crumb.map((c,i)=>(
          <React.Fragment key={i}>
            {i>0 && <span style={{ color:'var(--t4)', fontSize:13 }}>/</span>}
            <span onClick={i===0?()=>go(crumb.length>1&&route!=='dashboard'?(c==='Parqueaderos'?'parqueaderos':c==='Trabajadores'?'trabajadores':c==='Usuarios app'?'usuarios':route):route):undefined}
              style={{ fontSize:13.5, fontWeight: i===crumb.length-1?600:500, color: i===crumb.length-1?'var(--t1)':'var(--t2)', cursor:i<crumb.length-1?'pointer':'default', whiteSpace:'nowrap' }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
        <div className="input" style={{ height:38, width:248, borderRadius:11 }}>
          <Icon n="search" s={17} c="var(--t3)"/>
          <input placeholder="Buscar parqueadero, trabajador…" style={{ fontSize:13 }}/>
          <span style={{ fontSize:11, color:'var(--t3)', border:'1px solid var(--border)', borderRadius:6, padding:'1px 6px', fontWeight:600 }}>⌘K</span>
        </div>
        <button onClick={()=>go('notificaciones')} style={{ position:'relative', width:38, height:38, borderRadius:11, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-card)' }}>
          <Icon n="bell" s={18} c="var(--t2)"/>
          <span style={{ position:'absolute', top:8, right:9, width:7, height:7, borderRadius:'50%', background:'var(--red)', border:'1.5px solid var(--surface)' }}/>
        </button>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:13 }}>{ADM.admin.init}</div>
      </div>
    </div>
  );
}

/* ── MetricCard ── */
function MetricCard({ ic, iconBg, iconColor, label, value, prefix, suffix, sub, subColor, trend, trendDir, ring, warn, delay=0 }) {
  const n = useCountUp(typeof value==='number'?value:0);
  const shown = typeof value==='number' ? (prefix||'')+n.toLocaleString('es-CO')+(suffix||'') : value;
  return (
    <div className="card rise-s" style={{ animationDelay:`${delay}s`, padding:16, border: warn?'1px solid rgba(232,133,30,.4)':'1px solid var(--border-card)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:iconBg||'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon n={ic} s={19} c={iconColor||'var(--ink)'}/></div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="t-micro upper" style={{ color:'var(--t3)', fontSize:10 }}>{label}</div>
          <div className="tnum" style={{ fontFamily:'var(--display)', fontWeight:700, fontSize:25, letterSpacing:'-0.02em', marginTop:3, lineHeight:1 }}>{shown}</div>
          {trend && <div style={{ display:'inline-flex', alignItems:'center', gap:3, marginTop:7, fontSize:12, fontWeight:600, color: trendDir==='down'?'var(--red)':'var(--green-tx)' }}>
            <Icon n={trendDir==='down'?'trendDown':'trendUp'} s={14} c={trendDir==='down'?'var(--red)':'var(--green)'}/>{trend}</div>}
          {sub && <div style={{ marginTop:6, fontSize:12, fontWeight:500, color: subColor||'var(--t3)' }}>{sub}</div>}
        </div>
        {ring!=null && <Ring pct={ring} size={48} sw={5}><span className="t-micro tnum" style={{ fontSize:12, fontWeight:700 }}>{Math.round(ring*100)}%</span></Ring>}
      </div>
    </div>
  );
}

/* ── StatChip ── */
function StatChip({ label, value, color }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border-card)', borderRadius:14, padding:'11px 16px', boxShadow:'var(--sh-card)' }}>
      <div className="t-micro upper" style={{ color:'var(--t3)', fontSize:10 }}>{label}</div>
      <div className="tnum" style={{ fontSize:19, fontWeight:700, fontFamily:'var(--display)', color:color||'var(--t1)', marginTop:2 }}>{value}</div>
    </div>
  );
}

/* ── SectionCard ── */
function Panel({ title, right, children, style, pad=18 }) {
  return (
    <div className="card" style={{ display:'flex', flexDirection:'column', ...style }}>
      {(title||right) && <div style={{ display:'flex', alignItems:'center', gap:10, padding:`${pad}px ${pad}px 0` }}>
        {title && <span className="t-h3" style={{ fontSize:15 }}>{title}</span>}
        <div style={{ marginLeft:'auto' }}>{right}</div>
      </div>}
      <div style={{ padding:pad }}>{children}</div>
    </div>
  );
}

/* ── status pill for parkings ── */
function ParkingStatus({ status }) {
  const map = { active:['bg-avail','Activo','var(--green)'], inactive:['','Inactivo','var(--t3)'], maintenance:['bg-few','Mantenimiento','var(--orange)'] };
  const [cls,l,c] = map[status]||map.inactive;
  return <span className={'badge '+cls} style={!cls?{ background:'var(--elevated)', color:'var(--t2)' }:null}><span className="dot" style={{ background:c }}/>{l}</span>;
}

/* ── Avatar ── */
function Avatar({ init, size=32, bg='var(--ink)', color='var(--lime)' }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:size*0.4, flexShrink:0 }}>{init}</div>;
}

/* ── simple Select ── */
function Select({ value, options, onChange, w }) {
  const [open,setOpen]=sS(false);
  const ref=sR(null);
  sE(()=>{ const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[]);
  const cur = options.find(o=>(o.v??o)===value);
  return (
    <div ref={ref} style={{ position:'relative', width:w }}>
      <button onClick={()=>setOpen(o=>!o)} className="input" style={{ height:38, width:'100%', cursor:'pointer', borderRadius:11 }}>
        <span style={{ flex:1, fontSize:13, color: value?'var(--t1)':'var(--t3)', textAlign:'left' }}>{cur?(cur.l??cur):'Todos'}</span>
        <Icon n="chevD" s={15} c="var(--t3)"/>
      </button>
      {open && <div className="card" style={{ position:'absolute', top:44, left:0, right:0, zIndex:40, boxShadow:'var(--sh-pop)', padding:6, maxHeight:260, overflowY:'auto' }}>
        {options.map(o=>{ const v=o.v??o, l=o.l??o; const on=v===value;
          return <button key={v} onClick={()=>{ onChange(v); setOpen(false); }} style={{ display:'flex', alignItems:'center', width:'100%', height:34, padding:'0 10px', borderRadius:8, border:'none', cursor:'pointer', background: on?'var(--lime-bg)':'transparent', color: on?'var(--lime-deep)':'var(--t1)', fontSize:13, fontWeight: on?600:500, textAlign:'left', fontFamily:'var(--font)' }}>{l}</button>;
        })}
      </div>}
    </div>
  );
}

Object.assign(window, { ADMCtx, useADM, ROUTES, AdmSidebar, AdmTopBar, RoleBadge, MetricCard, StatChip, Panel, ParkingStatus, Avatar, Select });
