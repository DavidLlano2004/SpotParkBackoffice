/* adm-charts.jsx — lightweight SVG charts in the SpotPark palette. */
const { useState:cS, useEffect:cE, useRef:cR } = React;

/* ── Area / line chart ── */
function AreaChart({ data, h=200, color='var(--lime-deep)', fill='rgba(94,127,18,.12)', fmt=v=>v, showDots=true }) {
  const [w,setW]=cS(640); const ref=cR(null);
  cE(()=>{ const el=ref.current; if(!el) return; const ro=new ResizeObserver(()=>setW(el.clientWidth)); ro.observe(el); setW(el.clientWidth); return ()=>ro.disconnect(); },[]);
  const pad={ l:54, r:12, t:14, b:26 };
  const vals=data.map(d=>d.value); const max=Math.max(...vals)*1.12, min=Math.min(...vals)*0.85;
  const X=i=> pad.l + i*(w-pad.l-pad.r)/Math.max(1,data.length-1);
  const Y=v=> pad.t + (1-(v-min)/(max-min))*(h-pad.t-pad.b);
  const line=data.map((d,i)=>`${i?'L':'M'}${X(i)},${Y(d.value)}`).join(' ');
  const area=`${line} L${X(data.length-1)},${h-pad.b} L${X(0)},${h-pad.b} Z`;
  const ticks=4;
  return (
    <div ref={ref} style={{ width:'100%' }}>
      <svg width={w} height={h} style={{ display:'block' }}>
        {[...Array(ticks+1)].map((_,i)=>{ const v=min+(max-min)*i/ticks; const y=Y(v);
          return <g key={i}><line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke="var(--separator)" strokeDasharray="3 4"/>
            <text x={pad.l-10} y={y+4} textAnchor="end" fontSize="10.5" fill="var(--t3)" fontFamily="var(--mono)">{fmt(v)}</text></g>; })}
        <path d={area} fill={fill}/>
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray:1200, strokeDashoffset:1200, animation:'dash 1.1s ease forwards' }}/>
        {showDots && data.map((d,i)=><circle key={i} cx={X(i)} cy={Y(d.value)} r="3.2" fill="var(--surface)" stroke={color} strokeWidth="2"/>)}
        {data.map((d,i)=><text key={i} x={X(i)} y={h-8} textAnchor="middle" fontSize="10.5" fill="var(--t3)">{d.label}</text>)}
      </svg>
    </div>
  );
}

/* ── Donut ── */
function Donut({ data, size=150, thick=22, center }) {
  const total=data.reduce((s,d)=>s+d.value,0);
  const r=(size-thick)/2, c=2*Math.PI*r; let off=0;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--elevated)" strokeWidth={thick} fill="none"/>
        {data.map((d,i)=>{ const frac=d.value/total; const dash=c*frac; const seg=<circle key={i} cx={size/2} cy={size/2} r={r} stroke={d.color} strokeWidth={thick} fill="none" strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset={-off} style={{ transition:'stroke-dasharray .9s' }}/>; off+=dash; return seg; })}
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>{center}</div>
    </div>
  );
}

/* ── Vertical bar chart (peak hours etc) ── */
function BarChart({ data, h=180, colorFn, fmt }) {
  const [w,setW]=cS(640); const ref=cR(null);
  cE(()=>{ const el=ref.current; if(!el) return; const ro=new ResizeObserver(()=>setW(el.clientWidth)); ro.observe(el); setW(el.clientWidth); return ()=>ro.disconnect(); },[]);
  const pad={ l:8, r:8, t:10, b:22 };
  const max=Math.max(...data.map(d=>d.value))*1.1;
  const bw=(w-pad.l-pad.r)/data.length;
  return (
    <div ref={ref} style={{ width:'100%' }}>
      <svg width={w} height={h} style={{ display:'block' }}>
        {data.map((d,i)=>{ const bh=(d.value/max)*(h-pad.t-pad.b); const x=pad.l+i*bw; const y=h-pad.b-bh;
          const col=colorFn?colorFn(d.value,max):'var(--lime-deep)';
          return <g key={i}>
            <rect x={x+bw*0.18} y={y} width={bw*0.64} height={bh} rx="3" fill={col} style={{ transformOrigin:`${x+bw/2}px ${h-pad.b}px`, animation:`bar .7s cubic-bezier(.2,.8,.2,1) ${i*0.012}s both` }}/>
            {(d.label!=null) && <text x={x+bw/2} y={h-7} textAnchor="middle" fontSize="9.5" fill="var(--t3)">{d.label}</text>}
          </g>; })}
      </svg>
    </div>
  );
}

/* ── Inline sparkline ── */
function Sparkline({ data, w=72, h=26, color='var(--lime-deep)', up }) {
  const max=Math.max(...data), min=Math.min(...data);
  const X=i=> i*w/(data.length-1);
  const Y=v=> h-2 - ((v-min)/((max-min)||1))*(h-4);
  const line=data.map((v,i)=>`${i?'L':'M'}${X(i)},${Y(v)}`).join(' ');
  const col = up===false?'var(--red)':up===true?'var(--green)':color;
  return <svg width={w} height={h} style={{ display:'block' }}>
    <path d={`${line} L${w},${h} L0,${h} Z`} fill={col} opacity="0.1"/>
    <path d={line} fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

/* ── Score gauge (SpotPark Score) ── */
function ScoreGauge({ score, size=92 }) {
  const pct=score/100; const r=(size-9)/2; const c=2*Math.PI*r;
  const col = score>=80?'var(--green)':score>=60?'var(--yellow)':'var(--red)';
  const [v,setV]=cS(0);
  cE(()=>{ const t=setTimeout(()=>setV(pct),60); return ()=>clearTimeout(t); },[pct]);
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--elevated)" strokeWidth="9" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-v)} style={{ transition:'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span className="tnum" style={{ fontFamily:'var(--display)', fontWeight:700, fontSize:size*0.27, lineHeight:1 }}>{Math.round(v*100)}</span>
        <span className="t-micro" style={{ color:'var(--t3)', fontSize:9 }}>/ 100</span>
      </div>
    </div>
  );
}

/* ── progress bar ── */
function ProgressBar({ pct, h=6, colorByPct=true, color }) {
  const col = color || (colorByPct ? (pct>0.9?'var(--red)':pct>0.7?'var(--yellow)':'var(--green)') : 'var(--lime-deep)');
  const [w,setW]=cS(0);
  cE(()=>{ const t=setTimeout(()=>setW(pct),80); return ()=>clearTimeout(t); },[pct]);
  return <div style={{ height:h, borderRadius:h, background:'var(--elevated)', overflow:'hidden' }}>
    <div style={{ height:'100%', width:`${Math.min(100,w*100)}%`, background:col, borderRadius:h, transition:'width .7s cubic-bezier(.2,.8,.2,1)' }}/>
  </div>;
}

/* ── heatmap color ── */
function heatColor(p) {
  if (p<15) return '#EEF1E5';
  if (p<35) return '#DCE9C0';
  if (p<55) return '#C6F24E';
  if (p<75) return '#9FC93C';
  if (p<90) return '#E0A211';
  return '#E5484D';
}
function AdmHeatmap({ cell=22, gap=4 }) {
  const [tip,setTip]=cS(null);
  const now=new Date(); const curDay=(now.getDay()+6)%7, curHour=now.getHours();
  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', gap }}>
        <div style={{ display:'flex', flexDirection:'column', gap }}>
          {BO.heatmap.map((r,i)=><div key={i} style={{ height:cell, display:'flex', alignItems:'center' }}><span className="t-micro" style={{ color:i===curDay?'var(--ink)':'var(--t3)', fontWeight:i===curDay?700:500, width:26 }}>{r.day}</span></div>)}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', gap }}>
            {BO.heatmap.map((r,di)=>(
              <div key={di} style={{ display:'grid', gridTemplateColumns:'repeat(24,1fr)', gap }}>
                {r.hours.map((p,h)=><div key={h} onMouseEnter={()=>setTip({ d:r.day, h, p })} onMouseLeave={()=>setTip(null)}
                  style={{ height:cell, borderRadius:4, background:heatColor(p), cursor:'pointer', outline:(di===curDay&&h===curHour)?'2px solid var(--ink)':'none' }}/>)}
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(24,1fr)', gap, marginTop:6 }}>
            {[...Array(24)].map((_,h)=><span key={h} className="t-micro" style={{ color:'var(--t4)', textAlign:'center', fontSize:9 }}>{h%6===0?h:''}</span>)}
          </div>
        </div>
      </div>
      {tip && <div style={{ position:'absolute', top:-6, left:'50%', transform:'translate(-50%,-100%)', background:'var(--ink)', color:'#fff', padding:'7px 11px', borderRadius:9, whiteSpace:'nowrap', zIndex:20, boxShadow:'var(--sh-pop)', pointerEvents:'none' }}>
        <div style={{ fontSize:12, fontWeight:600 }}>{tip.d} {tip.h}:00</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>Ocupación {tip.p}%</div></div>}
    </div>
  );
}

Object.assign(window, { AreaChart, Donut, BarChart, Sparkline, ScoreGauge, ProgressBar, heatColor, AdmHeatmap });
