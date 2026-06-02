/* bo-features.jsx — F8 Camera OCR · F9 Shift · F10 Heatmap · F11 Alerts */
const { useState:fS, useEffect:fE, useMemo:fM, useRef:fR } = React;

/* heat color ramp (occupancy %) — clean lime→amber→red */
function heatCol(p) {
  if (p<20) return '#EEF0E8';
  if (p<40) return '#DCEFA8';
  if (p<60) return '#C6F24E';
  if (p<80) return '#94C322';
  if (p<92) return '#E0A211';
  return '#E5484D';
}

/* ───────── F10 · WEEKLY HEATMAP ───────── */
function HeatmapGrid({ cell=18, gap=3 }) {
  const [tip,setTip]=fS(null);
  const now = new Date();
  const curDay = (now.getDay()+6)%7, curHour = now.getHours();
  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', gap }}>
        <div style={{ display:'flex', flexDirection:'column', gap, marginTop:0 }}>
          {BO.heatmap.map((r,i)=>(<div key={i} style={{ height:cell, display:'flex', alignItems:'center' }}><span className="t-micro" style={{ color: i===curDay?'var(--ink)':'var(--t3)', fontWeight:i===curDay?700:500, width:26 }}>{r.day}</span></div>))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', gap }}>
            {BO.heatmap.map((r,di)=>(
              <div key={di} className="rise-s" style={{ animationDelay:`${di*0.04}s`, display:'grid', gridTemplateColumns:`repeat(24, 1fr)`, gap }}>
                {r.hours.map((p,h)=>(
                  <div key={h} onMouseEnter={()=>setTip({ d:r.day, h, p })} onMouseLeave={()=>setTip(null)}
                    style={{ height:cell, borderRadius:4, background:heatCol(p), cursor:'pointer',
                      outline: (di===curDay&&h===curHour)?'2px solid var(--ink)':'none', outlineOffset:0 }}/>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(24, 1fr)', gap, marginTop:6 }}>
            {[...Array(24)].map((_,h)=>(<span key={h} className="t-micro" style={{ color:'var(--t4)', textAlign:'center', fontSize:9 }}>{(h%6===0)?h:''}</span>))}
          </div>
        </div>
      </div>
      {tip && (
        <div style={{ position:'absolute', top:-8, left:'50%', transform:'translate(-50%,-100%)', background:'var(--ink)', color:'#fff',
          padding:'8px 12px', borderRadius:10, whiteSpace:'nowrap', zIndex:20, boxShadow:'var(--sh-pop)', pointerEvents:'none' }}>
          <div style={{ fontSize:12, fontWeight:600 }}>{tip.d} {tip.h}:00–{tip.h+1}:00</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>Ocupación promedio: {tip.p}%</div>
        </div>
      )}
    </div>
  );
}
function HeatLegend() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span className="t-micro" style={{ color:'var(--t3)' }}>Menos</span>
      {[10,30,50,70,88,96].map(p=><span key={p} style={{ width:14, height:14, borderRadius:3, background:heatCol(p) }}/>)}
      <span className="t-micro" style={{ color:'var(--t3)' }}>Más</span>
    </div>
  );
}
function Heatmap() {
  const { go } = useBO();
  const [src,setSrc]=fS('hist');
  const [veh,setVeh]=fS('all');
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:6 }}>
          {[['hist','Histórico'],['week','Esta semana']].map(([k,l])=><button key={k} onClick={()=>setSrc(k)} style={{ height:34, padding:'0 13px', borderRadius:10, border:'none', cursor:'pointer', background:src===k?'var(--ink)':'var(--elevated)', color:src===k?'#fff':'var(--t2)', fontSize:13, fontWeight:600 }}>{l}</button>)}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {[['all','Todos'],['car','Carros'],['moto','Motos']].map(([k,l])=><button key={k} onClick={()=>setVeh(k)} className={'chip'+(veh===k?' on':'')} style={{ height:34 }}>{l}</button>)}
        </div>
        <span className="chip" style={{ marginLeft:'auto', height:34 }}>Últimos 3 meses <Icon n="chevD" s={14} c="var(--t3)"/></span>
      </div>
      <div className="card" style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
          <span className="t-h3">Ocupación por hora y día</span>
          <div style={{ marginLeft:'auto' }}><HeatLegend/></div>
        </div>
        <HeatmapGrid cell={26} gap={4}/>
      </div>
      <div style={{ display:'flex', gap:12, marginTop:16, flexWrap:'wrap' }}>
        {[['flame','var(--red)','Hora pico','Mar–Jue 8–10 AM'],['checkC','var(--green)','Más tranquilo','Dom 2–6 PM'],['trendUp','var(--lime-deep)','Ocupación promedio','64%']].map(([ic,c,t,v],i)=>(
          <div key={i} className="card rise-s" style={{ animationDelay:`${i*.06}s`, flex:1, minWidth:200, padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={ic} s={20} c={c}/></div>
            <div><div className="t-micro upper" style={{ color:'var(--t3)' }}>{t}</div><div className="t-h3" style={{ marginTop:2 }}>{v}</div></div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16 }}><AIInsightCard body="La demanda se concentra martes a jueves de 8 a 10 AM (>85%). Considera reservar cupos para empresas en esa franja y habilitar tarifas valle los domingos." /></div>
    </div>
  );
}

/* compact heatmap section for the dashboard right column */
function HeatmapMini() {
  const { go } = useBO();
  return (
    <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--separator)' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}>
        <span className="t-h3" style={{ fontSize:15 }}>Mapa de calor semanal</span>
        <button onClick={()=>go('heatmap')} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Ver completo →</button>
      </div>
      <HeatmapGrid cell={13} gap={2}/>
    </div>
  );
}

/* ───────── F11 · ALERTS ───────── */
const ALERT_META = {
  long:   { ic:'clock', c:'var(--orange)', t:'Estancia prolongada' },
  orphan: { ic:'warning', c:'var(--red)', t:'Entrada huérfana' },
  late:   { ic:'cal', c:'var(--blue)', t:'Reserva sin check-in' },
};
function AlertBanner({ count, onOpen }) {
  if (!count) return null;
  return (
    <div className="rise-s" style={{ display:'flex', alignItems:'center', gap:10, background:'var(--yellow-bg)', border:'1px solid var(--orange)', borderRadius:14, padding:'12px 16px', marginBottom:14 }}>
      <Icon n="warning" s={20} c="var(--orange)"/>
      <span className="t-small" style={{ color:'var(--yellow-tx)', fontWeight:600 }}>{count} {count===1?'alerta activa':'alertas activas'}</span>
      <button onClick={onOpen} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--yellow-tx)', fontSize:13, fontWeight:700, cursor:'pointer' }}>Ver todas →</button>
    </div>
  );
}
function AlertsModal({ close, onResolve, onGo }) {
  const [list,setList]=fS(BO.alerts);
  const resolve = id => { setList(l=>l.filter(a=>a.id!==id)); onResolve&&onResolve(id); };
  return (
    <Modal open onClose={close} wide>
      <ModalHead title="Alertas activas" icon="warning" iconColor="var(--orange)" onClose={close}/>
      <div className="no-sb" style={{ padding:'10px 22px 22px', maxHeight:460, overflowY:'auto' }}>
        {list.length===0 && <div style={{ textAlign:'center', padding:'40px 0', color:'var(--t2)' }}><Icon n="checkC" s={40} c="var(--green)"/><p className="t-small" style={{ marginTop:10 }}>Sin alertas pendientes. Todo en orden.</p></div>}
        {list.map(a=>{
          const m=ALERT_META[a.type];
          return (
            <div key={a.id} className="rise-s" style={{ background:'var(--surface)', border:'1px solid var(--border-card)', borderLeft:`3px solid ${m.c}`, borderRadius:14, padding:15, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <Icon n={m.ic} s={18} c={m.c}/><span className="t-h3" style={{ fontSize:14 }}>{m.t}</span>
                <span className="t-micro" style={{ color:'var(--t3)', marginLeft:'auto' }}>{BO.durLabel(a.mins)}</span>
              </div>
              <div className="t-small" style={{ color:'var(--t2)', margin:'8px 0' }}><b className="mono" style={{ color:'var(--t1)' }}>{BO.fmtPlate(a.plate)}</b> · Espacio {a.space}</div>
              <div className="t-small" style={{ color:'var(--t2)', marginBottom:12 }}>{a.desc}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-ghost btn-sm" onClick={()=>{ onGo&&onGo(a.space); close(); }}>Ver espacio</button>
                <button className="btn btn-primary btn-sm" onClick={()=>resolve(a.id)}><Icon n="check" s={15} c="var(--ink)"/>Verificado</button>
                <button className="btn btn-danger btn-sm" style={{ marginLeft:'auto' }} onClick={()=>resolve(a.id)}>Reportar</button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

/* ───────── F8 · CAMERA PLATE READER ───────── */
function CameraModal({ modal, close }) {
  const [state,setState]=fS('scan'); // scan | reading | result
  const [plate]=fS('ABC123');
  const conf = 87;
  fE(()=>{ if(state==='reading'){ const t=setTimeout(()=>setState('result'),1400); return ()=>clearTimeout(t); } },[state]);
  const frame = state==='result'?'var(--green)':'var(--lime)';
  return (
    <Modal open onClose={close} wide>
      <ModalHead title="Leer placa con cámara" icon="cam" onClose={close}/>
      <div style={{ padding:'16px 22px 22px' }}>
        <div style={{ position:'relative', background:'#0A0A0F', borderRadius:18, height:240, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:.18 }}><defs><pattern id="cg" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#2A3340" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#cg)"/></svg>
          {/* plate frame */}
          <div style={{ position:'relative', width:200, height:64, border:`2px solid ${frame}`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color .3s' }}>
            {state==='result'
              ? <span className="mono" style={{ color:'#fff', fontSize:28, fontWeight:600, letterSpacing:'.08em' }}>{BO.fmtPlate(plate)}</span>
              : <span className="mono" style={{ color:'rgba(255,255,255,.5)', fontSize:22, letterSpacing:'.1em' }}>· · · · · ·</span>}
            {state==='scan' && <div style={{ position:'absolute', left:6, right:6, height:2, background:'var(--lime)', boxShadow:'0 0 10px 2px rgba(198,242,78,.7)', animation:'scanline 1.8s ease-in-out infinite' }}/>}
          </div>
          {state==='reading' && <div style={{ position:'absolute', bottom:14, display:'flex', alignItems:'center', gap:8, color:'#fff' }}><span style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', animation:'spin .7s linear infinite' }}/><span className="t-small">Leyendo placa…</span></div>}
        </div>
        {state!=='result'
          ? <p className="t-small" style={{ textAlign:'center', color:'var(--t2)', marginTop:14 }}>Centra la placa dentro del recuadro</p>
          : <div className="rise-s" style={{ textAlign:'center', marginTop:14 }}><span className="badge bg-avail">Confianza: {conf}%</span></div>}
        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          {state==='result'
            ? <>
                <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setState('scan')}>Reintentar</button>
                <button className="btn btn-primary" style={{ flex:1.6 }} onClick={()=>{ modal.onUse&&modal.onUse(BO.fmtPlate(plate)); close(); }}><Icon n="check" s={18} c="var(--ink)"/>Usar esta placa</button>
              </>
            : <button className="btn btn-primary btn-block" disabled={state==='reading'} onClick={()=>setState('reading')}><Icon n="cam" s={18} c="var(--ink)"/>Capturar</button>}
        </div>
      </div>
    </Modal>
  );
}

/* ───────── F9 · PRE-TURNO ───────── */
function PreTurno() {
  const { go, openModal } = useBO();
  const sh = BO.shift;
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', maxWidth:780, margin:'0 auto' }}>
      <h1 className="t-h1">Antes de comenzar tu turno</h1>
      <p className="t-small" style={{ color:'var(--t2)', margin:'6px 0 4px' }}>Revisa el estado del parqueadero. Turno anterior: <b style={{ color:'var(--t1)' }}>{sh.prevGuard}</b> · {sh.prevRange}.</p>

      {/* pending vehicles */}
      <div className="card rise-s" style={{ padding:18, marginTop:16, borderLeft:'3px solid var(--orange)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Icon n="warning" s={18} c="var(--orange)"/><span className="t-h3" style={{ fontSize:15 }}>{sh.pending.length} vehículos sin salida del turno anterior</span>
        </div>
        <table className="tbl"><thead><tr><th>Placa</th><th>Espacio</th><th>Entrada</th><th>Tiempo</th><th></th></tr></thead>
          <tbody>{sh.pending.map((v,i)=>(<tr key={i}><td className="mono" style={{ fontWeight:600 }}>{BO.fmtPlate(v.plate)}</td><td className="t-small" style={{ color:'var(--t2)' }}>{v.space}</td><td className="t-small">{v.inT}</td>
            <td className="t-small" style={{ color: v.mins>180?'var(--red)':v.mins>60?'var(--yellow-tx)':'var(--green-tx)', fontWeight:600 }}>{BO.durLabel(v.mins)}</td>
            <td style={{ textAlign:'right' }}><button className="btn btn-ghost btn-sm" onClick={()=>go('mapa')}>Ver</button></td></tr>))}</tbody></table>
        <p className="t-micro" style={{ color:'var(--t3)', marginTop:10 }}>Verifica físicamente si estos vehículos siguen en el parqueadero.</p>
      </div>

      {/* note */}
      <div className="card rise-s d1" style={{ padding:16, marginTop:14, background:'var(--lime-bg)', border:'1px solid var(--lime-tint)', borderLeft:'3px solid var(--lime-deep)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}><Icon n="edit" s={16} c="var(--lime-deep)"/><span className="t-small" style={{ fontWeight:600, color:'var(--lime-deep)' }}>Nota de entrega</span></div>
        <p className="t-small" style={{ color:'var(--t1)', margin:0 }}>{sh.note}</p>
      </div>

      {/* arriving */}
      <div className="card rise-s d2" style={{ padding:18, marginTop:14 }}>
        <span className="t-h3" style={{ fontSize:15 }}>Reservas programadas para hoy</span>
        <table className="tbl" style={{ marginTop:8 }}><thead><tr><th>Hora</th><th>Espacio</th><th>Vehículo</th><th>Placa</th><th>Usuario</th></tr></thead>
          <tbody>{sh.arriving.map((r,i)=>(<tr key={i} className="rise-s" style={{ animationDelay:`${i*.05}s` }}><td className="t-small" style={{ fontWeight:600 }}>{r.time}</td><td className="t-small" style={{ color:'var(--t2)' }}>{r.space}</td><td><span className="badge bg-info">{BO.TYPE_LABEL[r.type]}</span></td><td className="mono t-small">{BO.fmtPlate(r.plate)}</td><td className="t-small">{r.user}</td></tr>))}</tbody></table>
      </div>

      <button className="btn btn-primary btn-lg btn-block" style={{ margin:'20px 0 30px' }} onClick={()=>go('dashboard')}>Entendido, comenzar turno</button>
    </div>
  );
}

/* ───────── F9 · POST-TURNO ───────── */
function PostTurno() {
  const { go } = useBO();
  const sh = BO.shift;
  const [pdf,setPdf]=fS('idle');
  const stats = [['Entradas',23],['Salidas',19],['Activos ahora',4],['Estimado','$87.000']];
  const maxC = Math.max(...sh.curve);
  fE(()=>{ if(pdf==='gen'){ const t=setTimeout(()=>setPdf('done'),1400); return ()=>clearTimeout(t); } },[pdf]);
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', maxWidth:780, margin:'0 auto' }}>
      <h1 className="t-h1">Resumen de turno</h1>
      <p className="t-small" style={{ color:'var(--t2)', margin:'6px 0 0' }}>{BO.guard.name} · 6:00 AM – 2:00 PM · 8 horas</p>

      <div style={{ marginTop:16 }}><AIInsightCard title="Resumen del turno · SpotPark AI" body={sh.summary} delay={0}/></div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:14 }}>
        {stats.map(([l,v],i)=>{ const n=typeof v==='number'?useCountUp(v):null;
          return <div key={l} className="card rise-s" style={{ animationDelay:`${i*.05}s`, padding:16, textAlign:'center' }}><div className="t-hero tnum" style={{ fontSize:30 }}>{n!=null?n:v}</div><div className="t-micro upper" style={{ color:'var(--t3)', marginTop:2 }}>{l}</div></div>;
        })}
      </div>

      {/* activity curve */}
      <div className="card rise-s d1" style={{ padding:18, marginTop:14 }}>
        <span className="t-h3" style={{ fontSize:15 }}>Actividad del turno</span>
        <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:120, marginTop:14 }}>
          {sh.curve.map((v,i)=>(<div key={i} style={{ flex:1, height:`${(v/maxC)*100}%`, background: i===14?'var(--lime)':'var(--lime-tint)', borderRadius:'4px 4px 2px 2px', transformOrigin:'bottom', animation:`bar .6s cubic-bezier(.2,.8,.2,1) both`, animationDelay:`${i*.02}s` }}/>))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}><span className="t-micro" style={{ color:'var(--t3)' }}>6 AM</span><span className="t-micro" style={{ color:'var(--t3)' }}>10 AM</span><span className="t-micro" style={{ color:'var(--t3)' }}>2 PM</span></div>
      </div>

      {/* handover */}
      <div className="card rise-s d2" style={{ padding:18, marginTop:14 }}>
        <span className="t-h3" style={{ fontSize:15 }}>Vehículos que quedan en sitio</span>
        <p className="t-micro" style={{ color:'var(--t3)', margin:'4px 0 10px' }}>Quedan bajo responsabilidad del siguiente turno.</p>
        <table className="tbl"><tbody>{sh.pending.map((v,i)=>(<tr key={i}><td className="mono" style={{ fontWeight:600 }}>{BO.fmtPlate(v.plate)}</td><td className="t-small" style={{ color:'var(--t2)' }}>{v.space}</td><td className="t-small">{v.inT}</td><td className="t-small" style={{ textAlign:'right', color:'var(--red)', fontWeight:600 }}>{BO.durLabel(v.mins)}</td></tr>))}</tbody></table>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, margin:'18px 0 30px' }}>
        <button className="btn btn-ghost btn-lg" disabled={pdf==='gen'} onClick={()=>pdf==='idle'&&setPdf('gen')}>
          {pdf==='gen' ? <><span style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(15,17,21,.25)', borderTopColor:'var(--ink)', animation:'spin .7s linear infinite' }}/>Generando PDF…</>
            : pdf==='done' ? <><Icon n="checkC" s={19} c="var(--green-tx)"/>PDF descargado</>
            : <><Icon n="download" s={19} c="var(--t1)"/>Descargar resumen PDF</>}
        </button>
        <button className="btn btn-primary btn-lg" disabled={pdf!=='done'} style={{ opacity:pdf==='done'?1:.5 }} onClick={()=>go('login')}>Cerrar sesión y finalizar turno</button>
      </div>
    </div>
  );
}

Object.assign(window.BO_PAGES, { heatmap:Heatmap, preturno:PreTurno, postturno:PostTurno });
Object.assign(window, { HeatmapMini, AlertBanner, AlertsModal, CameraModal, ALERT_META });
