
const header=document.querySelector('header'),progress=document.querySelector('.progress');
function onScroll(){const y=scrollY;header?.classList.toggle('scrolled',y>24);const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform=`scaleX(${max>0?Math.min(y/max,1):0})`}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.mobile-menu');toggle?.addEventListener('click',()=>menu?.classList.toggle('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu?.classList.remove('open')});
