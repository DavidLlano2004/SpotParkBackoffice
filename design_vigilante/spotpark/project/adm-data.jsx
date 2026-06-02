/* adm-data.jsx — SpotPark Admin mock data. window.ADM */
(function () {
  const COP = n => '$' + Math.round(n).toLocaleString('es-CO');
  const COPk = n => n>=1e6 ? '$'+(n/1e6).toFixed(1).replace('.0','')+'M' : n>=1000 ? '$'+Math.round(n/1000)+'K' : '$'+n;

  /* ── PARQUEADEROS ── */
  const parkings = [
    { id:'p1', name:'Universidad de Caldas', short:'U. de Caldas', city:'Manizales', addr:'Calle 65 #26-10', status:'active',
      cap:50, free:14, schedule:'Lun–Dom · 5:00 AM – 11:00 PM', score:84, rev:8900000, reservas:312, incidents:1,
      coords:'5.0573° N, 75.4920° W', dynamic:true, trend:[42,48,51,55,53,60,58],
      services:['vigilancia','cctv','techado','factura','accesible'],
      split:{ car:30, moto:15, bike:5 }, workers:['Carlos Torres','Andrea Ríos','Diego Parra'] },
    { id:'p2', name:'Centro Comercial Fundadores', short:'C.C. Fundadores', city:'Manizales', addr:'Carrera 23 #33-45', status:'active',
      cap:80, free:9, schedule:'24 horas', score:91, rev:14200000, reservas:540, incidents:0,
      coords:'5.0689° N, 75.5174° W', dynamic:true, trend:[70,72,68,74,78,80,79],
      services:['vigilancia','cctv','techado','carga','lavado','factura','wifi'],
      split:{ car:52, moto:20, bike:8 }, workers:['Sofía Mora','Julián Gómez','Mónica Vega','Andrés Ruiz'] },
    { id:'p3', name:'Hospital Santa Sofía', short:'Hosp. Santa Sofía', city:'Manizales', addr:'Calle 16 #18-22', status:'active',
      cap:40, free:3, schedule:'24 horas', score:76, rev:6100000, reservas:198, incidents:2,
      coords:'5.0640° N, 75.5090° W', dynamic:false, trend:[55,58,60,62,65,63,66],
      services:['vigilancia','cctv','accesible','factura'],
      split:{ car:28, moto:10, bike:2 }, workers:['Laura Mejía','Pedro Sáenz'] },
    { id:'p4', name:'Terminal de Transportes', short:'Terminal', city:'Manizales', addr:'Calle 19 #15-05', status:'active',
      cap:100, free:31, schedule:'24 horas', score:68, rev:9800000, reservas:421, incidents:0,
      coords:'5.0560° N, 75.4990° W', dynamic:false, trend:[40,44,42,48,46,50,49],
      services:['vigilancia','cctv','factura','baño'],
      split:{ car:60, moto:30, bike:10 }, workers:['Ricardo Loaiza','Marcela Ríos'] },
    { id:'p5', name:'Cable Plaza', short:'Cable Plaza', city:'Manizales', addr:'Carrera 23 #65-11', status:'active',
      cap:50, free:7, schedule:'Lun–Dom · 8:00 AM – 10:00 PM', score:88, rev:11000000, reservas:380, incidents:0,
      coords:'5.0670° N, 75.5120° W', dynamic:true, trend:[60,64,66,70,72,75,74],
      services:['vigilancia','cctv','techado','carga','valet','wifi','factura'],
      split:{ car:34, moto:12, bike:4 }, workers:['Tatiana Cruz','Felipe Arango'] },
    { id:'p6', name:'Parqueadero La Estación', short:'La Estación', city:'Pereira', addr:'Calle 17 #8-30', status:'maintenance',
      cap:30, free:30, schedule:'Lun–Sáb · 6:00 AM – 9:00 PM', score:54, rev:0, reservas:0, incidents:0,
      coords:'4.8133° N, 75.6961° W', dynamic:false, trend:[20,18,12,8,6,4,0],
      services:['vigilancia'],
      split:{ car:20, moto:8, bike:2 }, workers:[] },
  ];
  parkings.forEach(p=>{ p.used = p.cap - p.free; p.occ = p.cap? p.used/p.cap : 0; });

  /* ── TRABAJADORES ── */
  const ROLE_TONE = { Vigilante:'blue', Supervisor:'info', 'Administrador':'orange' };
  const workers = [
    { id:'w1', name:'Carlos Torres', init:'CT', role:'Vigilante', cc:'1107974183', phone:'312 248 0775', email:'carlos@spotpark.co', parkings:['p1'], status:'shift', last:'Hoy 6:00 AM – 2:00 PM', shifts:21, entries:840, incidents:1 },
    { id:'w2', name:'Andrea Ríos', init:'AR', role:'Vigilante', cc:'1053812440', phone:'310 555 1180', email:'andrea@spotpark.co', parkings:['p1'], status:'active', last:'Hoy 10 PM – 6 AM', shifts:20, entries:790, incidents:0 },
    { id:'w3', name:'Diego Parra', init:'DP', role:'Supervisor', cc:'75092113', phone:'315 882 9011', email:'diego@spotpark.co', parkings:['p1','p5'], status:'active', last:'Ayer 2 PM – 10 PM', shifts:22, entries:1120, incidents:0 },
    { id:'w4', name:'Sofía Mora', init:'SM', role:'Vigilante', cc:'1098220765', phone:'301 447 2230', email:'sofia@spotpark.co', parkings:['p2'], status:'shift', last:'Hoy 6 AM – 2 PM', shifts:19, entries:910, incidents:0 },
    { id:'w5', name:'Julián Gómez', init:'JG', role:'Vigilante', cc:'1110028394', phone:'313 909 1145', email:'julian@spotpark.co', parkings:['p2'], status:'active', last:'Hoy 2 PM – 10 PM', shifts:18, entries:680, incidents:0 },
    { id:'w6', name:'Mónica Vega', init:'MV', role:'Supervisor', cc:'30334812', phone:'318 220 7781', email:'monica@spotpark.co', parkings:['p2','p4'], status:'active', last:'Hoy 10 PM – 6 AM', shifts:23, entries:1340, incidents:0 },
    { id:'w7', name:'Andrés Ruiz', init:'AR', role:'Vigilante', cc:'1004552178', phone:'320 118 4490', email:'andres@spotpark.co', parkings:['p2'], status:'inactive', last:'Hace 5 días', shifts:8, entries:210, incidents:0 },
    { id:'w8', name:'Laura Mejía', init:'LM', role:'Vigilante', cc:'1144098321', phone:'304 661 9920', email:'laura@spotpark.co', parkings:['p3'], status:'active', last:'Hoy 6 AM – 2 PM', shifts:20, entries:560, incidents:2 },
    { id:'w9', name:'Pedro Sáenz', init:'PS', role:'Vigilante', cc:'94556210', phone:'316 003 7712', email:'pedro@spotpark.co', parkings:['p3'], status:'suspended', last:'Hace 12 días', shifts:5, entries:90, incidents:3 },
    { id:'w10', name:'Ricardo Loaiza', init:'RL', role:'Vigilante', cc:'1085440930', phone:'311 552 8841', email:'ricardo@spotpark.co', parkings:['p4'], status:'active', last:'Hoy 6 AM – 2 PM', shifts:21, entries:1010, incidents:0 },
    { id:'w11', name:'Marcela Ríos', init:'MR', role:'Vigilante', cc:'1067233188', phone:'305 778 1190', email:'marcela@spotpark.co', parkings:['p4'], status:'active', last:'Ayer 10 PM – 6 AM', shifts:19, entries:880, incidents:0 },
    { id:'w12', name:'Tatiana Cruz', init:'TC', role:'Supervisor', cc:'42115670', phone:'319 446 0021', email:'tatiana@spotpark.co', parkings:['p5'], status:'shift', last:'Hoy 8 AM – 4 PM', shifts:22, entries:1190, incidents:0 },
    { id:'w13', name:'Felipe Arango', init:'FA', role:'Vigilante', cc:'1090334221', phone:'317 220 5567', email:'felipe@spotpark.co', parkings:['p5'], status:'active', last:'Hoy 4 PM – 10 PM', shifts:18, entries:640, incidents:0 },
    { id:'w14', name:'Natalia Soto', init:'NS', role:'Administrador', cc:'52889310', phone:'312 990 4456', email:'natalia@spotpark.co', parkings:['p1','p2','p3','p4','p5'], status:'active', last:'Hoy 9:10 AM', shifts:0, entries:0, incidents:0 },
    { id:'w15', name:'Óscar Bernal', init:'OB', role:'Vigilante', cc:'1003221904', phone:'313 008 7720', email:'oscar@spotpark.co', parkings:['p4'], status:'inactive', last:'Hace 8 días', shifts:6, entries:180, incidents:0 },
  ];

  /* ── USUARIOS DE LA APP ── */
  const TIER = { Bronze:'#A06A3C', Silver:'#8A9099', Gold:'#C9A227', Platinum:'#0F1115' };
  const appUsers = [
    { id:'u1', name:'Julián Martínez', init:'JM', email:'julianm@gmail.com', tier:'Gold', reservas:48, last:'Hoy 8:14 AM', spent:1240000, status:'active', plates:['ZXC123'] },
    { id:'u2', name:'Laura Mendoza', init:'LM', email:'laura.m@outlook.com', tier:'Platinum', reservas:96, last:'Hoy 7:50 AM', spent:3180000, status:'active', plates:['KLM880','ABC123'] },
    { id:'u3', name:'Diego Ramírez', init:'DR', email:'dramirez@gmail.com', tier:'Silver', reservas:22, last:'Ayer 6:30 PM', spent:540000, status:'active', plates:['PQR318'] },
    { id:'u4', name:'Camila Ospina', init:'CO', email:'camila.o@gmail.com', tier:'Gold', reservas:51, last:'Hoy 9:02 AM', spent:1390000, status:'active', plates:['FGH210'] },
    { id:'u5', name:'Andrés Felipe Cárdenas', init:'AC', email:'afcardenas@hotmail.com', tier:'Bronze', reservas:7, last:'Hace 3 días', spent:120000, status:'active', plates:['JKL905'] },
    { id:'u6', name:'Valentina Ríos', init:'VR', email:'vale.rios@gmail.com', tier:'Silver', reservas:18, last:'Hoy 10:11 AM', spent:470000, status:'active', plates:['MNO442'] },
    { id:'u7', name:'Santiago López', init:'SL', email:'slopez@gmail.com', tier:'Bronze', reservas:3, last:'Hace 9 días', spent:38000, status:'suspended', plates:['TRS667'] },
    { id:'u8', name:'Daniela Quintero', init:'DQ', email:'dquintero@gmail.com', tier:'Gold', reservas:44, last:'Ayer 4:20 PM', spent:1080000, status:'active', plates:['BNX771'] },
    { id:'u9', name:'Mateo Giraldo', init:'MG', email:'mateog@gmail.com', tier:'Platinum', reservas:88, last:'Hoy 6:40 AM', spent:2760000, status:'active', plates:['GHT559','WQE128'] },
    { id:'u10', name:'Isabela Cano', init:'IC', email:'isa.cano@gmail.com', tier:'Bronze', reservas:0, last:'Hace 21 días', spent:0, status:'inactive', plates:[] },
  ];

  /* ── EMPRESAS (Super Admin) ── */
  const companies = [
    { id:'c1', name:'SpotPark Operaciones', nit:'900.112.334-1', contact:'Natalia Soto', parkings:5, employees:13, billing:4200000, status:'active' },
    { id:'c2', name:'Inversiones Caldas S.A.S.', nit:'901.556.220-7', contact:'Germán Vélez', parkings:3, employees:8, billing:2800000, status:'active' },
    { id:'c3', name:'Grupo Andino Parking', nit:'900.778.901-4', contact:'Paula Restrepo', parkings:1, employees:2, billing:600000, status:'active' },
    { id:'c4', name:'EstacionaYa Pereira', nit:'901.220.118-9', contact:'Camilo Ángel', parkings:1, employees:2, billing:0, status:'inactive' },
  ];

  /* ── TARIFAS por parqueadero ── */
  const tarifaFor = (p) => ({
    car:  { hour: p.dynamic?3500:3000, day:22000, min:'30 min', grace:'15 min', dynamic:p.dynamic, peak:4500, valley:2500 },
    moto: { hour:1500, day:9000, min:'30 min', grace:'15 min', dynamic:false },
    bike: { hour:800, day:4000, min:'1 hora', grace:'30 min', dynamic:false },
    suv:  { hour:4500, day:28000, min:'30 min', grace:'15 min', dynamic:false },
  });

  /* ── REPORTES / CHARTS ── */
  const months = ['Dic','Ene','Feb','Mar','Abr','May'];
  const revenueSeries = [38, 41, 44, 47, 46, 52].map((v,i)=>({ label:months[i], value:v*100000 + (i*30000) }));
  const revenueDaily = [...Array(30)].map((_,i)=>{
    const weekend = (i%7===5||i%7===6);
    const base = weekend? 1.0 : 1.45;
    return { day:i+1, value: Math.round((base + Math.sin(i/3)*0.18 + (i/60)) * 1000000) };
  });
  const vehicleSplit = [
    { label:'Carros', value:224, color:'var(--lime-deep)' },
    { label:'Motos', value:97, color:'var(--green)' },
    { label:'Bicicletas', value:31, color:'var(--blue)' },
  ];
  const peakHours = [...Array(24)].map((_,h)=>{
    const rush = (h>=7&&h<=9)||(h>=17&&h<=19);
    const mid = (h>=10&&h<=16);
    let v = h<6||h>21 ? 4 : rush ? 38 : mid ? 22 : 14;
    return { hour:h, value: Math.max(2, v + ((h*7)%9) - 4) };
  });

  /* ── ACTIVITY FEED ── */
  const activity = [
    { id:'a1', kind:'entry', text:'Entrada registrada · Carro ABC-123', parking:'U. de Caldas', ago:'hace 1 min' },
    { id:'a2', kind:'reservation', text:'Nueva reserva desde la app', parking:'C.C. Fundadores', ago:'hace 3 min' },
    { id:'a3', kind:'exit', text:'Salida registrada · Moto PQR-318 · $1.500', parking:'Terminal', ago:'hace 6 min' },
    { id:'a4', kind:'incident', text:'Incidente reportado · daño en vehículo', parking:'Hosp. Santa Sofía', ago:'hace 12 min' },
    { id:'a5', kind:'entry', text:'Entrada registrada · Carro KLM-880', parking:'Cable Plaza', ago:'hace 14 min' },
    { id:'a6', kind:'worker', text:'Tatiana Cruz inició turno', parking:'Cable Plaza', ago:'hace 22 min' },
    { id:'a7', kind:'exit', text:'Salida registrada · Carro XYZ-774 · $9.000', parking:'C.C. Fundadores', ago:'hace 25 min' },
    { id:'a8', kind:'reservation', text:'Nueva reserva desde la app', parking:'U. de Caldas', ago:'hace 31 min' },
    { id:'a9', kind:'entry', text:'Entrada registrada · Moto JKL-905', parking:'Terminal', ago:'hace 38 min' },
    { id:'a10', kind:'exit', text:'Salida registrada · Carro FGH-210 · $6.000', parking:'Cable Plaza', ago:'hace 44 min' },
  ];
  const ACT_META = {
    entry:{ ic:'car', c:'var(--blue)', bg:'var(--blue-bg)' },
    exit:{ ic:'logout', c:'var(--green)', bg:'var(--green-bg)' },
    reservation:{ ic:'cal', c:'var(--lime-deep)', bg:'var(--lime-bg)' },
    incident:{ ic:'warning', c:'var(--orange)', bg:'var(--yellow-bg)' },
    worker:{ ic:'user', c:'var(--blue-tx)', bg:'var(--blue-bg)' },
  };

  /* ── INCIDENTES (admin, all parkings) ── */
  const PRIO = { alta:{ l:'Alta', cls:'bg-full' }, media:{ l:'Media', cls:'bg-few' }, baja:{ l:'Baja', cls:'bg-resv' } };
  const incidents = [
    { id:'INC-2025-001', type:'damage', tl:'Daño en vehículo', parking:'U. de Caldas', space:'B2', plate:'LMN733', by:'App · Julián M.', when:'Hoy 11:20 AM', prio:'alta', status:'review', assigned:'Carlos Torres', ai:'AR',
      desc:'El usuario reporta un rayón en la puerta del conductor que no estaba al ingresar. Solicita revisión de cámaras.' },
    { id:'INC-2025-002', type:'billing', tl:'Cobro incorrecto', parking:'U. de Caldas', space:'A7', plate:'ZXC123', by:'App · Laura M.', when:'Hoy 9:05 AM', prio:'media', status:'open', assigned:null, ai:null,
      desc:'Cobro de 4h cuando la estadía fue de 2h 30min. Revisar registro de entrada/salida.' },
    { id:'INC-2025-003', type:'space', tl:'Demarcación', parking:'C.C. Fundadores', space:'M4', plate:'KLM880', by:'Vigilante', when:'Ayer 6:40 PM', prio:'baja', status:'resolved', assigned:'Sofía Mora', ai:'SM',
      desc:'Demarcación del espacio M4 borrosa, vehículos se parquean encima de la línea.' },
    { id:'INC-2025-004', type:'service', tl:'Demora barrera', parking:'Terminal', space:'M19', plate:'PQR318', by:'App · Diego R.', when:'Ayer 2:10 PM', prio:'media', status:'open', assigned:null, ai:null,
      desc:'Usuario indica demora de 10 min en la apertura de la barrera de salida.' },
    { id:'INC-2025-005', type:'damage', tl:'Daño en vehículo', parking:'Hosp. Santa Sofía', space:'A3', plate:'GHT559', by:'App · Mateo G.', when:'Hace 2 días', prio:'alta', status:'review', assigned:'Laura Mejía', ai:'LM',
      desc:'Espejo retrovisor doblado. Usuario solicita compensación.' },
    { id:'INC-2025-006', type:'billing', tl:'Reembolso', parking:'Cable Plaza', space:'A11', plate:'FGH210', by:'App · Camila O.', when:'Hace 3 días', prio:'baja', status:'resolved', assigned:'Tatiana Cruz', ai:'TC',
      desc:'Doble cobro por error de la pasarela de pago. Se aplicó reembolso.' },
  ];

  window.ADM = {
    COP, COPk, parkings, workers, appUsers, companies, incidents,
    tarifaFor, revenueSeries, revenueDaily, vehicleSplit, peakHours, activity,
    ACT_META, PRIO, TIER, ROLE_TONE, months,
    admin: { name:'Natalia Soto', init:'NS', email:'natalia@spotpark.co', phone:'312 990 4456', role:'super' }, // super | parking
    totals: {
      rev: parkings.reduce((s,p)=>s+p.rev,0),
      reservas: parkings.reduce((s,p)=>s+p.reservas,0),
      cap: parkings.reduce((s,p)=>s+p.cap,0),
      occ: parkings.filter(p=>p.status==='active').reduce((s,p)=>s+p.occ,0)/parkings.filter(p=>p.status==='active').length,
      active: parkings.filter(p=>p.status==='active').length,
      workersActive: workers.filter(w=>w.status!=='inactive'&&w.status!=='suspended').length,
      onShift: workers.filter(w=>w.status==='shift').length,
      openIncidents: incidents.filter(i=>i.status!=='resolved').length,
    },
  };
})();
