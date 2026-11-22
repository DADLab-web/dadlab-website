(()=>{
const d=window.DADLAB,c=d.categories;if(!c)return;
const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n};
const url=(kind,id)=>(kind==='research'?'research-'+id+'.html':'technology.html')+'#category-'+id;
function link(text,href){const a=el('a',text);a.href=href;return a}
function relations(p){const box=el('div');box.className='paper-relations';for(const kind of ['research','technology']){const cat=c[kind].find(x=>x.id===p[kind]);box.append(link(cat.title+' ↗',url(kind,cat.id)))}if(p.classificationNote)box.append(el('small',p.classificationNote));return box}
function card(p){const a=el('article');a.className='linked-paper';const dest=link('',detailUrl(p.id)),im=el('img');im.src=p.preview;im.alt=p.title;im.loading='lazy';dest.append(im,el('h3',p.title));a.append(dest,el('time',p.date),relations(p));return a}
const kind=document.body.dataset.page==='research'?'research':document.body.dataset.page==='technical'?'technology':null;
if(kind){
const section=el('section');section.className='section linked-categories';
if(kind==='research'){
 const old=document.querySelector('#research');if(old)old.remove();
 section.classList.add('research-layout');const side=el('aside');side.className='research-sidebar';side.append(el('p','RESEARCH AREAS'),el('h2','研究方向'));
 const nav=el('nav');nav.setAttribute('aria-label','研究方向分类');c[kind].forEach((cat,i)=>nav.append(link('0'+(i+1)+' / '+cat.title,url('research',cat.id))));side.append(nav);section.append(side);
}
const content=el('div');content.className='research-content';
for(const cat of c[kind]){
 const block=el('section');block.id='category-'+cat.id;block.className='linked-category';
 if(cat.english){const en=el('p',cat.english);en.className='eyebrow';block.append(en)}
 block.append(el('h2',cat.title));
 if(cat.description){const intro=el('p',cat.description);intro.className='direction-intro';block.append(intro)}
 if(cat.keywords){const tags=el('p',cat.keywords);tags.className='direction-keywords';block.append(tags)}
 if(cat.sourceId)block.append(link('完整方向介绍 ↗',detailUrl(cat.sourceId)));if(cat.sourceUrl)block.append(link(' 原站方向与论文列表 ↗',cat.sourceUrl));
 const papers=d.publications.filter(p=>kind==='research'&&cat.paperIds?cat.paperIds.includes(p.id):p[kind]===cat.id);
 const heading=el('div');heading.className='related-heading';heading.append(el('h3','相关论文'),el('span',papers.length+' 篇'));block.append(heading);
 const grid=el('div');grid.className='linked-papers';papers.forEach(p=>grid.append(card(p)));if(!papers.length)grid.append(el('p','暂无关联论文'));block.append(grid);content.append(block);
}
section.append(content);document.querySelector('main').append(section);
if(kind==='research'){
 const links=[...section.querySelectorAll('.research-sidebar nav a')],slides=[...content.children];
 content.classList.add('research-slider');content.tabIndex=0;content.setAttribute('aria-label','研究方向，左右滑动或使用方向键切换');
 const controls=el('div');controls.className='research-slide-controls';const prev=el('button','←'),next=el('button','→'),status=el('span');prev.type=next.type='button';prev.setAttribute('aria-label','上一个研究方向');next.setAttribute('aria-label','下一个研究方向');status.setAttribute('aria-live','polite');controls.append(prev,status,next);section.querySelector('.research-sidebar').append(controls);
 let current=Math.max(0,c.research.findIndex(cat=>cat.id===(location.hash.replace('#category-','')||document.body.dataset.direction||'healthy'))),settle;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function sync(write=false){links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});slides.forEach((slide,i)=>{slide.inert=i!==current});content.style.height=slides[current].scrollHeight+'px';prev.disabled=current===0;next.disabled=current===slides.length-1;status.textContent=(current+1)+' / '+slides.length;document.title=c.research[current].title+' — DADLab';if(write)history.replaceState(null,'','#'+slides[current].id)}
 function go(i,animate=true){current=Math.max(0,Math.min(slides.length-1,i));sync(true);content.scrollTo({left:current*content.clientWidth,behavior:animate&&!reduced.matches?'smooth':'instant'})}
 links.forEach((a,i)=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();go(i)}));prev.onclick=()=>go(current-1);next.onclick=()=>go(current+1);
 content.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1))}});
 content.addEventListener('scroll',()=>{clearTimeout(settle);settle=setTimeout(()=>{current=Math.round(content.scrollLeft/content.clientWidth);sync(true)},140)},{passive:true});
 window.addEventListener('hashchange',()=>{const i=slides.findIndex(s=>'#'+s.id===location.hash);if(i>=0)go(i)});
 new ResizeObserver(()=>{content.scrollTo({left:current*content.clientWidth,behavior:'instant'});sync()}).observe(content);
 slides.forEach(slide=>new ResizeObserver(()=>{if(slide===slides[current])content.style.height=slide.scrollHeight+'px'}).observe(slide));
 requestAnimationFrame(()=>go(current,false));

}
}
// Homepage direction previews lead directly to the corresponding research section.
const mapping={'da4d30f04e1983f3':'healthy','186278694bd15cb3':'inclusive','c86708b1ddbbad6a':'green'};
document.querySelectorAll('.directions a[data-page]').forEach(a=>{const key=mapping[a.dataset.page];if(key)a.href=url('research',key)});

const id=new URLSearchParams(location.search).get('id'),paper=d.publications.find(p=>p.id===id);if(paper&&document.querySelector('#article-body'))document.querySelector('#article-body').prepend(relations(paper));
const origin=document.querySelector('#article-origin');if(origin&&paper&&!paper.source)origin.hidden=true;
function annotate(){document.querySelectorAll('#papers > .record').forEach(a=>{if(a.querySelector('.category-label'))return;const p=d.publications.find(p=>a.href.endsWith(encodeURIComponent(p.id)));if(!p)return;const label=el('small',c.research.find(x=>x.id===p.research).title+' · '+c.technology.find(x=>x.id===p.technology).title);label.className='category-label';a.querySelector('h3').append(label)})}annotate();const papers=document.querySelector('#papers');if(papers)new MutationObserver(annotate).observe(papers,{childList:true});
if(kind!=='research'&&location.hash.startsWith('#category-'))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
