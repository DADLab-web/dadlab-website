(()=>{
const nav=document.querySelector('header #navigation');if(!nav)return;
const groups={
 'research.html':[['健康城市','research-healthy.html'],['绿色城市','research-green.html'],['包容性城市','research-inclusive.html']],
 'technology.html':window.DADLAB.categories.technology.map(c=>[c.title,'technology.html#category-'+c.id]),
 'news.html':[['学术活动','news.html'],['娱乐活动','life.html']],
 'people.html':[['团队成员','people.html'],['课题组负责人','member-01.html']],
 'about.html':[['实验室介绍','about.html'],['联系我们','about.html#contact']],
 'life.html':[['专题报道','life.html#original-activity'],['日常影像','life.html#life-gallery']]
};
nav.querySelectorAll(':scope > a').forEach(a=>{const items=groups[a.getAttribute('href')];if(!items)return;const group=document.createElement('div');group.className='nav-group';a.before(group);group.append(a);const button=document.createElement('button');button.className='nav-expand';button.textContent='⌄';button.setAttribute('aria-label','展开'+a.textContent+'子栏目');button.setAttribute('aria-expanded','false');group.append(button);const menu=document.createElement('div');menu.className='nav-dropdown';menu.id='submenu-'+a.getAttribute('href').split('.')[0];button.setAttribute('aria-controls',menu.id);for(const [title,href] of items){const link=document.createElement('a');link.textContent=title;link.href=href;menu.append(link)}group.append(menu);const set=open=>{group.classList.toggle('expanded',open);button.setAttribute('aria-expanded',String(open))};button.onclick=()=>set(!group.classList.contains('expanded'));group.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')set(true)});group.addEventListener('pointerleave',()=>set(false));group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))set(false)});group.addEventListener('keydown',e=>{if(e.key==='Escape'){set(false);button.focus()}});menu.addEventListener('click',()=>{set(false);nav.classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false')})});
const footer=document.querySelector('footer');if(footer)footer.id='contact';const wall=document.querySelector('.life-wall');if(wall)wall.id='life-gallery';
})();
