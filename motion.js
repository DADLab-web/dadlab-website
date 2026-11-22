(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
document.querySelectorAll('.team-carousel').forEach(wrap=>{const track=wrap.querySelector('.team-track'),cards=[...track.querySelectorAll('.person')],prev=wrap.querySelector('.team-prev'),next=wrap.querySelector('.team-next'),rail=wrap.querySelector('.team-rail'),thumb=rail.querySelector('span');let down=false,startX=0,startScroll=0,moved=false,suppress=false;
const position = wrap.querySelector('.team-position');
const formatNumber = number => String(number).padStart(2, '0');
rail.setAttribute('role', 'scrollbar');
rail.setAttribute('aria-label', '成员列表横向滚动');
rail.setAttribute('aria-controls', track.id);
rail.setAttribute('aria-orientation', 'horizontal');
rail.setAttribute('aria-valuemin', '0');
rail.setAttribute('aria-valuemax', '100');
thumb.setAttribute('aria-hidden', 'true');

function update() {
  const max = track.scrollWidth - track.clientWidth;
  const left = Math.max(0, Math.min(max, track.scrollLeft));
  const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const current = Math.min(cards.length, Math.round(left / step) + 1);
  const ratio = max > 0 ? left / max : 0;
  const width = rail.clientWidth;
  const thumbWidth = max > 0
    ? Math.min(width, Math.max(24, width * track.clientWidth / track.scrollWidth))
    : width;
  prev.disabled = left < 3;
  next.disabled = left >= max - 3;
  const caption = `${formatNumber(current)} / ${formatNumber(cards.length)}`;
  if (position.textContent !== caption) position.textContent = caption;
  wrap.dataset.position = String(current);
  thumb.style.width = thumbWidth + 'px';
  thumb.style.transform = `translateX(${(width - thumbWidth) * ratio}px)`;
  rail.tabIndex = max > 0 ? 0 : -1;
  rail.classList.toggle('is-disabled', max <= 0);
  rail.setAttribute('aria-disabled', String(max <= 0));
  rail.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
}
function move(dir){track.scrollBy({left:dir*track.clientWidth*.82,behavior:reduced.matches?'instant':'smooth'})}prev.onclick=()=>move(-1);next.onclick=()=>move(1);track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}if(e.key==='Home'){e.preventDefault();track.scrollTo({left:0,behavior:reduced.matches?'instant':'smooth'})}if(e.key==='End'){e.preventDefault();track.scrollTo({left:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'})}});
track.addEventListener('dragstart',e=>e.preventDefault());track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||railPointer!==null)return;e.preventDefault();down=true;moved=false;startX=e.clientX;startScroll=track.scrollLeft});track.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-startX;if(!moved&&Math.abs(dx)>6){moved=true;track.classList.add('is-dragging');track.setPointerCapture(e.pointerId)}if(moved){e.preventDefault();track.scrollLeft=startScroll-dx}});function end(e){if(!down)return;down=false;if(moved){suppress=true;track.classList.remove('is-dragging');if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);setTimeout(()=>{suppress=false},100)}update()}track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);track.addEventListener('lostpointercapture',()=>{down=false;track.classList.remove('is-dragging')});track.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false}},true);track.addEventListener('scroll',update,{passive:true});
// The rail maps the thumb's travel to the card row's scroll range.
let railPointer = null;
let thumbOffset = 0;

function scrollFromRail(clientX) {
  const bounds = rail.getBoundingClientRect();
  const travel = bounds.width - thumb.getBoundingClientRect().width;
  if (travel <= 0) return;
  const fraction = Math.max(0, Math.min(1, (clientX - bounds.left - thumbOffset) / travel));
  track.scrollLeft = fraction * (track.scrollWidth - track.clientWidth);
}

rail.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || railPointer !== null || down || rail.classList.contains('is-disabled')) return;
  const bounds = thumb.getBoundingClientRect();
  thumbOffset = event.clientX >= bounds.left && event.clientX <= bounds.right
    ? event.clientX - bounds.left
    : bounds.width / 2;
  railPointer = event.pointerId;
  rail.setPointerCapture(railPointer);
  track.classList.add('is-dragging');
  rail.classList.add('is-dragging');
  scrollFromRail(event.clientX);
});

rail.addEventListener('pointermove', event => {
  if (event.pointerId === railPointer) scrollFromRail(event.clientX);
});

function finishRailDrag(event) {
  if (event.pointerId !== railPointer) return;
  railPointer = null;
  track.classList.remove('is-dragging');
  rail.classList.remove('is-dragging');
}

rail.addEventListener('pointerup', finishRailDrag);
rail.addEventListener('pointercancel', finishRailDrag);
rail.addEventListener('lostpointercapture', finishRailDrag);

rail.addEventListener('keydown', event => {
  if (rail.classList.contains('is-disabled')) return;
  const behavior = reduced.matches ? 'instant' : 'smooth';
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      track.scrollBy({left: (event.key === 'ArrowLeft' ? -1 : 1) * (cards[1].offsetLeft - cards[0].offsetLeft), behavior});
      break;
    case 'Home':
    case 'End':
      track.scrollTo({left: event.key === 'Home' ? 0 : track.scrollWidth, behavior});
      break;
    default:
      return;
  }
  event.preventDefault();
});

const teamResize = new ResizeObserver(update);
teamResize.observe(track);
teamResize.observe(rail);
update();

});
const stage=document.querySelector('.hero-photo');if(stage){const primary=stage.querySelector('.hero-image'),original=stage.querySelector('.original-photo'),next=document.querySelector('#next-photo'),files=Object.keys(DADLAB.assets),sources=['69bf70f9c85f50ac1f7099f80e792501.jpg','088fb32a8d8f3cb9f0af3c2ac57081a1.jpg'].map(name=>DADLAB.assets[files.find(u=>u.endsWith('/'+name))].file);let current=0,elapsed=0,last=0,raf=0,visible=true,hover=false,focus=false,paused=reduced.matches,busy=false;const duration=6500;
primary.classList.add('photo-frame','is-current');const second=document.createElement('img');second.className='photo-frame';second.src=sources[1];second.alt='DADLab 原站首图 02';second.draggable=false;second.setAttribute('aria-hidden','true');stage.prepend(second);const frames=[primary,second];function ratio(){if(primary.naturalWidth)stage.style.setProperty('--photo-ratio',primary.naturalWidth+'/'+primary.naturalHeight)}primary.addEventListener('load',ratio);ratio();const scan=document.createElement('span');scan.className='photo-scan';scan.setAttribute('aria-hidden','true');stage.append(scan);const note=document.createElement('span');note.className='photo-note';note.textContent='DADLAB / ORIGINAL FRAMES';stage.append(note);const panel=document.createElement('div');panel.className='photo-console';panel.innerHTML='<span class="photo-status">AUTO / LIVE</span><span class="photo-count" aria-live="polite">01 / 02</span><div class="photo-dots" role="group" aria-label="选择首图"><button aria-label="首图 1" aria-pressed="true"></button><button aria-label="首图 2" aria-pressed="false"></button></div><div class="photo-progress" aria-hidden="true"><span></span></div><button id="photo-previous" class="photo-button" aria-label="上一张首图">←</button><button id="photo-toggle" class="photo-button" aria-label="暂停首图自动轮播" aria-pressed="false">Ⅱ</button>';stage.append(panel);panel.append(next);next.textContent='→';next.setAttribute('aria-label','下一张首图');const toggle=panel.querySelector('#photo-toggle'),status=panel.querySelector('.photo-status'),count=panel.querySelector('.photo-count'),progress=panel.querySelector('.photo-progress span'),dots=[...panel.querySelectorAll('.photo-dots button')];
const effects=[['slices','数字切片'],['iris','光圈展开'],['depth','景深溶解'],['curtain','双向幕帘']];let effectMode=-1,effectSequence=0;
const effectButton=document.createElement('button');effectButton.className='photo-effect';effectButton.textContent='效果：交替';effectButton.setAttribute('aria-label','切换动画效果，当前交替播放');panel.insertBefore(effectButton,panel.firstChild);
effectButton.onclick=()=>{effectMode=effectMode>=effects.length-1?-1:effectMode+1;const name=effectMode<0?'交替':effects[effectMode][1];effectButton.textContent='效果：'+name;effectButton.setAttribute('aria-label','切换动画效果，当前'+name)};
function playing(){return !paused&&!hover&&!focus&&visible&&!document.hidden}function sync(){stage.dataset.photo=String(current+1);stage.dataset.autoplay=String(!paused);stage.dataset.playing=String(playing());count.textContent=`0${current+1} / 02`;dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'播放首图自动轮播':'暂停首图自动轮播');toggle.textContent=paused?'▷':'Ⅱ';status.textContent=paused?'PAUSED / HOLD':hover||focus?'POINTER / HOLD':'AUTO / LIVE'}
async function change(index,direction=1){if(busy||index===current)return;busy=true;const old=frames[current],incoming=frames[index];try{await incoming.decode()}catch{busy=false;return}stage.dataset.direction=direction<0?"previous":"next";
const chosen=effects[effectMode<0?effectSequence++%effects.length:effectMode][0];stage.dataset.effect=chosen;
const slices=[];
if(!reduced.matches&&chosen==='slices'){
 for(let n=0;n<8;n++){
  const slice=document.createElement('div');slice.className='digital-slice';
  slice.style.setProperty('--slice',n);slice.style.setProperty('--delay',((direction<0?7-n:n)*65)+'ms');
  slice.style.clipPath=`inset(0 ${100-(n+1)*12.5}% 0 ${n*12.5}%)`;
  const image=document.createElement('img');image.src=incoming.src;image.alt='';slice.setAttribute('aria-hidden','true');slice.append(image);
  (stage.querySelector('.photo-depth')||stage).append(slice);slices.push(slice);
 }
}
incoming.classList.add('is-incoming');old.classList.add('is-outgoing');stage.classList.add('is-switching');incoming.removeAttribute('aria-hidden');old.setAttribute('aria-hidden','true');current=index;original.href=sources[current];elapsed=0;progress.style.transform='scaleX(0)';sync();setTimeout(()=>{slices.forEach(slice=>slice.remove());frames.forEach((f,i)=>{f.classList.remove('is-incoming','is-outgoing');f.classList.toggle('is-current',i===current)});stage.classList.remove('is-switching');busy=false},reduced.matches?0:1800)}
function tick(t){raf=0;if(!playing()){sync();return}elapsed+=Math.min(t-last,100);last=t;if(elapsed>=duration&&!busy){change(1-current);elapsed=0}progress.style.transform=`scaleX(${Math.min(1,elapsed/duration)})`;raf=requestAnimationFrame(tick)}function start(){sync();if(playing()&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}}function stop(){if(raf)cancelAnimationFrame(raf);raf=0;sync()}
next.onclick=()=>{elapsed=0;change(1-current)};panel.querySelector('#photo-previous').onclick=()=>{elapsed=0;change(1-current,-1)};dots.forEach((b,i)=>b.onclick=()=>{elapsed=0;change(i)});toggle.onclick=()=>{paused=!paused;if(!paused)focus=false;paused?stop():start()};stage.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;stop()}});stage.addEventListener('pointerleave',()=>{hover=false;start()});stage.addEventListener('focusin',()=>{focus=true;stop()});stage.addEventListener('focusout',e=>{if(!stage.contains(e.relatedTarget)){focus=false;start()}});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());new IntersectionObserver(es=>{visible=es[0].isIntersecting;visible?start():stop()},{threshold:.05}).observe(stage);reduced.addEventListener('change',e=>{if(e.matches){paused=true;stop()}});sync();start();
}
})();
