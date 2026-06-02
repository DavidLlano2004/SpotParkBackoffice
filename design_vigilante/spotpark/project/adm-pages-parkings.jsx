/* adm-pages-parkings.jsx — Lista, Detalle (tabs), Espacios (ZoneEditor), Wizard. */
const { useState:pkS, useMemo:pkM, useEffect:pkE } = React;

const SERVICES = {
  vigilancia:['shield','Vigilancia 24h'], cctv:['cam','CCTV'], techado:['roof','Techado'],
  accesible:['access','Accesible'], lavado:['refresh','Lavado'], carga:['bolt','Carga eléctrica'],
  factura:['ticket','Factura electrónica'], suv:['car','SUV / Camionetas'], valet:['nav','Valet'],
  wifi:['share','WiFi'], baño:['info','Baño público'],
};
const PHOTO_TONE = { p1:'#1E3A2E', p2:'#23304A', p3:'#3A2A1E', p4:'#2A2A38', p5:'#1E3540', p6:'#33302A' };

/* striped placeholder cover */
function ParkingCover({ p, h=140, radius='18px 18px 0 0' }) {
  const tone = PHOTO_TONE[p.id]||'#22252E';
  return (
    <div style={{ position:'relative', height:h, borderRadius:radius, overflow:'hidden', background:tone }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:.5 }}>
        <defs><pattern id={'pk'+p.id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="rgba(255,255,255,.08)" strokeWidth="7"/></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#pk${p.id})`}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
        <Icon n="layers" s={26} c="rgba(255,255,255,.3)"/>
        <span className="mono" style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.08em' }}>foto · {p.short.toLowerCase()}</span>
      </div>
    </div>
  );
}

/* ───────── PARKING CARD ───────── */
function ParkingCard({ p, onOpen }) {
  const occCol = p.occ>0.9?'var(--red-tx)':p.occ>0.7?'var(--yellow-tx)':'var(--green-tx)';
  return (
    <div className="card rise-s" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative' }}>
        <ParkingCover p={p}/>
        <div style={{ position:'absolute', top:12, left:12 }}><ParkingStatus status={p.status}/></div>
        <button style={{ position:'absolute', top:12, right:12, width:30, height:30, borderRadius:9, border:'none', cursor:'pointer', background:'rgba(0,0,0,.55)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="dots" s={18} c="#fff"/></button>
      </div>
      <div style={{ padding:16, flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
          <div style={{ flex:1 }}>
            <div className="t-h3" style={{ fontSize:15.5 }}>{p.name}</div>
            <div className="t-small" style={{ color:'var(--t2)', display:'flex', alignItems:'center', gap:4, marginTop:3 }}><Icon n="pin" s={14} c="var(--t3)"/>{p.addr}, {p.city}</div>
            <div className="t-micro" style={{ color:'var(--t3)', marginTop:3 }}>{p.schedule}</div>
          </div>
          <ScoreGauge score={p.score} size={54}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:14 }}>
          {[['Espacios',p.cap,'var(--t1)'],['Ocupación',Math.round(p.occ*100)+'%',occCol],['Ingresos',ADM.COPk(p.rev),'var(--lime-deep)']].map(([l,v,c])=>(
            <div key={l} style={{ background:'var(--elevated)', borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
              <div className="t-micro upper" style={{ color:'var(--t3)', fontSize:9 }}>{l}</div>
              <div className="tnum" style={{ fontSize:14, fontWeight:700, color:c, marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12 }}><ProgressBar pct={p.occ}/></div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:13 }}>
          <span className="t-micro" style={{ color:'var(--t3)' }}>Vigilantes:</span>
          {p.workers.length? <div style={{ display:'flex' }}>{p.workers.slice(0,3).map((w,i)=><div key={i} style={{ width:24, height:24, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9.5, fontWeight:700, marginLeft:i?-7:0, border:'2px solid var(--surface)' }}>{w.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>)}{p.workers.length>3 && <span className="t-micro" style={{ color:'var(--t3)', marginLeft:6, alignSelf:'center' }}>+{p.workers.length-3}</span>}</div>
            : <span className="t-micro" style={{ color:'var(--t4)' }}>Sin asignar</span>}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={()=>onOpen(p)}>Ver detalles</button>
          <button className="btn btn-primary btn-sm" style={{ flex:1 }} onClick={()=>onOpen(p)}>Gestionar</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── LISTA ───────── */
function ParkingsList() {
  const { go } = useADM();
  const [view,setView]=pkS('cards');
  const [q,setQ]=pkS(''); const [status,setStatus]=pkS(''); const [city,setCity]=pkS('');
  const open=p=>go('parking',{ parking:p });
  const list=ADM.parkings.filter(p=>(!q||p.name.toLowerCase().includes(q.toLowerCase()))&&(!status||p.status===status)&&(!city||p.city===city));
  const T={ total:ADM.parkings.length, active:ADM.parkings.filter(p=>p.status==='active').length, inactive:ADM.parkings.filter(p=>p.status!=='active').length, cap:ADM.parkings.reduce((s,p)=>s+p.cap,0) };
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:18 }}>
        <h1 className="t-h1">Parqueaderos</h1>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={()=>go('nuevo')}><Icon n="plus" s={17} c="var(--ink)"/>Crear parqueadero</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        <StatChip label="Total" value={T.total}/><StatChip label="Activos" value={T.active} color="var(--green-tx)"/>
        <StatChip label="Inactivos" value={T.inactive} color="var(--t2)"/><StatChip label="Capacidad total" value={T.cap+' esp.'}/>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div className="input" style={{ height:38, width:240, borderRadius:11 }}><Icon n="search" s={17} c="var(--t3)"/><input placeholder="Buscar parqueadero…" value={q} onChange={e=>setQ(e.target.value)} style={{ fontSize:13 }}/></div>
        <Select value={status} w={150} options={[{v:'',l:'Estado: Todos'},{v:'active',l:'Activo'},{v:'inactive',l:'Inactivo'},{v:'maintenance',l:'Mantenimiento'}]} onChange={setStatus}/>
        <Select value={city} w={150} options={[{v:'',l:'Ciudad: Todas'},{v:'Manizales',l:'Manizales'},{v:'Pereira',l:'Pereira'}]} onChange={setCity}/>
        <div style={{ marginLeft:'auto', display:'flex', gap:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:11, padding:3, boxShadow:'var(--sh-card)' }}>
          {[['cards','grid'],['list','list']].map(([k,ic])=><button key={k} onClick={()=>setView(k)} style={{ width:34, height:30, borderRadius:8, border:'none', cursor:'pointer', background:view===k?'var(--ink)':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={ic} s={17} c={view===k?'var(--lime)':'var(--t3)'}/></button>)}
        </div>
      </div>
      {view==='cards'
        ? <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>{list.map(p=><ParkingCard key={p.id} p={p} onOpen={open}/>)}</div>
        : <div className="card" style={{ overflow:'hidden' }}><table className="tbl"><thead><tr><th>Parqueadero</th><th>Ciudad</th><th>Estado</th><th>Capacidad</th><th style={{ width:130 }}>Ocupación</th><th>Ingresos mes</th><th>Score</th><th></th></tr></thead>
            <tbody>{list.map(p=><tr key={p.id} className="row" onClick={()=>open(p)}>
              <td><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:36, height:36, borderRadius:9, overflow:'hidden', flexShrink:0 }}><ParkingCover p={p} h={36} radius="9px"/></div><span style={{ fontWeight:600 }}>{p.name}</span></div></td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{p.city}</td><td><ParkingStatus status={p.status}/></td>
              <td className="tnum">{p.cap}</td>
              <td><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ flex:1 }}><ProgressBar pct={p.occ}/></div><span className="t-micro tnum" style={{ width:30 }}>{Math.round(p.occ*100)}%</span></div></td>
              <td className="tnum" style={{ fontWeight:600 }}>{ADM.COPk(p.rev)}</td>
              <td><span className="tnum" style={{ fontWeight:700, color:p.score>=80?'var(--green-tx)':p.score>=60?'var(--yellow-tx)':'var(--red-tx)' }}>{p.score}</span></td>
              <td><Icon n="chevR" s={16} c="var(--t3)"/></td>
            </tr>)}</tbody></table></div>}
    </div>
  );
}

/* ───────── ZONE EDITOR (espacios) ───────── */
function ZoneEditor({ compact }) {
  const [zoneIdx,setZoneIdx]=pkS(0);
  const [sel,setSel]=pkS([]);
  const [addN,setAddN]=pkS(8); const [prefix,setPrefix]=pkS('A'); const [addType,setAddType]=pkS('car');
  const zones=BO.zones;
  const z=zones[zoneIdx];
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const counts=t=>z.cells.filter(c=>c.type===t).length;
  return (
    <div>
      {/* zone tabs */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {zones.map((zz,i)=><button key={zz.id} onClick={()=>{ setZoneIdx(i); setSel([]); }} style={{ height:38, padding:'0 15px', borderRadius:11, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8,
          background:i===zoneIdx?'var(--ink)':'var(--surface)', color:i===zoneIdx?'#fff':'var(--t2)', fontSize:13, fontWeight:600, boxShadow:i===zoneIdx?'none':'var(--sh-card)', fontFamily:'var(--font)' }}>
          {zz.name}<span style={{ fontSize:11, opacity:.7 }}>{zz.cells.length}</span></button>)}
        <button className="btn btn-ghost btn-sm"><Icon n="plus" s={16} c="var(--t1)"/>Agregar zona</button>
      </div>

      {/* zone header */}
      <div className="card" style={{ padding:16, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span className="t-h3" style={{ fontSize:16 }}>{z.name}</span>
          <Icon n="edit" s={15} c="var(--t3)" style={{ cursor:'pointer' }}/>
          <span className="t-small" style={{ color:'var(--t2)', marginLeft:6 }}>{z.cells.length} espacios · {z.cells.filter(c=>c.status==='free').length} libres · {z.cells.filter(c=>c.status==='occupied').length} ocupados</span>
          <div style={{ marginLeft:'auto', display:'flex', gap:7 }}>
            <TypeBadge t={z.type}/>
          </div>
        </div>
        {sel.length>0 && <div className="rise-s" style={{ display:'flex', alignItems:'center', gap:8, marginTop:14, paddingTop:14, borderTop:'1px solid var(--separator)', flexWrap:'wrap' }}>
          <span className="t-small" style={{ fontWeight:600 }}>{sel.length} seleccionados</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>setSel([])}>Deseleccionar</button>
          <button className="btn btn-ghost btn-sm">Fuera de servicio</button>
          <button className="btn btn-ghost btn-sm">Marcar disponible</button>
          <button className="btn btn-danger btn-sm" style={{ height:36 }}><Icon n="trash" s={15} c="var(--red)"/>Eliminar</button>
        </div>}
      </div>

      {/* bulk add */}
      <div className="card" style={{ padding:16, marginBottom:14, background:'var(--lime-bg)', border:'1px solid var(--lime-tint)' }}>
        <div className="t-micro upper" style={{ color:'var(--lime-deep)', marginBottom:12 }}>Agregar espacios en lote</div>
        <div style={{ display:'flex', gap:12, alignItems:'flex-end', flexWrap:'wrap' }}>
          <Stepper label="Cantidad" value={addN} setValue={setAddN} min={1} max={50}/>
          <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>Prefijo</div><div className="input" style={{ height:40, width:90 }}><input value={prefix} onChange={e=>setPrefix(e.target.value.toUpperCase())} style={{ fontSize:14, fontWeight:600 }}/></div></div>
          <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>Tipo</div><div style={{ width:230 }}><TypeSelect value={addType} onChange={setAddType}/></div></div>
          <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={16} c="var(--ink)"/>Agregar {addN} espacios</button>
        </div>
      </div>

      {/* grid */}
      <div className="card" style={{ padding:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))', gap:10 }}>
          {z.cells.map(c=><SpaceCell key={c.id} cell={c} selected={sel.includes(c.id)} onClick={()=>toggle(c.id)}/>)}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
          {[['Carros',counts('car'),'var(--lime-deep)'],['Motos',counts('moto'),'var(--green-tx)'],['Bicis',counts('bike'),'var(--blue-tx)'],['Fuera de servicio',z.cells.filter(c=>c.status==='disabled').length,'var(--t2)']].map(([l,v,c])=>(
            <span key={l} style={{ display:'inline-flex', alignItems:'center', gap:6, height:28, padding:'0 12px', borderRadius:100, background:'var(--elevated)', fontSize:12, fontWeight:600 }}><span className="tnum" style={{ color:c }}>{v}</span><span style={{ color:'var(--t2)' }}>{l}</span></span>
          ))}
        </div>
      </div>
    </div>
  );
}
function TypeBadge({ t }) {
  const m={ car:['🚗','Carros'], moto:['🏍️','Motos'], bike:['🚲','Bicicletas'], mixed:['🅿️','Mixta'] };
  const [e,l]=m[t]||m.car;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:6, height:28, padding:'0 12px', borderRadius:100, background:'var(--lime-tint)', color:'var(--lime-deep)', fontSize:12, fontWeight:600 }}>{e} {l}</span>;
}
function Stepper({ label, value, setValue, min=0, max=99 }) {
  return <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>{label}</div>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <button onClick={()=>setValue(Math.max(min,value-1))} style={{ width:34, height:40, borderRadius:10, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer' }}><Icon n="minus" s={16} c="var(--t2)"/></button>
      <div className="tnum" style={{ width:46, textAlign:'center', fontSize:18, fontWeight:700, fontFamily:'var(--display)' }}>{value}</div>
      <button onClick={()=>setValue(Math.min(max,value+1))} style={{ width:34, height:40, borderRadius:10, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer' }}><Icon n="plus" s={16} c="var(--t2)"/></button>
    </div></div>;
}

function EspaciosPage() {
  const { ctx } = useADM();
  const p=ctx?.parking||ADM.parkings[0];
  return <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
    <div style={{ display:'flex', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
      <div><h1 className="t-h1">Espacios</h1><p className="t-small" style={{ color:'var(--t3)', marginTop:3 }}>{p.name} · {p.cap} espacios</p></div>
      <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
        <button className="btn btn-ghost btn-sm"><Icon n="download" s={16} c="var(--t1)"/>Importar CSV</button>
        <button className="btn btn-primary btn-sm"><Icon n="plus" s={16} c="var(--ink)"/>Agregar espacios</button>
      </div>
    </div>
    <ZoneEditor/>
  </div>;
}

Object.assign(window, { SERVICES, ParkingCover, ParkingCard, ZoneEditor, TypeBadge, Stepper });
Object.assign(window.ADM_PAGES, { parqueaderos:ParkingsList, espacios:EspaciosPage });
