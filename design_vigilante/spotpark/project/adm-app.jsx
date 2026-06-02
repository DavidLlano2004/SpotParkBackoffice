/* adm-app.jsx — router + mount */
const { useState:aS, useEffect:aE, useCallback:aCb } = React;

function AdmModalHost({ modal, close }) {
  if (!modal) return null;
  if (modal.type==='confirm') return (
    <Modal open onClose={close}>
      <ModalHead title={modal.title} icon={modal.danger?'warning':'info'} iconColor={modal.danger?'var(--red)':'var(--ink)'} onClose={close}/>
      <div style={{ padding:'14px 22px 22px' }}>
        <p className="t-body" style={{ color:'var(--t2)', margin:'0 0 18px' }}>{modal.desc}</p>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={close}>Cancelar</button>
          <button className={'btn '+(modal.danger?'btn-danger':'btn-primary')} style={{ flex:1 }} onClick={()=>{ modal.onConfirm&&modal.onConfirm(); close(); }}>{modal.confirm||'Confirmar'}</button>
        </div>
      </div>
    </Modal>
  );
  if (modal.type==='denied') return (
    <Modal open onClose={close}>
      <ModalHead title="Acceso restringido" icon="lock" iconColor="var(--t2)" onClose={close}/>
      <div style={{ padding:'14px 22px 22px' }}>
        <p className="t-body" style={{ color:'var(--t2)', margin:'0 0 18px' }}>La sección <b>Empresas</b> es exclusiva para Super Admin. Cambia de rol para acceder.</p>
        <button className="btn btn-primary btn-block" onClick={close}>Entendido</button>
      </div>
    </Modal>
  );
  if (modal.type==='score') return (
    <Modal open onClose={close} wide>
      <ModalHead title="SpotPark Score" icon="target" iconColor="var(--lime-deep)" onClose={close}/>
      <ScoreBreakdown p={modal.parking}/>
    </Modal>
  );
  return null;
}

function AdminApp() {
  const [route,setRoute]=aS('login');
  const [ctx,setCtx]=aS(null);
  const [role,setRole]=aS(ADM.admin.role);
  const [modal,setModal]=aS(null);

  const go = aCb((r,c=null)=>{ setRoute(r); setCtx(c); setModal(null);
    const el=document.querySelector('.adm-main'); if(el) el.scrollTop=0; },[]);
  const openModal=aCb(m=>setModal(m),[]);
  const close=aCb(()=>setModal(null),[]);

  aE(()=>{ document.getElementById('boot')?.remove(); },[]);

  const value={ route, go, ctx, role, setRole, openModal, close };
  const Page = window.ADM_PAGES[route];

  return (
    <ADMCtx.Provider value={value}>
      {route==='login'
        ? <Page/>
        : (
          <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
            <AdmSidebar/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
              <AdmTopBar/>
              <div className="adm-main" key={route} style={{ flex:1, overflow:'hidden', padding:'22px 24px' }}>
                {Page ? <Page/> : <div style={{ padding:40, color:'var(--t3)' }}>Página en construcción.</div>}
              </div>
            </div>
          </div>
        )}
      <AdmModalHost modal={modal} close={close}/>
    </ADMCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<AdminApp/>);
