/* bo-app.jsx — router + mount */
const { useState:aS, useEffect:aE, useCallback:aCb } = React;

const TITLES = { dashboard:'Dashboard', mapa:'Mapa', registros:'Registros', perfil:'Perfil', ajustes:'Ajustes', heatmap:'Mapa de calor', preturno:'Inicio de turno', postturno:'Cierre de turno', chat:'Mensajes', incidentes:'Incidentes' };

function BackofficeApp() {
  const [route,setRoute]=aS('login');
  const [modal,setModal]=aS(null);
  const [online,setOnline]=aS(true);

  const go = aCb(r=>{ setRoute(r); setModal(null); },[]);
  const openModal = aCb(m=>setModal(m),[]);
  const close = aCb(()=>setModal(null),[]);

  aE(()=>{ document.getElementById('boot')?.remove(); },[]);

  // keyboard shortcuts (power users)
  aE(()=>{
    const h = e=>{
      if (route==='login') return;
      const tag = (e.target.tagName||'').toLowerCase();
      if (tag==='input'||tag==='textarea') return;
      if (e.key==='e'||e.key==='E') { e.preventDefault(); openModal({ type:'entry', vtype:'car' }); }
      else if (e.key==='q'||e.key==='Q') { e.preventDefault(); openModal({ type:'qr' }); }
    };
    document.addEventListener('keydown', h); return ()=>document.removeEventListener('keydown', h);
  },[route, openModal]);

  const ctx = { route, go, openModal, online };
  const Page = window.BO_PAGES[route];

  return (
    <BOCtx.Provider value={ctx}>
      {route==='login'
        ? <Page/>
        : (
          <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
            <Sidebar/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <TopBar title={TITLES[route]||''}/>
              <div key={route} className="fade" style={{ flex:1, overflow:'hidden', padding:24 }}>
                {Page ? <Page/> : <div style={{ padding:40 }}>Página en construcción.</div>}
              </div>
              <StatusBar/>
            </div>
            {/* dev: connection toggle */}
            <button onClick={()=>setOnline(o=>!o)} title="Simular conexión" style={{ position:'fixed', bottom:12, right:12, zIndex:80,
              width:36, height:36, borderRadius:'50%', border:'none', cursor:'pointer', background:online?'var(--ink)':'var(--red)', color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--sh-pop)', opacity:.6 }}>
              <Icon n="refresh" s={17} c="#fff"/></button>
          </div>
        )}
      <ModalHost modal={modal} close={close}/>
    </BOCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<BackofficeApp/>);
