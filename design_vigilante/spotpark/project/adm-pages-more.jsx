/* adm-pages-more.jsx — Reportes, Tarifas, Incidentes, Empresas, Ajustes. */
const { useState:moS } = React;

/* ───────── REPORTES ───────── */
function Reportes() {
  const { go } = useADM();
  const [range,setRange]=moS('mes');
  const [view,setView]=moS('general');
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:18, gap:12, flexWrap:'wrap' }}>
        <h1 className="t-h1">Reportes</h1>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <Select value="" w={190} options={[{v:'',l:'Todos los parqueaderos'},...ADM.parkings.map(p=>({v:p.id,l:p.short}))]} onChange={()=>{}}/>
          <DateRange value={range} onChange={setRange}/>
          <button className="btn btn-ghost btn-sm"><Icon n="download" s={15} c="var(--t1)"/>PDF</button>
          <button className="btn btn-ghost btn-sm"><Icon n="download" s={15} c="var(--t1)"/>Excel</button>
        </div>
      </div>
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--border)', marginBottom:18 }}>
        {[['general','Vista general'],['comparar','Comparar'],['proyecciones','Proyecciones']].map(([k,l])=><button key={k} onClick={()=>setView(k)} style={{ height:38, padding:'0 14px', border:'none', background:'none', cursor:'pointer', fontSize:13.5, fontWeight:600, color:view===k?'var(--t1)':'var(--t3)', borderBottom:view===k?'2px solid var(--lime-deep)':'2px solid transparent', marginBottom:-1, fontFamily:'var(--font)' }}>{l}</button>)}
      </div>
      {view==='comparar' && <ComparisonMode/>}
      {view==='proyecciones' && <Projections/>}
      {view==='general' && <React.Fragment>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
        <MetricCard ic="card" iconBg="var(--green-bg)" iconColor="var(--green-tx)" label="Ingresos" value={ADM.totals.rev} prefix="$" trend="12%" trendDir="up"/>
        <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas" value={ADM.totals.reservas} trend="8%" trendDir="up"/>
        <MetricCard ic="layers" iconBg="var(--lime-bg)" iconColor="var(--lime-deep)" label="Ocupación media" value={Math.round(ADM.totals.occ*100)} suffix="%"/>
        <MetricCard ic="car" iconBg="var(--elevated)" label="Vehículos únicos" value={1284}/>
      </div>
      <Panel title="Ingresos por día" style={{ marginBottom:14 }} right={<span className="t-micro" style={{ color:'var(--t3)' }}>Mayo 2025</span>}>
        <AreaChart data={ADM.revenueDaily.filter((_,i)=>i%2===0).map((d)=>({ label:d.day%6===1?String(d.day):'', value:d.value }))} fmt={v=>ADM.COPk(v)} h={230} showDots={false}/>
      </Panel>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <Panel title="Tipo de vehículo">
          <BarChart data={ADM.parkings.filter(p=>p.status==='active').map(p=>({ label:p.short.slice(0,8), value:p.split.car+p.split.moto+p.split.bike }))} h={190} colorFn={()=>'var(--lime-deep)'}/>
        </Panel>
        <Panel title="Horas pico" right={<span className="t-micro" style={{ color:'var(--t3)' }}>Pico 8–9 AM</span>}>
          <BarChart data={ADM.peakHours.map(d=>({ label:d.hour%6===0?String(d.hour):null, value:d.value }))} h={190} colorFn={(v,max)=>v>max*0.75?'var(--red)':v>max*0.45?'var(--yellow)':'var(--blue)'}/>
        </Panel>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:14, marginBottom:14 }}>
        <Panel title="Mapa de calor semanal"><AdmHeatmap cell={22}/></Panel>
        <Panel title="Ingresos por parqueadero">
          {ADM.parkings.filter(p=>p.status==='active').sort((a,b)=>b.rev-a.rev).map((p,i)=>{ const pct=p.rev/ADM.totals.rev;
            return <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:i<4?'1px solid var(--separator)':'none' }}>
              <span className="tnum" style={{ width:18, color:'var(--t3)', fontWeight:700 }}>{i+1}</span>
              <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>{p.short}</div><div style={{ marginTop:4 }}><ProgressBar pct={pct} color="var(--lime-deep)" colorByPct={false}/></div></div>
              <span className="t-small tnum" style={{ fontWeight:600, width:48, textAlign:'right' }}>{Math.round(pct*100)}%</span>
            </div>; })}
        </Panel>
      </div>
      <div className="card" style={{ position:'relative', overflow:'hidden', background:'var(--lime-bg)', border:'1px solid var(--lime-tint)', padding:'18px 20px' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--lime)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}><Icon n="sparkle" s={18} c="var(--lime-deep)"/><span style={{ fontSize:14.5, fontWeight:600, color:'var(--lime-deep)' }}>SpotPark AI · Insights del periodo</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }}><Icon n="refresh" s={15} c="var(--t1)"/>Actualizar análisis</button></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, borderTop:'1px solid var(--lime-tint)', marginTop:14, paddingTop:16 }}>
          {[['Crecimiento','C.C. Fundadores lidera con $14.2M (+9%). Mantiene 89% de ocupación promedio.'],['Atención','La Estación lleva 6 días en mantenimiento. Cada día inactivo cuesta ~$320K en ingresos.'],['Recomendación','Replica la estrategia de precios dinámicos de Cable Plaza en Terminal para subir ~12% de ingresos.']].map(([t,b],i)=>(
            <div key={t} className="fade" style={{ animationDelay:`${0.1+i*0.1}s` }}><div className="t-micro upper" style={{ color:'var(--lime-deep)', fontSize:10, marginBottom:6 }}>{t}</div><p className="t-small" style={{ margin:0, lineHeight:1.5 }}>{b}</p></div>
          ))}
        </div>
      </div>
      </React.Fragment>}
    </div>
  );
}

/* ───────── TARIFAS ───────── */
function Tarifas() {
  const { go } = useADM();
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:18 }}>
        <h1 className="t-h1">Tarifas</h1>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={17} c="var(--ink)"/>Nueva plantilla</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {ADM.parkings.filter(p=>p.status!=='maintenance').map(p=>{ const t=ADM.tarifaFor(p);
            return <div key={p.id} className="card" style={{ padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, overflow:'hidden', flexShrink:0 }}><ParkingCover p={p} h={34} radius="9px"/></div>
                <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:700 }}>{p.short}</div><div className="t-micro" style={{ color:'var(--t3)' }}>Actualizado hace 3 días</div></div>
                {p.dynamic && <span className="badge bg-resv"><Icon n="bolt" s={12} c="var(--blue-tx)"/>Dinámico</span>}
              </div>
              <table style={{ width:'100%', fontSize:13 }}><tbody>
                {[['🚗 Carro',t.car.hour],['🏍️ Moto',t.moto.hour],['🚲 Bici',t.bike.hour]].map(([l,v])=>(
                  <tr key={l}><td style={{ padding:'5px 0', color:'var(--t2)' }}>{l}</td><td className="tnum" style={{ textAlign:'right', fontWeight:600 }}>{ADM.COP(v)}/h</td></tr>
                ))}
              </tbody></table>
              <button className="btn btn-ghost btn-sm" style={{ width:'100%', marginTop:12 }} onClick={()=>go('parking',{ parking:p })}>Editar tarifas</button>
            </div>; })}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <AIInsightCard title="SpotPark AI · Precios sugeridos" body="El parqueadero Terminal tiene 40% de ocupación los miércoles. Reducir el precio de $3.000 a $2.000 podría aumentar la ocupación ~25% según datos históricos similares." action={<div style={{ display:'flex', gap:8, marginTop:12 }}><button className="btn btn-primary btn-sm">Aplicar sugerencia</button><button className="btn btn-ghost btn-sm">Ver análisis</button></div>}/>
          <Panel title="Aplicar plantilla a varios">
            <p className="t-small" style={{ color:'var(--t2)', margin:'0 0 12px' }}>Crea una plantilla de precios y aplícala a varios parqueaderos a la vez.</p>
            <button className="btn btn-ghost btn-sm" style={{ width:'100%' }}><Icon n="layers" s={16} c="var(--t1)"/>Gestionar plantillas</button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ───────── INCIDENTES ───────── */
const INC_TYPE={ damage:['warning','var(--red)'], billing:['card','var(--blue)'], space:['grid','var(--orange)'], service:['info','var(--yellow-tx)'] };
function Incidentes() {
  const [sel,setSel]=moS(null);
  const [st,setSt]=moS('');
  const list=ADM.incidents.filter(i=>!st||i.status===st);
  const T={ open:ADM.incidents.filter(i=>i.status==='open').length, review:ADM.incidents.filter(i=>i.status==='review').length, resolved:ADM.incidents.filter(i=>i.status==='resolved').length };
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <h1 className="t-h1" style={{ marginBottom:16 }}>Incidentes</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        <StatChip label="Abiertos" value={T.open} color="var(--red-tx)"/><StatChip label="En revisión" value={T.review} color="var(--yellow-tx)"/>
        <StatChip label="Resueltos (mes)" value={T.resolved} color="var(--green-tx)"/><StatChip label="Tiempo prom. resolución" value="4.2h"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <Select value={st} w={160} options={[{v:'',l:'Estado: Todos'},{v:'open',l:'Abierto'},{v:'review',l:'En revisión'},{v:'resolved',l:'Resuelto'}]} onChange={setSt}/>
        <Select value="" w={180} options={[{v:'',l:'Parqueadero: Todos'},...ADM.parkings.map(p=>({v:p.id,l:p.short}))]} onChange={()=>{}}/>
        <Select value="" w={150} options={[{v:'',l:'Prioridad: Todas'},'Alta','Media','Baja']} onChange={()=>{}}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: sel?'1.4fr 1fr':'1fr', gap:14 }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl"><thead><tr><th>ID</th><th>Tipo</th><th>Parqueadero</th><th>Placa</th><th>Prioridad</th><th>Estado</th><th>Asignado</th></tr></thead>
            <tbody>{list.map(i=>{ const [ic,c]=INC_TYPE[i.type]||['info','var(--t2)']; const P=ADM.PRIO[i.prio];
              return <tr key={i.id} className="row" onClick={()=>setSel(i)} style={sel?.id===i.id?{ background:'var(--lime-bg)' }:null}>
                <td className="mono" style={{ fontSize:12, color:'var(--t2)' }}>{i.id}</td>
                <td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Icon n={ic} s={16} c={c}/><span className="t-small" style={{ fontWeight:600 }}>{i.tl}</span></div></td>
                <td className="t-small" style={{ color:'var(--t2)' }}>{i.parking}</td>
                <td className="mono" style={{ fontSize:12.5 }}>{i.plate}</td>
                <td><span className={'badge '+P.cls}>{P.l}</span></td>
                <td><IncStatus s={i.status}/></td>
                <td>{i.assigned? <div style={{ display:'flex', alignItems:'center', gap:6 }}><Avatar init={i.ai} size={24}/><span className="t-micro" style={{ color:'var(--t2)' }}>{i.assigned.split(' ')[0]}</span></div> : <span className="t-micro" style={{ color:'var(--t4)' }}>Sin asignar</span>}</td>
              </tr>; })}</tbody></table>
        </div>
        {sel && <IncidentPanel i={sel} onClose={()=>setSel(null)}/>}
      </div>
    </div>
  );
}
function IncStatus({ s }) {
  const m={ open:['bg-full','Abierto','var(--red)'], review:['bg-few','En revisión','var(--orange)'], resolved:['bg-avail','Resuelto','var(--green)'] };
  const [cls,l,c]=m[s]||m.open;
  return <span className={'badge '+cls}><span className="dot" style={{ background:c }}/>{l}</span>;
}
function IncidentPanel({ i, onClose }) {
  const [ic,c]=INC_TYPE[i.type]||['info','var(--t2)'];
  return (
    <div className="card rise-s" style={{ padding:18, alignSelf:'flex-start', position:'sticky', top:0 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={ic} s={19} c={c}/></div>
        <div style={{ flex:1 }}><div className="t-h3" style={{ fontSize:15 }}>{i.tl}</div><div className="mono t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{i.id}</div></div>
        <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, border:'none', cursor:'pointer', background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="x" s={16} c="var(--t2)"/></button>
      </div>
      <p className="t-small" style={{ color:'var(--t2)', lineHeight:1.55, margin:'14px 0' }}>{i.desc}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        {[['Parqueadero',i.parking],['Espacio',i.space],['Placa',i.plate],['Reportado',i.when]].map(([l,v])=>(
          <div key={l}><div className="t-micro upper" style={{ color:'var(--t3)', fontSize:9.5 }}>{l}</div><div className="t-small" style={{ fontWeight:600, marginTop:2 }}>{v}</div></div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid var(--separator)', paddingTop:14 }}>
        <div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:8 }}>Prioridad</div>
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>{['alta','media','baja'].map(pr=><button key={pr} style={{ flex:1, height:34, borderRadius:9, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'var(--font)', background:i.prio===pr?'var(--ink)':'var(--surface)', color:i.prio===pr?'#fff':'var(--t2)', border:i.prio===pr?'none':'1px solid var(--border)' }}>{ADM.PRIO[pr].l}</button>)}</div>
        <div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:8 }}>Asignar a</div>
        <div className="input" style={{ height:42, cursor:'pointer', marginBottom:14 }}><Icon n="user" s={17} c="var(--t3)"/><span style={{ flex:1, fontSize:13 }}>{i.assigned||'Sin asignar'}</span><Icon n="chevD" s={15} c="var(--t3)"/></div>
        <div style={{ display:'flex', gap:8 }}><button className="btn btn-ghost btn-sm" style={{ flex:1 }}>Notas internas</button><button className="btn btn-primary btn-sm" style={{ flex:1 }}>Marcar resuelto</button></div>
      </div>
    </div>
  );
}

/* ───────── EMPRESAS (super admin) ───────── */
function Empresas() {
  const { role } = useADM();
  if (role!=='super') return <AccessDenied/>;
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <h1 className="t-h1">Empresas</h1><RoleBadge role="super" big/>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={17} c="var(--ink)"/>Nueva empresa</button>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl"><thead><tr><th>Empresa</th><th>NIT</th><th>Contacto</th><th>Parqueaderos</th><th>Empleados</th><th>Facturación mensual</th><th>Estado</th><th></th></tr></thead>
          <tbody>{ADM.companies.map(c=>(
            <tr key={c.id} className="row">
              <td><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:34, height:34, borderRadius:9, background:'var(--lime-tint)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--lime-deep)', fontSize:13, fontFamily:'var(--display)' }}>{c.name[0]}</div><span style={{ fontWeight:600 }}>{c.name}</span></div></td>
              <td className="mono t-small" style={{ color:'var(--t2)' }}>{c.nit}</td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{c.contact}</td>
              <td className="tnum">{c.parkings}</td><td className="tnum">{c.employees}</td>
              <td className="tnum" style={{ fontWeight:600 }}>{c.billing?ADM.COP(c.billing):'—'}</td>
              <td>{c.status==='active'?<span className="badge bg-avail"><span className="dot" style={{ background:'var(--green)' }}/>Activa</span>:<span className="badge" style={{ background:'var(--elevated)', color:'var(--t2)' }}>Inactiva</span>}</td>
              <td><Icon n="chevR" s={16} c="var(--t3)"/></td>
            </tr>))}</tbody></table>
      </div>
    </div>
  );
}
function AccessDenied() {
  const { setRole } = useADM();
  return <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
    <div style={{ width:64, height:64, borderRadius:18, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="lock" s={28} c="var(--t3)"/></div>
    <div className="t-h2">Acceso restringido</div>
    <p className="t-body" style={{ color:'var(--t2)', textAlign:'center', maxWidth:340 }}>Esta sección es exclusiva para Super Admin. Tu rol actual es Administrador de parqueadero.</p>
    <button className="btn btn-primary btn-sm" onClick={()=>setRole('super')}>Cambiar a Super Admin</button>
  </div>;
}

/* ───────── AJUSTES ───────── */
function Ajustes() {
  const [n1,setN1]=moS(true); const [n2,setN2]=moS(true); const [n3,setN3]=moS(false); const [tfa,setTfa]=moS(false);
  const Row=({ title, desc, on, set })=>(
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid var(--separator)' }}>
      <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>{title}</div><div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{desc}</div></div><Toggle on={on} onChange={set}/></div>
  );
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        <h1 className="t-h1" style={{ marginBottom:18 }}>Ajustes</h1>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Panel title="Perfil de administrador">
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}><Avatar init={ADM.admin.init} size={56}/><div><div className="t-h3" style={{ fontSize:16 }}>{ADM.admin.name}</div><RoleBadge role="super"/></div><button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }}>Editar</button></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Labeled label="Correo"><Field ic="mail" value={ADM.admin.email} onChange={()=>{}}/></Labeled>
              <Labeled label="Teléfono"><Field ic="phone" value={ADM.admin.phone} onChange={()=>{}}/></Labeled>
            </div>
          </Panel>
          <Panel title="Notificaciones">
            <Row title="Alertas de incidentes críticos" desc="Email + push inmediato" on={n1} set={setN1}/>
            <Row title="Reporte diario automático" desc="Resumen cada día a las 7:00 AM" on={n2} set={setN2}/>
            <Row title="Alertas de ocupación crítica (>95%)" desc="Por parqueadero, en tiempo real" on={n3} set={setN3}/>
          </Panel>
          <Panel title="Integraciones">
            {[['Google Maps','Conectado',true],['Wompi / PSE','Conectado',true],['Firebase (notificaciones)','Conectado',true],['Socket.io','Error de conexión',false]].map(([l,s,ok],i)=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:i<3?'1px solid var(--separator)':'none' }}>
                <span className="t-small" style={{ flex:1, fontWeight:500 }}>{l}</span>
                <span className={'badge '+(ok?'bg-avail':'bg-full')}><span className="dot" style={{ background:ok?'var(--green)':'var(--red)' }}/>{s}</span>
                <button className="btn btn-ghost btn-sm" style={{ height:32 }}>Configurar</button>
              </div>
            ))}
          </Panel>
          <Panel title="Seguridad">
            <Row title="Autenticación de dos factores (2FA)" desc="Capa extra de seguridad al iniciar sesión" on={tfa} set={setTfa}/>
            <div style={{ paddingTop:14 }}><button className="btn btn-danger btn-sm" style={{ height:38 }}>Cerrar todas las sesiones</button></div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AccessDenied });
Object.assign(window.ADM_PAGES, { reportes:Reportes, tarifas:Tarifas, incidentes:Incidentes, empresas:Empresas, ajustes:Ajustes });
