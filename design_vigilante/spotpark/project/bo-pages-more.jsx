/* bo-pages-more.jsx — Registros, Perfil, Ajustes + Modals. */
const { useState:mS, useEffect:mE } = React;

/* ───────── REGISTROS ───────── */
function Registros() {
  const { openModal } = useBO();
  const [sel,setSel]=mS(null);
  const [type,setType]=mS('all');
  const recs = BO.records.filter(r=> type==='all'?true : type==='active'?r.active : type==='done'?!r.active : true);
  const activos = BO.records.filter(r=>r.active).length;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'56% 44%', height:'100%', margin:-24 }}>
      <div style={{ borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {[['all','Todos'],['active','Activos'],['done','Cerrados']].map(([k,l])=>(
              <button key={k} onClick={()=>setSel(null)||setType(k)} style={{ height:32, padding:'0 12px', borderRadius:9, border:'none', cursor:'pointer',
                background:type===k?'var(--ink)':'var(--elevated)', color:type===k?'#fff':'var(--t2)', fontSize:12.5, fontWeight:600 }}>{l}</button>
            ))}
            <button className="chip" style={{ marginLeft:'auto', height:34 }}>Hoy <Icon n="chevD" s={14} c="var(--t3)"/></button>
            <button className="btn btn-ghost btn-sm"><Icon n="download" s={16} c="var(--t1)"/>CSV</button>
          </div>
          <div className="t-small" style={{ color:'var(--t3)', marginTop:12 }}>Hoy: <b style={{ color:'var(--t1)' }}>{BO.records.length} entradas</b> · {BO.records.filter(r=>!r.active).length} salidas · <b style={{ color:'var(--green-tx)' }}>{activos} activos ahora</b></div>
        </div>
        <div className="no-sb" style={{ flex:1, overflowY:'auto' }}>
          <table className="tbl">
            <thead><tr><th>Tipo</th><th>Placa</th><th>Espacio</th><th>Entrada</th><th>Salida</th><th>Duración</th><th>Monto</th></tr></thead>
            <tbody>
              {recs.map(r=>(
                <tr key={r.id} className="row" onClick={()=>setSel(r)} style={{ borderLeft: r.active?'2px solid var(--green)':'2px solid transparent', background: sel?.id===r.id?'var(--surface)':'transparent' }}>
                  <td><span className="badge" style={{ background:r.active?'var(--lime-bg)':'var(--green-bg)', color:r.active?'var(--lime-deep)':'var(--green-tx)' }}>{r.active?'ENT':'SAL'}</span></td>
                  <td className="mono" style={{ fontWeight:600 }}>{BO.fmtPlate(r.plate)}</td>
                  <td className="t-small" style={{ color:'var(--t2)' }}>{r.space}</td>
                  <td className="t-small">{r.inT}</td>
                  <td className="t-small" style={{ color:r.active?'var(--green-tx)':'var(--t1)', fontWeight:r.active?600:400 }}>{r.active?'Activo':r.outT}</td>
                  <td className="t-small" style={{ color:'var(--t2)' }}>{BO.durLabel(r.durMin)}</td>
                  <td className="t-small" style={{ color:'var(--lime-deep)', fontWeight:600 }}>{r.amount?BO.COP(r.amount):'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'12px 24px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center' }}>
          <span className="t-small" style={{ color:'var(--t3)' }}>Mostrando {recs.length} de {BO.records.length} registros</span>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}><button className="btn btn-ghost btn-sm">← Anterior</button><button className="btn btn-ghost btn-sm">Siguiente →</button></div>
        </div>
      </div>
      <div style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <RecordDetail key={sel?.id||'e'} rec={sel} openModal={openModal}/>
      </div>
    </div>
  );
}
function RecordDetail({ rec, openModal }) {
  if (!rec) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:32 }}>
      <div style={{ width:72, height:72, borderRadius:20, background:'var(--surface)', boxShadow:'var(--sh-card)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}><Icon n="list" s={32} c="var(--t3)"/></div>
      <div className="t-h2" style={{ color:'var(--t2)' }}>Selecciona un registro</div>
      <p className="t-small" style={{ color:'var(--t3)', maxWidth:260, marginTop:8 }}>Haz clic en una fila para ver el detalle, la línea de tiempo y la facturación.</p>
    </div>
  );
  const rate = rec.type==='car'?3000:rec.type==='moto'?1500:800;
  const events = [
    { c:'var(--blue)', l:'Registro creado', t:rec.inT+' · por Carlos Torres' },
    { c:'var(--green)', l:'Entrada registrada', t:rec.inT },
    rec.active ? { c:'var(--t4)', l:'Salida pendiente', t:'—' } : { c:'var(--green)', l:'Salida registrada', t:rec.outT },
  ];
  return (
    <div className="fade" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span className="badge" style={{ background:rec.active?'var(--lime-bg)':'var(--green-bg)', color:rec.active?'var(--lime-deep)':'var(--green-tx)' }}>{rec.active?'ACTIVO':'CERRADO'}</span>
          <span className="t-h1 mono">{BO.fmtPlate(rec.plate)}</span>
          <span className="badge bg-info" style={{ marginLeft:'auto' }}>{BO.TYPE_LABEL[rec.type]}</span></div>
        <div className="t-small" style={{ color:'var(--t2)', marginTop:6 }}>{rec.space} · {rec.inT}{rec.outT?' – '+rec.outT:''}</div>
      </div>
      <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        <div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:14 }}>Línea de tiempo</div>
        <div style={{ position:'relative', paddingLeft:4 }}>
          {events.map((e,i)=>(
            <div key={i} style={{ display:'flex', gap:13, position:'relative', paddingBottom:i<events.length-1?20:0 }}>
              {i<events.length-1 && <div style={{ position:'absolute', left:8, top:18, bottom:0, width:2, background:'var(--separator)' }}/>}
              <div style={{ width:18, height:18, borderRadius:'50%', background:e.c, flexShrink:0, zIndex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }}/></div>
              <div><div className="t-h3" style={{ fontSize:14 }}>{e.l}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{e.t}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:16, marginTop:20, boxShadow:'none', border:'1px solid var(--border-card)' }}>
          <div className="t-micro upper" style={{ color:'var(--t3)' }}>Duración</div>
          <div className="t-h1" style={{ color:'var(--lime-deep)', margin:'4px 0 12px' }}>{BO.durLabel(rec.durMin)}</div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}><span className="t-small" style={{ color:'var(--t2)' }}>{Math.ceil(rec.durMin/60)} h × {BO.COP(rate)}</span><span className="t-small tnum">{BO.COP(rec.amount||Math.ceil(rec.durMin/60)*rate)}</span></div>
          <div style={{ height:1, background:'var(--separator)', margin:'8px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}><span className="t-h3">Total</span><span className="t-h2">{BO.COP(rec.amount||Math.ceil(rec.durMin/60)*rate)}</span></div>
          <div style={{ marginTop:12, display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color: rec.pay==='app'?'var(--green-tx)':'var(--yellow-tx)' }}>
            <Icon n={rec.pay==='app'?'checkC':'warning'} s={16} c={rec.pay==='app'?'var(--green-tx)':'var(--yellow-tx)'}/>{rec.pay==='app'?'Pagado vía app':'Cobrar en sitio'}</div>
        </div>
      </div>
      <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
        {rec.active && <button className="btn btn-green" style={{ flex:1 }} onClick={()=>openModal({ type:'exit', cell:{ label:rec.space, plate:rec.plate, type:rec.type, since:rec.durMin } })}>Registrar Salida</button>}
        <button className="btn btn-ghost" style={{ flex: rec.active?'0 0 auto':1 }}><Icon n="download" s={17} c="var(--t1)"/>Comprobante</button>
      </div>
    </div>
  );
}

/* ───────── PERFIL ───────── */
function Perfil() {
  const { openModal, go } = useBO();
  const g = BO.guard;
  const info = [['Rol','Empleado · Vigilante'],['Email',g.email],['Identificación',g.id],['Teléfono',g.phone],['Dirección',g.addr],['Turno',g.shift]];
  const hist = [['Hoy','6 AM–2 PM','23','19','6h'],['Ayer','6 AM–2 PM','41','40','8h'],['27 May','2–10 PM','38','37','8h'],['26 May','6 AM–2 PM','29','29','8h']];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, height:'100%', overflowY:'auto' }} className="no-sb">
      <div>
        <div className="card rise-s" style={{ overflow:'hidden' }}>
          <div style={{ height:88, background:'var(--ink)', position:'relative' }}>
            <div style={{ position:'absolute', top:-30, right:-20, width:140, height:140, borderRadius:'50%', background:'rgba(198,242,78,.12)' }}/>
            <div style={{ position:'absolute', bottom:-30, left:24, width:64, height:64, borderRadius:'50%', background:'var(--lime)', border:'4px solid var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink)', fontWeight:700, fontFamily:'var(--display)', fontSize:24 }}>{g.initials}</div>
          </div>
          <div style={{ padding:'40px 22px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="t-h2">{g.name}</span><span className="badge bg-info">{g.role}</span>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }} onClick={()=>openModal({ type:'confirm', title:'Editar perfil', desc:'Función disponible para administradores.', confirm:'Entendido' })}>Editar</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 14px', marginTop:18 }}>
              {info.map(([l,v])=>(<div key={l}><div className="t-micro upper" style={{ color:'var(--t3)' }}>{l}</div><div className="t-small" style={{ marginTop:3, fontWeight:500 }}>{v}</div></div>))}
            </div>
          </div>
        </div>
        <div className="t-small" style={{ color:'var(--t3)', fontWeight:600, margin:'18px 0 10px' }}>Hoy</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[['Entradas',BO.records.length],['Salidas',BO.records.filter(r=>!r.active).length],['Turno','6h']].map(([l,v])=>{
            const n=typeof v==='number'?useCountUp(v):null;
            return <div key={l} className="card" style={{ padding:16, textAlign:'center' }}><div className="t-hero">{n!=null?n:v}</div><div className="t-micro upper" style={{ color:'var(--t3)', marginTop:2 }}>{l}</div></div>;
          })}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:18 }}>
          <button className="btn btn-ghost btn-block" onClick={()=>openModal({ type:'confirm', title:'Cambiar contraseña', desc:'Se enviará un enlace seguro a tu correo.', confirm:'Enviar enlace' })}><Icon n="lock" s={18} c="var(--t1)"/>Cambiar contraseña</button>
          <button className="btn btn-danger btn-block" onClick={()=>openModal({ type:'confirm', title:'Cerrar sesión', desc:'¿Seguro que quieres salir de tu turno?', confirm:'Cerrar sesión', danger:true, onConfirm:()=>go('login') })}><Icon n="logout" s={18} c="var(--red)"/>Cerrar sesión</button>
        </div>
      </div>
      <div>
        <div className="card rise-s d1" style={{ padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}><span className="t-h3">Historial de turnos</span><span className="chip" style={{ marginLeft:'auto', height:30 }}>Este mes <Icon n="chevD" s={13} c="var(--t3)"/></span></div>
          <table className="tbl"><thead><tr><th>Fecha</th><th>Turno</th><th>Ent.</th><th>Sal.</th><th>Horas</th></tr></thead>
            <tbody>{hist.map((h,i)=>(<tr key={i} style={{ background:i===0?'var(--elevated)':'transparent' }}><td className="t-small" style={{ fontWeight:600 }}>{h[0]}</td><td className="t-small" style={{ color:'var(--t2)' }}>{h[1]}</td><td className="t-small">{h[2]}</td><td className="t-small">{h[3]}</td><td className="t-small">{h[4]}</td></tr>))}</tbody>
          </table>
        </div>
        <div className="card rise-s d2" style={{ padding:18, marginTop:16 }}>
          <span className="t-h3">Parqueadero asignado</span>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}><Icon n="location" s={20} c="var(--lime-deep)"/><div><div className="t-h3" style={{ fontSize:15 }}>Universidad de Caldas</div><div className="t-small" style={{ color:'var(--t2)' }}>Calle 65 #26-10, Manizales</div></div></div>
          <div className="t-small" style={{ color:'var(--t2)', marginTop:12 }}>Lun–Vie 6 AM – 10 PM · Sáb–Dom 7 AM – 8 PM</div>
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:12 }}>
            {[['Carros',BO.stats.car],['Motos',BO.stats.moto],['Bicicletas',BO.stats.bike]].map(([l,st])=>{
              const pct=st.used/st.cap; return (
              <div key={l}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span className="t-small" style={{ color:'var(--t2)' }}>{l}</span><span className="t-small tnum" style={{ color:'var(--t1)', fontWeight:600 }}>{st.used}/{st.cap}</span></div>
                <div style={{ height:8, borderRadius:8, background:'var(--elevated)', overflow:'hidden' }}><div style={{ height:'100%', width:`${pct*100}%`, background:pct>.9?'var(--red)':pct>.7?'var(--yellow)':'var(--green)', borderRadius:8, transformOrigin:'left', animation:'bar .8s cubic-bezier(.2,.8,.2,1) both' }}/></div></div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── AJUSTES ───────── */
function Ajustes() {
  const { online } = useBO();
  const [pref,setPref]=mS({ sonido:true, alto:false, cupos:true, reserva:true, anom:true, resumen:false });
  const T=(k,l,d)=>(<div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid var(--separator)' }}>
    <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>{l}</div>{d&&<div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{d}</div>}</div>
    <Toggle on={pref[k]} onChange={v=>setPref(p=>({ ...p,[k]:v }))}/></div>);
  const Group=({title,children})=>(<div className="card rise-s" style={{ padding:'18px 20px', marginBottom:16 }}><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:6 }}>{title}</div>{children}</div>);
  return (
    <div className="no-sb" style={{ maxWidth:640, margin:'0 auto', height:'100%', overflowY:'auto', paddingBottom:24 }}>
      <Group title="Preferencias de operación">
        {T('sonido','Sonido de confirmación','Reproduce un beep al registrar entrada o salida.')}
        {T('alto','Modo alto contraste','Hace las celdas del mapa más distinguibles.')}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0' }}>
          <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>Zona por defecto</div></div>
          <span className="chip">Zona A <Icon n="chevD" s={13} c="var(--t3)"/></span></div>
      </Group>
      <Group title="Notificaciones">
        {T('cupos','Alerta de cupos bajos','Cuando queden menos de 5 espacios libres.')}
        {T('reserva','Reserva próxima','Aviso 15 min antes de cada reserva.')}
        {T('anom','Alertas de anomalías','Detección en tiempo real de comportamientos inusuales.')}
        {T('resumen','Resumen de fin de turno',null)}
      </Group>
      <Group title="Conexión">
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0 12px' }}>
          <span style={{ width:9, height:9, borderRadius:'50%', background: online?'var(--green)':'var(--red)' }}/>
          <span className="t-small" style={{ fontWeight:600 }}>{online?'Conectado al servidor':'Sin conexión'}</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }}><Icon n="refresh" s={15} c="var(--t1)"/>Sincronizar</button></div>
        <div style={{ background:'var(--yellow-bg)', borderRadius:12, padding:'12px 14px', display:'flex', gap:9 }}>
          <Icon n="warning" s={18} c="var(--yellow-tx)"/><span className="t-small" style={{ color:'var(--yellow-tx)' }}>Sin conexión, los datos se guardan localmente y se sincronizan al reconectar.</span></div>
      </Group>
      <Group title="Sobre la app">
        <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}><span className="t-small" style={{ color:'var(--t2)' }}>Versión</span><span className="t-small" style={{ fontWeight:600 }}>2.4.0</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}><span className="t-small" style={{ color:'var(--t2)' }}>API</span><span className="t-small" style={{ color:'var(--green-tx)', fontWeight:600 }}>Operativa</span></div>
        <button style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer', marginTop:6 }}>Ver changelog</button>
      </Group>
    </div>
  );
}

/* ───────── MODALS ───────── */
function ModalHost({ modal, close }) {
  if (!modal) return null;
  if (modal.type==='entry') return <EntryModal modal={modal} close={close}/>;
  if (modal.type==='exit') return <ExitModal modal={modal} close={close}/>;
  if (modal.type==='qr') return <QRModal close={close}/>;
  if (modal.type==='camera') return <CameraModal modal={modal} close={close}/>;
  if (modal.type==='alerts') return <AlertsModal close={close} onGo={modal.onGo}/>;
  if (modal.type==='confirm') return <ConfirmModal modal={modal} close={close}/>;
  return null;
}

function SuccessBlock({ title, sub }) {
  return (
    <div style={{ padding:'32px 24px 28px', textAlign:'center' }}>
      <div className="zoom" style={{ width:84, height:84, borderRadius:'50%', background:'var(--green-bg)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="30" style={{ animation:'dash .5s .2s ease forwards' }}/></svg></div>
      <div className="t-h2 rise-s" style={{ marginTop:18 }}>{title}</div>
      <div className="t-small rise-s d1" style={{ color:'var(--t2)', marginTop:6 }}>{sub}</div>
      <div style={{ height:3, background:'var(--separator)', borderRadius:3, marginTop:22, overflow:'hidden' }}><div style={{ height:'100%', background:'var(--lime)', transformOrigin:'left', animation:'bar 2s linear forwards' }}/></div>
    </div>
  );
}

function EntryModal({ modal, close }) {
  const [plate,setPlate]=mS('');
  const [vtype,setVtype]=mS(modal.vtype||'car');
  const [zone,setZone]=mS('A');
  const [done,setDone]=mS(false);
  const [cam,setCam]=mS(false);
  mE(()=>{ if(done){ const t=setTimeout(close,2000); return ()=>clearTimeout(t); } },[done]);
  const space = zone+'4';
  return (
    <Modal open onClose={close}>
      {cam && <CameraModal modal={{ onUse:p=>setPlate(p.replace(/[^A-Z0-9]/g,'').slice(0,6)) }} close={()=>setCam(false)}/>}
      {!done ? (<>
        <ModalHead title="Entrada de vehículo" onClose={close}/>
        <div style={{ padding:'18px 22px 22px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1 }}><Field big ph="Placa del vehículo" value={plate} onChange={v=>setPlate(v.replace(/[^A-Z0-9]/g,'').slice(0,6))} upper autoFocus/></div>
            <button onClick={()=>setCam(true)} title="Leer placa con cámara" style={{ width:56, height:56, borderRadius:16, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-card)' }}><Icon n="cam" s={22} c="var(--lime-deep)"/></button>
          </div>
          <div><div className="t-small" style={{ marginBottom:8 }}>Tipo de vehículo</div><TypeSelect value={vtype} onChange={setVtype}/></div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1 }}><div className="t-small" style={{ marginBottom:8 }}>Zona</div>
              <div style={{ display:'flex', gap:6 }}>{['A','B','M','V'].map(z=><button key={z} onClick={()=>setZone(z)} style={{ flex:1, height:42, borderRadius:11, border:zone===z?'1.5px solid var(--lime-deep)':'1px solid var(--border)', background:zone===z?'var(--lime-tint)':'var(--surface)', color:zone===z?'var(--lime-deep)':'var(--t2)', fontWeight:600, cursor:'pointer' }}>{z}</button>)}</div></div>
            <div style={{ width:120 }}><div className="t-small" style={{ marginBottom:8 }}>Espacio</div><div className="input" style={{ justifyContent:'center', fontWeight:600 }}>{space} · Libre</div></div>
          </div>
        </div>
        <div style={{ padding:'0 22px 22px', display:'flex', gap:10 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={close}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex:1.6 }} disabled={plate.length<3} onClick={()=>setDone(true)}>Registrar Entrada</button>
        </div>
      </>) : <SuccessBlock title="Entrada registrada" sub={`Zona ${zone} · Espacio ${space} · ${BO.fmtPlate(plate)}`}/>}
    </Modal>
  );
}

function ExitModal({ modal, close }) {
  const c = modal.cell;
  const [done,setDone]=mS(false);
  mE(()=>{ if(done){ const t=setTimeout(()=>{ modal.onDone&&modal.onDone(); close(); },1800); return ()=>clearTimeout(t); } },[done]);
  const rate=c.type==='car'?3000:c.type==='moto'?1500:800;
  const total=Math.max(rate, Math.ceil((c.since||80)/60)*rate);
  return (
    <Modal open onClose={close}>
      {!done ? (<>
        <ModalHead title="Confirmar salida" icon="warning" iconColor="var(--yellow-tx)" onClose={close}/>
        <div style={{ padding:'18px 22px 22px' }}>
          <div style={{ background:'var(--elevated)', borderRadius:16, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}><span className="t-h1 mono">{BO.fmtPlate(c.plate)}</span><span className="badge bg-info" style={{ marginLeft:'auto' }}>{BO.TYPE_LABEL[c.type]}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, paddingTop:12, borderTop:'1px solid var(--border)' }}>
              <span className="t-small" style={{ color:'var(--t2)' }}>Espacio {c.label}</span>
              <span className="t-small" style={{ color:'var(--lime-deep)', fontWeight:600 }}>Tiempo: <LiveTimer fromMin={c.since||80}/></span></div>
          </div>
          <div style={{ background:'var(--lime-bg)', border:'1px solid var(--lime-tint)', borderRadius:16, padding:16, marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span className="t-small" style={{ color:'var(--t2)' }}>{Math.ceil((c.since||80)/60)} h × {BO.COP(rate)}</span><span className="t-small tnum">{BO.COP(total)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid var(--lime-tint)' }}><span className="t-h3">Total</span><span className="t-h2" style={{ color:'var(--lime-deep)' }}>{BO.COP(total)}</span></div>
            <div style={{ marginTop:8, fontSize:13, fontWeight:600, color:'var(--green-tx)' }}>✓ Pagado vía app</div>
          </div>
          <p className="t-small" style={{ color:'var(--t2)', marginTop:14 }}>¿Confirmar la salida de este vehículo?</p>
        </div>
        <div style={{ padding:'0 22px 22px', display:'flex', gap:10 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={close}>Cancelar</button>
          <button className="btn btn-green btn-lg" style={{ flex:1.6 }} onClick={()=>setDone(true)}>Sí, registrar salida</button>
        </div>
      </>) : <SuccessBlock title="Salida registrada" sub={`${BO.fmtPlate(c.plate)} · ${BO.COP(total)} cobrado`}/>}
    </Modal>
  );
}

function QRModal({ close }) {
  const [state,setState]=mS('scan');
  mE(()=>{ const t=setTimeout(()=>setState('valid'),2400); return ()=>clearTimeout(t); },[]);
  mE(()=>{ if(state==='valid'){ const t=setTimeout(close,1800); return ()=>clearTimeout(t); } },[state]);
  const frameColor = state==='valid'?'var(--green)':state==='invalid'?'var(--red)':'var(--lime)';
  return (
    <Modal open onClose={close} wide>
      <ModalHead title="Escanear QR de reserva" onClose={close}/>
      <div style={{ padding:'18px 22px 22px' }}>
        <div style={{ position:'relative', background:'#0A0A0F', borderRadius:18, height:300, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {/* simulated camera grid */}
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:.25 }}><defs><pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#2A3340" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
          {/* corner brackets */}
          {[[12,12,'nw'],[12,12,'ne'],[12,12,'sw'],[12,12,'se']].map((_,i)=>{
            const pos = [{top:60,left:90},{top:60,right:90},{bottom:60,left:90},{bottom:60,right:90}][i];
            const b = { borderColor:frameColor };
            const sty = { position:'absolute', width:34, height:34, ...pos,
              borderTop: i<2?`3px solid ${frameColor}`:'none', borderBottom:i>=2?`3px solid ${frameColor}`:'none',
              borderLeft:(i%2===0)?`3px solid ${frameColor}`:'none', borderRight:(i%2===1)?`3px solid ${frameColor}`:'none',
              borderTopLeftRadius:i===0?8:0, borderTopRightRadius:i===1?8:0, borderBottomLeftRadius:i===2?8:0, borderBottomRightRadius:i===3?8:0, transition:'border-color .3s' };
            return <div key={i} style={sty}/>;
          })}
          {state==='scan' && <div style={{ position:'absolute', left:'25%', right:'25%', height:2, background:'var(--lime)', boxShadow:'0 0 12px 2px rgba(198,242,78,.7)', animation:'scanline 2s ease-in-out infinite' }}/>}
          <Icon n="qr" s={120} c={state==='valid'?'var(--green)':'rgba(255,255,255,.25)'}/>
          {state==='valid' && <div style={{ position:'absolute', inset:0, background:'rgba(61,163,93,.12)' }}/>}
        </div>
        {state==='scan' && <p className="t-small" style={{ textAlign:'center', color:'var(--t2)', marginTop:14 }}>Centra el código QR dentro del marco</p>}
        {state==='valid' && (
          <div className="rise-s" style={{ background:'var(--green-bg)', border:'1px solid var(--green)', borderRadius:14, padding:14, marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
            <Icon n="checkC" s={22} c="var(--green-tx)"/>
            <div><div className="t-small" style={{ fontWeight:600, color:'var(--green-tx)' }}>Reserva válida</div><div className="t-micro" style={{ color:'var(--green-tx)' }}>Laura M. · ZXC-123 · Espacio C2</div></div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function ConfirmModal({ modal, close }) {
  return (
    <Modal open onClose={close}>
      <ModalHead title={modal.title} icon={modal.danger?'warning':'info'} iconColor={modal.danger?'var(--red)':'var(--lime-deep)'} onClose={close}/>
      <div style={{ padding:'14px 22px 20px' }}><p className="t-body" style={{ color:'var(--t2)', margin:0 }}>{modal.desc}</p></div>
      <div style={{ padding:'0 22px 22px', display:'flex', gap:10 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={close}>Cancelar</button>
        <button className={'btn '+(modal.danger?'btn-danger':'btn-primary')} style={{ flex:1.4 }} onClick={()=>{ modal.onConfirm&&modal.onConfirm(); close(); }}>{modal.confirm||'Confirmar'}</button>
      </div>
    </Modal>
  );
}

Object.assign(window.BO_PAGES, { registros:Registros, perfil:Perfil, ajustes:Ajustes });
window.ModalHost = ModalHost;
