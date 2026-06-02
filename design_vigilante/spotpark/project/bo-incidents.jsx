/* bo-incidents.jsx — F14 · Reporte de incidentes (backoffice) */
const { useState:iS } = React;

const INC_META = {
  damage:  { ic:'warning', c:'var(--red)', t:'Daño al vehículo' },
  service: { ic:'user', c:'var(--orange)', t:'Mal servicio' },
  billing: { ic:'card', c:'var(--blue)', t:'Cobro incorrecto' },
  space:   { ic:'location', c:'var(--yellow)', t:'Estado del espacio' },
};
const INC_STATUS = {
  open:     { cls:'bg-few', t:'Abierto' },
  review:   { cls:'bg-resv', t:'En revisión' },
  resolved: { cls:'bg-avail', t:'Resuelto' },
};

function Incidentes() {
  const [filter,setFilter]=iS('open');
  const [sel,setSel]=iS(null);
  const map = { open:['open'], review:['review'], resolved:['resolved'], all:['open','review','resolved'] };
  const list = BO.incidents.filter(x=>map[filter].includes(x.status));
  return (
    <div style={{ display:'grid', gridTemplateColumns:'46% 54%', height:'100%', margin:-24 }}>
      {/* list */}
      <div style={{ borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}>
            <span className="t-h2">Incidentes</span>
            <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}><Icon n="plus" s={16} c="var(--ink)"/>Nuevo</button>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[['open','Abiertos'],['review','En revisión'],['resolved','Resueltos'],['all','Todos']].map(([k,l])=>(
              <button key={k} onClick={()=>{setFilter(k);setSel(null);}} style={{ height:32, padding:'0 12px', borderRadius:9, border:'none', cursor:'pointer', background:filter===k?'var(--ink)':'var(--elevated)', color:filter===k?'#fff':'var(--t2)', fontSize:12.5, fontWeight:600 }}>{l}</button>
            ))}
          </div>
        </div>
        <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'14px 18px' }}>
          {list.length===0 && <div style={{ textAlign:'center', padding:'50px 0', color:'var(--t2)' }}><Icon n="checkC" s={38} c="var(--green)"/><p className="t-small" style={{ marginTop:10 }}>Sin incidentes en este filtro.</p></div>}
          {list.map(x=>{
            const m=INC_META[x.type], st=INC_STATUS[x.status], on=sel?.id===x.id;
            return (
              <button key={x.id} onClick={()=>setSel(x)} className="rise-s" style={{ width:'100%', textAlign:'left', cursor:'pointer', display:'block',
                background:on?'var(--surface)':'var(--surface)', boxShadow: on?'var(--sh-card)':'none', border:'1px solid var(--border-card)', borderLeft:`3px solid ${m.c}`, borderRadius:14, padding:14, marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Icon n={m.ic} s={17} c={m.c}/><span className="t-h3" style={{ fontSize:14 }}>{m.t}</span>
                  <span className={'badge '+st.cls} style={{ marginLeft:'auto' }}>{st.t}</span>
                </div>
                <div className="t-small" style={{ color:'var(--t2)', margin:'8px 0 6px' }}><b className="mono" style={{ color:'var(--t1)' }}>{BO.fmtPlate(x.plate)}</b> · {x.id}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span className="t-micro" style={{ color:'var(--t3)' }}>{x.when}</span>
                  {x.photos>0 && <span className="t-micro" style={{ color:'var(--t3)', display:'inline-flex', alignItems:'center', gap:4 }}><Icon n="cam" s={13} c="var(--t3)"/>{x.photos}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* detail */}
      <div style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {!sel
          ? <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:32 }}>
              <div style={{ width:72, height:72, borderRadius:20, background:'var(--surface)', boxShadow:'var(--sh-card)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}><Icon n="warning" s={32} c="var(--t3)"/></div>
              <div className="t-h2" style={{ color:'var(--t2)' }}>Selecciona un incidente</div>
              <p className="t-small" style={{ color:'var(--t3)', maxWidth:280, marginTop:8 }}>Revisa el detalle, las fotos, la línea de tiempo y cambia el estado.</p>
            </div>
          : <IncidentDetail key={sel.id} x={sel}/>}
      </div>
    </div>
  );
}

function IncidentDetail({ x }) {
  const { openModal } = useBO();
  const m=INC_META[x.type];
  const [status,setStatus]=iS(x.status);
  const steps=[['open','Abierto'],['review','En revisión'],['resolved','Resuelto']];
  return (
    <div className="fade" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={m.ic} s={22} c={m.c}/></div>
          <div style={{ flex:1 }}><div className="t-h3">{m.t}</div><div className="t-micro mono" style={{ color:'var(--t3)' }}>{x.id} · {x.res}</div></div>
          <span className={'badge '+INC_STATUS[status].cls}>{INC_STATUS[status].t}</span>
        </div>
      </div>
      <div className="no-sb" style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        <div className="t-small" style={{ color:'var(--t2)' }}>Vehículo <b className="mono" style={{ color:'var(--t1)' }}>{BO.fmtPlate(x.plate)}</b> · {x.when}</div>
        <p className="t-body" style={{ color:'var(--t1)', marginTop:10 }}>{x.desc}</p>

        {x.photos>0 && (<>
          <div className="t-micro upper" style={{ color:'var(--t3)', margin:'18px 0 10px' }}>Evidencia</div>
          <div style={{ display:'flex', gap:10 }}>
            {[...Array(x.photos)].map((_,i)=>(
              <div key={i} style={{ width:96, height:96, borderRadius:12, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><Icon n="cam" s={26} c="var(--t3)"/></div>
            ))}
          </div>
        </>)}

        <div className="t-micro upper" style={{ color:'var(--t3)', margin:'22px 0 12px' }}>Línea de tiempo</div>
        <div style={{ position:'relative', paddingLeft:4 }}>
          {x.tl.map((e,i)=>(
            <div key={i} style={{ display:'flex', gap:13, position:'relative', paddingBottom:i<x.tl.length-1?18:0 }}>
              {i<x.tl.length-1 && <div style={{ position:'absolute', left:8, top:18, bottom:0, width:2, background:'var(--separator)' }}/>}
              <div style={{ width:18, height:18, borderRadius:'50%', background:e.c, flexShrink:0, zIndex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }}/></div>
              <div><div className="t-h3" style={{ fontSize:14 }}>{e.l}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{e.t}</div></div>
            </div>
          ))}
        </div>

        {/* status changer */}
        <div className="t-micro upper" style={{ color:'var(--t3)', margin:'22px 0 10px' }}>Cambiar estado</div>
        <div style={{ display:'flex', gap:8 }}>
          {steps.map(([k,l])=>(
            <button key={k} onClick={()=>setStatus(k)} className={'chip'+(status===k?' on':'')} style={{ flex:1, justifyContent:'center' }}>{l}</button>
          ))}
        </div>

        <div className="t-micro upper" style={{ color:'var(--t3)', margin:'22px 0 8px' }}>Nota del vigilante</div>
        <div className="input" style={{ height:'auto', alignItems:'flex-start', padding:'12px 14px' }}>
          <textarea rows="2" placeholder="Agrega una nota o resolución…" style={{ resize:'none' }}/></div>
      </div>
      <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>openModal({ type:'confirm', title:'Contactar usuario', desc:'Se enviará una notificación al usuario en su app.', confirm:'Enviar' })}><Icon n="chat" s={17} c="var(--t1)"/>Contactar usuario</button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={()=>setStatus('resolved')}><Icon n="check" s={17} c="var(--ink)"/>Marcar resuelto</button>
      </div>
    </div>
  );
}

Object.assign(window.BO_PAGES, { incidentes:Incidentes });
