let photos=[];
const $=id=>document.getElementById(id);
const MATERIAL_KEY='dachwerkMaterialStammV1', SETUP_KEY='dachwerkSetupStammV1';
let materialMaster=readJSON(MATERIAL_KEY,[]), setupMaster=readJSON(SETUP_KEY,[]);
$('datum').value=new Date().toISOString().slice(0,10);
function euro(n){return (Number(n)||0).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'}
function num(v){return Number(String(v||'').replace(/\s/g,'').replace(',','.'))||0}
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function currentYear(){return new Date().getFullYear()}
function nextOrderNumber(){
  const year=currentYear();
  const prefix=String(year)+'-';
  const nums=orders.map(x=>String(x.auftragsnr||'')).filter(x=>x.startsWith(prefix)).map(x=>Number(x.slice(prefix.length))).filter(Number.isFinite);
  const next=(nums.length?Math.max(...nums):0)+1;
  return prefix+String(next).padStart(3,'0');
}
// Vorab eingepflegte DW-Produkte aus "DW Produkte.xlsx".
// Preise und Artikelnummern bleiben bewusst leer, da sie in der Excel-Datei nicht enthalten waren.
const DEFAULT_MATERIALS = [{"name":"02 ATTIKA ABDECKUNG Aluminium","unit":"m","article":"","price":""},{"name":"02 Alublech 0,7mm","unit":"m ²","article":"","price":""},{"name":"02 Alublech Anthrazit 0,7 mm","unit":"m ²","article":"","price":""},{"name":"02 Kehldichtstreifen","unit":"m","article":"","price":""},{"name":"02 Kehlabdeckung Zinkblech","unit":"m","article":"","price":""},{"name":"02 Zinkblech 0,7 mm","unit":"m ²","article":"","price":""},{"name":"03 Fallrohr Waschbär Abwehrschutz","unit":"Stück","article":"","price":""},{"name":"03 Standrohr LORO X mit Klappe 1000 mm","unit":"Stück","article":"","price":""},{"name":"03 Standrohr LORO X mit Klappe 2000 mm","unit":"Stück","article":"","price":""},{"name":"03-LORO-X Rohrschelle","unit":"Stück","article":"","price":""},{"name":"03 Zink Dachrinne 6-teilig","unit":"m","article":"","price":""},{"name":"30 Zink Dachrinne komplett","unit":"m","article":"","price":""},{"name":"03 Zink Dachrinneneisen","unit":"Stück","article":"","price":""},{"name":"03 Zink Dachrinnenzubehör","unit":"Stück","article":"","price":""},{"name":"03 Zink Fallrohr 100er","unit":"m","article":"","price":""},{"name":"03 Zink Fallrohrschellen 100er","unit":"Stück","article":"","price":""},{"name":"04 Kemperol 1K Flüssigkunststoff","unit":"kg","article":"","price":""},{"name":"04 Kemperol 1K Grundierung","unit":"kg","article":"","price":""},{"name":"04 Kemperol Notpflaster","unit":"Stück","article":"","price":""},{"name":"04 Kemperol Vlies","unit":"m ²","article":"","price":""},{"name":"05 ALWITRA VGSK Evalon KS Bahnen","unit":"m ²","article":"","price":""},{"name":"05 ALWITRA Verbundblech Evalon","unit":"m","article":"","price":""},{"name":"05 ALWITRA Wandanschlüsse","unit":"m","article":"","price":""},{"name":"06 Allwetter Dichtmasse","unit":"Stück","article":"","price":""},{"name":"06 Bitu - Dicht Spezial - 310 ml - Kartusche","unit":"Stück","article":"","price":""},{"name":"06 Bornit Kaltspachtel","unit":"kg","article":"","price":""},{"name":"06  Acryl","unit":"Stück","article":"","price":""},{"name":"06 EPDM Notpflaster","unit":"Stück","article":"","price":""},{"name":"06 IWETEC Alles Dicht","unit":"Stück","article":"","price":""},{"name":"06 Wand-Kaminanschluss Band","unit":"m","article":"","price":""},{"name":"07 Alu Wandanschlussschiene","unit":"m","article":"","price":""},{"name":"07 Dachausstiegfenster","unit":"Stück","article":"","price":""},{"name":"07 Fugendichtmasse","unit":"Stück","article":"","price":""},{"name":"07 Kaminkopfabdeckung","unit":"Stück","article":"","price":""},{"name":"07 Kaminsanierung komplett","unit":"Stück","article":"","price":""},{"name":"07 Wand- Kaminanschlüsse erneuern","unit":"m","article":"","price":""},{"name":"08 Antennenziegel Blei","unit":"Stück","article":"","price":""},{"name":"08 Dachtritte aus verzinktem Stahl","unit":"m","article":"","price":""},{"name":"08 Eternit Wabenziegel","unit":"Stück","article":"","price":""},{"name":"08 Frankfurter Pfanne","unit":"Stück","article":"","price":""},{"name":"08 Greaton Ziegel Harmonie","unit":"Stück","article":"","price":""},{"name":"08 Jakobi Hohlpfanne","unit":"Stück","article":"","price":""},{"name":"08 Lüftungsrohr auf Frankfurter Pfanne","unit":"Stück","article":"","price":""},{"name":"08 Schiefer Schindeln","unit":"Stück","article":"","price":""},{"name":"09 DACH Laub fang Gully 100er Edelstahl","unit":"Stück","article":"","price":""},{"name":"09 DACH Laubfangkorb","unit":"Stück","article":"","price":""},{"name":"09 DACH Laubstopp Dachrinnenschutz","unit":"Stück","article":"","price":""},{"name":"09 Walz Blei","unit":"kg","article":"","price":""},{"name":"10 Bitumen Voranstrich","unit":"Liter","article":"","price":""},{"name":"10 Bitumenschweißbahn - VEDAC PYE PV 200 S 5 EN Elastomer Bitumenbahn","unit":"m ²","article":"","price":""},{"name":"11 Dachlatten F/T","unit":"m","article":"","price":""},{"name":"11 Edelstahl Spengler Schrauben","unit":"Stück","article":"","price":""},{"name":"12 ABS Dachsicherungshaken","unit":"Stück","article":"","price":""},{"name":"12 Dachsicherungshaken","unit":"Stück","article":"","price":""}];
const DEFAULT_SETUP = [{"name":"12 Hubsteiger Stunden","unit":"Stunden","price":""},{"name":"12 Gerüst - Leihdauer 4 Wochen","unit":"m²","price":""},{"name":"12 Rollgerüst","unit":"Stück","price":""},{"name":"12 Bockgerüst","unit":"Stück","price":""},{"name":"12 Dachbockgerüst","unit":"Stück","price":""}];
function seedDefaultMasters(){
  let changed=false;
  const existingM=new Set(materialMaster.map(x=>String(x.name||'').trim().toLocaleLowerCase('de')));
  DEFAULT_MATERIALS.forEach(x=>{
    const key=x.name.toLocaleLowerCase('de');
    if(!existingM.has(key)){ materialMaster.push({id:uid(),...x}); changed=true; }
  });
  const existingS=new Set(setupMaster.map(x=>String(x.name||'').trim().toLocaleLowerCase('de')));
  DEFAULT_SETUP.forEach(x=>{
    const key=x.name.toLocaleLowerCase('de');
    if(!existingS.has(key)){ setupMaster.push({id:uid(),...x}); changed=true; }
  });
  if(changed) saveMasters();
}

function showView(name){document.querySelectorAll('.appview').forEach(v=>v.hidden=true);$('view-'+name).hidden=false;document.querySelectorAll('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='stammdaten'){renderMaterialMaster();renderSetupMaster()}if(name==='auftraege')renderOrders()}
function employeeHours(row){let b=row.querySelector('.emp-beginn').value,e=row.querySelector('.emp-ende').value,p=Number(row.querySelector('.emp-pause').value||0),out=row.querySelector('.emp-stunden');if(!b||!e){out.value='';return}let [bh,bm]=b.split(':').map(Number),[eh,em]=e.split(':').map(Number),mins=(eh*60+em)-(bh*60+bm)-p;if(mins<0)mins+=1440;out.value=(Math.max(0,mins)/60).toFixed(2).replace('.',',')}
function addEmployeeRow(data={}){let c=$('employeeRows'),r=document.createElement('div');r.className='employee-row';r.innerHTML=`<div class="employee-field employee-name-field"><label>Mitarbeiter</label><input class="emp-name" placeholder="Name des Mitarbeiters" value="${escapeHtml(data.name||'')}"></div><div class="employee-field"><label>Beginn</label><input class="emp-beginn" type="time" value="${data.beginn||''}"></div><div class="employee-field"><label>Ende</label><input class="emp-ende" type="time" value="${data.ende||''}"></div><div class="employee-field"><label>Pause (Min.)</label><input class="emp-pause" type="number" min="0" value="${data.pause??0}"></div><div class="employee-field"><label>Arbeitsstunden</label><input class="emp-stunden" readonly value="${data.stunden||''}"></div><button type="button" class="remove-row" aria-label="Mitarbeiter entfernen" onclick="this.parentElement.remove()">×</button>`;c.appendChild(r);r.querySelectorAll('input').forEach(x=>x.addEventListener('input',()=>employeeHours(r)));employeeHours(r)}
function employeeRowsData(){return [...document.querySelectorAll('#employeeRows .employee-row')].map(r=>({name:r.querySelector('.emp-name').value,beginn:r.querySelector('.emp-beginn').value,ende:r.querySelector('.emp-ende').value,pause:r.querySelector('.emp-pause').value,stunden:r.querySelector('.emp-stunden').value}))}
function restoreEmployees(rows){$('employeeRows').innerHTML='';(rows&&rows.length?rows:[{}]).forEach(addEmployeeRow)}
function calcHours(){}
function input(ph,val,cls){let x=document.createElement('input');x.placeholder=ph;x.value=val||'';if(cls)x.className=cls;return x}
function delButton(row,calc){let b=document.createElement('button');b.type='button';b.className='delete';b.textContent='×';b.onclick=()=>{row.remove();calc()};return b}
function addCostRow(target,desc='',amount=''){let r=document.createElement('div');r.className='costrow';let d=input('Beschreibung',desc),a=input('0,00',amount,'money');a.inputMode='decimal';a.addEventListener('input',calcCosts);r.append(d,a,delButton(r,calcCosts));$(target).appendChild(r);calcCosts()}
function calcCosts(){let total=[...$('fahrtkosten').querySelectorAll('.money')].reduce((s,x)=>s+num(x.value),0);$('fahrtSum').textContent=euro(total);let setup=[...$('baustellenkosten').querySelectorAll('.setuprow')].reduce((s,r)=>s+num(r.querySelector('.qty').value)*num(r.querySelector('.ep').value),0);$('baustelleSum').textContent=euro(setup)}
function makeSuggestInput(ph,value,listGetter,onPick){let wrap=document.createElement('div');wrap.className='suggest-wrap';let x=input(ph,value,'search-input');let box=document.createElement('div');box.className='suggestions';wrap.append(x,box);function hide(){setTimeout(()=>box.classList.remove('open'),120)}function render(){let q=x.value.trim().toLocaleLowerCase('de');let items=listGetter().filter(i=>!q||i.name.toLocaleLowerCase('de').includes(q)).slice(0,12);box.innerHTML='';items.forEach(i=>{let b=document.createElement('button');b.type='button';b.className='suggestion';b.innerHTML=`<strong>${escapeHtml(i.name)}</strong><small>${escapeHtml(i.article||'')}${i.unit?' · '+escapeHtml(i.unit):''}${i.price!==''&&i.price!=null?' · '+euro(i.price):''}</small>`;b.onclick=()=>{x.value=i.name;box.classList.remove('open');onPick(i)};box.appendChild(b)});box.classList.toggle('open',items.length>0)}x.addEventListener('input',render);x.addEventListener('focus',render);x.addEventListener('blur',hide);return {wrap,input:x}}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addMaterial(v='',m='',unit='',ep=''){let r=document.createElement('div');r.className='matrow';let b=input('Menge',m,'qty'),u=input('Einheit',unit,'unit'),c=input('0,00',ep,'ep money'),g=document.createElement('output');g.className='line-total';g.textContent='0,00 €';let s=makeSuggestInput('Material suchen …',v,()=>materialMaster,i=>{u.value=i.unit||'';c.value=String(i.price??'').replace('.',',');calcMaterial()});b.inputMode='decimal';c.inputMode='decimal';b.addEventListener('input',calcMaterial);c.addEventListener('input',calcMaterial);r.append(s.wrap,b,u,c,g,delButton(r,calcMaterial));$('material').appendChild(r);calcMaterial()}
function calcMaterial(){let sum=0;document.querySelectorAll('.matrow').forEach(r=>{let q=num(r.querySelector('.qty').value),epRaw=r.querySelector('.ep').value.trim(),p=num(epRaw),t=q*p;r.querySelector('.line-total').textContent=(epRaw&&q?'':epRaw?'0,00 €':'');sum+=t});$('materialSum').textContent=euro(sum)}
function addSetupRow(v='',m='',unit='',ep=''){let r=document.createElement('div');r.className='setuprow';let b=input('Menge',m,'qty'),u=input('Einheit',unit,'unit'),c=input('0,00',ep,'ep money'),g=document.createElement('output');g.className='line-total';g.textContent='0,00 €';let s=makeSuggestInput('Einrichtung suchen …',v,()=>setupMaster,i=>{u.value=i.unit||'';c.value=String(i.price??'').replace('.',',');calcCosts()});b.inputMode='decimal';c.inputMode='decimal';b.addEventListener('input',calcCosts);c.addEventListener('input',calcCosts);r.append(s.wrap,b,u,c,g,delButton(r,calcCosts));$('baustellenkosten').appendChild(r);calcSetupRows()}
function calcSetupRows(){document.querySelectorAll('.setuprow').forEach(r=>{let q=num(r.querySelector('.qty').value),epRaw=r.querySelector('.ep').value.trim(),t=q*num(epRaw);r.querySelector('.line-total').textContent=(epRaw&&q?euro(t):'')});calcCosts()}
document.addEventListener('input',e=>{if(e.target.closest('.setuprow'))calcSetupRows()});
function saveMasters(){localStorage.setItem(MATERIAL_KEY,JSON.stringify(materialMaster));localStorage.setItem(SETUP_KEY,JSON.stringify(setupMaster))}
function addMaterialMaster(){materialMaster.push({id:uid(),name:'',article:'',unit:'Stk.',price:''});saveMasters();renderMaterialMaster();setTimeout(()=>$('materialMaster').lastElementChild?.querySelector('input')?.focus(),0)}
function addSetupMaster(){setupMaster.push({id:uid(),name:'',unit:'Stk.',price:''});saveMasters();renderSetupMaster();setTimeout(()=>$('setupMaster').lastElementChild?.querySelector('input')?.focus(),0)}
function renderMaterialMaster(){$('materialMaster').innerHTML='';if(!materialMaster.length)$('materialMaster').innerHTML='<p class="empty-state">Noch keine Materialien angelegt.</p>';materialMaster.forEach(item=>{let r=document.createElement('div');r.className='masterrow materialmasterrow';[['name','Material'],['article','Art.-Nr.'],['unit','Einheit'],['price','0,00']].forEach(([key,ph])=>{let x=input(ph,item[key]);if(key==='price'){x.inputMode='decimal';x.className='money'}x.oninput=()=>{item[key]=x.value;saveMasters()};r.appendChild(x)});let d=delButton(r,()=>{materialMaster=materialMaster.filter(x=>x.id!==item.id);saveMasters();renderMaterialMaster()});r.appendChild(d);$('materialMaster').appendChild(r)})}
function renderSetupMaster(){$('setupMaster').innerHTML='';if(!setupMaster.length)$('setupMaster').innerHTML='<p class="empty-state">Noch keine Positionen angelegt.</p>';setupMaster.forEach(item=>{let r=document.createElement('div');r.className='masterrow setupmasterrow';[['name','Bezeichnung'],['unit','Einheit'],['price','0,00']].forEach(([key,ph])=>{let x=input(ph,item[key]);if(key==='price'){x.inputMode='decimal';x.className='money'}x.oninput=()=>{item[key]=x.value;saveMasters()};r.appendChild(x)});let d=delButton(r,()=>{setupMaster=setupMaster.filter(x=>x.id!==item.id);saveMasters();renderSetupMaster()});r.appendChild(d);$('setupMaster').appendChild(r)})}
addCostRow('fahrtkosten');addSetupRow();addMaterial();addMaterial();addMaterial();
const signatureState={sigKunde:{},sigFirma:{}};
function setupCanvas(id){
 const c=$(id); if(!c)return;
 const ctx=c.getContext('2d'); let drawing=false;
 function sizeCanvas(){
   const r=c.getBoundingClientRect(), old=c.toDataURL();
   const w=Math.max(300,Math.round(r.width*devicePixelRatio)), h=Math.max(140,Math.round(r.height*devicePixelRatio));
   c.width=w; c.height=h; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
   ctx.strokeStyle='#1769d1'; ctx.fillStyle='#1769d1'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.lineJoin='round';
   if(old && old!=='data:,'){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,r.width,r.height);img.src=old;}
 }
 function point(e){const r=c.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top];}
 function begin(e){e.preventDefault(); if(e.pointerId!=null)c.setPointerCapture?.(e.pointerId); const p=point(e); drawing=true; ctx.beginPath(); ctx.moveTo(p[0],p[1]);}
 function draw(e){if(!drawing)return; e.preventDefault(); const p=point(e); ctx.lineTo(p[0],p[1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p[0],p[1]);}
 function end(e){if(e?.preventDefault)e.preventDefault(); drawing=false;}
 sizeCanvas();
 c.addEventListener('pointerdown',begin,{passive:false}); c.addEventListener('pointermove',draw,{passive:false}); c.addEventListener('pointerup',end,{passive:false}); c.addEventListener('pointercancel',end,{passive:false}); c.addEventListener('pointerleave',end,{passive:false});
 c.addEventListener('contextmenu',e=>e.preventDefault());
 window.addEventListener('resize',sizeCanvas);
}
function signatureData(id){const c=$(id);return c?c.toDataURL('image/png'):''}
function restoreSignature(id,data){const c=$(id);if(!c)return;if(!data){clearSig(id);return}const img=new Image();img.onload=()=>{const ctx=c.getContext('2d'),r=c.getBoundingClientRect();ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,r.width,r.height);ctx.strokeStyle='#1769d1';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round'};img.src=data}
function clearSig(id){const c=$(id);if(!c)return;const ctx=c.getContext('2d');ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.restore();ctx.strokeStyle='#1769d1';ctx.fillStyle='#1769d1';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round'}
function startSig(){return true} function lockSig(){return true} function unlockSig(){return true} function hasSignature(id){const c=$(id);if(!c)return false;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=3;i<d.length;i+=4)if(d[i]>10)return true;return false}
setupCanvas('sigKunde');setupCanvas('sigFirma');


// Sprache-zu-Text für „Ausgeführte Arbeiten“ – nutzt die im Browser verfügbare Spracherkennung.
let speechRecognition=null;
let speechListening=false;
let speechBaseText='';
function speechSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function toggleSpeechToText(){
  const btn=$('voiceArbeitenBtn'), status=$('voiceArbeitenStatus'), area=$('arbeiten');
  if(!speechSupported()){
    if(status) status.textContent='Spracherkennung wird von diesem Browser nicht unterstützt.';
    alert('Die Spracheingabe wird von diesem Browser nicht unterstützt. Bitte Chrome oder einen unterstützten Browser verwenden.');
    return;
  }
  if(speechListening){speechRecognition?.stop(); return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  speechRecognition=new SR();
  speechRecognition.lang='de-DE';
  speechRecognition.continuous=false;
  speechRecognition.interimResults=true;
  speechBaseText=area.value.trim();
  speechRecognition.onstart=()=>{speechListening=true;btn.classList.add('recording');btn.textContent='⏹️ Aufnahme stoppen';if(status)status.textContent='Ich höre zu …';};
  speechRecognition.onresult=(event)=>{
    let finalText='', interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const text=event.results[i][0].transcript;
      if(event.results[i].isFinal) finalText+=text; else interim+=text;
    }
    const combined=[speechBaseText,finalText].filter(Boolean).join(speechBaseText&&finalText?' ':'');
    area.value=combined+(interim?(combined?' ':'')+interim:'');
    area.dispatchEvent(new Event('input',{bubbles:true}));
  };
  speechRecognition.onerror=(event)=>{
    speechListening=false;btn.classList.remove('recording');btn.textContent='🎤 Spracheingabe';
    const msg=event.error==='not-allowed'?'Mikrofonzugriff wurde nicht erlaubt.':event.error==='no-speech'?'Keine Sprache erkannt. Bitte erneut versuchen.':'Spracheingabe konnte nicht gestartet werden.';
    if(status)status.textContent=msg;
  };
  speechRecognition.onend=()=>{speechListening=false;btn.classList.remove('recording');btn.textContent='🎤 Spracheingabe';if(status)status.textContent='Spracheingabe beendet.';};
  try{speechRecognition.start();}catch(e){speechListening=false;btn.classList.remove('recording');btn.textContent='🎤 Spracheingabe';if(status)status.textContent='Spracheingabe konnte nicht gestartet werden.';}
}

function rowsData(id){return [...$(id).children].filter(r=>r.querySelector('input')).map(r=>[...r.querySelectorAll('input')].map(x=>x.value))}
function saveLocal(){let ids=['kunde','telefon','email','kontakt','datum','objekt','arbeiten'];let data={employees:employeeRowsData(),rows:{fahrtkosten:rowsData('fahrtkosten'),baustellenkosten:rowsData('baustellenkosten'),material:rowsData('material')}};ids.forEach(i=>data[i]=$(i).value);localStorage.setItem('dachwerkAuftrag',JSON.stringify(data));alert('Auftrag wurde auf diesem Gerät zwischengespeichert. Bilder werden aus Speichergründen nicht mitgespeichert.')}
function restoreRows(id,rows,fn){$(id).innerHTML='';(rows&&rows.length?rows:[[]]).forEach(x=>fn(...x))}
function load(){let d=readJSON('dachwerkAuftrag',null);if(!d)return;['kunde','telefon','email','kontakt','datum','objekt','arbeiten'].forEach(i=>{if(d[i]!=null)$(i).value=d[i]});restoreEmployees(d.employees); if(d.rows){restoreRows('fahrtkosten',d.rows.fahrtkosten,(...x)=>addCostRow('fahrtkosten',...x));restoreRows('baustellenkosten',d.rows.baustellenkosten,(...x)=>addSetupRow(...x));restoreRows('material',d.rows.material,(...x)=>addMaterial(...x))}calcCosts();calcSetupRows();calcMaterial()}
function addPhotos(e){[...e.target.files].forEach(file=>{let reader=new FileReader();reader.onload=ev=>{photos.push({src:ev.target.result,name:file.name});renderPhotos()};reader.readAsDataURL(file)});e.target.value=''}
function renderPhotos(){let box=$('photoPreview');box.innerHTML='';photos.forEach((p,i)=>{let d=document.createElement('div');d.className='photoitem';let im=document.createElement('img');im.src=p.src;im.alt=p.name;let b=document.createElement('button');b.textContent='×';b.type='button';b.onclick=()=>{photos.splice(i,1);renderPhotos()};d.append(im,b);box.appendChild(d)})}
function sendMail(){let subject=encodeURIComponent(`Auftrag ${$('kunde').value||''} – ${$('datum').value}`),body=encodeURIComponent(`Auftraggeber: ${$('kunde').value}\nObjekt: ${$('objekt').value}\nArbeitsstunden: ${$('stunden').value}\nMaterialsumme: ${$('materialSum').textContent}\nBaustelleneinrichtung: ${$('baustelleSum').textContent}\n\nBitte den zuvor als PDF gespeicherten Auftrag anhängen.`);location.href=`mailto:?subject=${subject}&body=${body}`}
renderMaterialMaster();renderSetupMaster();

// Auftragsverwaltung – echte Supabase-Version
// Aufträge werden ausschließlich in Supabase gespeichert, sobald ein Supabase-Login vorhanden ist.
// Keine lokalen Fake-Aufträge mehr: Dadurch bleiben Löschen und Änderungen nach einem Reload dauerhaft.
const ORDERS_KEY='dachwerkOrdersV1';
let orders=[], currentOrderId=null, orderFilter='active';
const DW_SB = ()=>window.dachwerkSupabase || null;

function statusText(s){return ({offen:'Offen',bearbeitung:'In Bearbeitung',erledigt:'Erledigt',abgeschlossen:'Abgeschlossen'})[s]||'Offen'}
function localSaveOrders(){try{localStorage.setItem(ORDERS_KEY,JSON.stringify(orders))}catch(e){}}
function clearLegacyLocalOrders(){try{localStorage.removeItem(ORDERS_KEY);localStorage.removeItem('dachwerkAuftrag')}catch(e){}}
function isUuid(v){return typeof v==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)}

async function loadOrdersFromSupabase(){
  const sb=DW_SB();
  if(!sb) return;
  const {data:sessionData}=await sb.auth.getSession();
  const user=sessionData?.session?.user;
  if(!user){orders=[];clearLegacyLocalOrders();renderOrders();return}
  const {data,error}=await sb.from('dachwerk_orders').select('*').order('updated_at',{ascending:false});
  if(error){
    console.error('Supabase-Aufträge konnten nicht geladen werden:',error);
    orders=[]; clearLegacyLocalOrders(); renderOrders();
    alert('Die Auftragsdatenbank ist noch nicht eingerichtet oder nicht erreichbar. Bitte zuerst das DACHWERK-SQL im Supabase SQL Editor ausführen.\n\nFehler: '+error.message);
    return;
  }
  orders=(data||[]).map(row=>{
    const payload=(row.order_data && typeof row.order_data==='object')?row.order_data:{};
    return {...payload,id:row.id,auftragsnr:row.order_number||payload.auftragsnr||'',kunde:row.customer??payload.kunde??'',objekt:row.object??payload.objekt??'',status:row.status||payload.status||'offen',updatedAt:row.updated_at||payload.updatedAt||new Date().toISOString(),createdAt:row.created_at||payload.createdAt||row.updated_at};
  });
  // Lokale Alt-Daten niemals erneut als Aufträge anzeigen.
  localSaveOrders();
  try{localStorage.removeItem('dachwerkAuftrag')}catch(e){}
  renderOrders();
  updateCurrentOrderLabel();
}

async function getNextSupabaseOrderNumber(){
  const sb=DW_SB();
  if(!sb) return nextOrderNumber();
  try{
    const {data,error}=await sb.rpc('next_dachwerk_order_number');
    if(!error && data) return String(data);
    if(error) console.warn('Auftragsnummer per Supabase nicht verfügbar:',error.message);
  }catch(e){console.warn(e)}
  return nextOrderNumber();
}

function orderRowsData(id){return [...$(id).children].filter(r=>r.querySelector('input')).map(r=>[...r.querySelectorAll('input')].map(x=>x.value))}
function collectOrder(){
  return {
    id:currentOrderId||null,
    auftragsnr:$('auftragsnr').value.trim(),
    kunde:$('kunde').value.trim(),
    telefon:$('telefon').value.trim(),
    email:$('email').value.trim(),
    kontakt:[$('telefon').value.trim(),$('email').value.trim()].filter(Boolean).join(' · ')||$('kontakt')?.value.trim()||'',
    datum:$('datum').value,
    objekt:$('objekt').value.trim(),
    arbeiten:$('arbeiten').value,
    status:$('status').value,
    signOrt:$('signOrt').value.trim(),
    signDatum:$('signDatum').value,
    signatures:{kunde:signatureData('sigKunde'),firma:signatureData('sigFirma')},
    employees:employeeRowsData(),
    rows:{fahrtkosten:orderRowsData('fahrtkosten'),baustellenkosten:orderRowsData('baustellenkosten'),material:orderRowsData('material')},
    updatedAt:new Date().toISOString()
  }
}

async function saveOrder(showAlert=true){
  const d=collectOrder();
  if(!d.kunde&&!d.objekt&&!d.auftragsnr){alert('Bitte mindestens Auftraggeber, Objekt oder Auftragsnummer eintragen.');return false;}
  const sb=DW_SB();
  if(!sb){alert('Supabase ist nicht geladen. Bitte Seite neu laden.');return false;}
  const {data:sessionData}=await sb.auth.getSession();
  const user=sessionData?.session?.user;
  if(!user){alert('Bitte zuerst anmelden.');return false;}
  if(!d.auftragsnr){d.auftragsnr=await getNextSupabaseOrderNumber();$('auftragsnr').value=d.auftragsnr;}
  const orderData={...d}; delete orderData.id;
  const payload={order_number:d.auftragsnr,user_id:user.id,status:d.status||'offen',customer:d.kunde||'',object:d.objekt||'',order_data:orderData};
  let result;
  if(d.id && isUuid(d.id)) result=await sb.from('dachwerk_orders').update(payload).eq('id',d.id).select('*').single();
  else result=await sb.from('dachwerk_orders').insert(payload).select('*').single();
  if(result.error){console.error(result.error);alert('Auftrag konnte nicht in Supabase gespeichert werden: '+result.error.message);return false;}
  const row=result.data;
  d={...orderData,id:row.id,auftragsnr:row.order_number,status:row.status,kunde:row.customer,objekt:row.object,updatedAt:row.updated_at,createdAt:row.created_at};
  currentOrderId=d.id;
  await loadOrdersFromSupabase();
  updateCurrentOrderLabel();
  if(showAlert)alert('Auftrag gespeichert. Er ist jetzt zentral in Supabase gespeichert.');
  return true;
}

function resetOrderForm(){
  ['auftragsnr','kunde','telefon','email','kontakt','objekt','arbeiten'].forEach(i=>{if($(i))$(i).value=''});
  $('auftragsnr').value=''; restoreEmployees(); $('datum').value=new Date().toISOString().slice(0,10); $('status').value='offen';
  $('fahrtkosten').innerHTML='';$('baustellenkosten').innerHTML='';$('material').innerHTML='';
  addCostRow('fahrtkosten');addSetupRow();addMaterial();addMaterial();addMaterial();photos=[];renderPhotos();
  clearSig('sigKunde',true);clearSig('sigFirma',true);$('signOrt').value='';$('signDatum').value=new Date().toISOString().slice(0,10);
  calcCosts();calcSetupRows();calcMaterial();
}
function newOrder(){currentOrderId=null;resetOrderForm();updateCurrentOrderLabel();showView('auftrag')}

async function openOrder(id){
  if(!isUuid(id)){alert('Dieser alte lokale Auftrag ist nicht mehr gültig. Bitte einen Auftrag aus Supabase öffnen.');return;}
  const sb=DW_SB(); if(!sb)return;
  const {data,error}=await sb.from('dachwerk_orders').select('*').eq('id',id).single();
  if(error||!data){alert('Auftrag konnte nicht geladen werden: '+(error?.message||'unbekannter Fehler'));return;}
  const d={...(data.order_data||{}),id:data.id,auftragsnr:data.order_number,status:data.status,kunde:data.customer,objekt:data.object,updatedAt:data.updated_at,createdAt:data.created_at};
  currentOrderId=id;
  ['auftragsnr','kunde','telefon','email','kontakt','datum','objekt','arbeiten'].forEach(i=>{if($(i)&&d[i]!=null)$(i).value=d[i]});
  if(!d.telefon&&!d.email&&d.kontakt){let parts=String(d.kontakt).split(' · ');if($('telefon'))$('telefon').value=parts[0]||'';if($('email'))$('email').value=parts[1]||'';}
  restoreEmployees(d.employees);$('status').value=d.status||'offen';
  if(d.rows){restoreRows('fahrtkosten',d.rows.fahrtkosten,(...x)=>addCostRow('fahrtkosten',...x));restoreRows('baustellenkosten',d.rows.baustellenkosten,(...x)=>addSetupRow(...x));restoreRows('material',d.rows.material,(...x)=>addMaterial(...x));}
  photos=[];renderPhotos();
  $('signOrt').value=d.signOrt || (d.signOrtDatum||'').split(',')[0].trim();
  $('signDatum').value=d.signDatum || (d.signOrtDatum||'').split(',').slice(1).join(',').trim() || d.datum || new Date().toISOString().slice(0,10);
  calcCosts();calcSetupRows();calcMaterial();updateCurrentOrderLabel();showView('auftrag');
  setTimeout(()=>{restoreSignature('sigKunde',d.signatures?.kunde);restoreSignature('sigFirma',d.signatures?.firma)},40);
}

async function deleteOrder(id){
  if(!isUuid(id)){orders=orders.filter(x=>x.id!==id);localSaveOrders();renderOrders();return;}
  if(!confirm('Auftrag wirklich löschen?'))return;
  const sb=DW_SB(); if(!sb){alert('Supabase ist nicht geladen.');return;}
  const {error}=await sb.from('dachwerk_orders').delete().eq('id',id);
  if(error){alert('Auftrag konnte nicht gelöscht werden: '+error.message);return;}
  orders=orders.filter(x=>x.id!==id); localSaveOrders();
  if(currentOrderId===id)currentOrderId=null;
  renderOrders();updateCurrentOrderLabel();
}

function updateCurrentOrderLabel(){let d=orders.find(x=>x.id===currentOrderId);$('currentOrderLabel').textContent=d?(d.auftragsnr?d.auftragsnr+' · ':'')+(d.kunde||d.objekt||'Auftrag'):'Neuer Auftrag'}
function setOrderFilter(f,b){orderFilter=f;document.querySelectorAll('.filterbtn').forEach(x=>x.classList.toggle('active',x===b));renderOrders()}
function renderOrders(){
  if(!$('orderList'))return;
  let list=orders.slice().sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
  if(orderFilter==='active')list=list.filter(x=>['offen','bearbeitung'].includes(x.status||'offen'));
  const box=$('orderList');box.innerHTML='';
  if(!list.length){box.innerHTML='<div class="empty-orders">Keine passenden Aufträge vorhanden.<br><br><button class="primary" onclick="newOrder()">Ersten Auftrag anlegen</button></div>';return}
  const groups=[['offen','Offen'],['bearbeitung','In Bearbeitung'],['erledigt','Erledigt'],['abgeschlossen','Abgeschlossen']];
  groups.forEach(([status,title])=>{const items=list.filter(d=>(d.status||'offen')===status);if(!items.length)return;const section=document.createElement('section');section.className='order-status-group';section.innerHTML='<div class="order-status-heading"><h3>'+title+'</h3><span>'+items.length+'</span></div><div class="order-status-list"></div>';const listBox=section.querySelector('.order-status-list');items.forEach(d=>{let el=document.createElement('div');el.className='orderitem';let titleText=escapeHtml(d.kunde||d.objekt||'Auftrag ohne Bezeichnung');let nr=d.auftragsnr?'<span>Nr. '+escapeHtml(d.auftragsnr)+'</span>':'';el.innerHTML='<div><h3>'+titleText+'</h3><div class="ordermeta">'+nr+'<span>'+escapeHtml(d.objekt||'Kein Objekt')+'</span><span>'+escapeHtml(d.datum||'Kein Datum')+'</span><span class="statusbadge status-'+escapeHtml(d.status||'offen')+'">'+statusText(d.status)+'</span></div></div><div class="order-actions"><button class="primary openorder">Öffnen</button><button class="danger delorder">Löschen</button></div>';el.querySelector('.openorder').onclick=()=>openOrder(d.id);el.querySelector('.delorder').onclick=()=>deleteOrder(d.id);listBox.appendChild(el)});box.appendChild(section)});
}



/* =========================================================
   PDF / Druckfunktion
   Die Funktion baut eine eigene A4-Druckansicht auf und nutzt
   den nativen Druck-/PDF-Dialog des Geräts. Dadurch funktioniert
   sie auch ohne externe PDF-Bibliothek.
   ========================================================= */
function pdfEsc(v){
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function pdfMoney(v){
  const raw=String(v??'').trim();
  if(!raw) return '';
  return euro(num(raw));
}
function buildPdfSheet(){
  const sheet=$('pdfSheet');
  if(!sheet) return false;
  const d=collectOrder();
  const employeeRows=(d.employees||[]).filter(x=>x.name||x.beginn||x.ende||x.pause||x.stunden);
  const matRows=[...document.querySelectorAll('#material .matrow')].map(r=>({
    name:r.querySelector('.search-input')?.value||'',
    qty:r.querySelector('.qty')?.value||'',
    unit:r.querySelector('.unit')?.value||'',
    ep:r.querySelector('.ep')?.value||'',
    total:(r.querySelector('.line-total')?.textContent||'').trim()
  })).filter(x=>x.name||x.qty||x.ep);
  const setupRows=[...document.querySelectorAll('#baustellenkosten .setuprow')].map(r=>({
    name:r.querySelector('.search-input')?.value||'',
    qty:r.querySelector('.qty')?.value||'',
    unit:r.querySelector('.unit')?.value||'',
    ep:r.querySelector('.ep')?.value||'',
    total:(r.querySelector('.line-total')?.textContent||'').trim()
  })).filter(x=>x.name||x.qty||x.ep);
  const travelRows=[...document.querySelectorAll('#fahrtkosten .costrow')].map(r=>({
    name:r.querySelector('input')?.value||'', amount:r.querySelector('.money')?.value||''
  })).filter(x=>x.name||x.amount);
  const sigKunde=d.signatures?.kunde||'';
  const sigFirma=d.signatures?.firma||'';
  const employeesHtml=employeeRows.length ? `<table><thead><tr><th>Mitarbeiter</th><th>Beginn</th><th>Ende</th><th>Pause (Min.)</th><th>Arbeitsstunden</th></tr></thead><tbody>${employeeRows.map(x=>`<tr><td>${pdfEsc(x.name)}</td><td class="num">${pdfEsc(x.beginn)}</td><td class="num">${pdfEsc(x.ende)}</td><td class="num">${pdfEsc(x.pause)}</td><td class="num">${pdfEsc(x.stunden)}</td></tr>`).join('')}</tbody></table>` : '<div class="pdf-empty">Keine Mitarbeiterzeiten eingetragen.</div>';
  const rowsTable=(rows)=>rows.length ? `<table><thead><tr><th>Position</th><th>Menge</th><th>Einheit</th><th>EP</th><th>Gesamt</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${pdfEsc(x.name)}</td><td class="num">${pdfEsc(x.qty)}</td><td class="num">${pdfEsc(x.unit)}</td><td class="num">${pdfEsc(pdfMoney(x.ep))}</td><td class="num">${pdfEsc(x.total)}</td></tr>`).join('')}</tbody></table>` : '<div class="pdf-empty">Keine Positionen eingetragen.</div>';
  const travelHtml=travelRows.length ? `<table><thead><tr><th>Beschreibung</th><th>Betrag</th></tr></thead><tbody>${travelRows.map(x=>`<tr><td>${pdfEsc(x.name)}</td><td class="num">${pdfEsc(pdfMoney(x.amount))}</td></tr>`).join('')}</tbody></table>` : '<div class="pdf-empty">Keine Fahrtkosten eingetragen.</div>';
  const photoHtml=photos.length ? `<section class="pdf-photos"><div class="pdf-section"><h2>Baustellenfotos</h2></div><div class="pdf-photo-grid">${photos.map(p=>`<div class="pdf-photo"><img src="${p.src}" alt="${pdfEsc(p.name)}"></div>`).join('')}</div></section>` : '';
  sheet.innerHTML=`
    <div class="pdf-header">
      <div class="pdf-brand"><img src="dachwerk-logo-transparent.png" alt="DACHWERK"></div>
      <div class="pdf-company"><b>JONAS DITTERT | BAUNATAL</b><br><span>Lübecker Straße 21 · 34225 Baunatal<br>0151 127 055 88 · info@dachwerk.biz<br>www.dachwerk.biz</span></div>
      <div class="pdf-title"><strong>DACHWERK</strong><span>AUFTRAG / SERVICEBERICHT</span></div>
    </div>
    <div class="pdf-rule"></div>
    <div class="pdf-meta three">
      <div><small>Auftragsnummer</small><strong>${pdfEsc(d.auftragsnr||'')}</strong></div>
      <div><small>Auftraggeber</small><strong>${pdfEsc(d.kunde||'')}</strong></div>
      <div><small>Datum</small><strong>${pdfEsc(d.datum||'')}</strong></div>
    </div>
    <div class="pdf-meta two">
      <div><small>Telefon</small><strong>${pdfEsc(d.telefon||'')}</strong></div>
      <div><small>E-Mail</small><strong>${pdfEsc(d.email||'')}</strong></div>
    </div>
    <div class="pdf-object"><small>Objekt / Baustelle / Adresse</small><strong>${pdfEsc(d.objekt||'')}</strong></div>
    <section class="pdf-section"><h2>Ausgeführte Arbeiten</h2><div class="worktext">${pdfEsc(d.arbeiten||'').replace(/\n/g,'<br>')||'Keine Beschreibung eingetragen.'}</div></section>
    <section class="pdf-section"><h2>Mitarbeiter Zeiterfassung</h2>${employeesHtml}</section>
    <section class="pdf-section"><h2>Fahrtkosten</h2>${travelHtml}<div class="pdf-sum">Summe Fahrtkosten <b>${pdfEsc($('fahrtSum')?.textContent||'0,00 €')}</b></div></section>
    <section class="pdf-section"><h2>Baustelleneinrichtung</h2>${rowsTable(setupRows)}<div class="pdf-sum">Summe Baustelleneinrichtung <b>${pdfEsc($('baustelleSum')?.textContent||'0,00 €')}</b></div></section>
    <section class="pdf-section"><h2>Material</h2>${rowsTable(matRows)}<div class="pdf-sum">Materialsumme <b>${pdfEsc($('materialSum')?.textContent||'0,00 €')}</b></div></section>
    <section class="pdf-confirm"><h2>Kundenbestätigung</h2><p class="confirm-intro">Der Auftraggeber bestätigt mit seiner Unterschrift die oben aufgeführten Angaben und Leistungen.</p><div class="confirm-grid"><div class="place"><small>Ort</small><strong>${pdfEsc(d.signOrt||'')}</strong><small>Datum</small><strong>${pdfEsc(d.signDatum||d.datum||'')}</strong></div><div class="sig"><small>Unterschrift Auftraggeber</small>${sigKunde?`<img src="${sigKunde}" alt="Unterschrift Auftraggeber">`:'<div class="sig-empty"></div>'}</div><div class="sig"><small>Unterschrift Mitarbeiter</small>${sigFirma?`<img src="${sigFirma}" alt="Unterschrift Mitarbeiter">`:'<div class="sig-empty"></div>'}</div></div><p>Der Auftraggeber erklärt mit Unterschrift die ordnungsgemäße Ausführung der Arbeiten.</p><p>Mit Auftragserteilung erklärt sich der Auftraggeber mit unseren Geschäftsbedingungen einverstanden. Es gelten die Stundensätze, die auf unserer Internetseite veröffentlicht sind. Die Arbeitszeit beginnt mit Verlassen unseres Betriebes in Baunatal und endet bei Rückkehr. Materialkosten werden je nach Verbrauch in Rechnung gestellt. Da es sich bei Arbeiten an Dächern um eine sehr gefahrenträchtige Arbeit handelt, entstehen Kosten der Baustelleneinrichtung. Die Baustelleneinrichtung beinhaltet Sicherungsmaßnahmen unterschiedlicher Art, die vom Gesetzgeber bei Dacharbeiten vorgeschrieben sind. Auch bei Festpreisangeboten können Zusatzkosten entstehen. Sie erhalten eine Rechnung von uns, die Zahlung ist dann innerhalb 8 Tagen ohne Abzug fällig. Unsere aktuellen Stundensätze und vollständigen Geschäftsbedingungen können Sie jederzeit auf unserer Internetseite einsehen.</p><div class="pdf-footer"><span>GF: Jonas Dittert · AG Fritzlar HRB 12775 · USt.-ID-Nr.: DE349017021</span><span>www.dachwerk.biz</span></div></section>
    ${photoHtml}`;
  return true;
}
function createAndSendPDF(){
  try{
    calcCosts(); calcSetupRows(); calcMaterial();
    if(!buildPdfSheet()){alert('PDF konnte nicht vorbereitet werden.');return;}
    document.body.classList.add('printing-pdf');
    const cleanup=()=>{document.body.classList.remove('printing-pdf');const s=$('pdfSheet');if(s)s.innerHTML='';window.removeEventListener('afterprint',cleanup);};
    window.addEventListener('afterprint',cleanup);
    setTimeout(()=>window.print(),120);
  }catch(err){
    console.error('PDF-Erstellung fehlgeschlagen:',err);
    document.body.classList.remove('printing-pdf');
    alert('PDF konnte nicht erstellt werden: '+(err?.message||err));
  }
}

// Keine automatische Wiederbelebung alter localStorage-Aufträge mehr.
// Ein alter Entwurf wird nur noch über den bestehenden manuellen Entwurfsbutton gespeichert.
clearLegacyLocalOrders();
orders=[];
renderOrders();updateCurrentOrderLabel();
if($('auftragsnr')&&!$('auftragsnr').value)$('auftragsnr').value='';
window.addEventListener('DOMContentLoaded',async()=>{if(!$('employeeRows').children.length)addEmployeeRow();await loadOrdersFromSupabase()});
