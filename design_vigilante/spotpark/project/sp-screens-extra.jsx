/* sp-screens-extra.jsx — Feature 2 (Gastos) + Feature 13 (SpotPoints) */
const { useState: xS, useMemo: xM } = React;

/* ─────────── GASTOS (Finanzas) ─────────── */
function Gastos() {
  const { pop } = useNav();
  const sp = SP.spending;
  const [mi, setMi] = xS(0); // 0 = current month
  const months = ['Mayo 2025','Abril 2025','Marzo 2025'];
  const max = Math.max(...sp.series.map(s=>s.v));
  const total = useCounter(mi===0?sp.total:mi===1?57200:52000);
  const insights = [
    { ic:'pin', t:sp.insights.fav, l:`${sp.insights.favN} visitas`, cap:'Parqueadero favorito' },
    { ic:'clock', t:sp.insights.hour, l:'Cuando más parqueas', cap:'Hora frecuente' },
    { ic:'card', t:SP.COP(sp.insights.avg), l:'Promedio por reserva', cap:'Gasto medio' },
    { ic:'car', t:sp.insights.veh, l:`${sp.insights.vehN} reservas`, cap:'Vehículo más usado' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="Mis gastos" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'4px 20px 30px' }}>
        {/* month selector */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, margin:'4px 0 18px' }}>
          <button onClick={()=>setMi(Math.min(2,mi+1))} style={{ background:'none', border:'none', cursor:'pointer', opacity:mi<2?1:.3 }}><Icon n="chevL" s={20} c="var(--t1)"/></button>
          <span className="t-h3" style={{ minWidth:120, textAlign:'center' }}>{months[mi]}</span>
          <button onClick={()=>setMi(Math.max(0,mi-1))} style={{ background:'none', border:'none', cursor:'pointer', opacity:mi>0?1:.3 }}><Icon n="chevR" s={20} c="var(--t1)"/></button>
        </div>

        {/* hero metric */}
        <div className="card rise-s" style={{ padding:20 }}>
          <div className="t-micro upper" style={{ color:'var(--t3)' }}>Este mes</div>
          <div className="t-hero tnum" style={{ marginTop:4 }}>{SP.COP(Math.round(total))}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:8 }}>
            <Icon n={sp.prevDelta<0?'trendDown':'trendUp'} s={16} c={sp.prevDelta<0?'var(--green)':'var(--red)'}/>
            <span className="t-small" style={{ color: sp.prevDelta<0?'var(--green)':'var(--red)', fontWeight:600 }}>
              {SP.COP(Math.abs(sp.prevDelta))} {sp.prevDelta<0?'menos':'más'} que en {sp.prevMonth}</span>
          </div>
        </div>

        {/* bar chart */}
        <div className="card rise-s d1" style={{ padding:18, marginTop:14 }}>
          <div className="t-small" style={{ color:'var(--t2)', marginBottom:14 }}>Últimos 6 meses</div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:10, height:150 }}>
            {sp.series.map((b,i)=>{
              const cur = i===sp.series.length-1;
              return (
                <div key={b.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, height:'100%', justifyContent:'flex-end' }}>
                  <span className="t-micro tnum" style={{ color:cur?'var(--ink)':'var(--t3)', fontWeight:cur?700:500 }}>{Math.round(b.v/1000)}k</span>
                  <div style={{ width:'100%', maxWidth:30, height:`${(b.v/max)*100}%`, borderRadius:'8px 8px 4px 4px',
                    background: cur?'var(--lime)':'var(--paper-2, #E3E3DE)', transformOrigin:'bottom',
                    animation:`sp-bar .7s cubic-bezier(.2,.8,.2,1) both`, animationDelay:`${i*.07}s` }}/>
                  <span className="t-micro" style={{ color:cur?'var(--ink)':'var(--t3)', fontWeight:cur?600:400 }}>{b.m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* insights grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
          {insights.map((c,i)=>(
            <div key={i} className="card rise-s" style={{ animationDelay:`${i*.05}s`, padding:15 }}>
              <Icon n={c.ic} s={19} c="var(--lime-deep)"/>
              <div className="t-h3" style={{ marginTop:9, fontSize:16 }}>{c.t}</div>
              <div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>{c.l}</div>
            </div>
          ))}
        </div>

        {/* AI insight */}
        <div style={{ marginTop:14 }}>
          <AIInsightCard body="Parqueas casi siempre martes y jueves cerca de la U. Reservando con un día de anticipación ahorras ~15% frente a reservar el mismo día." delay={0}/>
        </div>

        {/* F3: time patterns by zone */}
        <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'24px 2px 10px' }}>Tus patrones de tiempo</div>
        <div className="card" style={{ padding:18 }}>
          {SP.timePatterns.map((p,i)=>{ const max=Math.max(...SP.timePatterns.map(z=>z.mins));
            return <div key={p.zone} style={{ marginBottom:i<SP.timePatterns.length-1?14:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span className="t-small" style={{ fontWeight:500 }}>{p.zone}</span><span className="t-small tnum" style={{ color:'var(--blue-light)', fontWeight:600 }}>{p.label}</span></div>
              <div style={{ height:8, borderRadius:9, background:'var(--elevated)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${p.mins/max*100}%`, background:'var(--lime)', borderRadius:9, transformOrigin:'left', animation:`sp-bar .7s cubic-bezier(.2,.8,.2,1) both`, animationDelay:`${i*.07}s` }}/></div>
            </div>; })}
          <div className="t-micro" style={{ color:'var(--t3)', marginTop:14 }}>Basado en tus últimas 18 reservas.</div>
        </div>

        {/* breakdown */}
        <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'24px 2px 10px' }}>Detalle del mes</div>
        {sp.weeks.map((wk,wi)=>(
          <div key={wi} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 2px' }}>
              <span className="t-small" style={{ color:'var(--t2)', fontWeight:600 }}>{wk.w}</span>
              <span className="t-small tnum" style={{ color:'var(--t2)' }}>{SP.COP(wk.total)}</span>
            </div>
            <div className="card" style={{ overflow:'hidden' }}>
              {wk.rows.map((r,ri)=>(
                <div key={ri} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderBottom: ri<wk.rows.length-1?'1px solid var(--separator)':'none' }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="pin" s={18} c="var(--t2)"/></div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:14, fontWeight:500 }}>{r.s}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{r.d} · {r.dur}</div></div>
                  <span className="t-small tnum" style={{ fontWeight:600 }}>{SP.COP(r.a)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 2px 16px' }}>
          <span className="t-h3">Total mayo</span><span className="t-h2 tnum">{SP.COP(sp.total)}</span>
        </div>
        <button className="btn btn-ghost btn-block"><Icon n="download" s={18} c="var(--t1)"/>Exportar informe</button>
      </div>
    </div>
  );
}

/* ─────────── PUNTOS (SpotPoints loyalty) ─────────── */
function Puntos() {
  const { pop } = useNav();
  const L = SP.loyalty;
  const pts = useCounter(L.points);
  const curIdx = L.levels.reduce((acc,lv,i)=> L.points>=lv.min?i:acc, 0);
  const cur = L.levels[curIdx], nxt = L.levels[curIdx+1];
  const prog = nxt ? (L.points-cur.min)/(nxt.min-cur.min) : 1;
  const toNext = nxt ? nxt.min-L.points : 0;
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar title="SpotPoints" onBack={pop}/>
      <div className="scr-scroll no-sb" style={{ padding:'4px 20px 30px' }}>
        {/* hero */}
        <div className="rise-s" style={{ borderRadius:'var(--r-xl)', padding:22, background:'var(--ink)', boxShadow:'var(--sh-ink)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-30, width:170, height:170, borderRadius:'50%', background:'rgba(198,242,78,.14)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Icon n="bolt" s={18} c="var(--lime)"/>
              <span className="badge" style={{ background:cur.color, color:'#fff' }}>Nivel {cur.k}</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:14 }}>
              <span className="t-hero tnum" style={{ color:'#fff' }}>{Math.round(pts).toLocaleString('es-CO')}</span>
              <span className="t-body" style={{ color:'rgba(255,255,255,.6)' }}>SpotPoints</span>
            </div>
            {nxt && (<>
              <div style={{ height:8, borderRadius:8, background:'rgba(255,255,255,.12)', overflow:'hidden', marginTop:16 }}>
                <div style={{ height:'100%', width:`${prog*100}%`, background:'var(--lime)', borderRadius:8, transformOrigin:'left', animation:'sp-bar 1s cubic-bezier(.2,.8,.2,1) both' }}/>
              </div>
              <div className="t-small" style={{ color:'rgba(255,255,255,.6)', marginTop:8 }}>{toNext.toLocaleString('es-CO')} pts para nivel {nxt.k}</div>
            </>)}
          </div>
        </div>

        {/* level rail */}
        <div className="rise-s d1" style={{ display:'flex', gap:6, marginTop:14 }}>
          {L.levels.map((lv,i)=>(
            <div key={lv.k} style={{ flex:1, textAlign:'center' }}>
              <div style={{ height:5, borderRadius:9, background: i<=curIdx?lv.color:'var(--elevated)' }}/>
              <div className="t-micro" style={{ color: i===curIdx?'var(--ink)':'var(--t3)', fontWeight:i===curIdx?700:500, marginTop:6 }}>{lv.k}</div>
            </div>
          ))}
        </div>

        {/* benefits */}
        <div className="card rise-s d2" style={{ padding:18, marginTop:16 }}>
          <div className="t-h3" style={{ marginBottom:12 }}>Tus beneficios</div>
          {L.levels.map((lv,i)=>{
            const unlocked = i<=curIdx;
            return (
              <div key={lv.k} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 0', borderBottom: i<L.levels.length-1?'1px solid var(--separator)':'none', opacity:unlocked?1:.5 }}>
                <Icon n={unlocked?'checkC':'lock'} s={18} c={unlocked?'var(--green)':'var(--t3)'}/>
                <span className="t-small" style={{ flex:1, color: unlocked?'var(--t1)':'var(--t2)' }}>{lv.perk}</span>
                {!unlocked && <span className="t-micro" style={{ color:'var(--t3)' }}>{lv.k}</span>}
              </div>
            );
          })}
        </div>

        {/* redeem */}
        <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'24px 2px 10px' }}>Canjear puntos</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {L.rewards.map((r,i)=>{
            const ok = L.points>=r.cost;
            return (
              <div key={i} className="card" style={{ padding:14, display:'flex', alignItems:'center', gap:13, opacity:ok?1:.55 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:'var(--blue-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={r.ic} s={21} c="var(--lime-deep)"/></div>
                <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:500 }}>{r.t}</div><div className="t-micro tnum" style={{ color:'var(--t3)', marginTop:1 }}>{r.cost} pts</div></div>
                <button className={'btn btn-sm '+(ok?'btn-primary':'btn-ghost')} disabled={!ok} style={{ height:38 }}>Canjear</button>
              </div>
            );
          })}
        </div>

        {/* history */}
        <div className="t-micro upper" style={{ color:'var(--t3)', letterSpacing:'.1em', margin:'24px 2px 10px' }}>Movimientos</div>
        <div className="card" style={{ overflow:'hidden' }}>
          {L.history.map((h,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderBottom: i<L.history.length-1?'1px solid var(--separator)':'none' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n={h.ic} s={18} c={h.good?'var(--green)':'var(--orange)'}/></div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{h.t}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{h.when}</div></div>
              <span className="t-small tnum" style={{ fontWeight:700, color: h.good?'var(--green)':'var(--orange)' }}>{h.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window.SP_SCREENS, { gastos:Gastos, puntos:Puntos });
