/* ================= LANGUAGE ================= */
const html = document.documentElement;
let lang = 'en';
function applyLang(l){
  lang = l;
  const dict = I18N[l];
  html.lang = l;
  html.dir = (l === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(dict[k] !== undefined) el.textContent = dict[k];
  });
  document.title = (l==='ar')
    ? 'مهنّد البوش — محلّل أعمال وعمليات منتجات'
    : 'Mohanned Albosh — Business Analyst & Product Operations';
  try{ localStorage.setItem('mab-lang', l); }catch(e){}
  buildCharts(); // redraw with translated labels
}
document.getElementById('langToggle').addEventListener('click',()=>{
  applyLang(lang === 'en' ? 'ar' : 'en');
});

/* ================= NAV ================= */
const nav = document.getElementById('nav');
const onScroll = ()=>{ nav.classList.toggle('scrolled', window.scrollY > 8); };
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click',()=> navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=> navLinks.classList.remove('open')));

/* ================= REVEAL ON SCROLL ================= */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revObserver.unobserve(e.target); } });
},{threshold:.14, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=> revObserver.observe(el));

/* ================= COUNTERS ================= */
function animateCount(el){
  const dec = el.hasAttribute('data-decimals');
  const target = dec ? parseFloat(el.getAttribute('data-target-dec')) : parseInt(el.getAttribute('data-target'),10);
  const suffix = el.getAttribute('data-suffix') || '';
  if(reduce){ el.textContent = (dec?target.toFixed(1):target) + suffix; return; }
  const dur = 1400; const start = performance.now();
  function tick(now){
    const p = Math.min((now-start)/dur, 1);
    const eased = 1 - Math.pow(1-p, 3);
    const val = dec ? (target*eased).toFixed(1) : Math.round(target*eased);
    el.textContent = val + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ animateCount(e.target); countObserver.unobserve(e.target); } });
},{threshold:.5});
document.querySelectorAll('.count').forEach(el=> countObserver.observe(el));

/* ================= LANGUAGE BARS ================= */
const barObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.width = e.target.getAttribute('data-w')+'%'; barObserver.unobserve(e.target); } });
},{threshold:.5});
document.querySelectorAll('.lang-bar i').forEach(el=> barObserver.observe(el));

/* ================= CASE STUDY ACCORDION ================= */
document.querySelectorAll('[data-case]').forEach(c=>{
  const head = c.querySelector('.case-head');
  const body = c.querySelector('.case-body');
  head.addEventListener('click',()=>{
    const open = c.classList.toggle('open');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
  });
});
window.addEventListener('resize',()=>{
  document.querySelectorAll('.case.open .case-body').forEach(b=>{ b.style.maxHeight = b.scrollHeight+'px'; });
});

/* ================= CHARTS (hand-built SVG, always LTR) ================= */
const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs){ const n=document.createElementNS(NS,name); for(const k in attrs) n.setAttribute(k, attrs[k]); return n; }

/* Hero sparkline (area + line) */
function buildSpark(){
  const svg = document.getElementById('heroSpark');
  svg.innerHTML='';
  const W=340,H=88, pad=6;
  const data=[14,22,18,30,26,38,34,48,44,58,62,72];
  const max=Math.max(...data), min=Math.min(...data);
  const stepX=(W-pad*2)/(data.length-1);
  const pts=data.map((v,i)=>[pad+i*stepX, H-pad-((v-min)/(max-min))*(H-pad*2)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const grad=el('linearGradient',{id:'sg',x1:'0',y1:'0',x2:'0',y2:'1'});
  grad.appendChild(el('stop',{offset:'0',"stop-color":'#2563eb',"stop-opacity":'.28'}));
  grad.appendChild(el('stop',{offset:'1',"stop-color":'#2563eb',"stop-opacity":'0'}));
  const defs=el('defs',{}); defs.appendChild(grad); svg.appendChild(defs);
  const area=el('path',{d:line+` L ${pts[pts.length-1][0].toFixed(1)} ${H} L ${pts[0][0].toFixed(1)} ${H} Z`, fill:'url(#sg)'});
  svg.appendChild(area);
  const path=el('path',{d:line, fill:'none', stroke:'#2563eb', 'stroke-width':'2.4', 'stroke-linecap':'round','stroke-linejoin':'round'});
  svg.appendChild(path);
  if(!reduce){
    const len=path.getTotalLength();
    path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
    path.getBoundingClientRect();
    path.style.transition='stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)';
    path.style.strokeDashoffset='0';
    area.style.opacity='0'; area.style.transition='opacity 1.4s ease .3s';
    requestAnimationFrame(()=>{ area.style.opacity='1'; });
  }
  const last=pts[pts.length-1];
  svg.appendChild(el('circle',{cx:last[0], cy:last[1], r:'3.5', fill:'#2563eb'}));
}

/* Bar chart */
function buildBars(){
  const svg=document.getElementById('barChart');
  if(!svg) return;
  svg.innerHTML='';
  const W=520,H=240, padL=34,padR=10,padT=14,padB=28;
  const labels = (lang==='ar')
    ? ['ينا','فبر','مار','أبر','ماي','يون','يول','أغس']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  const data=[42,55,48,63,58,71,66,82];
  const max=90;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const bw=plotW/data.length*0.56;
  const gap=plotW/data.length;
  // gridlines
  for(let g=0; g<=3; g++){
    const y=padT+plotH-(g/3)*plotH;
    svg.appendChild(el('line',{x1:padL,y1:y,x2:W-padR,y2:y,stroke:'#eef2f9','stroke-width':'1'}));
    const tx=el('text',{x:padL-8,y:y+3,'text-anchor':'end','font-size':'9','fill':'#9aa7bf','font-family':'IBM Plex Mono, monospace'});
    tx.textContent=Math.round((g/3)*max); svg.appendChild(tx);
  }
  const grad=el('linearGradient',{id:'bg1',x1:'0',y1:'0',x2:'0',y2:'1'});
  grad.appendChild(el('stop',{offset:'0','stop-color':'#3b74f0'}));
  grad.appendChild(el('stop',{offset:'1','stop-color':'#1d4ed8'}));
  const defs=el('defs',{}); defs.appendChild(grad); svg.appendChild(defs);
  data.forEach((v,i)=>{
    const x=padL+gap*i+(gap-bw)/2;
    const h=(v/max)*plotH;
    const y=padT+plotH-h;
    const r=el('rect',{x:x.toFixed(1),y:(padT+plotH).toFixed(1),width:bw.toFixed(1),height:'0',rx:'4',fill:'url(#bg1)'});
    svg.appendChild(r);
    if(reduce){ r.setAttribute('y',y.toFixed(1)); r.setAttribute('height',h.toFixed(1)); }
    else{
      r.style.transition=`y .9s cubic-bezier(.16,1,.3,1) ${i*0.06}s, height .9s cubic-bezier(.16,1,.3,1) ${i*0.06}s`;
      requestAnimationFrame(()=>{ r.setAttribute('y',y.toFixed(1)); r.setAttribute('height',h.toFixed(1)); });
    }
    const t=el('text',{x:(x+bw/2).toFixed(1),y:H-10,'text-anchor':'middle','font-size':'9.5','fill':'#7c8aa5'});
    t.textContent=labels[i]; svg.appendChild(t);
  });
}

/* Donut chart */
function buildDonut(){
  const svg=document.getElementById('donutChart');
  const legend=document.getElementById('donutLegend');
  if(!svg) return;
  svg.innerHTML=''; legend.innerHTML='';
  const cx=100,cy=100,r=68,sw=26;
  const segs = (lang==='ar')
    ? [{l:'العملاء المحتملون',v:34,c:'#1d4ed8'},{l:'المبيعات',v:27,c:'#3b82f6'},{l:'التهيئة',v:22,c:'#60a5fa'},{l:'نجاح العملاء',v:17,c:'#93c5fd'}]
    : [{l:'Leads',v:34,c:'#1d4ed8'},{l:'Sales',v:27,c:'#3b82f6'},{l:'Onboarding',v:22,c:'#60a5fa'},{l:'Customer Success',v:17,c:'#93c5fd'}];
  const total=segs.reduce((a,b)=>a+b.v,0);
  const circ=2*Math.PI*r;
  let offset=0;
  svg.appendChild(el('circle',{cx,cy,r,fill:'none',stroke:'#eef2f9','stroke-width':sw}));
  segs.forEach((s,i)=>{
    const frac=s.v/total;
    const dash=frac*circ;
    const c=el('circle',{cx,cy,r,fill:'none',stroke:s.c,'stroke-width':sw,
      'stroke-dasharray':`${dash} ${circ-dash}`,
      'stroke-dashoffset': reduce ? (-offset) : circ,
      transform:`rotate(-90 ${cx} ${cy})`,'stroke-linecap':'butt'});
    svg.appendChild(c);
    if(!reduce){
      c.style.transition=`stroke-dashoffset .9s cubic-bezier(.16,1,.3,1) ${0.2+i*0.12}s`;
      requestAnimationFrame(()=>{ c.setAttribute('stroke-dashoffset', -offset); });
    }
    offset+=dash;
    const lg=document.createElement('div'); lg.className='lg';
    lg.innerHTML=`<span class="sw" style="background:${s.c}"></span><span>${s.l}</span><span class="pc">${s.v}%</span>`;
    legend.appendChild(lg);
  });
  const center=el('text',{x:cx,y:cy-2,'text-anchor':'middle','font-size':'20','font-weight':'600','fill':'#0f1b34','font-family':'IBM Plex Mono, monospace'});
  center.textContent=total; svg.appendChild(center);
  const sub=el('text',{x:cx,y:cy+15,'text-anchor':'middle','font-size':'9','fill':'#7c8aa5'});
  sub.textContent = lang==='ar' ? 'حساب' : 'accounts'; svg.appendChild(sub);
}

let chartsBuilt=false;
function buildCharts(){ buildSpark(); buildBars(); buildDonut(); }
/* build hero spark immediately; dashboard charts when scrolled into view */
buildSpark();
const dashObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ buildBars(); buildDonut(); chartsBuilt=true; dashObserver.disconnect(); } });
},{threshold:.25});
const dashEl=document.getElementById('dashboards');
if(dashEl) dashObserver.observe(dashEl);

/* ================= INIT ================= */
(function init(){
  let saved='en';
  try{ saved = localStorage.getItem('mab-lang') || 'en'; }catch(e){}
  if(saved==='ar') applyLang('ar'); // else stays en (default DOM)
})();
