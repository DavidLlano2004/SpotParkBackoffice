/* sp-ui.jsx — SpotPark shared UI (dark). Exports to window. */
window.SP_SCREENS = window.SP_SCREENS || {};

const Nav = React.createContext({ push:()=>{}, pop:()=>{}, replace:()=>{}, go:()=>{}, tab:'home' });
const useNav = () => React.useContext(Nav);

const AVAIL = { available:'var(--green)', few:'var(--orange)', full:'var(--red)' };
const AVAIL_LABEL = { available:'Disponible', few:'Pocos cupos', full:'Lleno' };

/* device chrome — status bar adapts to light/dark screens */
function Chrome({ time='9:41', onDark=false }) {
  const col = onDark ? '#fff' : '#0F1115';
  return (
    <>
      <div className="island" />
      <div className="statusbar" style={{ color: col }}>
        <span className="tnum">{time}</span>
        <span className="ico">
          <svg width="18" height="11" viewBox="0 0 18 11"><g fill={col}>
            <rect x="0" y="6.5" width="3" height="4.5" rx=".6"/><rect x="4.4" y="4" width="3" height="7" rx=".6"/>
            <rect x="8.8" y="2" width="3" height="9" rx=".6"/><rect x="13.2" y="0" width="3" height="11" rx=".6"/>
          </g></svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 3.4c2 0 3.9.8 5.3 2.1l1-1.1A9 9 0 0 0 8 1.7 9 9 0 0 0 1.7 4.4l1 1.1A7.4 7.4 0 0 1 8 3.4Z" fill={col}/><path d="M8 6.6c1.1 0 2.1.4 2.8 1.1l1-1.1A6 6 0 0 0 8 4.9a6 6 0 0 0-3.8 1.7l1 1.1A4 4 0 0 1 8 6.6Z" fill={col}/><circle cx="8" cy="9.5" r="1.3" fill={col}/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3" stroke={col} strokeOpacity=".4"/><rect x="2" y="2" width="18" height="8" rx="1.8" fill={col}/><path d="M23 4v4c.8-.3 1.3-1 1.3-2S23.8 4.3 23 4Z" fill={col} fillOpacity=".5"/></svg>
        </span>
      </div>
      <div className="home-ind" style={{ background: onDark ? 'rgba(255,255,255,.85)' : 'rgba(15,17,21,.3)' }} />
    </>
  );
}

function TopBar({ title, onBack, right, transparent, onDark }) {
  const col = onDark ? '#fff' : 'var(--t1)';
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'62px 16px 10px',
      position:'relative', zIndex:5, background: transparent?'transparent':(onDark?'var(--ink)':'var(--bg)') }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {onBack && <RoundBtn glass={onDark} onClick={onBack}><Icon n="chevL" s={21} c={col}/></RoundBtn>}
        {title && <span className="t-h2" style={{ color:col }}>{title}</span>}
      </div>
      <div style={{ display:'flex', gap:10 }}>{right}</div>
    </div>
  );
}

function RoundBtn({ children, onClick, size=44, style, glass }) {
  return (
    <button onClick={onClick} style={{
      width:size, height:size, borderRadius:'50%', cursor:'pointer',
      background: glass ? 'rgba(0,0,0,.4)' : 'var(--surface)',
      border:'none', boxShadow: glass ? 'none' : 'var(--sh-card)', backdropFilter: glass?'blur(10px)':'none', WebkitBackdropFilter: glass?'blur(10px)':'none',
      display:'flex', alignItems:'center', justifyContent:'center',
      transition:'transform .12s', ...style }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(.9)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {children}
    </button>
  );
}

/* floating tab bar — 4 tabs + raised center AI button */
function TabBar() {
  const { tab, go, push } = useNav();
  const items = [
    { k:'home', icon:'pin', label:'Inicio' },
    { k:'trips', icon:'ticket', label:'Reservas' },
    { k:'__ai', center:true },
    { k:'saved', icon:'heart', label:'Guardados' },
    { k:'profile', icon:'user', label:'Perfil' },
  ];
  return (
    <div style={{ position:'absolute', left:0, right:0, bottom:24, display:'flex', justifyContent:'center', zIndex:40, pointerEvents:'none' }}>
      <div style={{ pointerEvents:'auto', display:'flex', alignItems:'center', gap:2, background:'var(--surface)', boxShadow:'var(--sh-pop)',
        borderRadius:'var(--r-pill)', padding:'7px 10px' }}>
        {items.map(it => {
          if (it.center) return (
            <button key={it.k} onClick={()=>push('ai')} title="Buscar con IA" style={{ width:52, height:52, margin:'0 4px', borderRadius:18, border:'none', cursor:'pointer',
              background:'var(--ink)', boxShadow:'var(--sh-ink)', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform .16s' }}
              onMouseDown={e=>e.currentTarget.style.transform='scale(.9)'} onMouseUp={e=>e.currentTarget.style.transform='scale(1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
              <Icon n="sparkFill" s={24} c="var(--blue)"/>
            </button>
          );
          const on = it.k === tab;
          return (
            <button key={it.k} onClick={()=>go(it.k)} style={{ height:44, padding: on?'0 14px':'0 10px', borderRadius:'var(--r-pill)',
              background: on?'var(--blue-tint)':'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6,
              transition:'all .25s cubic-bezier(.3,1,.4,1)' }}>
              <Icon n={on && it.k==='saved' ? 'heartFill' : it.icon} s={21} c={on?'var(--ink)':'var(--t3)'}/>
              {on && <span style={{ fontSize:12, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap' }}>{it.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* stylized map — light by default, dark for immersive screens */
function MapMock({ children, style, dark }) {
  const land = dark?'#0F0F1E':'#E9EBE4', road = dark?'#1E1E3A':'#FBFBF8', minor = dark?'#161628':'#F2F2EE',
        block = dark?'#141428':'#E2E5DC', park = dark?'#0D1F12':'#DDE7D2', water = dark?'#0D1525':'#D7E7E4',
        dash = dark?'#222244':'#EBEBE3';
  return (
    <div style={{ position:'absolute', inset:0, background:land, overflow:'hidden', ...style }}>
      <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect width="390" height="844" fill={land}/>
        <path d="M-20 110 Q 80 70 150 140 T 300 150 L 320 -20 -40 -30Z" fill={park} opacity=".9"/>
        <circle cx="60" cy="650" r="80" fill={park} opacity=".85"/>
        <path d="M250 560 Q 320 540 410 600 L 430 880 220 870Z" fill={water}/>
        {[[40,360],[200,360],[40,560],[300,200],[300,640]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width="70" height="70" rx="6" fill={block}/>
        ))}
        <g stroke={road} strokeWidth="20" fill="none" strokeLinecap="round">
          <path d="M-20 300 H 420"/><path d="M-20 520 H 420"/>
          <path d="M120 -20 V 880"/><path d="M280 -20 V 880"/>
        </g>
        <g stroke={minor} strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-20 180 H 420"/><path d="M-20 700 H 420"/>
          <path d="M40 -20 V 880"/><path d="M200 -20 V 880"/><path d="M350 -20 V 880"/>
        </g>
        <g stroke={dash} strokeWidth="2" strokeDasharray="6 10" fill="none">
          <path d="M-20 300 H 420"/><path d="M120 -20 V 880"/><path d="M280 -20 V 880"/>
        </g>
      </svg>
      {children}
    </div>
  );
}

/* map parking pin: 32px circle, ring = availability, center P, pulse when available */
function ParkingPin({ x, y, status='available', count, active, stale, delay=0, onClick }) {
  const ring = stale ? '#475569' : AVAIL[status];
  return (
    <button onClick={onClick} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)',
      border:'none', background:'none', cursor:'pointer', padding:0, zIndex: active?7:5,
      animation:`sp-zoom .5s cubic-bezier(.2,.9,.3,1.2) both`, animationDelay:`${delay}s` }}>
      <div style={{ position:'relative' }}>
        {status==='available' && !stale && (
          <span style={{ position:'absolute', inset:-4, borderRadius:'50%', background:ring, opacity:.25,
            animation:'sp-pulse 2s ease-in-out infinite' }}/>
        )}
        <div style={{ width: active?40:32, height: active?40:32, borderRadius:'50%', background:'var(--surface)',
          border:`3px solid ${ring}`, display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .2s', boxSizing:'border-box', boxShadow:'var(--sh-card)' }}>
          <span style={{ color:'var(--ink)', fontWeight:600, fontSize: active?15:12 }}>P</span>
        </div>
        {count!=null && count>0 && (
          <span className="tnum" style={{ position:'absolute', top:-6, right:-6, minWidth:18, height:18, padding:'0 4px',
            borderRadius:'50%', background:'var(--ink)', color:'#fff', fontSize:10, fontWeight:600,
            display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--bg)' }}>{count}</span>
        )}
      </div>
    </button>
  );
}

function UserDot({ x=50, y=62 }) {
  return (
    <div style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)', zIndex:4 }}>
      <div style={{ position:'absolute', inset:-7, borderRadius:'50%', background:'#2F6BE0', opacity:.22, animation:'sp-ping 2.4s ease-out infinite' }}/>
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#2F6BE0', border:'2.5px solid #fff', boxShadow:'0 2px 6px rgba(47,107,224,.5)' }}/>
    </div>
  );
}

function Badge({ status, count }) {
  const cls = status==='available'?'badge-avail':status==='few'?'badge-few':'badge-full';
  const dotc = AVAIL[status];
  return (
    <span className={'badge '+cls}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:dotc }}/>
      {count!=null ? (status==='full'?'Lleno':`${count} cupos`) : AVAIL_LABEL[status]}
    </span>
  );
}

/* AI insight card — blue left accent bar, sparkle, "SpotPark AI" header */
function AIInsightCard({ title='SpotPark AI', body, icon='sparkle', onPress, micro, delay=0.4, action }) {
  return (
    <div onClick={onPress} className="in-left" style={{ animationDelay:`${delay}s`, position:'relative', overflow:'hidden',
      background:'var(--blue-bg)', border:'.5px solid var(--blue-tint)', borderRadius:16, padding: micro?'12px 14px 12px 16px':'14px 16px 14px 18px',
      cursor:onPress?'pointer':'default' }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--blue)' }}/>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
        <Icon n={icon} s={15} c="var(--blue-light)"/>
        <span style={{ fontSize:13, fontWeight:500, color:'var(--blue-light)' }}>{title}</span>
      </div>
      <p style={{ fontSize:13, color:'var(--t2)', margin:0, lineHeight:1.45 }}>{body}</p>
      {action}
    </div>
  );
}

/* vehicle chip */
function VehicleChip({ type, label, emoji, selected, onClick, display }) {
  return (
    <button onClick={onClick} disabled={display} style={{ height:44, minWidth:90, padding:'0 14px', borderRadius:12, cursor:display?'default':'pointer',
      background: selected?'var(--blue-tint)':'var(--surface)', border: selected?'1.5px solid var(--blue)':'.5px solid var(--border)',
      color: selected?'var(--blue-light)':'var(--t2)', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
      fontSize:14, fontWeight:500, transition:'all .15s' }}>
      <span style={{ fontSize:18 }}>{emoji}</span>{label}
    </button>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', background:'var(--surface)', borderRadius:'var(--r-pill)', padding:4, gap:2, border:'.5px solid var(--border)' }}>
      {options.map(o => {
        const k = o.k ?? o, on = k === value;
        return (
          <button key={k} onClick={()=>onChange(k)} style={{ flex:1, height:38, border:'none', cursor:'pointer', borderRadius:'var(--r-pill)',
            background: on?'var(--ink)':'transparent', color: on?'#fff':'var(--t2)', fontWeight:600, fontSize:14,
            transition:'all .3s cubic-bezier(.3,1,.4,1)' }}>{o.label ?? o}</button>
        );
      })}
    </div>
  );
}

function Stepper({ value, onChange, suffix='h', min=1, max=24, step=1 }) {
  const B = ({d, ic}) => (
    <button onClick={()=>onChange(Math.min(max,Math.max(min, value+d)))} style={{ width:44, height:44, borderRadius:12, border:'.5px solid var(--border)',
      cursor:'pointer', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform .12s' }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(.9)'} onMouseUp={e=>e.currentTarget.style.transform='scale(1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      <Icon n={ic} s={20} c="#fff"/></button>
  );
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
      <B d={-step} ic="minus"/>
      <span className="t-h1 tnum" style={{ minWidth:54, textAlign:'center' }}>{value}{suffix}</span>
      <B d={step} ic="plus"/>
    </div>
  );
}

function Rating({ value, s=14 }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
    <Icon n="starFill" s={s} c="var(--yellow)"/><b style={{ fontSize:s, fontWeight:500 }}>{value}</b></span>;
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={()=>onChange(!on)} style={{ width:48, height:28, borderRadius:'var(--r-pill)', border:'none', cursor:'pointer', padding:3,
      background: on?'var(--blue)':'var(--elevated)', transition:'background .25s', display:'flex', justifyContent: on?'flex-end':'flex-start' }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:'#fff', transition:'all .25s' }}/>
    </button>
  );
}

function Ring({ pct, size=160, sw=12, color='var(--blue)', track='#252545', children }) {
  const r=(size-sw)/2, c=2*Math.PI*r;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={sw} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c*(1-pct)} style={{ transition:'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>{children}</div>
    </div>
  );
}

function Avatar({ name='JM', size=44, bg='var(--ink)', col='var(--blue)' }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color:col, display:'flex',
    alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:size*0.36, flexShrink:0 }}>{name}</div>;
}

/* animated count-up */
function useCounter(target, dur=400) {
  const [v, setV] = React.useState(target);
  const ref = React.useRef(target);
  React.useEffect(()=>{
    const from = ref.current, start = performance.now(); let raf;
    const tick = now => { const p = Math.min(1,(now-start)/dur); const e=1-Math.pow(1-p,3);
      setV(from+(target-from)*e); if(p<1) raf=requestAnimationFrame(tick); else ref.current=target; };
    raf=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(raf);
  },[target]);
  return v;
}

Object.assign(window, {
  Nav, useNav, AVAIL, AVAIL_LABEL, Chrome, TopBar, RoundBtn, TabBar, MapMock, ParkingPin, UserDot,
  Badge, AIInsightCard, VehicleChip, Segmented, Stepper, Rating, Toggle, Ring, Avatar, useCounter,
});
