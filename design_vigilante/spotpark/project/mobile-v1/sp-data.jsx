/* sp-data.jsx — SpotPark mock data (Bogotá, COP). window.SP */
const COP = n => '$' + n.toLocaleString('es-CO');

const SP = {
  user: { name:'Julián', initials:'JM', email:'julian.m@gmail.com', since:'2024', reservas:18, guardados:6 },
  greeting: 'Buenos días, Julián',

  // availability: cars/motos out of capacity
  spots: [
    { id:'s1', name:'Parqueadero Chapinero 63', zone:'Chapinero', addr:'Cra 13 #63-21', dist:'180 m', walk:'2 min',
      price:3000, rating:4.8, reviews:212, x:42, y:34, cars:[12,40], motos:[8,20], status:'available',
      img:'#2C3340', services:['Vigilancia 24h','Techado','CCTV','Carga EV'], moto:true, suv:true,
      reliability:'verified', host:'Inmob. Centro' },
    { id:'s2', name:'Zona T Premium', zone:'Zona Rosa', addr:'Cra 12A #83-40', dist:'420 m', walk:'5 min',
      price:4500, rating:4.9, reviews:88, x:64, y:24, cars:[3,30], motos:[1,12], status:'few',
      img:'#33304A', services:['Vigilancia 24h','CCTV','Lavado','Factura'], moto:false, suv:true,
      reliability:'verified', host:'Parking VIP' },
    { id:'s3', name:'Universidad Javeriana', zone:'Chapinero', addr:'Cra 7 #40-62', dist:'650 m', walk:'8 min',
      price:2200, rating:4.5, reviews:340, x:30, y:58, cars:[0,50], motos:[4,30], status:'full',
      img:'#2A3A33', services:['Techado','CCTV','Económico'], moto:true, suv:false,
      reliability:'verified', host:'PUJ Campus' },
    { id:'s4', name:'CC Andino Subterráneo', zone:'Zona Rosa', addr:'Cra 11 #82-71', dist:'520 m', walk:'6 min',
      price:5000, rating:5.0, reviews:54, x:74, y:52, cars:[22,80], motos:[0,0], status:'available',
      img:'#3A3340', services:['Vigilancia 24h','Techado','CCTV','Accesible','Carga EV','SUV ok'], moto:false, suv:true,
      reliability:'uncertain', host:'CC Andino' },
    { id:'s5', name:'Parkadero Quinta Camacho', zone:'Chapinero', addr:'Cl 70 #11-30', dist:'820 m', walk:'10 min',
      price:2800, rating:4.6, reviews:160, x:50, y:72, cars:[9,35], motos:[6,15], status:'available',
      img:'#2C3340', services:['Techado','CCTV','Factura'], moto:true, suv:true,
      reliability:'verified', host:'Quinta P.' },
  ],

  reviews: [
    { who:'Marc T.', when:'Hace 2 días', stars:5, txt:'Entrada súper fácil con el QR. Espacios amplios y bien iluminados.', aspects:['Limpio','Seguro','Fácil acceso'] },
    { who:'Aisha K.', when:'Hace 1 semana', stars:5, txt:'Perfecto para cargar el carro. Personal muy amable.', aspects:['Personal amable','Precio justo'] },
    { who:'Pep R.', when:'Hace 2 semanas', stars:4, txt:'Buena ubicación, un poco justo para camionetas grandes.', aspects:['Seguro','Señalización'] },
  ],

  vehicles: [
    { id:'v1', type:'car', name:'Renault Sandero', plate:'ZXC 123', year:'2022', color:'#2563EB', rate:3000, fav:true },
    { id:'v2', type:'moto', name:'Yamaha FZ', plate:'KLM 88F', year:'2021', color:'#22C55E', rate:1500, fav:false },
  ],

  vehicleTypes: [
    { type:'car',  label:'Carro',    emoji:'🚗', rate:3000 },
    { type:'moto', label:'Moto',     emoji:'🏍️', rate:1500 },
    { type:'bike', label:'Bicicleta',emoji:'🚲', rate:800 },
    { type:'suv',  label:'SUV',      emoji:'🚙', rate:4000 },
  ],

  trips: [
    { id:'t1', spot:'s1', date:'Hoy', time:'14:00 – 18:00', status:'active', plate:'ZXC 123', space:'A2', total:13800 },
    { id:'t2', spot:'s4', date:'Mañana', time:'09:00 – 11:00', status:'upcoming', plate:'ZXC 123', space:'B7', total:11500 },
    { id:'t3', spot:'s3', date:'18 May', time:'20:00 – 23:00', status:'past', plate:'KLM 88F', space:'M4', total:5060, rated:false },
    { id:'t4', spot:'s2', date:'9 May', time:'12:00 – 14:00', status:'past', plate:'ZXC 123', space:'A1', total:10350, rated:true },
  ],

  ai: {
    home: { title:'SpotPark AI', body:'📈 Alta demanda proyectada para Chapinero hoy 5–7pm. Reserva en los próximos 20 min para asegurar cupo.' },
    parkingInsight: 'Lo recomendamos por tu historial: sueles parquear en Chapinero entre semana y este tiene 94% disponibilidad a esta hora los martes.',
    smartTime: 'Históricamente llegas a esta zona a las 8:30am. ¿Reservar desde las 8:15am?',
    reviewAssist: '¿Destacar que llegaste sin demoras y la entrada fue rápida?',
  },

  notifs: [
    { type:'ai', t:'Predicción de demanda', d:'Tu zona tendrá alta demanda hoy 5–7pm. Reserva antes de las 4pm.', when:'13:30', unread:true },
    { type:'payment', t:'Pago confirmado', d:'Parqueadero Chapinero 63 · $13.800 cobrados.', when:'13:28', unread:true },
    { type:'reservation', t:'Reserva confirmada', d:'CC Andino Subterráneo · mañana 09:00. Espacio B7.', when:'Ayer 18:44', unread:false },
    { type:'urgent', t:'Tu reserva vence pronto', d:'Quedan 30 min en Chapinero 63. ¿Extender tiempo?', when:'Ayer 17:10', unread:false },
    { type:'system', t:'Nueva versión disponible', d:'Mejoras en el mapa y predicciones más precisas.', when:'24 May', unread:false },
  ],

  COP,
};
SP.byId = id => SP.spots.find(s => s.id === id);
window.SP = SP;
