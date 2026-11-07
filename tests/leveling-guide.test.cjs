const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {JSDOM}=require('jsdom');
const root=join(__dirname,'..');
function guide(level=1){return new JSDOM(readFileSync(join(root,'index.html'),'utf8'),{runScripts:'dangerously',url:'https://ikugan132.github.io/ygglabs-leveling/?level='+level,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=()=>{};}});}
test('the updated route selects the supplied destinations through level 175',()=>{
 const dom=guide();try{const w=dom.window,d=w.document;for(const [level,name]of [[1,'Drops'],[9,'Snakes'],[18,'AntHell'],[35,'Orc'],[37,'Orc zumbi'],[49,'Orc zumbi'],[51,'Orc zumbi'],[52,'Arenoso'],[54,'Hode'],[65,'Sorrateiro'],[70,'Iara'],[71,'GOAT'],[77,'Petite'],[86,'Stapo'],[99,'Magmaring'],[100,'VENATU'],[101,'Sedora'],[115,'Isilla'],[118,'Agav'],[125,'Manuk 1'],[133,'Bio3'],[142,'Manuk 2'],[156,'Scaraba 1'],[160,'Scaraba 2'],[175,'Scaraba 2']]){const input=d.getElementById('level');input.value=level;input.dispatchEvent(new w.Event('change'));assert.ok(d.getElementById('mapName').textContent.includes(name),'level '+level);}
 assert.equal(d.getElementById('level').max,'175');d.getElementById('plus').click();assert.equal(d.getElementById('level').value,'175');
 }finally{dom.window.close();}
});
test('overlapping options remain selectable and optional extensions are retained',()=>{
 const dom=guide(101);try{const d=dom.window.document;assert.match(d.getElementById('stageOptions').textContent,/Magmaring/);assert.match(d.getElementById('stageOptions').textContent,/VENATU/);const magma=[...d.querySelectorAll('#stageOptions button')].find(b=>b.textContent.includes('Magdun'));assert.ok(magma);magma.click();assert.match(d.getElementById('mapName').textContent,/Magdun/);assert.match(d.getElementById('mapNote').textContent,/AoE/);
 const zombie=[...d.querySelectorAll('.route-card')].find(c=>c.querySelector('h3').textContent==='Orc zumbi');assert.match(zombie.textContent,/54.*56/);zombie.querySelector('button').click();assert.match(d.getElementById('mapName').textContent,/Orc zumbi/);
 }finally{dom.window.close();}
});
test('levels 123–124 stay on Agav / Echio until Manuk 1 at 125',()=>{
 for(const level of [123,124]){const dom=guide(level);try{const d=dom.window.document;assert.match(d.getElementById('mapName').textContent,/Agav/);assert.equal(d.getElementById('officialLink').hidden,false);assert.equal(d.getElementById('nextLevel').textContent,'125');}finally{dom.window.close();}}
 const dom=guide(1);try{const w=dom.window,d=w.document;for(let level=1;level<=175;level++){d.getElementById('level').value=String(level);d.getElementById('level').dispatchEvent(new w.Event('change'));assert.doesNotMatch(d.getElementById('mapName').textContent,/Sem destino/,'level '+level);}}finally{dom.window.close();}
});
test('the Hospital de Bangungot addendum shows from 100 to 116 with its EXP bonus',()=>{
 const dom=guide(105);try{const d=dom.window.document,w=dom.window;const tip=d.getElementById('hospitalTip');assert.ok(tip.classList.contains('is-visible'));assert.equal(d.getElementById('hospitalBonus').textContent,'100%');assert.match(tip.textContent,/quase nenhum loot/);assert.ok(d.getElementById('hospitalSection').compareDocumentPosition(d.getElementById('routeCards'))&w.Node.DOCUMENT_POSITION_FOLLOWING);
 for(const [level,visible]of [[99,false],[100,true],[116,true],[117,false],[123,false]]){d.getElementById('level').value=String(level);d.getElementById('level').dispatchEvent(new w.Event('change'));assert.equal(tip.classList.contains('is-visible'),visible,'level '+level);if(level===100)assert.equal(d.getElementById('hospitalBonus').textContent,'114%');}
 }finally{dom.window.close();}
});
test('the Pirate Skeleton addenda keep their placement and level 39–53 visibility',()=>{
 const dom=guide(39);try{const d=dom.window.document,w=dom.window;assert.ok(d.getElementById('ghostTip').classList.contains('is-visible'));assert.equal(d.getElementById('ghostBonus').textContent,'120%');assert.ok(d.getElementById('ghostTip').compareDocumentPosition(d.getElementById('recommended'))&w.Node.DOCUMENT_POSITION_FOLLOWING);assert.ok(d.getElementById('ghostSection').compareDocumentPosition(d.getElementById('routeCards'))&w.Node.DOCUMENT_POSITION_FOLLOWING);d.getElementById('level').value='54';d.getElementById('level').dispatchEvent(new w.Event('change'));assert.equal(d.getElementById('ghostTip').classList.contains('is-visible'),false);}finally{dom.window.close();}
});
test('tier labels follow their actual levels when the slider maximum changes',()=>{
 const html=readFileSync(join(root,'index.html'),'utf8').replace(/max="175"/g,'max="201"');
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://ikugan132.github.io/ygglabs-leveling/'});
 try{const ticks=dom.window.document.querySelectorAll('.ticks span');assert.equal(ticks[1].style.left,'15.5%');assert.equal(ticks[2].style.left,'32%');}finally{dom.window.close();}
});
test('the guide has no link or reference to the calculator',()=>{
 const html=readFileSync(join(root,'index.html'),'utf8');assert.doesNotMatch(html,/href="\.\.\/|Calculadora|Crafts &amp; farm|ygg-alchemy|extension|downloads/i);
 const dom=guide(1);try{const links=[...dom.window.document.querySelectorAll('a[href]')].map(a=>a.href);assert.deepEqual(links.filter(h=>h.startsWith('https://ikugan132.github.io/')&&!h.startsWith('https://ikugan132.github.io/ygglabs-leveling/')),[]);}finally{dom.window.close();}
});
