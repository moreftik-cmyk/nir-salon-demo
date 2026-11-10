const fs=require('fs'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8'); let errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://example.test/',beforeParse(w){w.alert=()=>{};w.confirm=()=>true;w.scrollTo=()=>{};w.open=()=>{};w.navigator.clipboard={writeText:async()=>{}};w.requestAnimationFrame=fn=>setTimeout(fn,0);}});
dom.window.addEventListener('error',e=>errors.push(e.error||e.message));
const w=dom.window;
for(const tab of ['dashboard','leads','new','customers','calendar']){w.setTab(tab); if(!w.document.querySelector('#app').textContent.trim()) throw new Error(`empty tab ${tab}`);}
w.setTab('calendar'); if(!w.document.querySelector('.week-board')) throw new Error('weekly calendar missing'); if(w.document.querySelectorAll('.day-head').length!==7) throw new Error('weekly day columns missing');
w.setTab('new'); const form=w.document.querySelector('.lead-form'); if(!form) throw new Error('form missing');
form.querySelector('[name=name]').value='בדיקת מערכת'; form.querySelector('[name=phone]').value='050-1111111'; form.querySelector('[name=service]').value='החלקה'; form.querySelector('[name=slots]').value='מחר אחרי 16:00'; form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
if(!w.state.leads.some(l=>l.name==='בדיקת מערכת')) throw new Error('lead not created');
w.setTab('leads'); const first=w.state.leads[0]; w.selectLead(first.id); w.updateStatus(first.id,'booked');
if(!w.state.bookings.some(b=>b.name===first.name)) throw new Error('booking not created');
if(errors.length) throw new Error(`browser errors: ${errors.map(String).join('; ')}`);
console.log(`smoke ok: ${w.state.leads.length} leads, ${w.state.bookings.length} bookings, 0 errors`);
