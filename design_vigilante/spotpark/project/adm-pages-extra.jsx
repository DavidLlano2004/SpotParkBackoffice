/* adm-pages-extra.jsx — Score breakdown · Shift planner · Notifications · Maintenance · Projections · Comparison */
const { useState:exS, useMemo:exM } = React;

const PARK_COLOR = { p1:'var(--lime-deep)', p2:'var(--blue-tx)', p3:'var(--orange)', p4:'var(--green-tx)', p5:'var(--yellow-tx)', p6:'var(--red-tx)' };
const PARK_BG = { p1:'var(--lime-bg)', p2:'var(--blue-bg)', p3:'var(--yellow-bg)', p4:'var(--green-bg)', p5:'var(--yellow-bg)', p6:'var(--red-bg)' };

/* ───────── IDEA A · SCORE BREAKDOWN (modal body) ───────── */
function ScoreBreakdown({ p }) {
  const cats=[
    ['Ocupación', Math.round(p.occ*100), 'Demanda sostenida y buen uso de espacios.'],
    ['Tasa de incidentes', Math.max(40, 100-p.incidents*12), p.incidents?`${p.incidents} incidente(s) reciente(s).`:'Sin incidentes recientes.'],
    ['Reseñas de usuarios', p.score>=85?92:p.score>=70?78:62, 'Promedio de calificación en la app.'],
    ['Tiempo de respuesta', p.score>=85?88:70, 'Tiempo medio en resolver reportes.'],
    ['Competitividad de precios', p.dynamic?90:72, p.dynamic?'Usa precios dinámicos.':'Precios fijos — margen de optimización.'],
  ];
  return (
    <div style={{ padding:'6px 22px 22px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:18 }}>
        <ScoreGauge score={p.score}/>
        <div><div className="t-h3" style={{ fontSize:16 }}>{p.name}</div>
          <p className="t-small" style={{ color:'var(--t2)', margin:'4px 0 0', maxWidth:280 }}>El SpotPark Score combina 5 factores ponderados de operación y satisfacción.</p></div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {cats.map(([l,v,d])=>(
          <div key={l}>
            <div style={{ display:'flex', alignItems:'baseline', marginBottom:5 }}><span className="t-small" style={{ fontWeight:600 }}>{l}</span><span className="t-small tnum" style={{ marginLeft:'auto', fontWeight:700, color:v>=80?'var(--green-tx)':v>=60?'var(--yellow-tx)':'var(--red-tx)' }}>{v}</span></div>
            <ProgressBar pct={v/100}/>
            <div className="t-micro" style={{ color:'var(--t3)', marginTop:4 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16 }}><AIInsightCard title="SpotPark AI · Cómo mejorar" body={`Tu parqueadero tiene ${p.score}/100. ${p.services.includes('cctv')?'':'Agrega CCTV (+5 pts). '}Responde incidentes en menos de 2h (+8 pts)${p.dynamic?'':' y activa precios dinámicos (+6 pts)'} para subir tu score.`}/></div>
    </div>
  );
}

/* ───────── IDEA B · SHIFT PLANNER ───────── */
function ShiftPlanner() {
  const DAYS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const BANDS=[['m','Mañana','6 AM – 2 PM'],['t','Tarde','2 – 10 PM'],['n','Noche','10 PM – 6 AM']];
  const pool=ADM.workers.filter(w=>w.role!=='Administrador');
  const sched=exM(()=>{
    const g={};
    BANDS.forEach((b,bi)=>{ g[b[0]]=DAYS.map((_,d)=>{ const w=pool[(d*3+bi)%pool.length]; const arr=[{ w, p:w.parkings[0] }];
      if (bi===0 && d===4) { const w2=pool[(d*3+bi+5)%pool.length]; arr.push({ w:w2, p:w2.parkings[0], conflict:true }); }
      return arr; }); });
    return g;
  },[]);
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18, flexWrap:'wrap' }}>
        <div><h1 className="t-h1">Planificador de turnos</h1><p className="t-small" style={{ color:'var(--t3)', marginTop:3 }}>Semana del 26 may – 1 jun · {pool.length} trabajadores</p></div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm"><Icon n="download" s={15} c="var(--t1)"/>Exportar</button>
          <button className="btn btn-primary btn-sm"><Icon n="sparkle" s={16} c="var(--ink)"/>Auto-asignar turnos</button>
        </div>
      </div>
      <div className="card" style={{ padding:16, overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'120px repeat(7,1fr)', gap:8, minWidth:880 }}>
          <div/>
          {DAYS.map((d,i)=><div key={d} className="t-micro upper" style={{ textAlign:'center', color:i===2?'var(--ink)':'var(--t3)', fontWeight:i===2?700:600, padding:'4px 0' }}>{d}</div>)}
          {BANDS.map(([k,l,t])=>(
            <React.Fragment key={k}>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}><div className="t-small" style={{ fontWeight:600 }}>{l}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{t}</div></div>
              {sched[k].map((cell,di)=>(
                <div key={di} style={{ minHeight:64, display:'flex', flexDirection:'column', gap:5, padding:5, borderRadius:10, background: cell.some(c=>c.conflict)?'var(--red-bg)':'var(--elevated)', border: cell.some(c=>c.conflict)?'1px solid var(--red)':'1px solid transparent' }}>
                  {cell.map((c,ci)=>(
                    <div key={ci} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 7px', borderRadius:8, background:'var(--surface)', borderLeft:`3px solid ${PARK_COLOR[c.p]}`, boxShadow:'var(--sh-card)' }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8.5, fontWeight:700, flexShrink:0 }}>{c.w.init}</div>
                      <span className="t-micro" style={{ fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.w.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display:'flex', gap:14, marginTop:16, flexWrap:'wrap', alignItems:'center' }}>
          <span className="t-micro upper" style={{ color:'var(--t3)' }}>Parqueaderos:</span>
          {ADM.parkings.slice(0,5).map(p=><span key={p.id} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t2)' }}><span style={{ width:10, height:10, borderRadius:3, background:PARK_COLOR[p.id] }}/>{p.short}</span>)}
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--red-tx)', marginLeft:'auto', fontWeight:600 }}><span style={{ width:10, height:10, borderRadius:3, background:'var(--red-bg)', border:'1px solid var(--red)' }}/>Conflicto de horario</span>
        </div>
      </div>
    </div>
  );
}

/* ───────── IDEA C · NOTIFICATIONS CENTER ───────── */
const NOTIFS=[
  { id:'n1', group:'Urgentes', kind:'incident', title:'Incidente de alta prioridad', body:'Daño en vehículo · U. de Caldas · espacio B2', ago:'hace 8 min', read:false },
  { id:'n2', group:'Urgentes', kind:'occupancy', title:'Ocupación crítica (93%)', body:'Hospital Santa Sofía está casi lleno', ago:'hace 20 min', read:false },
  { id:'n3', group:'Hoy', kind:'ai', title:'Nuevo insight de SpotPark AI', body:'Oportunidad de tarifa en Terminal los miércoles AM', ago:'hace 1 h', read:false },
  { id:'n4', group:'Hoy', kind:'worker', title:'Tatiana Cruz inició turno', body:'Cable Plaza · 8:00 AM – 4:00 PM', ago:'hace 2 h', read:true },
  { id:'n5', group:'Hoy', kind:'payment', title:'Pago recibido', body:'Reserva app · $9.000 · C.C. Fundadores', ago:'hace 3 h', read:true },
  { id:'n6', group:'Anteriores', kind:'worker', title:'Pedro Sáenz suspendido', body:'3 anomalías sin resolver · Hospital Santa Sofía', ago:'ayer', read:true },
  { id:'n7', group:'Anteriores', kind:'occupancy', title:'La Estación en mantenimiento', body:'Parqueadero desactivado temporalmente', ago:'hace 2 días', read:true },
];
const NOTIF_META={ incident:['warning','var(--red)','var(--red-bg)'], occupancy:['layers','var(--orange)','var(--yellow-bg)'], ai:['sparkle','var(--lime-deep)','var(--lime-bg)'], worker:['user','var(--blue-tx)','var(--blue-bg)'], payment:['card','var(--green-tx)','var(--green-bg)'] };
function NotificationsCenter() {
  const [items,setItems]=exS(NOTIFS);
  const groups=['Urgentes','Hoy','Anteriores'];
  const mark=id=>setItems(v=>v.map(n=>n.id===id?{...n,read:true}:n));
  const markAll=()=>setItems(v=>v.map(n=>({...n,read:true})));
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ maxWidth:760, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:18 }}>
          <div><h1 className="t-h1">Notificaciones</h1><p className="t-small" style={{ color:'var(--t3)', marginTop:3 }}>{items.filter(n=>!n.read).length} sin leer</p></div>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }} onClick={markAll}><Icon n="check" s={16} c="var(--t1)"/>Marcar todas como leídas</button>
        </div>
        {groups.map(g=>{ const list=items.filter(n=>n.group===g); if(!list.length) return null;
          return <div key={g} style={{ marginBottom:18 }}>
            <div className="t-micro upper" style={{ color: g==='Urgentes'?'var(--red-tx)':'var(--t3)', marginBottom:8 }}>{g}</div>
            <div className="card" style={{ overflow:'hidden' }}>
              {list.map((n,i)=>{ const [ic,c,bg]=NOTIF_META[n.kind];
                return <div key={n.id} onClick={()=>mark(n.id)} style={{ display:'flex', gap:12, padding:'13px 16px', borderBottom:i<list.length-1?'1px solid var(--separator)':'none', cursor:'pointer', background:n.read?'transparent':'var(--lime-bg)', transition:'background .15s' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon n={ic} s={17} c={c}/></div>
                  <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>{n.title}</div><div className="t-small" style={{ color:'var(--t2)', marginTop:2 }}>{n.body}</div></div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}><span className="t-micro" style={{ color:'var(--t3)' }}>{n.ago}</span>{!n.read && <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--lime-deep)' }}/>}</div>
                </div>; })}
            </div>
          </div>; })}
      </div>
    </div>
  );
}

/* ───────── IDEA E · MAINTENANCE (detail tab) ───────── */
const MAINT=[
  { id:'m1', space:'B3', prio:'alta', status:'pending', title:'Grieta en el pavimento', desc:'Espacio B3 tiene una grieta — bloquear hasta reparar.', cost:180000, who:'Carlos Torres', when:'Hoy 10:10 AM' },
  { id:'m2', space:'Barrera B', prio:'media', status:'progress', title:'Barrera lenta', desc:'La barrera de salida tarda en subir. Proveedor externo notificado.', cost:90000, who:'Andrea Ríos', when:'Ayer 4:30 PM' },
  { id:'m3', space:'M4', prio:'baja', status:'resolved', title:'Demarcación borrosa', desc:'Repintado de líneas del espacio M4.', cost:45000, who:'Diego Parra', when:'Hace 3 días' },
];
function MaintenancePanel({ p }) {
  const ST={ pending:['bg-full','Pendiente','var(--red)'], progress:['bg-few','En progreso','var(--orange)'], resolved:['bg-avail','Resuelto','var(--green)'] };
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:14 }}><span className="t-h3" style={{ fontSize:15 }}>Solicitudes de mantenimiento</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={16} c="var(--ink)"/>Nueva solicitud</button></div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {MAINT.map(m=>{ const [cls,l,c]=ST[m.status]; const P=ADM.PRIO[m.prio];
          return <div key={m.id} className="card" style={{ padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span className="badge" style={{ background:'var(--elevated)', color:'var(--t1)', fontWeight:700 }}>{m.space}</span>
              <span className="t-h3" style={{ fontSize:14.5 }}>{m.title}</span>
              <span className={'badge '+P.cls} style={{ marginLeft:4 }}>{P.l}</span>
              <span className={'badge '+cls} style={{ marginLeft:'auto' }}><span className="dot" style={{ background:c }}/>{l}</span>
            </div>
            <p className="t-small" style={{ color:'var(--t2)', margin:'0 0 10px' }}>{m.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <span className="t-micro" style={{ color:'var(--t3)' }}>{m.who} · {m.when}</span>
              <span className="t-micro tnum" style={{ color:'var(--t2)', fontWeight:600 }}>Costo: {ADM.COP(m.cost)}</span>
              {m.status!=='resolved' && <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <button className="btn btn-ghost btn-sm" style={{ height:32 }}>Bloquear espacio</button>
                <button className="btn btn-primary btn-sm" style={{ height:32 }}>Marcar resuelto</button></div>}
            </div>
          </div>; })}
      </div>
    </div>
  );
}

/* ───────── IDEA F · REVENUE PROJECTIONS ───────── */
function ProjectionChart({ h=240 }) {
  const [w,setW]=exS(680); const ref=React.useRef(null);
  React.useEffect(()=>{ const el=ref.current; if(!el)return; const ro=new ResizeObserver(()=>setW(el.clientWidth)); ro.observe(el); setW(el.clientWidth); return ()=>ro.disconnect(); },[]);
  const hist=ADM.revenueDaily.slice(0,18).map(d=>d.value);
  const last=hist[hist.length-1];
  const proj=[...Array(14)].map((_,i)=> last*(1+ (i+1)*0.018) );
  const all=[...hist, ...proj];
  const band=proj.map((v,i)=>({ lo:v*(1-0.06-i*0.004), hi:v*(1+0.06+i*0.004) }));
  const pad={ l:54, r:12, t:14, b:24 };
  const max=Math.max(...all, ...band.map(b=>b.hi))*1.08, min=Math.min(...all)*0.9;
  const X=i=> pad.l + i*(w-pad.l-pad.r)/(all.length-1);
  const Y=v=> pad.t + (1-(v-min)/(max-min))*(h-pad.t-pad.b);
  const histLine=hist.map((v,i)=>`${i?'L':'M'}${X(i)},${Y(v)}`).join(' ');
  const projLine=proj.map((v,i)=>`${i?'L':'M'}${X(hist.length-1+i+1)},${Y(v)}`).join(' ');
  const projStart=`M${X(hist.length-1)},${Y(last)} `+projLine.replace('M','L');
  const bandTop=band.map((b,i)=>`${i?'L':'M'}${X(hist.length+i)},${Y(b.hi)}`).join(' ');
  const bandBot=band.map((b,i)=>`L${X(hist.length+i)},${Y(b.lo)}`).reverse().join(' ');
  return <div ref={ref} style={{ width:'100%' }}><svg width={w} height={h} style={{ display:'block' }}>
    {[0,1,2,3,4].map(i=>{ const v=min+(max-min)*i/4; const y=Y(v); return <g key={i}><line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke="var(--separator)" strokeDasharray="3 4"/><text x={pad.l-10} y={y+4} textAnchor="end" fontSize="10.5" fill="var(--t3)" fontFamily="var(--mono)">{ADM.COPk(v)}</text></g>; })}
    <path d={`${bandTop} ${bandBot} Z`} fill="rgba(94,127,18,.10)"/>
    <path d={histLine} fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d={projStart} fill="none" stroke="var(--lime-deep)" strokeWidth="2.4" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1={X(hist.length-1)} y1={pad.t} x2={X(hist.length-1)} y2={h-pad.b} stroke="var(--t4)" strokeDasharray="2 3"/>
    <text x={X(hist.length-1)+6} y={pad.t+10} fontSize="10" fill="var(--t3)">hoy</text>
  </svg></div>;
}
function Projections() {
  const proj=Math.round(ADM.totals.rev*1.12);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <MetricCard ic="trendUp" iconBg="var(--lime-bg)" iconColor="var(--lime-deep)" label="Proyección 30 días" value={proj} prefix="$" trend="12% vs periodo actual" trendDir="up"/>
        <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas proyectadas" value={Math.round(ADM.totals.reservas*1.1)}/>
        <MetricCard ic="target" iconBg="var(--elevated)" label="Confianza del modelo" value={87} suffix="%"/>
      </div>
      <Panel title="Proyección de ingresos" right={<span className="t-micro" style={{ color:'var(--t3)' }}>Histórico + 14 días proyectados</span>}>
        <ProjectionChart/>
        <div style={{ display:'flex', gap:16, marginTop:10 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t2)' }}><span style={{ width:16, height:3, background:'var(--ink)', borderRadius:2 }}/>Histórico</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t2)' }}><span style={{ width:16, height:3, background:'var(--lime-deep)', borderRadius:2 }}/>Proyección</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t2)' }}><span style={{ width:16, height:10, background:'rgba(94,127,18,.12)', borderRadius:3 }}/>Rango de confianza</span>
        </div>
      </Panel>
      <AIInsightCard title="SpotPark AI · Proyección" body="Si reactivas La Estación los sábados, la proyección a 30 días sube ~12% adicional. La demanda festiva del próximo viernes podría añadir $1.4M en un solo día." action={<button className="btn btn-primary btn-sm" style={{ marginTop:12 }}>Ver plan recomendado</button>}/>
    </div>
  );
}

/* ───────── IDEA D · COMPARISON MODE ───────── */
function ComparisonMode() {
  const [sel,setSel]=exS(['p2','p5','p1']);
  const tog=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):s.length<4?[...s,id]:s);
  const chosen=ADM.parkings.filter(p=>sel.includes(p.id));
  const metrics=[['Ingresos mes',p=>ADM.COPk(p.rev)],['Ocupación',p=>Math.round(p.occ*100)+'%'],['Reservas',p=>p.reservas],['Capacidad',p=>p.cap],['Score',p=>p.score],['Incidentes',p=>p.incidents]];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div className="card" style={{ padding:16 }}>
        <div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:10 }}>Selecciona 2–4 parqueaderos</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {ADM.parkings.map(p=>{ const on=sel.includes(p.id);
            return <button key={p.id} onClick={()=>tog(p.id)} style={{ display:'inline-flex', alignItems:'center', gap:7, height:36, padding:'0 13px', borderRadius:100, cursor:'pointer', fontSize:12.5, fontWeight:600, fontFamily:'var(--font)',
              background:on?'var(--ink)':'var(--surface)', color:on?'#fff':'var(--t2)', border:on?'none':'1px solid var(--border)' }}>
              <span style={{ width:9, height:9, borderRadius:3, background:PARK_COLOR[p.id] }}/>{p.short}</button>; })}
        </div>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl"><thead><tr><th>Métrica</th>{chosen.map(p=><th key={p.id} style={{ textAlign:'right' }}><span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><span style={{ width:9, height:9, borderRadius:3, background:PARK_COLOR[p.id] }}/>{p.short}</span></th>)}</tr></thead>
          <tbody>{metrics.map(([l,fn])=>(
            <tr key={l}><td style={{ fontWeight:600 }}>{l}</td>{chosen.map(p=><td key={p.id} className="tnum" style={{ textAlign:'right', fontWeight:600 }}>{fn(p)}</td>)}</tr>
          ))}</tbody></table>
      </div>
      <Panel title="Ingresos comparados (6 meses)">
        <div style={{ position:'relative' }}>
          <AreaChart data={ADM.months.map((m,i)=>({ label:m, value: chosen.reduce((s,p)=>s+p.trend[i]*100000,0) }))} fmt={v=>ADM.COPk(v)} h={210} showDots={false}/>
        </div>
        <div style={{ display:'flex', gap:14, marginTop:8, flexWrap:'wrap' }}>{chosen.map(p=><span key={p.id} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--t2)' }}><span style={{ width:10, height:10, borderRadius:3, background:PARK_COLOR[p.id] }}/>{p.short}</span>)}</div>
      </Panel>
    </div>
  );
}

Object.assign(window, { PARK_COLOR, PARK_BG, ScoreBreakdown, MaintenancePanel, Projections, ProjectionChart, ComparisonMode });
Object.assign(window.ADM_PAGES, { turnos:ShiftPlanner, notificaciones:NotificationsCenter });
