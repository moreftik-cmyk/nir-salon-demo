const fs=require('fs');
const ui=fs.readFileSync('ui.html','utf8');
const core=fs.readFileSync('core.js','utf8');
const required=['WhatsApp','קליטת פנייה חדשה','תיעדוף','function submitLead','function openWhatsApp'];
for(const marker of required) if(!core.includes(marker)&&!ui.includes(marker)) throw new Error(`missing marker: ${marker}`);
fs.writeFileSync('index.html',ui.replace('/*CORE*/',()=>core));
console.log('bundled index.html');
