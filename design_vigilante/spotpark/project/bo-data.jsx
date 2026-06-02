/* bo-data.jsx — SpotPark Backoffice mock data. window.BO */
(function () {
  const COP = n => '$' + n.toLocaleString('es-CO');
  const PLATES = ['ABC123','KLM880','XYZ774','FGH210','JKL905','PQR318','MNO442','TRS667','BNX771','GHT559','WQE128','ZXC123','LMN733','RTY904','VBN615','HJK280'];
  const rand = (a,b)=>a+Math.floor(Math.random()*(b-a+1));

  let pi = 0;
  const plate = () => PLATES[(pi++) % PLATES.length];

  // build a zone of cells
  function zone(id, type, cols, rows, freeRatio, resvRatio) {
    const cells = [];
    for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
      const n = r*cols + c + 1;
      const label = id + n;
      const x = Math.random();
      let status = 'free', p=null, since=null, resv=null;
      if (x > 1-resvRatio) { status='reserved'; resv = { code:'SPK-25-'+id+'-'+String(n).padStart(2,'0'), user:'Laura M.', time:'2:30 PM', eta: rand(5,25) }; p=plate(); }
      else if (x > (1-resvRatio)-(1-freeRatio-resvRatio)) { status='occupied'; p=plate(); since = rand(8, 230); }
      cells.push({ id:label, zone:id, label, type, status, plate:p, since, resv });
    }
    // a couple disabled
    if (cells.length>6) cells[cells.length-2].status='disabled';
    return cells;
  }

  const zones = [
    { id:'A', name:'Zona A', type:'car',  cells: zone('A','car', 8, 3, 0.42, 0.10) },
    { id:'B', name:'Zona B', type:'car',  cells: zone('B','car', 8, 3, 0.50, 0.06) },
    { id:'M', name:'Zona M', type:'moto', cells: zone('M','moto',10, 3, 0.55, 0.04) },
    { id:'V', name:'Zona V', type:'bike', cells: zone('V','bike',10, 2, 0.70, 0.0) },
  ];
  const allCells = zones.flatMap(z=>z.cells);

  function statFor(type) {
    const cs = allCells.filter(c=>c.type===type);
    const cap = cs.length;
    const free = cs.filter(c=>c.status==='free').length;
    const occ = cs.filter(c=>c.status==='occupied').length;
    const resv = cs.filter(c=>c.status==='reserved').length;
    return { cap, free, occ, resv, used: occ+resv };
  }

  const stats = { car:statFor('car'), moto:statFor('moto'), bike:statFor('bike') };
  stats.total = {
    cap: stats.car.cap+stats.moto.cap+stats.bike.cap,
    free: stats.car.free+stats.moto.free+stats.bike.free,
    used: stats.car.used+stats.moto.used+stats.bike.used,
  };

  // records log
  const TYPE_LABEL = { car:'Carro', moto:'Moto', bike:'Bici' };
  const records = [];
  const now = 14*60; // minutes since midnight reference (2:00 PM)
  for (let i=0; i<24; i++) {
    const type = ['car','car','car','moto','moto','bike'][rand(0,5)];
    const inMin = rand(6*60, now);
    const active = Math.random() < 0.22;
    const dur = active ? now-inMin : rand(20, 180);
    const outMin = active ? null : inMin+dur;
    const rate = type==='car'?3000:type==='moto'?1500:800;
    const fmt = m => { let h=Math.floor(m/60), mm=m%60; const ap=h>=12?'PM':'AM'; let hh=h%12; if(hh===0)hh=12; return `${hh}:${String(mm).padStart(2,'0')} ${ap}`; };
    const zoneId = type==='car'?(Math.random()<.5?'A':'B'):type==='moto'?'M':'V';
    records.push({
      id:'r'+i, plate:plate(), type, zone:zoneId, space: zoneId+rand(1,20),
      inMin, outMin, inT:fmt(inMin), outT: outMin?fmt(outMin):null,
      durMin: dur, active, amount: active?null:Math.max(rate, Math.ceil(dur/60)*rate),
      pay: Math.random()<.5?'app':'cash',
    });
  }
  records.sort((a,b)=>b.inMin-a.inMin);

  const guard = {
    name:'Carlos Torres', role:'Vigilante', initials:'CT', email:'carlos@spotpark.co',
    id:'1107974183', phone:'312 248 0775', addr:'Carrera 8 #21-40',
    shift:'6:00 AM – 2:00 PM', parking:'Parqueadero Universidad de Caldas',
    entradasHoy: records.filter(r=>true).length, salidasHoy: records.filter(r=>!r.active).length,
  };

  const ai = {
    dashboard: '📈 Ocupación subiendo en Zona A. Quedan pocos cupos de carro; alta demanda proyectada en ~20 min.',
    mapa: '📱 2 reservas desde la app llegan en los próximos 30 min. Espacios: A4, B2.',
    anomaly: { plate:'BNX-771', space:'B5', mins:'4h 32min' },
  };

  function durLabel(m) { const h=Math.floor(m/60), mm=m%60; return h?`${h}h ${mm}min`:`${mm}min`; }

  // ── F10: weekly heatmap (7 days × 24 hours, % occupancy) ──
  const DAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const heatmap = DAYS.map((d,di)=>({
    day:d,
    hours:[...Array(24)].map((_,h)=>{
      const weekday = di<5;
      const rush = (h>=7&&h<=10)||(h>=16&&h<=19);
      let base = rush && weekday ? 78 : (h>=11&&h<=15&&weekday)?55 : (h<6||h>21)?12 : 38;
      if (!weekday) base = (h>=10&&h<=18)? 45 : 15;
      return Math.min(99, Math.max(4, base + ((h*7+di*13)%18) - 8));
    }),
  }));

  // ── F11: suspicious vehicle alerts ──
  const alerts = [
    { id:'al1', type:'long', plate:'BNX771', space:'B5', mins:272, desc:'Sin salida registrada. Lleva 4h 32min en el parqueadero.' },
    { id:'al2', type:'orphan', plate:'WQE128', space:'A7', mins:380, desc:'Entrada sin escaneo de QR ni salida tras 6h.' },
    { id:'al3', type:'late', plate:'GHT559', space:'M4', mins:34, desc:'Reserva sin check-in 34 min después de iniciar la ventana.' },
  ];

  // ── F9: shift handover ──
  const shift = {
    prevGuard:'Andrea Ríos', prevRange:'10 PM – 6 AM',
    pending: [
      { plate:'BNX771', type:'car', space:'B5', inT:'1:30 AM', mins:272 },
      { plate:'WQE128', type:'car', space:'A7', inT:'11:50 PM', mins:380 },
    ],
    arriving: [
      { time:'8:30 AM', space:'A4', type:'car', plate:'ZXC123', user:'Julián M.' },
      { time:'9:00 AM', space:'B2', type:'car', plate:'KLM880', user:'Laura M.' },
      { time:'10:15 AM', space:'M2', type:'moto', plate:'PQR318', user:'Diego R.' },
    ],
    note:'Revisar la barrera de la Zona B, a veces tarda en subir. — Andrea',
    summary:'Turno completado sin anomalías mayores. 23 entradas y 19 salidas registradas. 4 vehículos permanecen en el parqueadero. Hora pico: 8–9 AM con 8 entradas. Ingresos estimados: $87.000 COP. Incidentes: 0. Reservas app: 6 de 8 utilizadas.',
    curve: [2,5,8,6,4,3,5,7,4,2,1,2,3,5,8,9,6,4,2,1],
  };

  // loyalty tier / corporate flags by plate (F13 / F15)
  const loyaltyByPlate = { 'ZXC123':'Gold', 'KLM880':'Silver', 'BNX771':'Platinum' };
  const corporateByPlate = { 'WQE128':'Bancolombia', 'GHT559':'Bancolombia' };
  const TIER_COLOR = { Silver:'#8A9099', Gold:'#C9A227', Platinum:'#0F1115' };

  // ── F12: chat interno entre turnos ──
  const chat = {
    channels: [
      { id:'general', icon:'chat', name:'General', sub:'Todos los vigilantes', members:6, unread:0 },
      { id:'admin', icon:'shield', name:'Administración', sub:'Gerencia + vigilantes', members:3, unread:2 },
      { id:'entrega', icon:'refresh', name:'Entrega de turno', sub:'Notas de relevo', members:6, unread:0 },
    ],
    dms: [
      { id:'andrea', name:'Andrea Ríos', init:'AR', online:true,  last:'Listo, te dejé nota en relevo.' },
      { id:'diego',  name:'Diego Parra', init:'DP', online:false, last:'¿Cubres el sábado?' },
      { id:'sofia',  name:'Sofía Mora',  init:'SM', online:true,  last:'Gracias 🙌' },
    ],
    messages: {
      general: [
        { who:'Andrea Ríos', init:'AR', text:'Buenos días equipo. Barrera de Zona B sigue lenta, ya reporté a mantenimiento.', time:'7:42 AM', day:'Hoy' },
        { who:'Diego Parra', init:'DP', text:'Ok, gracias. Ayer también me pasó.', time:'7:45 AM', day:'Hoy' },
        { who:'Carlos Torres', init:'CT', mine:true, text:'Entrando a turno. Reviso la Zona B y aviso.', time:'7:58 AM', day:'Hoy' },
      ],
      admin: [
        { who:'Gerencia', init:'GE', text:'Recordatorio: tarifas valle activas los domingos desde este fin de semana.', time:'Ayer 4:10 PM', day:'Ayer' },
        { who:'Gerencia', init:'GE', text:'Por favor confirmar inventario de conos antes del viernes.', time:'8:05 AM', day:'Hoy' },
      ],
      entrega: [
        { who:'Andrea Ríos', init:'AR', pinned:true, text:'📌 Revisar la barrera de la Zona B, a veces tarda en subir. Vehículos BNX-771 (B5) y WQE-128 (A7) siguen sin salida.', time:'5:58 AM', day:'Hoy' },
        { who:'Carlos Torres', init:'CT', mine:true, text:'Recibido. Verifico esos dos vehículos en sitio.', time:'6:02 AM', day:'Hoy' },
      ],
    },
  };

  // ── F14: incidentes ──
  const incidentList = [
    { id:'INC-2025-001', type:'damage', plate:'LMN733', res:'SPK-25-B-02', status:'review', when:'Hoy 11:20 AM', photos:2,
      desc:'El usuario reporta un rayón en la puerta del conductor que no estaba al ingresar. Solicita revisión de cámaras.',
      tl:[ {c:'var(--blue)', l:'Reporte creado', t:'Hoy 11:20 AM · por la app'}, {c:'var(--orange)', l:'En revisión', t:'Hoy 11:35 AM · Carlos Torres'} ] },
    { id:'INC-2025-002', type:'billing', plate:'ZXC123', res:'SPK-25-A-07', status:'open', when:'Hoy 9:05 AM', photos:0,
      desc:'Cobro de 4h cuando la estadía fue de 2h 30min. Revisar registro de entrada/salida.',
      tl:[ {c:'var(--blue)', l:'Reporte creado', t:'Hoy 9:05 AM · por la app'} ] },
    { id:'INC-2025-003', type:'space', plate:'KLM880', res:'SPK-25-M-04', status:'resolved', when:'Ayer 6:40 PM', photos:1,
      desc:'Demarcación del espacio M4 borrosa, vehículos se parquean encima de la línea.',
      tl:[ {c:'var(--blue)', l:'Reporte creado', t:'Ayer 6:40 PM'}, {c:'var(--orange)', l:'En revisión', t:'Ayer 7:00 PM'}, {c:'var(--green)', l:'Resuelto · repintado', t:'Hoy 8:15 AM'} ] },
    { id:'INC-2025-004', type:'service', plate:'PQR318', res:'SPK-25-M-19', status:'open', when:'Ayer 2:10 PM', photos:0,
      desc:'Usuario indica demora de 10 min en la apertura de la barrera de salida.',
      tl:[ {c:'var(--blue)', l:'Reporte creado', t:'Ayer 2:10 PM'} ] },
  ];

  window.BO = { COP, zones, allCells, stats, records, guard, ai, TYPE_LABEL, durLabel,
    fmtPlate:p=>p? p.slice(0,3)+'-'+p.slice(3):'',
    heatmap, alerts, shift, loyaltyByPlate, corporateByPlate, TIER_COLOR, DAYS, chat, incidents:incidentList };
})();
