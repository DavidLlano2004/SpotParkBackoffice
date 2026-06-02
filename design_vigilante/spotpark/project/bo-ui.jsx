/* bo-ui.jsx — SpotPark Backoffice shared UI. Exports to window. */
const { useState:uS, useEffect:uE, useRef:uR, createContext, useContext } = React;

const BOCtx = createContext({ route:'dashboard', go:()=>{}, openModal:()=>{}, online:true });
const useBO = () => useContext(BOCtx);

/* count-up */
function useCountUp(target, dur=600) {
  const [v,setV]=uS(target); const ref=uR(target);
  uE(()=>{ if(document.hidden){ ref.current=target; setV(target); return; }
    const from=ref.current, t0=performance.now(); let raf;
    const tick=now=>{ const p=Math.min(1,(now-t0)/dur); const e=1-Math.pow(1-p,3); setV(Math.round(from+(target-from)*e)); if(p<1)raf=requestAnimationFrame(tick); else ref.current=target; };
    setV(0); raf=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(raf); },[target]);
  return v;
}

function LiveClock({ style }) {
  const [t,setT]=uS(new Date());
  uE(()=>{ const i=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(i); },[]);
  const p=n=>String(n).padStart(2,'0');
  return <span className="mono tnum" style={style}>{p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}</span>;
}
function LiveTimer({ fromMin, style }) {
  const [s,setS]=uS(0);
  uE(()=>{ const i=setInterval(()=>setS(x=>x+1),1000); return ()=>clearInterval(i); },[]);
  const base=(fromMin||0)*60 + s;
  const p=n=>String(n).padStart(2,'0');
  return <span className="mono tnum" style={style}>{p(Math.floor(base/3600))}:{p(Math.floor((base%3600)/60))}:{p(base%60)}</span>;
}

/* ── Sidebar (ink) ── */
function Sidebar() {
  const { route, go, openModal } = useBO();
  const items = [
    { k:'dashboard', ic:'grid', label:'Dashboard' },
    { k:'mapa', ic:'location', label:'Mapa' },
    { k:'registros', ic:'list', label:'Registros' },
    { k:'chat', ic:'chat', label:'Mensajes', badge:2 },
    { k:'incidentes', ic:'warning', label:'Incidentes' },
    { k:'heatmap', ic:'flame', label:'Mapa de calor' },
    { k:'perfil', ic:'user', label:'Perfil' },
  ];
  const NavBtn = ({ k, ic, label, onClick, badge }) => {
    const on = route===k;
    const [hov,setHov]=uS(false);
    return (
      <div style={{ position:'relative' }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <button onClick={onClick||(()=>go(k))} style={{ width:48, height:48, borderRadius:14, border:'none', cursor:'pointer',
          background: on?'rgba(198,242,78,.14)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', transition:'background .15s' }}>
          {on && <span style={{ position:'absolute', left:-10, top:12, bottom:12, width:3, borderRadius:3, background:'var(--lime)' }}/>}
          <Icon n={ic} s={22} c={on?'var(--lime)':'rgba(255,255,255,.45)'}/>
          {badge>0 && <span className="tnum" style={{ position:'absolute', top:7, right:7, minWidth:16, height:16, borderRadius:8, background:'var(--red)', color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', border:'2px solid var(--ink)' }}>{badge}</span>}
        </button>
        {hov && <div style={{ position:'absolute', left:56, top:12, background:'var(--ink-2)', color:'#fff', fontSize:12, fontWeight:500,
          padding:'6px 10px', borderRadius:8, whiteSpace:'nowrap', zIndex:50, boxShadow:'var(--sh-pop)' }}>{label}</div>}
      </div>
    );
  };
  return (
    <div style={{ width:72, flexShrink:0, background:'var(--ink)', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0' }}>
      <div style={{ width:42, height:42, borderRadius:13, background:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}>
        <span style={{ color:'var(--ink)', fontFamily:'var(--display)', fontWeight:700, fontSize:22 }}>P</span></div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:28 }}>
        {items.map(it=><NavBtn key={it.k} {...it}/>)}
      </div>
      <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:6 }}>
        <NavBtn k="postturno" ic="clock" label="Finalizar turno" onClick={()=>go('postturno')}/>
        <NavBtn k="ajustes" ic="cog" label="Ajustes"/>
        <NavBtn k="__logout" ic="logout" label="Cerrar sesión" onClick={()=>openModal({ type:'confirm', title:'Cerrar sesión', desc:'¿Seguro que quieres salir de tu turno?', confirm:'Cerrar sesión', danger:true, onConfirm:()=>go('login') })}/>
      </div>
    </div>
  );
}

/* ── TopBar ── */
function TopBar({ title }) {
  const { online } = useBO();
  return (
    <div style={{ height:60, flexShrink:0, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 24px', gap:16, background:'var(--bg)' }}>
      <span className="t-h2">{title}</span>
      <span className="t-small" style={{ color:'var(--t3)', marginLeft:6 }}>· {BO.guard.parking}</span>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:16 }}>
        <LiveClock style={{ color:'var(--t2)', fontSize:14 }}/>
        <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:13, color:'var(--t2)' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background: online?'var(--green)':'var(--red)', animation: online?'pulse 1.8s infinite':'none' }}/>
          {online?'En línea':'Sin conexión'}</span>
        <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:13 }}>{BO.guard.initials}</div>
      </div>
    </div>
  );
}

/* ── StatusBar ── */
function StatusBar() {
  const { online } = useBO();
  if (!online) return (
    <div style={{ height:40, flexShrink:0, background:'var(--yellow-bg)', borderTop:'2px solid var(--yellow)', display:'flex', alignItems:'center', padding:'0 24px', gap:8 }}>
      <Icon n="warning" s={16} c="var(--yellow-tx)"/><span className="t-small" style={{ color:'var(--yellow-tx)', fontWeight:500 }}>Sin conexión — mostrando datos en caché. Se sincronizará al reconectar.</span>
    </div>
  );
  return (
    <div style={{ height:38, flexShrink:0, borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 24px', background:'var(--bg)' }}>
      <span className="t-micro" style={{ color:'var(--t3)' }}>{BO.guard.name} · {BO.guard.role}</span>
      <span className="t-micro" style={{ color:'var(--t3)', margin:'0 auto' }}>Turno {BO.guard.shift}</span>
      <span className="t-micro" style={{ color:'var(--t3)' }}>Última sincronización: hace 30 seg</span>
    </div>
  );
}

/* ── Badge ── */
const STATUS = {
  free:{ cls:'bg-avail', c:'var(--green)', label:'Libre' },
  occupied:{ cls:'bg-full', c:'var(--red)', label:'Ocupado' },
  reserved:{ cls:'bg-resv', c:'var(--blue)', label:'Reservado' },
  disabled:{ cls:'', c:'var(--t3)', label:'Fuera de servicio' },
};
function Badge({ status, children }) {
  const s = STATUS[status] || { cls:'bg-info', c:'var(--lime-deep)' };
  return <span className={'badge '+s.cls}><span className="dot" style={{ background:s.c }}/>{children || s.label}</span>;
}

/* ── OccupancyRing ── */
function Ring({ pct, size=64, sw=7, color, track='var(--elevated)', children }) {
  const r=(size-sw)/2, c=2*Math.PI*r;
  const col = color || (pct>0.9?'var(--red)':pct>0.7?'var(--yellow)':'var(--green)');
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={sw} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth={sw} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c*(1-pct)} style={{ transition:'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      {children && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>{children}</div>}
    </div>
  );
}

/* ── AIInsightCard ── */
function AIInsightCard({ title='SpotPark AI', body, action, delay=0.35, style }) {
  return (
    <div className="inleft" style={{ animationDelay:`${delay}s`, position:'relative', overflow:'hidden', background:'var(--lime-bg)',
      border:'1px solid var(--lime-tint)', borderRadius:16, padding:'14px 16px 14px 18px', ...style }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--lime)' }}/>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
        <Icon n="sparkle" s={15} c="var(--lime-deep)"/><span style={{ fontSize:13, fontWeight:600, color:'var(--lime-deep)' }}>{title}</span></div>
      <p className="t-small" style={{ color:'var(--t1)', margin:0, lineHeight:1.5 }}>{body}</p>
      {action}
    </div>
  );
}

/* ── SpaceCell ── */
function SpaceCell({ cell, selected, onClick }) {
  const cls = selected ? 'sel' : cell.status;
  const sub = cell.status==='occupied' ? '·'+(cell.plate||'').slice(-3)
            : cell.status==='reserved' ? (cell.resv?.time||'') : '';
  return (
    <div className={'cell '+cls} onClick={onClick} title={cell.label} style={cell.flag?{ borderColor:'var(--orange)', animation:'flag-pulse 1.8s ease-in-out infinite' }:null}>
      {cell.flag && <Icon n="warning" s={11} c="var(--orange)" style={{ position:'absolute', top:4, right:5 }}/>}
      {cell.status==='reserved' && <Icon n="cal" s={11} c={selected?'var(--lime)':'var(--blue)'} style={{ position:'absolute', top:5, right:6 }}/>}
      <span className="lbl">{cell.label}</span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}

/* ── Modal ── */
function Modal({ open, onClose, children, wide }) {
  uE(()=>{ const h=e=>{ if(e.key==='Escape') onClose&&onClose(); }; document.addEventListener('keydown',h); return ()=>document.removeEventListener('keydown',h); },[onClose]);
  if (!open) return null;
  return (
    <div className="fade" style={{ position:'fixed', inset:0, background:'var(--overlay)', backdropFilter:'blur(3px)', zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={onClose}>
      <div className="rise" onClick={e=>e.stopPropagation()} style={{ background:'var(--surface)', borderRadius:24, width:'100%',
        maxWidth: wide?520:460, boxShadow:'var(--sh-pop)', overflow:'hidden' }}>{children}</div>
    </div>
  );
}
function ModalHead({ title, icon, iconColor, onClose }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 22px 0' }}>
      {icon && <Icon n={icon} s={22} c={iconColor||'var(--ink)'}/>}
      <span className="t-h2">{title}</span>
      <button onClick={onClose} style={{ marginLeft:'auto', width:34, height:34, borderRadius:10, border:'none', cursor:'pointer', background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="x" s={18} c="var(--t2)"/></button>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ on, onChange }) {
  return <button className="tg" onClick={()=>onChange(!on)} style={{ background:on?'var(--lime-deep)':'#CFD2CB', justifyContent:on?'flex-end':'flex-start' }}><span className="knob"/></button>;
}

/* ── Field ── */
function Field({ ic, ph, value, onChange, lg, big, trailing, autoFocus, upper }) {
  const [f,setF]=uS(false);
  return (
    <div className={'input'+(lg?' lg':'')+(f?' focus':'')} style={ big?{ height:56, borderRadius:16 }:null}>
      {ic && <Icon n={ic} s={19} c={f?'var(--lime-deep)':'var(--t3)'}/>}
      <input autoFocus={autoFocus} value={value} onChange={e=>onChange&&onChange(upper?e.target.value.toUpperCase():e.target.value)}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)} placeholder={ph}
        style={ big?{ fontSize:22, fontWeight:600, fontFamily:'var(--mono)', letterSpacing:'.06em' }:null}/>
      {trailing}
    </div>
  );
}

/* vehicle type chip selector */
function TypeSelect({ value, onChange, types=['car','moto','bike'] }) {
  const meta = { car:['🚗','Carro'], moto:['🏍️','Moto'], bike:['🚲','Bici'] };
  return (
    <div style={{ display:'flex', gap:10 }}>
      {types.map(t=>{ const on=value===t; const [e,l]=meta[t];
        return <button key={t} onClick={()=>onChange(t)} style={{ flex:1, height:48, borderRadius:14, cursor:'pointer', gap:7,
          background:on?'var(--lime-tint)':'var(--surface)', border:on?'1.5px solid var(--lime-deep)':'1px solid var(--border)',
          color:on?'var(--lime-deep)':'var(--t2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600 }}>
          <span style={{ fontSize:18 }}>{e}</span>{l}</button>;
      })}
    </div>
  );
}

Object.assign(window, { BOCtx, useBO, useCountUp, LiveClock, LiveTimer, Sidebar, TopBar, StatusBar, Badge, STATUS, Ring, AIInsightCard, SpaceCell, Modal, ModalHead, Toggle, Field, TypeSelect });
