/* sp-screens-book.jsx — Detail, Reserve wizard, Confirmed, Active */
const { useState: bS, useEffect: bE, useMemo: bM } = React;

/* heat color for an hour cell */
const heatColor = pct => pct>80?'var(--red)':pct>55?'var(--orange)':pct>35?'var(--yellow)':'var(--green)';
const heatBg = pct => pct>80?'#450A0A':pct>55?'#451A03':pct>35?'#3a2e08':'#052E16';
const dayHours = bMseed => [...Array(24)].map((_,h)=>{
  const base = (h>=8&&h<=10)||(h>=17&&h<=20) ? 70+((h*7+bMseed)%25) : 25+((h*11+bMseed)%30);
  return Math.min(96, base);
});

/* ─────────── DETAIL ─────────── */
function Detail({ id }) {
  const { pop, push } = useNav();
  const s = SP.byId(id);
  const [fav, setFav] = bS(false);
  const [heat, setHeat] = bS(false);
  const [tick, setTick] = bS(0);
  bE(()=>{ const t=setInterval(()=>setTick(x=>x+1),30000); return ()=>clearInterval(t); },[]);
  const stale = s.reliability!=='verified';
  const stats = [
    { ic:'card', v:SP.COP(s.price), l:'por hora' },
    { ic:'clock', v:'30 min', l:'mínimo' },
    { ic:'starFill', v:s.rating, l:`${s.reviews} reseñas` },
    { ic:'walk', v:s.walk, l:s.dist },
  ];
  const carPct = s.cars[1]? s.cars[0]/s.cars[1] : 0;
  const motoPct = s.motos[1]? s.motos[0]/s.motos[1] : 0;
  const hours = bM(()=>dayHours(s.name.length),[s.id]);
  const nowH = 14;
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* photo header */}
      <div style={{ height:220, background:s.img, position:'relative', flexShrink:0 }}>
        <Chrome onDark />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,26,.5) 0%, transparent 30%, transparent 55%, var(--bg) 100%)' }}/>
        <div style={{ position:'absolute', top:58, left:16, right:16, display:'flex', justifyContent:'space-between' }}>
          <RoundBtn glass onClick={pop}><Icon n="chevL" s={21} c="#fff"/></RoundBtn>
          <RoundBtn glass onClick={()=>setFav(!fav)}><Icon n={fav?'heartFill':'heart'} s={20} c={fav?'var(--red)':'#fff'}/></RoundBtn>
        </div>
        <div style={{ position:'absolute', bottom:18, left:16, right:16, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div><div className="t-h2">{s.name}</div><div className="t-small" style={{ color:'rgba(255,255,255,.7)', marginTop:2 }}>{s.addr}</div></div>
          <Badge status={s.status} count={s.status==='full'?null:s.cars[0]}/>
        </div>
      </div>

      <div className="scr-scroll no-sb" style={{ padding:'4px 0 150px' }}>
        {/* stats row */}
        <div className="rise-s" style={{ display:'flex', padding:'8px 8px 18px' }}>
          {stats.map((st,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center', padding:'4px 8px', borderLeft: i?'.5px solid var(--border)':'none' }}>
              <Icon n={st.ic} s={19} c="var(--blue-light)"/>
              <div className="t-h3 tnum" style={{ marginTop:5 }}>{st.v}</div>
              <div className="t-micro" style={{ color:'var(--t2)' }}>{st.l}</div>
            </div>
          ))}
        </div>

        <div style={{ padding:'0 20px' }}>
          {/* stale data warning */}
          {stale && (
            <div className="rise-s" style={{ display:'flex', gap:10, alignItems:'center', background:'var(--yellow-bg)', border:'.5px solid var(--orange)', borderRadius:14, padding:'12px 14px', marginBottom:18 }}>
              <Icon n="info" s={20} c="var(--orange)"/><span className="t-small" style={{ color:'#fed7aa' }}>Datos no verificados · último dato confiable hace 3 h.</span>
            </div>
          )}

          {/* accepts */}
          <div className="rise-s d1" style={{ marginBottom:8 }}>
            <div className="t-small" style={{ color:'var(--t2)', marginBottom:10 }}>Acepta</div>
            <div style={{ display:'flex', gap:8 }}>
              {SP.vehicleTypes.filter(v=> v.type==='moto'?s.moto : v.type==='suv'?s.suv : true).map(v=>(
                <VehicleChip key={v.type} {...v} display/>
              ))}
            </div>
          </div>

          {/* realtime availability */}
          <div className="rise-s d2" style={{ marginTop:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="t-h3">Disponibilidad en tiempo real</span>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', animation:'sp-pulse 1.6s infinite' }}/>
              <span className="t-micro" style={{ color:'var(--t3)', marginLeft:'auto' }}>Hace {tick*30||5} seg</span>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              {[['Carros',s.cars,carPct],['Motos',s.motos,motoPct]].map(([lbl,arr,pct])=>(
                <div key={lbl} className="card" style={{ flex:1, padding:16, display:'flex', flexDirection:'column', alignItems:'center', background:'var(--surface)' }}>
                  <Ring pct={pct} size={104} sw={9} color={pct>.5?'var(--green)':pct>.2?'var(--yellow)':'var(--red)'}>
                    <div className="t-h3 tnum">{arr[0]}/{arr[1]}</div>
                  </Ring>
                  <div className="t-small" style={{ color:'var(--t2)', marginTop:10 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI insight */}
          <div className="rise-s d3" style={{ marginTop:24 }}>
            <AIInsightCard title="Por qué te lo recomendamos" body={SP.ai.parkingInsight} delay={0}/>
            <button onClick={()=>setHeat(h=>!h)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer', marginTop:12 }}>
              📊 Ver disponibilidad por hora <Icon n={heat?'chevU':'chevD'} s={16} c="var(--blue-light)"/></button>
          </div>

          {/* heatmap */}
          {heat && (
            <div className="fade" style={{ marginTop:14 }}>
              <div className="no-sb" style={{ display:'flex', gap:3, overflowX:'auto', paddingBottom:6 }}>
                {hours.map((p,h)=>(
                  <div key={h} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ width:13, height:46, borderRadius:3, background:heatColor(p), opacity:.85, border: h===nowH?'1px solid #fff':'none' }}/>
                    {(h%6===0||h===23) && <span className="t-micro" style={{ color:'var(--t3)' }}>{h}</span>}
                  </div>
                ))}
              </div>
              <div className="t-micro" style={{ color:'var(--t3)', marginTop:6 }}>Patrón típico para un martes</div>
            </div>
          )}

          {/* services */}
          <div className="rise-s d4" style={{ marginTop:24 }}>
            <div className="t-h3" style={{ marginBottom:12 }}>Servicios</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {s.services.map(sv=>(
                <div key={sv} style={{ display:'flex', alignItems:'center', gap:9, background:'var(--surface)', border:'.5px solid var(--border)', borderRadius:8, padding:'10px 12px' }}>
                  <Icon n="check" s={17} c="var(--green)"/><span className="t-small" style={{ color:'var(--t2)' }}>{sv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* reviews */}
          <NetworkSection spotId={id}/>
          <div className="rise-s d5" style={{ marginTop:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                <span className="t-hero tnum" style={{ color:'var(--yellow)' }}>{s.rating}</span>
                <span style={{ display:'flex', gap:2 }}>{[...Array(5)].map((_,i)=><Icon key={i} n="starFill" s={14} c={i<Math.round(s.rating)?'var(--yellow)':'var(--t4)'}/>)}</span>
              </div>
              <button onClick={()=>push('review',{ reservationId:'t1' })} style={{ background:'none', border:'none', color:'var(--blue-light)', fontSize:13, fontWeight:500, cursor:'pointer' }}>Ver todas →</button>
            </div>
            {SP.reviews.slice(0,2).map((r,i)=>(
              <div key={i} style={{ padding:'12px 0', borderBottom:'.5px solid var(--separator)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7 }}>
                  <Avatar name={r.who.split(' ').map(w=>w[0]).join('')} size={32}/>
                  <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{r.who}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{r.when}</div></div>
                  <span style={{ display:'flex', gap:1 }}>{[...Array(r.stars)].map((_,k)=><Icon key={k} n="starFill" s={12} c="var(--yellow)"/>)}</span>
                </div>
                <p className="t-small" style={{ color:'var(--t2)', margin:0, lineHeight:1.45 }}>{r.txt}</p>
              </div>
            ))}
          </div>

          {/* mini map */}
          <div className="rise-s d6" style={{ marginTop:24, height:120, borderRadius:14, overflow:'hidden', position:'relative', border:'.5px solid var(--border)' }}>
            <MapMock><ParkingPin x={52} y={46} status={s.status} active/><UserDot x={26} y={72}/></MapMock>
            <button style={{ position:'absolute', bottom:10, right:10, background:'var(--surface)', border:'.5px solid var(--border)', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', gap:6, cursor:'pointer', color:'var(--blue-light)', fontSize:13, fontWeight:500 }} onClick={()=>push('navigate',{ id })}>
              <Icon n="nav" s={16} c="var(--blue-light)"/>Cómo llegar</button>
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'14px 20px 30px', background:'var(--bg)', borderTop:'.5px solid var(--border)', display:'flex', gap:12 }}>
        <button className="btn btn-ghost" style={{ width:'40%' }} onClick={()=>setFav(!fav)}><Icon n={fav?'heartFill':'heart'} s={19} c={fav?'var(--red)':'var(--t2)'}/>Guardar</button>
        <button className="btn btn-primary" style={{ flex:1 }} disabled={s.status==='full'} onClick={()=>push('reserve',{ id })}>
          {s.status==='full'?'Sin cupos':'Reservar ahora'}</button>
      </div>
    </div>
  );
}

/* ─────────── RESERVE WIZARD (3 steps) ─────────── */
function Reserve({ id }) {
  const { pop, push } = useNav();
  const s = SP.byId(id);
  const [step, setStep] = bS(1);
  const [vtype, setVtype] = bS('car');
  const [day, setDay] = bS(0);
  const [start, setStart] = bS('14:00');
  const [hours, setHours] = bS(2);
  const [pay, setPay] = bS('card');
  const [recur, setRecur] = bS(false);
  const [freq, setFreq] = bS('weekly');
  const [weeks, setWeeks] = bS(4);
  const rate = SP.vehicleTypes.find(v=>v.type===vtype).rate;
  const sub = rate*hours, fee = Math.round(sub*0.15), total = sub+fee;
  const days = ['Hoy','Mañana','Mié 28','Jue 29','Vie 30','Sáb 31','Dom 1'];
  const quick = [['30 min',0.5],['1h',1],['2h',2],['4h',4],['Día',10]];
  const steps = ['Vehículo','Tiempo','Pago'];
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Chrome />
      <TopBar onBack={()=> step>1?setStep(step-1):pop()} title={`Paso ${step} de 3`}/>
      {/* step indicator */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 32px 16px' }}>
        {steps.map((lbl,i)=>{
          const n=i+1, done=n<step, on=n===step;
          return (
            <React.Fragment key={lbl}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  background: done?'var(--green)':on?'var(--blue)':'var(--surface)', border: (done||on)?'none':'.5px solid var(--border)',
                  color: (done||on)?'#fff':'var(--t3)', fontSize:13, fontWeight:500 }}>
                  {done?<Icon n="check" s={15} c="#fff"/>:n}</div>
                <span className="t-micro" style={{ color: on?'var(--blue-light)':'var(--t3)' }}>{lbl}</span>
              </div>
              {i<2 && <div style={{ flex:1, height:2, margin:'0 6px 18px', background: n<step?'var(--blue)':'var(--border)' }}/>}
            </React.Fragment>
          );
        })}
      </div>

      <div className="scr-scroll no-sb" key={step} style={{ padding:'4px 20px 160px' }}>
        {step===1 && (<div className="fade">
          <h1 className="t-h1" style={{ margin:'0 0 4px' }}>¿Qué vehículo traes?</h1>
          <div className="t-small" style={{ color:'var(--t2)', marginBottom:18 }}>{s.name}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {SP.vehicleTypes.map(v=>{
              const on=v.type===vtype;
              return (
                <button key={v.type} onClick={()=>setVtype(v.type)} style={{ position:'relative', height:128, borderRadius:16, cursor:'pointer',
                  background: on?'var(--blue-tint)':'var(--surface)', border: on?'1.5px solid var(--blue)':'.5px solid var(--border)',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, transition:'all .15s' }}>
                  {on && <div className="zoom" style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="check" s={14} c="#fff"/></div>}
                  <span style={{ fontSize:36 }}>{v.emoji}</span>
                  <span style={{ fontSize:15, fontWeight:500 }}>{v.label}</span>
                  <span className="t-small tnum" style={{ color:'var(--t2)' }}>{SP.COP(v.rate)}/h</span>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop:20 }}>
            <AIInsightCard micro title="SpotPark AI" delay={.2}
              body={`Seleccionamos tu Renault Sandero · ZXC 123 automáticamente.`}
              action={<button onClick={()=>setVtype('car')} style={{ marginTop:8, background:'none', border:'none', color:'var(--blue-light)', fontSize:12, fontWeight:500, cursor:'pointer' }}>Cambiar →</button>}/>
          </div>
        </div>)}

        {step===2 && (<div className="fade">
          <h1 className="t-h1" style={{ margin:'0 0 18px' }}>¿Cuándo y por cuánto?</h1>
          <DurationSuggestion hours={hours} setHours={setHours} zone={s.zone}/>
          <div className="no-sb" style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
            {days.map((d,i)=>{
              const on=i===day, parts=d.split(' ');
              return (
                <button key={d} onClick={()=>setDay(i)} style={{ flexShrink:0, width:54, height:60, borderRadius:14, border: on?'none':'.5px solid var(--border)', cursor:'pointer',
                  background: on?'var(--blue)':'var(--surface)', color: on?'#fff':'var(--t2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
                  <span style={{ fontSize:11 }}>{parts[0]}</span>{parts[1] && <span style={{ fontSize:17, fontWeight:500 }}>{parts[1]}</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:18 }}>
            <div className="card" style={{ flex:1, padding:'12px 16px', background:'var(--surface)' }}>
              <div className="t-micro" style={{ color:'var(--t2)' }}>Entrada</div>
              <div className="t-h2 tnum" style={{ marginTop:2 }}>{start}</div></div>
            <div className="card" style={{ flex:1, padding:'12px 16px', background:'var(--surface)' }}>
              <div className="t-micro" style={{ color:'var(--t2)' }}>Salida</div>
              <div className="t-h2 tnum" style={{ marginTop:2 }}>{addHours(start,hours)}</div></div>
          </div>
          <div className="no-sb" style={{ display:'flex', gap:8, overflowX:'auto', marginTop:14, paddingBottom:4 }}>
            {quick.map(([l,h])=>(
              <button key={l} className={'chip'+(hours===h?' on':'')} onClick={()=>setHours(h)}>{l}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20 }}>
            <span className="t-h3">Duración</span><Stepper value={hours<1?1:hours} onChange={setHours} min={1}/></div>
          <PriceImpact rate={rate} hours={hours}/>
          {hours>3 && (
            <div className="rise-s" style={{ display:'flex', gap:10, alignItems:'flex-start', background:'var(--yellow-bg)', border:'.5px solid var(--orange)', borderRadius:14, padding:'12px 14px', marginTop:12 }}>
              <Icon n="info" s={18} c="var(--orange)" style={{ flexShrink:0, marginTop:1 }}/>
              <div style={{ flex:1 }}>
                <span className="t-small" style={{ color:'#9A5B0E', fontWeight:600 }}>Sueles estar ~2h aquí. ¿Seguro que necesitas {hours}h?</span>
                <div style={{ display:'flex', gap:8, marginTop:10 }}><button className="btn btn-ghost btn-sm" onClick={()=>setHours(2)}>Reducir a 2h</button></div>
              </div>
            </div>
          )}

          {/* Feature 5 — Reserva recurrente */}
          <div className="card" style={{ marginTop:18, padding:16, background:'var(--surface)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <Icon n="refresh" s={20} c="var(--lime-deep)"/>
              <div style={{ flex:1 }}><div className="t-h3" style={{ fontSize:15 }}>Reserva recurrente</div>
                <div className="t-micro" style={{ color:'var(--t2)', marginTop:1 }}>Repite esta reserva automáticamente</div></div>
              <Toggle on={recur} onChange={setRecur}/>
            </div>
            {recur && (
              <div className="fade" style={{ marginTop:16 }}>
                <div className="t-small" style={{ color:'var(--t2)', marginBottom:8 }}>Repetir</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[['weekly','Semanal'],['biweekly','Quincenal'],['monthly','Mensual']].map(([k,l])=>(
                    <button key={k} className={'chip'+(freq===k?' on':'')} style={{ flex:1, justifyContent:'center' }} onClick={()=>setFreq(k)}>{l}</button>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
                  <span className="t-small" style={{ color:'var(--t2)' }}>Durante</span>
                  <Stepper value={weeks} onChange={setWeeks} min={2} max={12} suffix=" sem"/>
                </div>
                <div className="t-micro" style={{ color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.08em', margin:'16px 0 8px' }}>Se crearán {weeks} reservas</div>
                {[0,1,2].map(k=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: k<2?'1px solid var(--separator)':'none' }}>
                    <span className="t-small">Lun {2+k*7} Jun · {start}–{addHours(start,hours)}</span>
                    <span className="t-small tnum" style={{ fontWeight:600 }}>{SP.COP(sub)}</span>
                  </div>
                ))}
                {weeks>3 && <div className="t-micro" style={{ color:'var(--t3)', marginTop:8 }}>+ {weeks-3} más…</div>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, paddingTop:12, borderTop:'1px solid var(--separator)' }}>
                  <span className="t-small" style={{ fontWeight:600 }}>Total ({weeks} reservas)</span>
                  <span className="t-h3 tnum">{SP.COP(sub*weeks)}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop:22 }}>
            <AIInsightCard micro body={SP.ai.smartTime} delay={.2}
              action={<div style={{ display:'flex', gap:8, marginTop:10 }}>
                <button onClick={()=>setStart('08:15')} className="btn btn-secondary btn-sm">Sí, usar</button>
                <button className="btn btn-ghost btn-sm">No, gracias</button></div>}/>
          </div>
          <div className="card" style={{ marginTop:20, padding:16, background:'var(--surface)' }}>
            <Row k={`${SP.COP(rate)} × ${hours}h`} v={SP.COP(sub)}/>
            <Row k="Comisión (15%)" v={SP.COP(fee)}/>
            <div style={{ height:'.5px', background:'var(--separator)', margin:'10px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="t-h3">Total</span><span className="t-h1 tnum" style={{ color:'var(--ink)' }}>{SP.COP(total)}</span></div>
          </div>
          <div className="t-micro" style={{ color:'var(--t3)', marginTop:10 }}>Tienes 15 min de gracia para llegar.</div>
        </div>)}

        {step===3 && (<div className="fade">
          <h1 className="t-h1" style={{ margin:'0 0 18px' }}>Confirmar y pagar</h1>
          <div className="card" style={{ padding:13, display:'flex', gap:12, alignItems:'center', background:'var(--surface)' }}>
            <div style={{ width:48, height:48, borderRadius:10, background:s.img, flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:15, fontWeight:500 }}>{s.name}</div>
              <div className="t-small" style={{ color:'var(--t2)' }}>{days[day]} · {start}–{addHours(start,hours)}</div></div>
            <VehicleChip {...SP.vehicleTypes.find(v=>v.type===vtype)} display/>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <div className="input" style={{ flex:1 }}><input placeholder="Código promocional"/></div>
            <button className="btn btn-ghost btn-sm" style={{ height:52 }}>Aplicar</button>
          </div>
          <div className="card" style={{ marginTop:16, padding:16, background:'var(--surface)' }}>
            <Row k="Subtotal" v={SP.COP(sub)}/><Row k="Comisión" v={SP.COP(fee)}/>
            <div style={{ height:'.5px', background:'var(--separator)', margin:'10px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="t-h3">Total</span><span className="t-h1 tnum" style={{ color:'var(--ink)' }}>{SP.COP(total)}</span></div>
          </div>
          <div className="t-small" style={{ color:'var(--t2)', margin:'20px 0 12px' }}>Método de pago</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['card','Visa ···· 4421','card'],['nequi','Nequi','phone'],['pse','PSE','card'],['cash','Efectivo en sitio','card']].map(([k,l,ic])=>{
              const on=pay===k;
              return (
                <button key={k} onClick={()=>setPay(k)} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 15px', borderRadius:14, cursor:'pointer',
                  background: on?'var(--blue-tint)':'var(--surface)', border: on?'1.5px solid var(--blue)':'.5px solid var(--border)', textAlign:'left' }}>
                  <Icon n={ic} s={20} c={on?'var(--blue-light)':'var(--t2)'}/>
                  <span style={{ flex:1, fontSize:15, fontWeight:500, color: on?'#fff':'var(--t1)' }}>{l}</span>
                  <div style={{ width:22, height:22, borderRadius:'50%', border: on?'7px solid var(--blue)':'2px solid var(--t3)', transition:'all .15s' }}/>
                </button>
              );
            })}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14, color:'var(--t3)' }}>
            <Icon n="fingerprint" s={18} c="var(--t3)"/><span className="t-micro">Se solicitará tu huella al pagar.</span></div>
        </div>)}
      </div>

      {/* CTA */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'14px 20px 30px', background:'var(--bg)', borderTop:'.5px solid var(--border)' }}>
        <button className="btn btn-primary btn-block" onClick={()=> step<3 ? setStep(step+1) : push('confirmed',{ id, total, start, hours, day:days[day], space:'A2' })}>
          {step<3 ? 'Continuar' : `Pagar ${SP.COP(total)}`}</button>
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
    <span className="t-small" style={{ color:'var(--t2)' }}>{k}</span><span className="t-small tnum" style={{ color:'var(--t1)' }}>{v}</span></div>;
}
function addHours(hhmm, add) {
  let [h,m]=hhmm.split(':').map(Number); const tot=(h*60+m+Math.round(add*60))%1440; h=Math.floor(tot/60); m=tot%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

/* ─────────── CONFIRMED ─────────── */
function Confirmed({ id, total, start, hours, day, space }) {
  const { replace, push } = useNav();
  const s = SP.byId(id);
  const [phase, setPhase] = bS(0);
  bE(()=>{ const a=setTimeout(()=>setPhase(1),700), b=setTimeout(()=>setPhase(2),1200); return ()=>{clearTimeout(a);clearTimeout(b);}; },[]);
  const rows = [
    { ic:'pin', l:s.name }, { ic:'cal', l:`${day} · ${start}–${addHours(start,hours)}` },
    { ic:'car', l:`Renault Sandero · Espacio ${space}` }, { ic:'card', l:`${SP.COP(total)} pagados` },
  ];
  return (
    <div className="scr-scroll no-sb" style={{ position:'absolute', inset:0, background:'var(--ink)' }}>
      <Chrome onDark />
      <div style={{ minHeight:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'88px 24px 40px', position:'relative' }}>
        <div style={{ position:'absolute', top:120, width:240, height:240 }}>
          {[0,1,2].map(k=>(<div key={k} style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(198,242,78,.35)', animation:'sp-ping 2.6s ease-out infinite', animationDelay:`${k*.6}s` }}/>))}
        </div>
        <div className="zoom" style={{ width:96, height:96, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)', zIndex:2 }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="30" strokeDashoffset="30" style={{ animation:'sp-dash .6s .3s ease forwards' }}/></svg>
        </div>
        {phase>=1 && <h1 className="t-h1 rise-s" style={{ margin:'22px 0 6px', color:'#fff' }}>¡Reserva confirmada!</h1>}
        {phase>=1 && <p className="t-body rise-s d1" style={{ color:'rgba(255,255,255,.6)', margin:0 }}>Tu código QR está listo</p>}

        {phase>=2 && (
          <div className="zoom" style={{ background:'#fff', borderRadius:24, padding:22, marginTop:26, width:'100%', maxWidth:280 }}>
            <div style={{ width:180, height:180, margin:'0 auto', borderRadius:14, background:'#0A0A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon n="qr" s={130} c="#fff"/></div>
            <div className="mono" style={{ textAlign:'center', color:'#475569', fontSize:13, marginTop:14 }}>SPK-7F2A-9X41</div>
            <div style={{ textAlign:'center', color:'#94A3B8', fontSize:12, marginTop:4 }}>Escanea esto en la entrada</div>
          </div>
        )}

        {phase>=2 && (
          <div className="rise-s d2" style={{ width:'100%', marginTop:24 }}>
            {rows.map((r,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i<3?'.5px solid rgba(255,255,255,.1)':'none' }}>
                <Icon n={r.ic} s={19} c="var(--blue)"/><span className="t-small" style={{ color:'#fff' }}>{r.l}</span></div>
            ))}
            <div style={{ marginTop:18 }}>
              <AIInsightCard body="Saliendo ahora llegarás a tiempo. El tráfico añade ~8 min." delay={0}
                action={<button className="btn btn-secondary btn-sm" style={{ marginTop:10 }}><Icon n="bell" s={15} c="var(--blue-light)"/>Activar recordatorio</button>}/>
            </div>
          </div>
        )}

        {phase>=2 && (
          <div className="rise-s d3" style={{ width:'100%', display:'flex', flexDirection:'column', gap:10, marginTop:24 }}>
            <button className="btn btn-primary btn-block" onClick={()=>push('navigate',{ id, start, hours, space })}><Icon n="nav" s={19} c="var(--ink)"/>Navegar con SpotPark</button>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-ghost" style={{ flex:1 }}><Icon n="cal" s={18} c="var(--t1)"/>Calendario</button>
              <button className="btn btn-ghost" style={{ flex:1 }}><Icon n="share" s={18} c="var(--t1)"/>Compartir</button>
            </div>
            <button onClick={()=>replace('home')} style={{ background:'none', border:'none', color:'rgba(255,255,255,.6)', fontSize:14, fontWeight:500, cursor:'pointer', padding:10 }}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── ACTIVE ─────────── */
function Active({ id='s1', start='14:00', hours=4, space='A2' }) {
  const { pop } = useNav();
  const s = SP.byId(id);
  const [el, setEl] = bS(72*60+14);
  const [alert, setAlert] = bS(true);
  const [arriving, setArriving] = bS('idle'); // idle | sending | done
  bE(()=>{ const t=setInterval(()=>setEl(e=>e+1),1000); return ()=>clearInterval(t); },[]);
  const totalSec = hours*3600, remain = Math.max(0,totalSec-el);
  const hh=String(Math.floor(remain/3600)).padStart(2,'0'), mm=String(Math.floor((remain%3600)/60)).padStart(2,'0'), ss=String(remain%60).padStart(2,'0');
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--ink)', display:'flex', flexDirection:'column' }}>
      <Chrome onDark />
      {/* status strip */}
      <div style={{ marginTop:54, background:'rgba(61,163,93,.16)', borderBottom:'1px solid rgba(61,163,93,.4)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#5BD08A', animation:'sp-pulse 1.4s infinite' }}/>
          <span style={{ color:'#5BD08A', fontSize:13, fontWeight:600 }}>Reserva activa</span></div>
        <span className="mono tnum" style={{ color:'#5BD08A', fontSize:15 }}>{hh}:{mm}:{ss}</span>
      </div>

      <div className="scr-scroll no-sb" style={{ padding:'14px 20px 30px' }}>
        {/* proactive alert */}
        {alert && (
          <div className="rise-s" style={{ background:'var(--yellow-bg)', border:'.5px solid var(--orange)', borderRadius:14, padding:14, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <span className="t-small" style={{ color:'#9A5B0E', fontWeight:600, flex:1 }}>⏰ Tu reserva vence en 30 min. ¿Necesitas más tiempo?</span>
              <button onClick={()=>setAlert(false)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Icon n="x" s={16} c="var(--orange)"/></button>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button className="btn btn-ghost btn-sm">+1h {SP.COP(3000)}</button>
              <button className="btn btn-ghost btn-sm">+2h {SP.COP(5500)}</button>
            </div>
          </div>
        )}

        {/* info */}
        <div className="card" style={{ padding:14, display:'flex', alignItems:'center', gap:12, marginBottom:16, background:'var(--surface)' }}>
          <div style={{ width:48, height:48, borderRadius:10, background:s.img, flexShrink:0 }}/>
          <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:500 }}>{s.name}</div><div className="t-small" style={{ color:'var(--t2)' }}>{s.addr}</div></div>
          <span className="tnum" style={{ background:'var(--blue-tint)', color:'var(--blue-light)', fontWeight:500, padding:'5px 10px', borderRadius:8, fontSize:14 }}>{space}</span>
        </div>

        {/* QR */}
        <div style={{ background:'#fff', borderRadius:24, padding:20, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ width:200, height:200, borderRadius:14, background:'#0A0A1A', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="qr" s={150} c="#fff"/></div>
          <div className="mono" style={{ color:'#475569', fontSize:13, marginTop:14 }}>SPK-7F2A-9X41</div>
          <div style={{ color:'#94A3B8', fontSize:12, marginTop:4 }}>Escanea en la entrada</div>
        </div>

        {/* Feature 1 — Estoy llegando */}
        <div className="rise-s" style={{ marginTop:16, background:'var(--blue-bg)', border:'1px solid var(--blue-tint)', borderLeft:'3px solid var(--lime-deep)', borderRadius:16, padding:14 }}>
          {arriving!=='done' ? (<>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Icon n="nav" s={19} c="var(--lime-deep)"/>
              <div style={{ flex:1 }}>
                <div className="t-h3" style={{ fontSize:14 }}>Llegas en ~8 min</div>
                <div className="t-micro" style={{ color:'var(--t2)', marginTop:1 }}>Avisa al parqueadero que vas en camino</div>
              </div>
            </div>
            <button className="btn btn-primary btn-block" style={{ height:46, marginTop:12 }} disabled={arriving==='sending'}
              onClick={()=>{ setArriving('sending'); setTimeout(()=>setArriving('done'),900); }}>
              {arriving==='sending'
                ? <span style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(15,17,21,.3)', borderTopColor:'var(--ink)', animation:'sp-spin .7s linear infinite' }}/>
                : <><Icon n="pin" s={18} c="var(--ink)"/>Estoy llegando</>}
            </button>
          </>) : (
            <div className="fade" style={{ display:'flex', alignItems:'center', gap:9 }}>
              <Icon n="checkC" s={20} c="var(--green)"/>
              <span className="t-small" style={{ color:'var(--green)', fontWeight:600 }}>Parqueadero notificado · te esperan</span>
            </div>
          )}
        </div>

        {/* live update */}
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface)', boxShadow:'var(--sh-card)', borderRadius:12, padding:'12px 14px', marginTop:16 }}>
          <Icon n="refresh" s={18} c="var(--green)"/><span className="t-small" style={{ color:'var(--t2)' }}><b style={{ color:'var(--t1)' }}>{s.cars[0]}/{s.cars[1]}</b> cupos de carro disponibles ahora</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:20 }}>
          <button className="btn btn-primary btn-block"><Icon n="clock" s={19} c="var(--ink)"/>Extender tiempo</button>
          <button className="btn btn-ghost btn-block" onClick={()=>push('navigate',{ id, start, hours, space })}><Icon n="nav" s={19} c="var(--t1)"/>Navegar</button>
          <button onClick={pop} style={{ background:'none', border:'none', color:'#FF8A80', fontSize:14, fontWeight:500, cursor:'pointer', padding:10 }}>Cancelar reserva</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window.SP_SCREENS, { detail:Detail, reserve:Reserve, confirmed:Confirmed, active:Active });
