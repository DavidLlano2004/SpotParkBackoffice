/* bo-chat.jsx — F12 · Chat interno entre turnos */
const { useState:cS, useRef:cR, useEffect:cE } = React;

function Chat() {
  const C = BO.chat;
  const [active, setActive] = cS('entrega');
  const [msgs, setMsgs] = cS(()=>JSON.parse(JSON.stringify(C.messages)));
  const [text, setText] = cS('');
  const [handoff, setHandoff] = cS(false);
  const [typing] = cS(active==='general');
  const endRef = cR(null);
  const isDM = !!C.dms.find(d=>d.id===active);
  const ch = C.channels.find(c=>c.id===active);
  const dm = C.dms.find(d=>d.id===active);
  const list = msgs[active] || [];

  cE(()=>{ if(endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [active, list.length]);

  const send = () => {
    const t = text.trim(); if(!t) return;
    setMsgs(m=>({ ...m, [active]:[...(m[active]||[]), { who:'Carlos Torres', init:'CT', mine:true, text:t, time:'Ahora', day:'Hoy', pinned: handoff }] }));
    setText(''); setHandoff(false);
  };

  // group by day
  const groups = [];
  list.forEach(m=>{ const g=groups[groups.length-1]; if(g&&g.day===m.day) g.items.push(m); else groups.push({ day:m.day, items:[m] }); });
  const pinned = list.find(m=>m.pinned);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', height:'100%', margin:-24 }}>
      {/* channels */}
      <div className="no-sb" style={{ borderRight:'1px solid var(--border)', overflowY:'auto', padding:'18px 14px' }}>
        <div className="t-h2" style={{ margin:'0 6px 14px' }}>Mensajes</div>
        {C.channels.map(c=>{
          const on=active===c.id;
          return (
            <button key={c.id} onClick={()=>setActive(c.id)} style={{ width:'100%', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:12, border:'none',
              background:on?'var(--lime-bg)':'transparent', borderLeft:on?'3px solid var(--lime-deep)':'3px solid transparent', marginBottom:2 }}>
              <Icon n={c.icon} s={19} c={on?'var(--lime-deep)':'var(--t2)'}/>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:14, fontWeight:on?600:500 }}>{c.name}</div><div className="t-micro" style={{ color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.sub}</div></div>
              {c.unread>0 && <span className="tnum" style={{ background:'var(--red)', color:'#fff', fontSize:10, fontWeight:700, minWidth:18, height:18, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{c.unread}</span>}
            </button>
          );
        })}
        <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'18px 8px 8px' }}>Directos</div>
        {C.dms.map(d=>{
          const on=active===d.id;
          return (
            <button key={d.id} onClick={()=>setActive(d.id)} style={{ width:'100%', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:12, border:'none',
              background:on?'var(--lime-bg)':'transparent', borderLeft:on?'3px solid var(--lime-deep)':'3px solid transparent', marginBottom:2 }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--ink)', color:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:12 }}>{d.init}</div>
                {d.online && <span style={{ position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:'50%', background:'var(--green)', border:'2px solid var(--bg)' }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:14, fontWeight:on?600:500 }}>{d.name}</div><div className="t-micro" style={{ color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.last}</div></div>
            </button>
          );
        })}
      </div>

      {/* messages */}
      <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          {!isDM && <Icon n={ch.icon} s={20} c="var(--ink)"/>}
          <span className="t-h3">{isDM?dm.name:ch.name}</span>
          <span className="t-small" style={{ color:'var(--t3)' }}>{isDM?(dm.online?'En línea':'Desconectado'):`${ch.members} miembros`}</span>
        </div>

        {pinned && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--blue-bg)', borderBottom:'1px solid var(--blue-tint)', padding:'10px 24px' }}>
            <Icon n="pin" s={15} c="var(--blue-tx)"/><span className="t-small" style={{ color:'var(--blue-tx)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{pinned.text.replace('📌 ','')}</span>
          </div>
        )}

        <div ref={endRef} className="no-sb" style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {groups.map((g,gi)=>(
            <div key={gi}>
              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'10px 0 14px' }}>
                <div style={{ flex:1, height:1, background:'var(--separator)' }}/>
                <span className="t-micro" style={{ color:'var(--t3)' }}>{g.day}</span>
                <div style={{ flex:1, height:1, background:'var(--separator)' }}/>
              </div>
              {g.items.map((m,mi)=>(
                <div key={mi} className="rise-s" style={{ display:'flex', gap:11, padding:'7px 0' }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:m.mine?'var(--lime)':'var(--ink)', color:m.mine?'var(--ink)':'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:12, flexShrink:0 }}>{m.init}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                      <span style={{ fontSize:14, fontWeight:600 }}>{m.who}</span>
                      <span className="t-micro" style={{ color:'var(--t3)' }}>{m.time}</span>
                      {m.pinned && <Icon n="pin" s={12} c="var(--blue-tx)"/>}
                    </div>
                    <p className="t-small" style={{ color:'var(--t1)', margin:'2px 0 0', lineHeight:1.5 }}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {typing && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', color:'var(--t3)' }}>
              <span style={{ display:'flex', gap:3 }}>{[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--t3)', animation:'pulse 1s infinite', animationDelay:`${i*.15}s` }}/>)}</span>
              <span className="t-micro">Diego está escribiendo…</span>
            </div>
          )}
        </div>

        {/* input */}
        <div style={{ borderTop:'1px solid var(--border)', padding:'12px 24px 16px', flexShrink:0 }}>
          {active==='entrega' && (
            <label style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, cursor:'pointer' }}>
              <button onClick={()=>setHandoff(h=>!h)} style={{ width:18, height:18, borderRadius:5, border:handoff?'none':'1.5px solid var(--border)', background:handoff?'var(--lime-deep)':'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{handoff && <Icon n="check" s={13} c="#fff"/>}</button>
              <span className="t-small" style={{ color:'var(--t2)' }}>Marcar como nota de entrega de turno</span>
            </label>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ width:40, height:40, borderRadius:11, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon n="clip" s={19} c="var(--t2)"/></button>
            <div className="input" style={{ flex:1, boxShadow:'none', background:'var(--elevated)', border:'none' }}>
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } }} placeholder="Escribe un mensaje…"/>
            </div>
            <button className="btn btn-primary" style={{ width:44, padding:0, flexShrink:0 }} disabled={!text.trim()} onClick={send}><Icon n="send" s={19} c="var(--ink)"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window.BO_PAGES, { chat:Chat });
