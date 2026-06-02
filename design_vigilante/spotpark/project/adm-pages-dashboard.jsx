/* adm-pages-dashboard.jsx — Login + Executive Dashboard. window.ADM_PAGES */
window.ADM_PAGES = window.ADM_PAGES || {};
const { useState:dS, useEffect:dE } = React;

/* ───────── LOGIN ───────── */
function AdmLogin() {
  const { go } = useADM();
  const [show,setShow]=dS(false);
  const [email,setEmail]=dS('natalia@spotpark.co');
  const [pass,setPass]=dS('••••••••••');
  return (
    <div style={{ height:'100vh', display:'grid', gridTemplateColumns:'1.05fr 1fr', background:'var(--bg)' }}>
      <div className="inleft" style={{ background:'var(--ink)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-70, right:-50, width:260, height:260, borderRadius:'50%', background:'rgba(198,242,78,.10)' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(198,242,78,.06)' }}/>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:2 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:'var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-lime)' }}>
            <span style={{ color:'var(--ink)', fontFamily:'var(--display)', fontWeight:700, fontSize:34 }}>P</span></div>
          <div className="t-h1" style={{ color:'#fff', marginTop:16 }}>SpotPark</div>
          <div className="t-small" style={{ color:'var(--lime)', marginTop:4 }}>Panel Administrativo</div>
          {/* mini multi-parking dashboard illustration */}
          <svg width="340" height="220" viewBox="0 0 340 220" style={{ marginTop:34 }}>
            <rect width="340" height="220" rx="16" fill="#15171F"/>
            <rect x="20" y="20" width="92" height="58" rx="8" fill="#1C1F28"/>
            <rect x="124" y="20" width="92" height="58" rx="8" fill="#1C1F28"/>
            <rect x="228" y="20" width="92" height="58" rx="8" fill="#1C1F28"/>
            <rect x="30" y="32" width="40" height="6" rx="3" fill="#283042"/>
            <rect x="30" y="48" width="60" height="12" rx="3" fill="#C6F24E"/>
            <rect x="134" y="32" width="40" height="6" rx="3" fill="#283042"/><rect x="134" y="48" width="46" height="12" rx="3" fill="#3DA35D"/>
            <rect x="238" y="32" width="40" height="6" rx="3" fill="#283042"/><rect x="238" y="48" width="54" height="12" rx="3" fill="#3B82F6"/>
            <polyline points="20,170 60,150 100,158 140,128 180,138 220,108 260,118 300,90 320,96" fill="none" stroke="#C6F24E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="20" y1="190" x2="320" y2="190" stroke="#283042" strokeWidth="1.5"/>
          </svg>
          <p className="t-small" style={{ color:'rgba(255,255,255,.5)', textAlign:'center', maxWidth:280, marginTop:26 }}>Gestiona todos tus parqueaderos desde un solo lugar.</p>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:48 }}>
        <div style={{ maxWidth:368, margin:'0 auto', width:'100%' }}>
          <h1 className="t-h1 rise-s">Bienvenida, Natalia</h1>
          <p className="t-body rise-s d1" style={{ color:'var(--t2)', margin:'6px 0 30px' }}>Ingresa a tu panel administrativo.</p>
          <div className="rise-s d2" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label className="t-micro upper" style={{ color:'var(--t3)', display:'block', marginBottom:7 }}>Correo</label>
              <Field ic="mail" ph="tu@spotpark.co" lg value={email} onChange={setEmail}/>
            </div>
            <div>
              <label className="t-micro upper" style={{ color:'var(--t3)', display:'block', marginBottom:7 }}>Contraseña</label>
              <Field ic="lock" ph="••••••••" lg value={pass} onChange={setPass} trailing={
                <button onClick={()=>setShow(s=>!s)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Icon n={show?'eyeOff':'eye'} s={19} c="var(--t3)"/></button>}/>
              <div style={{ textAlign:'right', marginTop:7 }}><button style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer' }}>¿Olvidaste tu contraseña?</button></div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block rise-s d3" style={{ marginTop:24 }} onClick={()=>go('dashboard')}>Ingresar al panel</button>
          <p className="t-micro rise-s d4" style={{ color:'var(--t4)', textAlign:'center', marginTop:24 }}>SpotPark Admin · v2.4 · Manizales, Colombia</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── DASHBOARD ───────── */
function DateRange({ value, onChange }) {
  const opts=[['hoy','Hoy'],['semana','Esta semana'],['mes','Este mes'],['ano','Este año'],['custom','Personalizado']];
  return <div style={{ display:'flex', gap:6 }}>
    {opts.map(([k,l])=><button key={k} onClick={()=>onChange(k)} style={{ height:32, padding:'0 13px', borderRadius:9, border:'none', cursor:'pointer',
      background:value===k?'var(--ink)':'var(--surface)', color:value===k?'#fff':'var(--t2)', fontSize:12.5, fontWeight:600, boxShadow:value===k?'none':'var(--sh-card)', fontFamily:'var(--font)' }}>{l}</button>)}
  </div>;
}

function Dashboard() {
  const { go, openModal } = useADM();
  const [range,setRange]=dS('mes');
  const T=ADM.totals;
  const today=new Date().toLocaleDateString('es-CO',{ weekday:'long', day:'numeric', month:'long' });
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'flex-end', marginBottom:18 }}>
        <div>
          <h1 className="t-h1">Dashboard</h1>
          <p className="t-small" style={{ color:'var(--t3)', marginTop:3, textTransform:'capitalize' }}>{today}</p>
        </div>
        <div style={{ marginLeft:'auto' }}><DateRange value={range} onChange={setRange}/></div>
      </div>

      {/* metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14 }}>
        <MetricCard ic="card" iconBg="var(--green-bg)" iconColor="var(--green-tx)" label="Ingresos totales" value={T.rev} prefix="$" trend="12% vs mes anterior" trendDir="up" delay={0}/>
        <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas completadas" value={T.reservas} trend="8% vs mes anterior" trendDir="up" delay={0.05}/>
        <MetricCard ic="layers" iconBg="var(--lime-bg)" iconColor="var(--lime-deep)" label="Ocupación promedio" value={Math.round(T.occ*100)} suffix="%" ring={T.occ} trend="2% vs mes anterior" trendDir="down" delay={0.1}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <MetricCard ic="home" iconBg="var(--elevated)" label="Parqueaderos activos" value={T.active} sub={`de ${ADM.parkings.length} totales`} delay={0.15}/>
        <MetricCard ic="user" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Trabajadores activos" value={T.workersActive} sub={`${T.onShift} en turno ahora`} subColor="var(--green-tx)" delay={0.2}/>
        <MetricCard ic="warning" iconBg="var(--yellow-bg)" iconColor="var(--orange)" label="Incidentes abiertos" value={T.openIncidents} sub="Requieren atención" subColor="var(--orange)" warn delay={0.25}/>
      </div>

      {/* charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
        <Panel title="Ingresos" right={<span className="t-micro" style={{ color:'var(--t3)' }}>Últimos 6 meses</span>}>
          <AreaChart data={ADM.revenueSeries} fmt={v=>ADM.COPk(v)} h={206}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:8, borderTop:'1px solid var(--separator)', paddingTop:14 }}>
            {[['Total periodo',ADM.COPk(ADM.revenueSeries.reduce((s,d)=>s+d.value,0))],['Promedio diario',ADM.COPk(ADM.totals.rev/30)],['Mejor día','$2.1M']].map(([l,v])=>(
              <div key={l}><div className="t-micro upper" style={{ color:'var(--t3)', fontSize:10 }}>{l}</div><div className="tnum" style={{ fontSize:18, fontWeight:700, fontFamily:'var(--display)', marginTop:2 }}>{v}</div></div>
            ))}
          </div>
        </Panel>
        <Panel title="Ocupación por tipo">
          <div style={{ display:'flex', justifyContent:'center', padding:'6px 0 14px' }}>
            <Donut data={ADM.vehicleSplit} size={158} center={<><span className="tnum" style={{ fontFamily:'var(--display)', fontWeight:700, fontSize:28 }}>{Math.round(ADM.totals.occ*100)}%</span><span className="t-micro" style={{ color:'var(--t3)' }}>ocupación</span></>}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {ADM.vehicleSplit.map(d=>{ const tot=ADM.vehicleSplit.reduce((s,x)=>s+x.value,0);
              return <div key={d.label} style={{ display:'flex', alignItems:'center', gap:9 }}>
                <span style={{ width:10, height:10, borderRadius:3, background:d.color }}/>
                <span className="t-small" style={{ flex:1 }}>{d.label}</span>
                <span className="t-small tnum" style={{ color:'var(--t2)' }}>{Math.round(d.value/tot*100)}%</span>
              </div>; })}
          </div>
        </Panel>
      </div>

      {/* tables + feed */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
        <Panel title="Rendimiento por parqueadero" pad={18} right={<button onClick={()=>go('parqueaderos')} style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Ver todos →</button>}>
          <table className="tbl" style={{ marginTop:-4 }}>
            <thead><tr><th>Parqueadero</th><th>Ingresos</th><th style={{ width:120 }}>Ocupación</th><th>Reservas</th><th>Tendencia</th></tr></thead>
            <tbody>
              {ADM.parkings.filter(p=>p.status==='active').sort((a,b)=>b.rev-a.rev).map(p=>(
                <tr key={p.id} className="row" onClick={()=>go('parking',{ parking:p })}>
                  <td><div style={{ fontWeight:600, fontSize:13.5 }}>{p.short}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{p.city}</div></td>
                  <td className="tnum" style={{ fontWeight:600 }}>{ADM.COPk(p.rev)}</td>
                  <td><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ flex:1 }}><ProgressBar pct={p.occ}/></div><span className="t-micro tnum" style={{ color:'var(--t2)', width:30 }}>{Math.round(p.occ*100)}%</span></div></td>
                  <td className="tnum">{p.reservas}</td>
                  <td><Sparkline data={p.trend} up={p.trend[p.trend.length-1]>=p.trend[0]}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Actividad reciente" right={<span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--green-tx)', fontWeight:600 }}><span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', animation:'pulse 1.8s infinite' }}/>En vivo</span>}>
          <div className="no-sb" style={{ maxHeight:300, overflowY:'auto', margin:'-4px -4px 0' }}>
            {ADM.activity.map((a,i)=>{ const m=ADM.ACT_META[a.kind];
              return <div key={a.id} className="rise-s" style={{ animationDelay:`${i*0.03}s`, display:'flex', gap:10, padding:'10px 4px', borderBottom:i<ADM.activity.length-1?'1px solid var(--separator)':'none' }}>
                <div style={{ width:28, height:28, borderRadius:9, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon n={m.ic} s={15} c={m.c}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="t-small" style={{ fontWeight:500, lineHeight:1.35 }}>{a.text}</div>
                  <div style={{ display:'flex', gap:6, marginTop:2 }}><span className="t-micro" style={{ color:'var(--t3)' }}>{a.parking}</span><span className="t-micro" style={{ color:'var(--t4)' }}>· {a.ago}</span></div>
                </div>
              </div>; })}
          </div>
        </Panel>
      </div>

      {/* AI business insights */}
      <div className="card rise-s" style={{ position:'relative', overflow:'hidden', background:'var(--lime-bg)', border:'1px solid var(--lime-tint)', padding:'18px 20px' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--lime)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Icon n="sparkle" s={18} c="var(--lime-deep)"/><span style={{ fontSize:14.5, fontWeight:600, color:'var(--lime-deep)' }}>SpotPark AI · Insights del negocio</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, borderTop:'1px solid var(--lime-tint)', marginTop:14, paddingTop:16 }}>
          {[
            ['Oportunidad','El parqueadero Terminal tiene 40% de ocupación los miércoles AM. Considera una tarifa reducida para atraer más usuarios.','Ver análisis','reportes'],
            ['Alerta','Los ingresos de Hosp. Santa Sofía cayeron 18% esta semana. El vigilante Pedro Sáenz tiene 3 anomalías sin resolver.','Investigar','incidentes'],
            ['Predicción','Próximo viernes festivo: demanda proyectada +45%. Considera reactivar La Estación para ese día.','Planear','parqueaderos'],
          ].map(([t,b,a,r],i)=>(
            <div key={t} className="fade" style={{ animationDelay:`${0.15+i*0.12}s` }}>
              <div className="t-micro upper" style={{ color:'var(--lime-deep)', fontSize:10, marginBottom:6 }}>{t}</div>
              <p className="t-small" style={{ color:'var(--t1)', margin:0, lineHeight:1.5 }}>{b}</p>
              <button onClick={()=>go(r)} style={{ background:'none', border:'none', color:'var(--lime-deep)', fontSize:12.5, fontWeight:600, cursor:'pointer', marginTop:8, padding:0 }}>{a} →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window.ADM_PAGES, { login:AdmLogin, dashboard:Dashboard });
Object.assign(window, { DateRange });
