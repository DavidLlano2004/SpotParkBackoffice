/* adm-pages-parking-detail.jsx — Parking detail tabs + Create wizard. */
const { useState:pdS } = React;

/* ───────── DETALLE / EDITAR ───────── */
function ParkingDetail() {
  const { ctx, go } = useADM();
  const p = ctx?.parking || ADM.parkings[0];
  const [tab,setTab]=pdS('resumen');
  const tabs=[['resumen','Resumen'],['espacios','Espacios'],['vigilantes','Vigilantes'],['tarifas','Tarifas'],['mantenimiento','Mantenimiento'],['reportes','Reportes']];
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      {/* hero */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:18 }}>
        <div style={{ width:76, height:76, borderRadius:16, overflow:'hidden', flexShrink:0 }}><ParkingCover p={p} h={76} radius="16px"/></div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}><h1 className="t-h1">{p.name}</h1><ParkingStatus status={p.status}/></div>
          <div className="t-small" style={{ color:'var(--t2)', display:'flex', alignItems:'center', gap:4, marginTop:4 }}><Icon n="pin" s={14} c="var(--t3)"/>{p.addr}, {p.city} · {p.schedule}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm"><Icon n="edit" s={16} c="var(--t1)"/>Editar</button>
          <button className="btn btn-ghost btn-sm"><Icon n="share" s={15} c="var(--t1)"/>Ver en app</button>
          <button className="btn btn-ghost btn-sm" style={{ width:36, padding:0 }}><Icon n="dots" s={18} c="var(--t1)"/></button>
        </div>
      </div>
      {/* tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--border)', marginBottom:20 }}>
        {tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{ height:40, padding:'0 14px', border:'none', background:'none', cursor:'pointer', fontSize:14, fontWeight:600,
          color:tab===k?'var(--t1)':'var(--t3)', borderBottom:tab===k?'2px solid var(--lime-deep)':'2px solid transparent', marginBottom:-1, fontFamily:'var(--font)' }}>{l}</button>)}
      </div>
      <div key={tab} className="fade">
        {tab==='resumen' && <DetailResumen p={p}/>}
        {tab==='espacios' && <ZoneEditor/>}
        {tab==='vigilantes' && <DetailVigilantes p={p}/>}
        {tab==='tarifas' && <TarifaForm p={p}/>}
        {tab==='mantenimiento' && <MaintenancePanel p={p}/>}
        {tab==='reportes' && <DetailReportes p={p}/>}
      </div>
    </div>
  );
}

function DetailResumen({ p }) {
  const { openModal } = useADM();
  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          <MetricCard ic="card" iconBg="var(--green-bg)" iconColor="var(--green-tx)" label="Ingresos mes" value={p.rev} prefix="$"/>
          <MetricCard ic="layers" iconBg="var(--lime-bg)" iconColor="var(--lime-deep)" label="Ocupación" value={Math.round(p.occ*100)} suffix="%" ring={p.occ}/>
          <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas" value={p.reservas}/>
        </div>
        <Panel title="Ocupación en vivo">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(56px,1fr))', gap:8 }}>
            {BO.allCells.slice(0,40).map(c=><SpaceCell key={c.id} cell={c}/>)}
          </div>
        </Panel>
        <Panel title="Servicios">
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {p.services.map(s=>{ const [ic,l]=SERVICES[s]||['info',s];
              return <span key={s} style={{ display:'inline-flex', alignItems:'center', gap:7, height:34, padding:'0 13px', borderRadius:100, background:'var(--lime-bg)', color:'var(--lime-deep)', fontSize:13, fontWeight:600 }}><Icon n={ic} s={16} c="var(--lime-deep)"/>{l}</span>; })}
          </div>
        </Panel>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Panel title="SpotPark Score" right={<button onClick={()=>openModal({ type:'score', parking:p })} style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:12.5, fontWeight:600, cursor:'pointer' }}>Ver desglose →</button>}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <ScoreGauge score={p.score}/>
            <div style={{ flex:1 }}>
              <p className="t-small" style={{ color:'var(--t2)', margin:0, lineHeight:1.5 }}>{p.score>=80?'Excelente desempeño.':'Hay margen de mejora.'} Agrega CCTV (+5) y responde incidentes en menos de 2h (+8).</p>
            </div>
          </div>
        </Panel>
        <Panel title="Vigilantes asignados">
          {p.workers.length? p.workers.map((w,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:i<p.workers.length-1?'1px solid var(--separator)':'none' }}>
              <Avatar init={w.split(' ').map(x=>x[0]).join('').slice(0,2)} size={32}/>
              <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>{w}</div><div className="t-micro" style={{ color:'var(--t3)' }}>Vigilante</div></div>
            </div>
          )) : <p className="t-small" style={{ color:'var(--t3)', margin:0 }}>Sin vigilantes asignados.</p>}
        </Panel>
      </div>
    </div>
  );
}

function DetailVigilantes({ p }) {
  const assigned=ADM.workers.filter(w=>w.parkings.includes(p.id));
  return (
    <div>
      <div style={{ display:'flex', marginBottom:14 }}><span className="t-h3" style={{ fontSize:15 }}>Vigilantes asignados</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={16} c="var(--ink)"/>Asignar vigilante</button></div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl"><thead><tr><th>Trabajador</th><th>Rol</th><th>Teléfono</th><th>Turno actual</th><th>Estado</th><th></th></tr></thead>
          <tbody>{assigned.map(w=><WorkerRow key={w.id} w={w}/>)}
            {!assigned.length && <tr><td colSpan="6" style={{ textAlign:'center', color:'var(--t3)' }}>Sin vigilantes asignados.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}

function DetailReportes({ p }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span className="t-h3" style={{ fontSize:15 }}>Analítica · {p.short}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm"><Icon n="download" s={15} c="var(--t1)"/>PDF</button>
          <button className="btn btn-ghost btn-sm"><Icon n="download" s={15} c="var(--t1)"/>Excel</button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <MetricCard ic="card" iconBg="var(--green-bg)" iconColor="var(--green-tx)" label="Ingresos periodo" value={p.rev} prefix="$"/>
        <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas" value={p.reservas}/>
        <MetricCard ic="layers" iconBg="var(--lime-bg)" iconColor="var(--lime-deep)" label="Ocupación media" value={Math.round(p.occ*100)} suffix="%"/>
      </div>
      <Panel title="Ingresos diarios"><AreaChart data={ADM.revenueDaily.filter((_,i)=>i%2===0).map((d,i)=>({ label:i%3===0?d.day:'', value:d.value*(p.rev/ADM.totals.rev) }))} fmt={v=>ADM.COPk(v)} h={200} showDots={false}/></Panel>
      <Panel title="Mapa de calor semanal"><AdmHeatmap cell={20}/></Panel>
    </div>
  );
}

/* ───────── TARIFA FORM (reused in tab + tarifas page) ───────── */
function TarifaForm({ p, embedded }) {
  const t=ADM.tarifaFor(p);
  const [veh,setVeh]=pdS('car');
  const [dyn,setDyn]=pdS(t.car.dynamic);
  const cur=t[veh];
  const VTABS=[['car','🚗 Carros'],['moto','🏍️ Motos'],['bike','🚲 Bicis'],['suv','🛺 SUV']];
  return (
    <div style={{ display:'grid', gridTemplateColumns: embedded?'1fr':'2fr 1fr', gap:14 }}>
      <div>
        <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
          {VTABS.map(([k,l])=><button key={k} onClick={()=>setVeh(k)} style={{ height:36, padding:'0 14px', borderRadius:10, border:'none', cursor:'pointer', background:veh===k?'var(--ink)':'var(--surface)', color:veh===k?'#fff':'var(--t2)', fontSize:13, fontWeight:600, boxShadow:veh===k?'none':'var(--sh-card)', fontFamily:'var(--font)' }}>{l}</button>)}
        </div>
        <div className="card" style={{ padding:18 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <PriceField label="Precio por hora" value={ADM.COP(cur.hour)}/>
            <PriceField label="Precio por día" value={cur.day?ADM.COP(cur.day):'—'}/>
            <FieldRow label="Tiempo mínimo" value={cur.min}/>
            <FieldRow label="Período de gracia" value={cur.grace}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:18, paddingTop:16, borderTop:'1px solid var(--separator)' }}>
            <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>Precios dinámicos</div><div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>Ajusta el precio según la demanda</div></div>
            <Toggle on={dyn} onChange={setDyn}/>
          </div>
          {dyn && <div className="rise-s" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14 }}>
            <PriceField label="Precio hora pico" value={ADM.COP(cur.peak||cur.hour*1.3)}/>
            <PriceField label="Precio hora valle" value={ADM.COP(cur.valley||cur.hour*0.7)}/>
          </div>}
          {dyn && <div style={{ marginTop:14 }}><AIInsightCard title="SpotPark AI · Precios" body="Puedo sugerir precios óptimos según la demanda histórica de este parqueadero." action={<button className="btn btn-primary btn-sm" style={{ marginTop:10 }}>Activar sugerencias AI</button>}/></div>}
        </div>
      </div>
      {!embedded && <Panel title="Historial de cambios">
        {[['Carro · hora','$2.800 → $3.000','Hace 3 días','Natalia S.'],['Moto · hora','$1.200 → $1.500','Hace 12 días','Natalia S.'],['Carro · día','$20.000 → $22.000','Hace 1 mes','Diego P.']].map(([w,c,t,who],i)=>(
          <div key={i} style={{ padding:'10px 0', borderBottom:i<2?'1px solid var(--separator)':'none' }}>
            <div className="t-small" style={{ fontWeight:600 }}>{w}</div>
            <div className="t-micro tnum" style={{ color:'var(--lime-deep)', marginTop:2 }}>{c}</div>
            <div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{t} · {who}</div>
          </div>
        ))}
      </Panel>}
    </div>
  );
}
function PriceField({ label, value }) {
  return <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>{label}</div>
    <div className="input" style={{ height:46 }}><span style={{ color:'var(--t3)', fontWeight:600 }}>$</span><input value={value.replace('$','')} readOnly style={{ fontSize:15, fontWeight:600, fontFamily:'var(--mono)' }}/></div></div>;
}
function FieldRow({ label, value }) {
  return <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>{label}</div>
    <div className="input" style={{ height:46, cursor:'pointer' }}><span style={{ flex:1, fontSize:14 }}>{value}</span><Icon n="chevD" s={15} c="var(--t3)"/></div></div>;
}

/* shared worker row */
function WorkerRow({ w, onClick }) {
  const ST={ shift:['bg-avail','En turno','var(--green)',true], active:['bg-resv','Activo','var(--blue)',false], inactive:['','Inactivo','var(--t3)',false], suspended:['bg-full','Suspendido','var(--red)',false] };
  const [cls,l,c,pulse]=ST[w.status]||ST.active;
  const RT={ Vigilante:'bg-resv', Supervisor:'bg-info', 'Administrador':'' };
  return <tr className="row" onClick={onClick}>
    <td><div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar init={w.init} size={34}/><div><div style={{ fontWeight:600, fontSize:13.5 }}>{w.name}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{w.cc}</div></div></div></td>
    <td><span className={'badge '+RT[w.role]} style={w.role==='Administrador'?{ background:'var(--yellow-bg)', color:'var(--yellow-tx)' }:null}>{w.role}</span></td>
    <td className="t-small tnum" style={{ color:'var(--t2)' }}>{w.phone}</td>
    <td className="t-small" style={{ color:'var(--t2)' }}>{w.last}</td>
    <td><span className={'badge '+cls} style={!cls?{ background:'var(--elevated)', color:'var(--t2)' }:null}><span className="dot" style={{ background:c, animation:pulse?'pulse 1.8s infinite':'none' }}/>{l}</span></td>
    <td><Icon n="chevR" s={16} c="var(--t3)"/></td>
  </tr>;
}

/* ───────── WIZARD ───────── */
function CreateWizard() {
  const { go } = useADM();
  const [step,setStep]=pdS(0);
  const steps=['Información básica','Ubicación','Espacios','Tarifas y servicios'];
  const [name,setName]=pdS(''); const [phone,setPhone]=pdS(''); const [open24,setOpen24]=pdS(true);
  const [services,setServices]=pdS(['vigilancia','cctv']);
  const tog=s=>setServices(v=>v.includes(s)?v.filter(x=>x!==s):[...v,s]);
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
        <button onClick={()=>go('parqueaderos')} style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="chevL" s={18} c="var(--t1)"/></button>
        <h1 className="t-h1">Crear parqueadero</h1>
      </div>
      {/* progress */}
      <div style={{ display:'flex', gap:8, margin:'18px 0 24px' }}>
        {steps.map((s,i)=>(
          <div key={s} style={{ flex:1 }}>
            <div style={{ height:5, borderRadius:5, background:i<=step?'var(--lime)':'var(--elevated)', transition:'background .3s' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
              <span className="tnum" style={{ width:18, height:18, borderRadius:'50%', background:i<step?'var(--lime-deep)':i===step?'var(--ink)':'var(--elevated)', color:i<=step?'#fff':'var(--t3)', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{i<step?'✓':i+1}</span>
              <span className="t-small" style={{ fontWeight:i===step?600:500, color:i===step?'var(--t1)':'var(--t3)' }}>{s}</span>
            </div>
          </div>
        ))}
      </div>

      <div key={step} className="fade">
        {step===0 && <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
          <div className="card" style={{ padding:20, display:'flex', flexDirection:'column', gap:16 }}>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Nombre del parqueadero</div><Field ph="Ej. Parqueadero Centro" value={name} onChange={setName}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Teléfono</div><Field ic="phone" ph="+57 300 000 0000" value={phone} onChange={setPhone}/></div>
              <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Correo</div><Field ic="mail" ph="contacto@…"/></div>
            </div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Descripción</div>
              <div className="input" style={{ height:88, alignItems:'flex-start', paddingTop:10 }}><textarea placeholder="Breve descripción del parqueadero…" style={{ resize:'none', height:'100%', fontFamily:'var(--font)' }}/></div></div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Fotos</div>
              <div style={{ height:96, border:'1.5px dashed var(--border)', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, color:'var(--t3)', background:'var(--elevated)' }}>
                <Icon n="download" s={22} c="var(--t3)"/><span className="t-small">Arrastra o selecciona fotos del parqueadero</span></div></div>
            <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:4 }}>
              <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>Abierto 24 horas</div></div><Toggle on={open24} onChange={setOpen24}/>
            </div>
          </div>
          <div>
            <div className="t-micro" style={{ color:'var(--t3)', marginBottom:8 }}>Vista previa en la app</div>
            <div className="card" style={{ overflow:'hidden' }}>
              <div style={{ height:120, background:'var(--ink-2)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="layers" s={26} c="rgba(255,255,255,.3)"/></div>
              <div style={{ padding:16 }}><div className="t-h3" style={{ fontSize:15 }}>{name||'Nombre del parqueadero'}</div>
                <div className="t-small" style={{ color:'var(--t2)', marginTop:4 }}>{open24?'Abierto 24 horas':'Horario configurable'}</div>
                <div style={{ display:'flex', gap:6, marginTop:12, flexWrap:'wrap' }}>{services.slice(0,3).map(s=><span key={s} className="badge bg-info">{(SERVICES[s]||['',s])[1]}</span>)}</div>
              </div>
            </div>
          </div>
        </div>}

        {step===1 && <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ position:'relative', height:320, background:'var(--ink-2)' }}>
            <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}><defs><pattern id="mapg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#mapg)"/>
              <path d="M0,180 Q200,120 400,200 T900,160" stroke="rgba(198,242,78,.25)" strokeWidth="3" fill="none"/></svg>
            <div style={{ position:'absolute', top:16, left:16, right:16 }}><div className="input" style={{ height:44, background:'var(--surface)' }}><Icon n="search" s={18} c="var(--t3)"/><input placeholder="Buscar dirección en Manizales…"/></div></div>
            <div style={{ position:'absolute', top:'52%', left:'50%', transform:'translate(-50%,-100%)' }}><div style={{ width:38, height:38, borderRadius:'50% 50% 50% 0', background:'var(--lime)', transform:'rotate(-45deg)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}><span style={{ transform:'rotate(45deg)', color:'var(--ink)', fontWeight:700, fontFamily:'var(--display)' }}>P</span></div></div>
          </div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Dirección</div><Field ic="pin" ph="Calle 00 #00-00" value="Calle 65 #26-10"/></div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Localidad / Barrio</div><Field ph="Palermo"/></div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Ciudad</div><Field ph="Manizales" value="Manizales"/></div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Referencia</div><Field ph="Frente a la universidad"/></div>
          </div>
        </div>}

        {step===2 && <div><div className="t-h3" style={{ fontSize:16, marginBottom:14 }}>Configura los espacios de tu parqueadero</div><ZoneEditor/></div>}

        {step===3 && <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div><div className="t-h3" style={{ fontSize:16, marginBottom:14 }}>Configura las tarifas por tipo de vehículo</div><TarifaForm p={ADM.parkings[0]} embedded/></div>
          <div><div className="t-h3" style={{ fontSize:16, marginBottom:14 }}>Servicios disponibles</div>
            <div className="card" style={{ padding:18 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {Object.entries(SERVICES).map(([k,[ic,l]])=>{ const on=services.includes(k);
                  return <button key={k} onClick={()=>tog(k)} style={{ display:'flex', alignItems:'center', gap:9, height:46, padding:'0 13px', borderRadius:12, cursor:'pointer', textAlign:'left',
                    background:on?'var(--lime-bg)':'var(--surface)', border:on?'1.5px solid var(--lime-deep)':'1px solid var(--border)', fontFamily:'var(--font)' }}>
                    <span style={{ width:20, height:20, borderRadius:6, border:on?'none':'1.5px solid var(--border)', background:on?'var(--lime-deep)':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>{on&&<Icon n="check" s={14} c="#fff"/>}</span>
                    <Icon n={ic} s={17} c={on?'var(--lime-deep)':'var(--t3)'}/><span className="t-small" style={{ fontWeight:600, color:on?'var(--lime-deep)':'var(--t2)' }}>{l}</span></button>; })}
              </div>
            </div></div>
        </div>}
      </div>

      {/* nav */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:24, paddingTop:18, borderTop:'1px solid var(--border)' }}>
        <span className="t-micro" style={{ color:'var(--t4)' }}>Borrador guardado automáticamente</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          {step>0 && <button className="btn btn-ghost" onClick={()=>setStep(step-1)}>Atrás</button>}
          {step<3 ? <button className="btn btn-primary" onClick={()=>setStep(step+1)}>Siguiente</button>
            : <button className="btn btn-primary" onClick={()=>go('parqueaderos')}><Icon n="check" s={18} c="var(--ink)"/>Crear parqueadero</button>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ParkingDetail, TarifaForm, WorkerRow, PriceField, FieldRow });
Object.assign(window.ADM_PAGES, { parking:ParkingDetail, nuevo:CreateWizard });
