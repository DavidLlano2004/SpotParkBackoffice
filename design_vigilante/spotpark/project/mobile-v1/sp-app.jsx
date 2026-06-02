/* sp-app.jsx — navigator + mount. Spring push/pop + tab fade. */
const { useState, useRef, useCallback, useEffect } = React;

/* registry filled by screen modules: window.SP_SCREENS[name] = Component */
window.SP_SCREENS = window.SP_SCREENS || {};

const TABS = ['home','trips','ai','saved','profile'];

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  // a stack entry: { id, name, props, kind:'push'|'tab' }
  const [stack, setStack] = useState([{ id:0, name:'splash', props:{}, kind:'tab' }]);
  const [tab, setTab] = useState('home');
  const idRef = useRef(1);
  const [popping, setPopping] = useState(null); // id being popped (for exit anim)

  const top = stack[stack.length - 1];

  const push = useCallback((name, props = {}) => {
    setStack(s => [...s, { id: idRef.current++, name, props, kind:'push' }]);
  }, []);

  const pop = useCallback(() => {
    setStack(s => {
      if (s.length <= 1) return s;
      const leaving = s[s.length - 1];
      setPopping(leaving.id);
      setTimeout(() => {
        setStack(cur => cur.filter(e => e.id !== leaving.id));
        setPopping(null);
      }, 330);
      return s;
    });
  }, []);

  const replace = useCallback((name, props = {}) => {
    setStack([{ id: idRef.current++, name, props, kind:'tab' }]);
  }, []);

  // switch bottom tab — collapse stack to a single tab root
  const go = useCallback((t) => {
    setTab(t);
    const root = t === 'home' ? 'home' : t === 'trips' ? 'trips' : t === 'saved' ? 'saved' : 'profile';
    setStack([{ id: idRef.current++, name: root, props:{}, kind:'tab' }]);
  }, []);

  const nav = { push, pop, replace, go, tab };

  // self-heal: coerce any stale/invalid accent (e.g. an old teal) to lime
  useEffect(() => {
    const valid = ['#C6F24E','#7BE08A','#A3E635','#34D399'];
    if (!valid.includes(t.accent)) setTweak('accent', '#C6F24E');
  }, []);

  // apply accent tweak to the lime design-system tokens
  useEffect(() => {
    const r = document.documentElement.style;
    const accents = {
      // [accent, dark-variant for text on white, pale tint]
      '#C6F24E': ['#C6F24E', '#5E7F12', '#E8F4C9'], // lima
      '#7BE08A': ['#7BE08A', '#1F7A3D', '#DBF5E1'], // verde menta
      '#A3E635': ['#A3E635', '#4D7C0F', '#ECFCCB'], // verde brillante
      '#34D399': ['#34D399', '#047857', '#D1FAE5'], // esmeralda
    };
    const [a1, a2, a3] = accents[t.accent] || accents['#C6F24E'];
    r.setProperty('--blue', a1);
    r.setProperty('--blue-light', a2);
    r.setProperty('--blue-tint', a3);
    r.setProperty('--lime-deep', a2);
    r.setProperty('--sp-accent', a1);
    r.setProperty('--sp-accent-light', a2);
    r.setProperty('--sp-accent-tint', a3);
  }, [t.accent]);

  // reduce-motion tweak reuses the hidden-tab safety net
  useEffect(() => {
    document.documentElement.classList.toggle('sp-reduce', !!t.reduceMotion);
  }, [t.reduceMotion]);

  useEffect(() => { document.getElementById('loading')?.remove(); }, []);

  return (
    <Nav.Provider value={nav}>
      <div id="stage-inner">
        <div className="phone">
          <div className="screen-host">
            <div className="stack">
              {stack.map((e, i) => {
                const C = window.SP_SCREENS[e.name];
                const isTop = i === stack.length - 1;
                const isPush = e.kind === 'push';
                const leaving = popping === e.id;
                let anim = 'none', z = i + 1, shadow = 'none', filter = 'none';
                if (isPush && !leaving) anim = 'sp-push-in .34s cubic-bezier(.2,.85,.25,1) both';
                if (leaving) { anim = 'sp-push-out .33s cubic-bezier(.4,0,.6,1) both'; z = 99; }
                // underlying screen subtly recedes when a push covers it
                const covered = isPush && isTop && !leaving;
                return (
                  <div key={e.id} className="scr" style={{
                    zIndex: z, animation: anim, boxShadow: isPush ? '-12px 0 40px rgba(0,0,0,.18)' : 'none',
                  }}>
                    {C ? <C {...e.props} /> : <Missing name={e.name} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Color de acento" />
        <TweakColor label="Marca" value={t.accent}
          options={['#C6F24E','#7BE08A','#A3E635','#34D399']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Movimiento" />
        <TweakToggle label="Reducir animaciones" value={t.reduceMotion}
          onChange={(v) => setTweak('reduceMotion', v)} />
      </TweaksPanel>
    </Nav.Provider>
  );
}

function Missing({ name }) {
  return <div style={{ padding:80, fontFamily:'var(--font)', color:'var(--t2)' }}>Pantalla «{name}» pendiente.</div>;
}

/* push/pop keyframes injected here (depend on app) */
const st = document.createElement('style');
st.textContent = `
@keyframes sp-push-in  { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes sp-push-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
#stage-inner { transform-origin: center; }
`;
document.head.appendChild(st);

ReactDOM.createRoot(document.getElementById('stage')).render(<App />);
