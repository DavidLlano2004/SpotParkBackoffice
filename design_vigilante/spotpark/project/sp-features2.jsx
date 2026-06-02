/* sp-features2.jsx — F2 Parqueo Social (red) · F6 SpotPark para Eventos. */
const { useState: gS } = React;

/* ─────────── FEATURE 2 · TU RED ─────────── */
function Red() {
  const { pop, push } = useNav();
  const [connected, setConnected] = gS(true);
  const S = SP.social;
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Tu red" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'4px 20px 30px' }}>
        {!connected ? (
          <div className="rise-s card" style={{ padding:22, textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:18, background:'var(--blue-tint)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><Icon n="user" s={30} c="var(--blue-light)"/></div>
            <div className="t-h2">Descubre dónde<br/>parquean tus amigos</div>
            <p className="t-small" style={{ color:'var(--t2)', margin:'10px auto 18px', maxWidth:260 }}>Conecta tus contactos y mira qué parqueaderos usa y recomienda tu red. Nunca mostramos nombres sin permiso.</p>
            <button className="btn btn-primary btn-block" onClick={()=>setConnected(true)}><Icon n="user" s={19} c="var(--ink)"/>Conectar contactos</button>
          </div>
        ) : (<>
          {/* stats */}
          <div className="rise-s" style={{ borderRadius:'var(--r-xl)', padding:20, background:'var(--ink)', boxShadow:'var(--sh-ink)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-30, width:150, height:150, borderRadius:'50%', background:'rgba(198,242,78,.12)' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative' }}>
              <div style={{ display:'flex' }}>{S.contacts.slice(0,4).map((c,i)=>(<div key={i} style={{ width:34, height:34, borderRadius:'50%', background:'var(--blue)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, marginLeft:i?-10:0, border:'2px solid var(--ink)' }}>{c.init}</div>))}</div>
              <div style={{ flex:1 }}><div className="t-h3" style={{ color:'#fff' }}>{S.networkCount} en SpotPark</div><div className="t-micro" style={{ color:'rgba(255,255,255,.55)' }}>de tus contactos</div></div>
            </div>
          </div>

          {/* activity feed */}
          <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'22px 2px 10px' }}>Actividad de tu red</div>
          <div className="no-sb" style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:4, margin:'0 -20px', padding:'0 20px 4px' }}>
            {S.activity.map((a,i)=>(
              <button key={i} className="rise-s" onClick={()=>push('detail',{ id:a.spot })} style={{ animationDelay:`${i*.05}s`, flexShrink:0, width:172, textAlign:'left', cursor:'pointer', background:'var(--surface)', border:'.5px solid var(--border-card)', borderRadius:16, padding:14, boxShadow:'var(--sh-card)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={a.init} size={28} bg="var(--blue-tint)" col="var(--blue-light)"/><Rating value={a.rating} s={12}/></div>
                <div className="t-small" style={{ marginTop:10, lineHeight:1.4 }}><b>{a.name}</b> {a.text}</div>
                <div className="t-micro" style={{ color:'var(--t3)', marginTop:6 }}>{a.ago}</div>
              </button>
            ))}
          </div>

          {/* referral */}
          <div className="rise-s d1" style={{ marginTop:22, position:'relative', overflow:'hidden', background:'var(--blue-bg)', border:'.5px solid var(--blue-tint)', borderRadius:18, padding:18 }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--blue)' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}><Icon n="gift" s={18} c="var(--blue-light)"/><span style={{ fontSize:15, fontWeight:600, color:'var(--blue-light)' }}>Invita y gana</span></div>
            <p className="t-small" style={{ color:'var(--t2)', margin:'8px 0 14px', lineHeight:1.45 }}>Por cada amigo que complete su primera reserva, ambos ganan <b style={{ color:'var(--t1)' }}>+300 SpotPoints</b>.</p>
            <div style={{ display:'flex', gap:10 }}>
              <div className="input" style={{ flex:1, height:46, background:'var(--surface)' }}><Icon n="share" s={17} c="var(--t3)"/><span className="mono" style={{ fontSize:13, color:'var(--t2)', overflow:'hidden', textOverflow:'ellipsis' }}>{S.referralLink}</span></div>
              <button className="btn btn-primary btn-sm" style={{ height:46 }}><Icon n="share" s={17} c="var(--ink)"/>Invitar</button>
            </div>
          </div>

          {/* invitations */}
          <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'24px 2px 10px' }}>Mis invitaciones</div>
          <div className="card" style={{ overflow:'hidden' }}>
            {S.referrals.map((r,i)=>{ const st = r.status==='reservó'?['var(--green)','var(--green-bg)','#1F7A3D']:r.status==='registrado'?['var(--orange)','var(--yellow-bg)','#9A5B0E']:['var(--t3)','var(--elevated)','var(--t2)'];
              return <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderBottom:i<S.referrals.length-1?'1px solid var(--separator)':'none' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="user" s={17} c="var(--t2)"/></div>
                <span className="t-small" style={{ flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.who}</span>
                {r.pts>0 && <span className="t-small tnum" style={{ color:'var(--green)', fontWeight:700 }}>+{r.pts}</span>}
                <span className="badge" style={{ background:st[1], color:st[2] }}>{r.status}</span>
              </div>; })}
          </div>
          <button onClick={()=>setConnected(false)} style={{ display:'block', margin:'18px auto 0', background:'none', border:'none', color:'var(--t3)', fontSize:13, fontWeight:500, cursor:'pointer' }}>Desconectar contactos</button>
        </>)}
      </div>
    </div>
  );
}

/* social proof block for Parking Detail (Tu red section) */
function NetworkSection({ spotId }) {
  const { push } = useNav();
  const S = SP.social;
  const count = S.spotSocial[spotId];
  if (!count) return (
    <div className="rise-s d4" style={{ marginTop:24 }}>
      <div className="t-h3" style={{ marginBottom:10 }}>Tu red</div>
      <p className="t-small" style={{ color:'var(--t3)', margin:0 }}>Sé el primero de tu red en parquear aquí.</p>
    </div>
  );
  return (
    <div className="rise-s d4" style={{ marginTop:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span className="t-h3">Recomendado por tu red</span>
        <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:5, background:'var(--blue-tint)', color:'var(--blue-light)', padding:'4px 10px', borderRadius:'var(--r-pill)', fontSize:12, fontWeight:600 }}><Icon n="starFill" s={13} c="var(--blue-light)"/>{S.networkRating} de tu red</span>
      </div>
      <div className="no-sb" style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
        {S.contacts.map((c,i)=>(
          <div key={i} style={{ flexShrink:0, width:120, background:'var(--surface)', border:'.5px solid var(--border)', borderRadius:14, padding:13, textAlign:'center' }}>
            <Avatar name={c.init} size={40} bg="var(--blue-tint)" col="var(--blue-light)"/>
            <div className="t-small" style={{ fontWeight:500, marginTop:8 }}>{c.name||'Contacto'}</div>
            <div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{c.ago}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>push('red')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer', marginTop:12 }}>
        {count} personas de tu red han parqueado aquí <Icon n="chevR" s={15} c="var(--blue-light)"/></button>
    </div>
  );
}

/* ─────────── FEATURE 6 · EVENTOS ─────────── */
function Eventos() {
  const { pop, push } = useNav();
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Eventos cerca" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'4px 20px 30px' }}>
        <p className="t-small" style={{ color:'var(--t2)', margin:'0 0 16px' }}>Parqueaderos curados para los eventos de tu ciudad.</p>
        {SP.events.map((e,i)=>(
          <button key={e.id} className="rise-s" onClick={()=>push('evento',{ id:e.id })} style={{ animationDelay:`${i*.06}s`, width:'100%', textAlign:'left', cursor:'pointer',
            background:'var(--surface)', border:'.5px solid var(--border-card)', borderRadius:18, padding:0, marginBottom:14, overflow:'hidden', boxShadow:'var(--sh-card)' }}>
            <div style={{ height:96, background:'var(--ink)', position:'relative', display:'flex', alignItems:'center', padding:'0 18px', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-30, right:-20, width:120, height:120, borderRadius:'50%', background:`${e.color}22` }}/>
              <span style={{ fontSize:34, position:'relative' }}>{e.kind.split(' ')[0]}</span>
              <div style={{ position:'absolute', right:14, top:14, background:'rgba(255,255,255,.12)', color:'#fff', fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:'var(--r-pill)' }}>{e.date}</div>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <div className="t-h3">{e.name}</div>
              <div className="t-small" style={{ color:'var(--t2)', marginTop:3, display:'flex', alignItems:'center', gap:6 }}><Icon n="pin" s={14} c="var(--t3)"/>{e.venue} · {e.when}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
                <span className="badge" style={{ background:'var(--blue-tint)', color:'var(--blue-light)' }}>{e.spots.length} parqueaderos</span>
                <span className="t-micro" style={{ color:'var(--t3)' }}>{e.people} asistentes</span>
                <Icon n="chevR" s={18} c="var(--t3)" style={{ marginLeft:'auto' }}/>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Evento({ id='e1' }) {
  const { pop, push } = useNav();
  const e = SP.eventById(id);
  const spots = e.spots.map(sid=>SP.byId(sid));
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* hero */}
      <div style={{ height:200, background:'var(--ink)', position:'relative', flexShrink:0, overflow:'hidden' }}>
        <Chrome onDark />
        <div style={{ position:'absolute', top:-40, right:-30, width:200, height:200, borderRadius:'50%', background:`${e.color}26` }}/>
        <div style={{ position:'absolute', top:58, left:16 }}><RoundBtn glass onClick={pop}><Icon n="chevL" s={21} c="#fff"/></RoundBtn></div>
        <div style={{ position:'absolute', bottom:18, left:18, right:18 }}>
          <span style={{ background:'rgba(255,255,255,.12)', color:'#fff', fontSize:12, fontWeight:600, padding:'4px 11px', borderRadius:'var(--r-pill)' }}>{e.kind}</span>
          <div className="t-h2" style={{ color:'#fff', marginTop:10 }}>{e.name}</div>
          <div className="t-small" style={{ color:'rgba(255,255,255,.7)', marginTop:4, display:'flex', alignItems:'center', gap:6 }}><Icon n="pin" s={14} c="rgba(255,255,255,.7)"/>{e.venue} · {e.when}</div>
        </div>
      </div>

      <div className="scr-scroll no-sb" style={{ padding:'16px 20px 30px' }}>
        {/* event stats */}
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[['cal',e.date,'Fecha'],['user',e.people,'Asistentes'],['pin',e.spots.length,'Parqueaderos']].map(([ic,v,l],i)=>(
            <div key={i} className="card" style={{ flex:1, padding:'13px 10px', textAlign:'center' }}>
              <Icon n={ic} s={18} c="var(--blue-light)"/><div className="t-h3 tnum" style={{ marginTop:6, fontSize:15 }}>{v}</div><div className="t-micro" style={{ color:'var(--t2)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* mini map */}
        <div style={{ height:150, borderRadius:16, overflow:'hidden', position:'relative', border:'.5px solid var(--border)', marginBottom:16 }}>
          <MapMock>
            {/* venue marker */}
            <div style={{ position:'absolute', left:`${e.x}%`, top:`${e.y}%`, transform:'translate(-50%,-50%)', zIndex:6 }}>
              <div style={{ position:'absolute', inset:-7, borderRadius:'50%', background:e.color, opacity:.3, animation:'sp-pulse 1.8s infinite' }}/>
              <div style={{ width:34, height:34, borderRadius:'50% 50% 50% 0', background:e.color, transform:'rotate(-45deg)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-card)' }}>
                <span style={{ transform:'rotate(45deg)', fontSize:15 }}>{e.kind.split(' ')[0]}</span></div>
            </div>
            {spots.map((s,i)=>(<ParkingPin key={s.id} x={[28,70,46][i]||40} y={[34,40,66][i]||50} status={s.status} count={s.status==='full'?0:s.cars[0]} delay={.1+i*.08}/>))}
          </MapMock>
        </div>

        {/* AI note */}
        <AIInsightCard title="SpotPark AI · Evento" body={e.note} delay={0}/>

        {/* curated parkings */}
        <div className="t-h3" style={{ margin:'22px 0 12px' }}>Parqueaderos para este evento</div>
        {spots.map((s,i)=>(
          <button key={s.id} className="rise-s" onClick={()=>push('detail',{ id:s.id })} style={{ animationDelay:`${i*.06}s`, width:'100%', textAlign:'left', cursor:'pointer',
            background:'var(--surface)', border:'.5px solid var(--border-card)', borderRadius:16, padding:12, marginBottom:12, display:'flex', gap:13, alignItems:'center', boxShadow:'var(--sh-card)' }}>
            <div style={{ width:54, height:54, borderRadius:12, background:s.img, flexShrink:0, position:'relative' }}>
              {i===0 && <span style={{ position:'absolute', top:-7, left:-7, background:'var(--blue)', color:'var(--ink)', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:6 }}>TOP</span>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:5 }}><Badge status={s.status} count={s.status==='full'?null:s.cars[0]}/><span className="t-micro" style={{ color:'var(--t2)' }}>{s.walk} al venue</span></div>
            </div>
            <div style={{ textAlign:'right' }}><div className="t-h3 tnum">{SP.COP(s.price)}</div><div className="t-micro" style={{ color:'var(--t2)' }}>/hora</div></div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding:'14px 20px 30px', background:'var(--bg)', borderTop:'.5px solid var(--border)' }}>
        <button className="btn btn-primary btn-block" onClick={()=>push('reserve',{ id:e.spots[0] })}><Icon n="cal" s={19} c="var(--ink)"/>Reservar para el evento</button>
      </div>
    </div>
  );
}

Object.assign(window, { Red, NetworkSection, Eventos, Evento });
Object.assign(window.SP_SCREENS, { red:Red, eventos:Eventos, evento:Evento });
