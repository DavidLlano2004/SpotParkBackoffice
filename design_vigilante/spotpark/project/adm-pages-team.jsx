/* adm-pages-team.jsx — Trabajadores + Usuarios de la app. */
const { useState:tmS } = React;

/* ───────── TRABAJADORES ───────── */
function Trabajadores() {
  const { go } = useADM();
  const [q,setQ]=tmS(''); const [role,setRole]=tmS(''); const [park,setPark]=tmS(''); const [st,setSt]=tmS('');
  const list=ADM.workers.filter(w=>(!q||w.name.toLowerCase().includes(q.toLowerCase())||w.cc.includes(q))&&(!role||w.role===role)&&(!park||w.parkings.includes(park))&&(!st||w.status===st));
  const T={ total:ADM.workers.length, active:ADM.workers.filter(w=>w.status==='active'||w.status==='shift').length, shift:ADM.workers.filter(w=>w.status==='shift').length, inc:ADM.workers.filter(w=>w.incidents>0).length };
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:18 }}>
        <h1 className="t-h1">Trabajadores</h1>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={()=>go('trabajador',{ worker:null })}><Icon n="plus" s={17} c="var(--ink)"/>Nuevo trabajador</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        <StatChip label="Total" value={T.total}/><StatChip label="Activos" value={T.active} color="var(--green-tx)"/>
        <StatChip label="En turno ahora" value={T.shift} color="var(--green-tx)"/><StatChip label="Con incidentes" value={T.inc} color="var(--orange)"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div className="input" style={{ height:38, width:260, borderRadius:11 }}><Icon n="search" s={17} c="var(--t3)"/><input placeholder="Buscar por nombre o identificación…" value={q} onChange={e=>setQ(e.target.value)} style={{ fontSize:13 }}/></div>
        <Select value={role} w={150} options={[{v:'',l:'Rol: Todos'},'Vigilante','Supervisor','Administrador']} onChange={setRole}/>
        <Select value={park} w={180} options={[{v:'',l:'Parqueadero: Todos'},...ADM.parkings.map(p=>({v:p.id,l:p.short}))]} onChange={setPark}/>
        <Select value={st} w={150} options={[{v:'',l:'Estado: Todos'},{v:'active',l:'Activo'},{v:'shift',l:'En turno'},{v:'inactive',l:'Inactivo'},{v:'suspended',l:'Suspendido'}]} onChange={setSt}/>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl"><thead><tr><th>Trabajador</th><th>Rol</th><th>Teléfono</th><th>Parqueadero</th><th>Estado</th><th>Último turno</th><th></th></tr></thead>
          <tbody>{list.map(w=>(
            <tr key={w.id} className="row" onClick={()=>go('trabajador',{ worker:w })}>
              <td><div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar init={w.init} size={34}/><div><div style={{ fontWeight:600, fontSize:13.5 }}>{w.name}</div><div className="t-micro" style={{ color:'var(--t3)' }}>{w.cc}</div></div></div></td>
              <td><RoleTag role={w.role}/></td>
              <td className="t-small tnum" style={{ color:'var(--t2)' }}>{w.phone}</td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{w.parkings.length>1?`${w.parkings.length} asignados`:(ADM.parkings.find(p=>p.id===w.parkings[0])?.short||'—')}</td>
              <td><StatusTag status={w.status}/></td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{w.last}</td>
              <td><Icon n="chevR" s={16} c="var(--t3)"/></td>
            </tr>))}</tbody></table>
      </div>
    </div>
  );
}
function RoleTag({ role }) {
  const m={ Vigilante:['bg-resv',null], Supervisor:['bg-info',null], 'Administrador':['',{ background:'var(--yellow-bg)', color:'var(--yellow-tx)' }] };
  const [cls,style]=m[role]||m.Vigilante;
  return <span className={'badge '+cls} style={style}>{role}</span>;
}
function StatusTag({ status }) {
  const ST={ shift:['bg-avail','En turno','var(--green)',true], active:['bg-resv','Activo','var(--blue)',false], inactive:['','Inactivo','var(--t3)',false], suspended:['bg-full','Suspendido','var(--red)',false] };
  const [cls,l,c,pulse]=ST[status]||ST.active;
  return <span className={'badge '+cls} style={!cls?{ background:'var(--elevated)', color:'var(--t2)' }:null}><span className="dot" style={{ background:c, animation:pulse?'pulse 1.8s infinite':'none' }}/>{l}</span>;
}

/* ───────── TRABAJADOR DETAIL / FORM ───────── */
function TrabajadorForm() {
  const { ctx, go } = useADM();
  const w=ctx?.worker;
  const editing=!!w;
  const [name,setName]=tmS(w?.name||''); const [cc,setCc]=tmS(w?.cc||''); const [email,setEmail]=tmS(w?.email||''); const [phone,setPhone]=tmS(w?.phone||'');
  const [role,setRole]=tmS(w?.role||'Vigilante');
  const [parks,setParks]=tmS(w?.parkings||[]);
  const togPark=id=>setParks(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <button onClick={()=>go('trabajadores')} style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="chevL" s={18} c="var(--t1)"/></button>
        <h1 className="t-h1">{editing?'Editar trabajador':'Nuevo trabajador'}</h1>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={()=>go('trabajadores')}><Icon n="check" s={16} c="var(--ink)"/>Guardar</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Panel title="Datos personales">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Labeled label="Nombre completo" full><Field ph="Nombre y apellido" value={name} onChange={setName}/></Labeled>
              <Labeled label="Identificación (CC)"><Field ph="000000000" value={cc} onChange={setCc}/></Labeled>
              <Labeled label="Teléfono"><Field ic="phone" ph="+57 300 000 0000" value={phone} onChange={setPhone}/></Labeled>
              <Labeled label="Correo" full><Field ic="mail" ph="trabajador@spotpark.co" value={email} onChange={setEmail}/></Labeled>
            </div>
          </Panel>
          <Panel title="Datos laborales">
            <Labeled label="Rol"><div style={{ display:'flex', gap:8 }}>{['Vigilante','Supervisor','Administrador'].map(r=><button key={r} onClick={()=>setRole(r)} style={{ flex:1, height:42, borderRadius:11, cursor:'pointer', background:role===r?'var(--lime-tint)':'var(--surface)', border:role===r?'1.5px solid var(--lime-deep)':'1px solid var(--border)', color:role===r?'var(--lime-deep)':'var(--t2)', fontSize:13, fontWeight:600, fontFamily:'var(--font)' }}>{r}</button>)}</div></Labeled>
            <div style={{ marginTop:14 }}><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>Parqueaderos asignados</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{ADM.parkings.map(p=>{ const on=parks.includes(p.id);
                return <button key={p.id} onClick={()=>togPark(p.id)} style={{ display:'inline-flex', alignItems:'center', gap:6, height:34, padding:'0 12px', borderRadius:100, cursor:'pointer', background:on?'var(--ink)':'var(--surface)', color:on?'#fff':'var(--t2)', border:on?'none':'1px solid var(--border)', fontSize:12.5, fontWeight:600, fontFamily:'var(--font)' }}>{on&&<Icon n="check" s={14} c="var(--lime)"/>}{p.short}</button>; })}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:16, paddingTop:14, borderTop:'1px solid var(--separator)' }}>
              <div style={{ flex:1 }}><div className="t-small" style={{ fontWeight:600 }}>Enviar credenciales por correo</div><div className="t-micro" style={{ color:'var(--t3)', marginTop:2 }}>Contraseña temporal al correo registrado</div></div><Toggle on={true} onChange={()=>{}}/>
            </div>
          </Panel>
        </div>
        <div>
          {editing ? <Panel title="Estadísticas">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}><Avatar init={w.init} size={48}/><div><div className="t-h3" style={{ fontSize:15 }}>{w.name}</div><RoleTag role={w.role}/></div></div>
            {[['Turnos este mes',w.shifts],['Entradas registradas',w.entries.toLocaleString('es-CO')],['Incidentes',w.incidents],['Último acceso',w.last]].map(([l,v],i)=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:i<3?'1px solid var(--separator)':'none' }}>
                <span className="t-small" style={{ color:'var(--t2)' }}>{l}</span><span className="t-small tnum" style={{ fontWeight:600, color:l==='Incidentes'&&v>0?'var(--orange)':'var(--t1)' }}>{v}</span></div>
            ))}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
              <button className="btn btn-ghost btn-sm"><Icon n="refresh" s={15} c="var(--t1)"/>Resetear contraseña</button>
              <button className="btn btn-danger btn-sm" style={{ height:36 }}>Suspender cuenta</button>
            </div>
          </Panel>
          : <div>
            <div className="t-micro" style={{ color:'var(--t3)', marginBottom:8 }}>Vista previa del perfil</div>
            <Panel><div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'10px 0' }}>
              <Avatar init={name?name.split(' ').map(x=>x[0]).join('').slice(0,2):'—'} size={64}/>
              <div className="t-h3" style={{ fontSize:16 }}>{name||'Nuevo trabajador'}</div>
              <RoleTag role={role}/>
              <div className="t-small" style={{ color:'var(--t3)' }}>{parks.length?`${parks.length} parqueadero(s)`:'Sin asignar'}</div>
            </div></Panel>
          </div>}
        </div>
      </div>
    </div>
  );
}
function Labeled({ label, children, full }) {
  return <div style={{ gridColumn: full?'1 / -1':'auto' }}><div className="t-micro upper" style={{ color:'var(--t3)', marginBottom:7 }}>{label}</div>{children}</div>;
}

/* ───────── USUARIOS ───────── */
function Usuarios() {
  const { go } = useADM();
  const [q,setQ]=tmS(''); const [tier,setTier]=tmS(''); const [st,setSt]=tmS('');
  const list=ADM.appUsers.filter(u=>(!q||u.name.toLowerCase().includes(q.toLowerCase())||u.email.includes(q.toLowerCase()))&&(!tier||u.tier===tier)&&(!st||u.status===st));
  const T={ total:ADM.appUsers.length, active:ADM.appUsers.filter(u=>u.status==='active').length, gold:ADM.appUsers.filter(u=>['Gold','Platinum'].includes(u.tier)).length, spent:ADM.appUsers.reduce((s,u)=>s+u.spent,0) };
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <h1 className="t-h1" style={{ marginBottom:16 }}>Usuarios</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        <StatChip label="Total registrados" value={T.total}/><StatChip label="Activos" value={T.active} color="var(--green-tx)"/>
        <StatChip label="Nivel Gold+" value={T.gold} color="var(--yellow-tx)"/><StatChip label="Gasto total" value={ADM.COPk(T.spent)} color="var(--lime-deep)"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div className="input" style={{ height:38, width:260, borderRadius:11 }}><Icon n="search" s={17} c="var(--t3)"/><input placeholder="Buscar por nombre, email o placa…" value={q} onChange={e=>setQ(e.target.value)} style={{ fontSize:13 }}/></div>
        <Select value={tier} w={160} options={[{v:'',l:'Nivel: Todos'},'Bronze','Silver','Gold','Platinum']} onChange={setTier}/>
        <Select value={st} w={150} options={[{v:'',l:'Estado: Todos'},{v:'active',l:'Activo'},{v:'suspended',l:'Suspendido'},{v:'inactive',l:'Sin reservas'}]} onChange={setSt}/>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl"><thead><tr><th>Usuario</th><th>Email</th><th>Nivel</th><th>Reservas</th><th>Último acceso</th><th>Gasto total</th><th>Estado</th><th></th></tr></thead>
          <tbody>{list.map(u=>(
            <tr key={u.id} className="row" onClick={()=>go('usuario',{ user:u })}>
              <td><div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar init={u.init} size={34} bg="var(--elevated)" color="var(--t1)"/><span style={{ fontWeight:600, fontSize:13.5 }}>{u.name}</span></div></td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{u.email}</td>
              <td><TierBadge tier={u.tier}/></td>
              <td className="tnum">{u.reservas}</td>
              <td className="t-small" style={{ color:'var(--t2)' }}>{u.last}</td>
              <td className="tnum" style={{ fontWeight:600, color:'var(--lime-deep)' }}>{ADM.COP(u.spent)}</td>
              <td><StatusTag status={u.status==='active'?'active':u.status==='suspended'?'suspended':'inactive'}/></td>
              <td><Icon n="chevR" s={16} c="var(--t3)"/></td>
            </tr>))}</tbody></table>
      </div>
    </div>
  );
}
function TierBadge({ tier }) {
  const c=ADM.TIER[tier]||'var(--t3)';
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:24, padding:'0 10px', borderRadius:100, background:'var(--elevated)', fontSize:11.5, fontWeight:600, color:c }}><Icon n="starFill" s={12} c={c}/>{tier}</span>;
}

function UsuarioDetail() {
  const { ctx, go } = useADM();
  const u=ctx?.user||ADM.appUsers[0];
  return (
    <div className="no-sb" style={{ height:'100%', overflowY:'auto', paddingRight:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <button onClick={()=>go('usuarios')} style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon n="chevL" s={18} c="var(--t1)"/></button>
        <h1 className="t-h1">{u.name}</h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}><button className="btn btn-ghost btn-sm">Ver reservas</button><button className="btn btn-danger btn-sm" style={{ height:36 }}>Suspender cuenta</button></div>
      </div>
      {u.status==='suspended' && <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--yellow-bg)', border:'1px solid var(--orange)', borderRadius:14, padding:'12px 16px', marginBottom:16 }}><Icon n="warning" s={18} c="var(--orange)"/><span className="t-small" style={{ color:'var(--yellow-tx)', fontWeight:500 }}>Esta cuenta está suspendida por: actividad sospechosa de pago.</span><button className="btn btn-green btn-sm" style={{ marginLeft:'auto', height:32 }}>Reactivar</button></div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:14 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Panel><div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'8px 0' }}>
            <Avatar init={u.init} size={64} bg="var(--elevated)" color="var(--t1)"/>
            <div className="t-h3" style={{ fontSize:16 }}>{u.name}</div><TierBadge tier={u.tier}/>
            <div className="t-small" style={{ color:'var(--t3)' }}>{u.email}</div></div></Panel>
          <Panel title="Vehículos">
            {u.plates.length? u.plates.map(p=><div key={p} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0' }}><Icon n="car" s={18} c="var(--t2)"/><span className="mono" style={{ fontWeight:600, letterSpacing:'.05em' }}>{ADM.fmtPlate?ADM.fmtPlate(p):p}</span></div>)
              : <p className="t-small" style={{ color:'var(--t3)', margin:0 }}>Sin vehículos registrados.</p>}
          </Panel>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <MetricCard ic="cal" iconBg="var(--blue-bg)" iconColor="var(--blue-tx)" label="Reservas" value={u.reservas}/>
            <MetricCard ic="card" iconBg="var(--green-bg)" iconColor="var(--green-tx)" label="Gasto total" value={u.spent} prefix="$"/>
            <MetricCard ic="star" iconBg="var(--yellow-bg)" iconColor="var(--yellow-tx)" label="Puntos" value={u.reservas*25}/>
          </div>
          <Panel title="Gasto últimos 6 meses"><AreaChart data={ADM.months.map((m,i)=>({ label:m, value: Math.round(u.spent/6*(0.7+i*0.1)) }))} fmt={v=>ADM.COPk(v)} h={200}/></Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RoleTag, StatusTag, TierBadge, Labeled });
Object.assign(window.ADM_PAGES, { trabajadores:Trabajadores, trabajador:TrabajadorForm, usuarios:Usuarios, usuario:UsuarioDetail });
