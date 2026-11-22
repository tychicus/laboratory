
// Fictional disk and custom recovery program; no access to the visitor's filesystem.
function createFloppy(restoredInitially=false){
  let restored=restoredInitially, awaiting=false;
  const files={
    'SYSTEM.DAT':{size:2048,date:'06-13-83',text:'RECEIVER CONFIGURATION\nSTATION: 04\nCHANNEL: 10.13\nOPERATOR: M. VALE\nAUTOMATIC RECORDING: ENABLED\n\nCHECKSUM ERROR AT OFFSET 0037'},
    'CONTACT.TXT':{size:917,date:'06-13-83',text:'FIELD NOTES / 13 JUN 1983\n\n10:13 - First contact. Three pulses, then a voice.\nThe antenna was disconnected.\n\n10:16 - Repeated the test with the receiver unplugged.\nThe voice repeated my name.\n\n14 JUN - The recording contains a second voice.\nIt is mine. I have not said those words yet.\n\n15 JUN - They removed the incident report from the\ndirectory. The disk never left my desk.\n\nM.V.'},
    'SIGNAL.DAT':{size:16384,date:'06-14-83',text:'SIGNAL CAPTURE / CHANNEL 10.13\n\n03 03 03  /  00 37 00  /  03 03 03\n[UNREADABLE DATA]\n\nTRANSCRIPT FRAGMENT:\nDO NOT ANSWER WITH YOUR NAME.\n\nEND OF CAPTURE'},
    'README.TXT':{size:312,date:'06-14-83',text:'STATION 04 / MEDIA NOTES\n\nKeep this disk away from magnetic fields.\nDo not write new data over missing records.\n\nDeleting a directory entry does not erase its\nsectors. The old maintenance utility is still\non this disk. There may be something left.\n\nSpare ribbon in the lower drawer.\nCoffee is not a disk-cleaning solution.\n\nM.V.'},
    'RECOVER.EXE':{size:8192,date:'06-15-83',text:'This program cannot be displayed as text.'},
    'INCIDENT.TXT':{size:1536,date:'06-15-83',text:'INCIDENT 001 / 15 JUN 1983\nSTATION 04 - RESTRICTED\n\nThe signal did not originate above the facility.\nIt originated inside a sealed evidence locker.\n\nContents: one comic book, issue 37.\nPublisher records show that issue was never printed.\nIts cover depicts this room. The clock reads 10:13.\nThere are three people in the picture.\nOnly two of us were here.\n\nThe third figure is standing behind me.\n\nI separated the cover from this report and hid it\namong the ordinary collection. Find the missing\nissue. Look where the price should be.\nThe same crooked mark is there.\n\nDo not trust the date on the cover.\n\nM. VALE\n\nDELETION AUTHORIZED BY: [REDACTED]'}
  };
  const names=()=>Object.keys(files).filter(n=>restored||n!=='INCIDENT.TXT');
  function path(s){return s.replace(/^A:\\?/i,'').replace(/^\\/,'').toUpperCase();}
  function execute(raw){
    const line=raw.trim().replace(/^A:\\>\s*/i,'');
    if(awaiting){
      if(/^y$/i.test(line)){awaiting=false;return {action:'restore'};}
      if(/^n$/i.test(line)){awaiting=false;return {text:'RESTORE CANCELLED.'};}
      return {text:'RESTORE FILE? Y/N',question:true};
    }
    if(!line)return {};
    const [rawCmd,...args]=line.split(/\s+/),cmd=path(rawCmd),arg=args.join(' ');
    if(cmd==='CLS')return {action:'clear'};
    if(cmd==='EXIT')return {action:'exit'};
    if(rawCmd.toUpperCase()==='A:')return {};
    if(/^[B-Z]:$/i.test(rawCmd))return {text:'Invalid drive specification'};
    if(cmd==='CD'||cmd==='CHDIR')return {text:!arg?'A:\\':/^(\\|\.\.?|A:\\)$/i.test(arg)?'':'Invalid directory'};
    if(cmd==='HELP'||cmd==='?')return {text:'DIR             Display disk directory\nTYPE filename   Display a text file\nCLS             Clear screen\nCD              Display current directory\nEXIT            Leave terminal\n\nEnter a program name to execute it.'};
    if(cmd==='DIR'){
      let pattern=path(arg||'*.*');
      if(pattern==='')pattern='*.*';
      const filter=new RegExp('^'+pattern.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i');
      const list=names().filter(n=>filter.test(n));
      if(!list.length)return {text:'File not found'};
      const rows=list.map(n=>{const [base,ext]=n.split('.');return base.padEnd(8)+' '+ext.padEnd(3)+' '+String(files[n].size).padStart(6)+' '+files[n].date;});
      return {text:' Volume in drive A has no label\n Directory of A:\\\n\n'+rows.join('\n')+'\n'+String(list.length).padStart(9)+' File(s)\n   '+(327680-names().reduce((sum,n)=>sum+files[n].size,0))+' bytes free'};
    }
    if(cmd==='TYPE'){
      if(!arg)return {text:'Required parameter missing'};
      const n=path(arg);
      return {text:names().includes(n)?files[n].text:'File not found'};
    }
    if(cmd==='RECOVER'||cmd==='RECOVER.EXE'){
      if(arg)return {text:'Invalid parameter'};
      if(restored)return {text:'RECOVERY UTILITY 1.03\nNO DELETED FILES FOUND'};
      return {action:'scan'};
    }
    return {text:'Bad command or file name'};
  }
  return {execute,requestRestore(){awaiting=true},completeRestore(){restored=true},cancel(){awaiting=false},get awaiting(){return awaiting},get restored(){return restored}};
}

(()=>{
  'use strict';
  const frame=document.getElementById('frame'), enter=document.getElementById('enter'), effects=document.getElementById('effects');
  // Permanent story epoch: preserve this exact instant in every future revision.
  // Absolute elapsed time survives refreshes, closed tabs, cleared storage and new devices.
  const SIGNAL_RETURN_EPOCH = Date.parse('2026-09-30T09:40:47-05:00');
  const signalClock=document.getElementById('signal-clock');
  function updateSignalClock(){
    const totalSeconds=Math.max(0,Math.floor((Date.now()-SIGNAL_RETURN_EPOCH)/1000));
    const days=Math.floor(totalSeconds/86400);
    const hours=Math.floor(totalSeconds%86400/3600);
    const minutes=Math.floor(totalSeconds%3600/60);
    const seconds=totalSeconds%60;
    const pad=value=>String(value).padStart(2,'0');
    signalClock.textContent=String(days).padStart(3,'0')+'D : '+pad(hours)+'H : '+pad(minutes)+'M : '+pad(seconds)+'S';
    signalClock.setAttribute('datetime','PT'+totalSeconds+'S');
    signalClock.setAttribute('aria-label',days+' days, '+hours+' hours, '+minutes+' minutes, '+seconds+' seconds since signal return');
  }
  updateSignalClock();
  window.setInterval(updateSignalClock,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateSignalClock();});
  window.addEventListener('pageshow',updateSignalClock);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let effectsOn=!reduced.matches;
  const monitor=document.getElementById('monitor-wear');
  let flickerTimer;
  function scheduleFlicker(){
    window.clearTimeout(flickerTimer);
    monitor.classList.remove('flicker');
    if(!effectsOn || reduced.matches || document.hidden)return;
    flickerTimer=window.setTimeout(()=>{
      if(!effectsOn || reduced.matches || document.hidden)return;
      monitor.classList.add('flicker');
    },16000+Math.random()*14000);
  }
  monitor.addEventListener('animationend',scheduleFlicker);
  document.addEventListener('visibilitychange',scheduleFlicker);
  function applyEffects(){document.body.classList.toggle('no-effects',!effectsOn);effects.setAttribute('aria-pressed',String(effectsOn));effects.textContent='CRT effects: '+(effectsOn?'on':'off');scheduleFlicker();}
  applyEffects();document.body.classList.add('boot');
  effects.addEventListener('click',()=>{effectsOn=!effectsOn;applyEffects();});
  reduced.addEventListener('change',()=>{if(reduced.matches){effectsOn=false;applyEffects();}});
  enter.addEventListener('click',()=>{
    document.getElementById('transmission').showModal();
  });
  document.getElementById('anomaly').addEventListener('click',()=>{document.getElementById('fragment').showModal();document.getElementById('dos-input').focus();});
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));

  const dosDialog=document.getElementById('fragment'),dosInput=document.getElementById('dos-input'),dosForm=document.getElementById('dos-form'),dosOutput=document.getElementById('dos-output'),dosScreen=document.getElementById('dos-screen'),dosLabel=document.getElementById('dos-prompt-label');
  const diskSaveKey='signal-archive.floppy-1983.restored.v1';
  let savedRestore=false;
  try{savedRestore=localStorage.getItem(diskSaveKey)==='yes';}catch{}
  const disk=createFloppy(savedRestore);
  let busy=false,sequence=0;
  const commandHistory=[];let historyIndex=0;
  const scrollTerminal=()=>{dosScreen.scrollTop=dosScreen.scrollHeight;};
  function printDOS(text){if(!text)return;const line=document.createElement('div');line.textContent=text;dosOutput.appendChild(line);while(dosOutput.children.length>180)dosOutput.firstChild.remove();scrollTerminal();}
  function promptDOS(){busy=false;dosForm.hidden=false;dosLabel.textContent=disk.awaiting?'? ':'A:\\>';dosInput.value='';if(dosDialog.open)dosInput.focus();scrollTerminal();}
  const pauseDOS=ms=>new Promise(resolve=>window.setTimeout(resolve,effectsOn&&!reduced.matches?ms:0));
  async function runDOS(raw){
    if(busy)return;
    printDOS((disk.awaiting?'? ':'A:\\>')+raw);
    if(raw.trim()){commandHistory.push(raw);if(commandHistory.length>80)commandHistory.shift();historyIndex=commandHistory.length;}
    dosInput.value='';const result=disk.execute(raw);
    if(result.action==='clear'){dosOutput.replaceChildren();promptDOS();return;}
    if(result.action==='exit'){dosDialog.close();return;}
    if(result.text)printDOS(result.text);
    if(result.action==='scan'||result.action==='restore'){
      busy=true;dosForm.hidden=true;const ticket=++sequence;
      if(result.action==='scan'){
        printDOS('RECOVERY UTILITY 1.03\nSCANNING MEDIA............');
        await pauseDOS(800);if(ticket!==sequence)return;
        printDOS('1 DELETED FILE FOUND\nRESTORE FILE? Y/N');disk.requestRestore();
      }else{
        printDOS('RESTORING...');
        await pauseDOS(650);if(ticket!==sequence)return;
        disk.completeRestore();
        try{localStorage.setItem(diskSaveKey,'yes');}catch{}
        printDOS('████████████████████ 100%\nFILE RESTORED:\nINCIDENT.TXT\n\nWARNING:\nTHIS FILE WAS DELETED\nBY ORDER OF [REDACTED]');
      }
    }
    promptDOS();
  }
  dosForm.addEventListener('submit',event=>{event.preventDefault();runDOS(dosInput.value);});
  dosInput.addEventListener('keydown',event=>{
    // Explicit Enter handling avoids depending on implicit form submission.
    if(event.key==='Enter'&&!event.isComposing){event.preventDefault();if(!event.repeat)runDOS(dosInput.value);return;}
    if(event.key==='ArrowUp'){event.preventDefault();historyIndex=Math.max(0,historyIndex-1);dosInput.value=commandHistory[historyIndex]||'';}
    if(event.key==='ArrowDown'){event.preventDefault();historyIndex=Math.min(commandHistory.length,historyIndex+1);dosInput.value=commandHistory[historyIndex]||'';}
  });
  dosDialog.addEventListener('keydown',event=>{if(event.ctrlKey&&event.key.toLowerCase()==='c'){event.preventDefault();sequence++;disk.cancel();printDOS('^C');promptDOS();}});
  dosDialog.addEventListener('close',()=>{sequence++;disk.cancel();promptDOS();document.getElementById('anomaly').focus();});

  // A recovered margin note: "10:13 wasn't the beginning. It was when we noticed."
})();

// Node 04 is a second view in this file so downloaded copies remain self-contained.
(()=>{
 const $=id=>document.getElementById(id),node=$('network'),frame=$('frame'),directory=$('node-directory'),response=$('node-response'),archive=$('print-archive');
 let mode='off',ticket=0,visited=false,clockFrozen=false,anomalyTimer;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const motion=()=>!reduced.matches&&!document.body.classList.contains('no-effects');
 const wait=ms=>new Promise(r=>setTimeout(r,motion()?ms:0));
 function syncEffects(){const on=motion();$('node-effects').textContent='CRT effects: '+(on?'on':'off');$('node-effects').setAttribute('aria-pressed',String(on));}
 $('node-effects').onclick=()=>{$('effects').click();syncEffects();resetAnomaly();};
 function clock(){if(mode!=='boot'&&!clockFrozen)$('node-clock').textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});}clock();setInterval(clock,1000);
 function resetAnomaly(){clearTimeout(anomalyTimer);if(mode==='boot')return;clockFrozen=false;$('node-users').textContent='1';$('omega-label').textContent='████████████████';clock();if(mode!=='directory'||!motion()||document.hidden)return;anomalyTimer=setTimeout(async()=>{if(mode!=='directory'||!motion()||document.hidden)return;const t=ticket;const choice=Math.floor(Math.random()*3);if(choice===0)$('node-users').textContent='2';else if(choice===1){clockFrozen=true;$('node-clock').textContent='22:13:10';}else $('omega-label').textContent="DON'T TURN AROUND";await wait(choice===2?650:1500);if(t!==ticket)return;resetAnomaly();},35000+Math.random()*45000);}
 document.addEventListener('visibilitychange',resetAnomaly);reduced.addEventListener('change',()=>{syncEffects();resetAnomaly();});
 function focusHeading(id){$(id).focus({preventScroll:true});}

 let pendingText=[];
 function restorePrintedText(){for(const [text,value] of pendingText)text.nodeValue=value;pendingText=[];node.classList.remove('node-printing');node.querySelectorAll('.node-print-row').forEach(row=>{row.classList.remove('node-print-row','print-active');row.inert=false;});}
 async function typeRow(row,t){
   const walker=document.createTreeWalker(row,NodeFilter.SHOW_TEXT);const parts=[];
   while(walker.nextNode())parts.push([walker.currentNode,walker.currentNode.nodeValue]);
   for(const [text,value]of parts){pendingText.push([text,value]);text.nodeValue='';}
   row.classList.add('print-active');
   for(const [text,value]of parts){for(let i=0;i<value.length;i+=2){if(t!==ticket)return false;if(!motion()){text.nodeValue=value;break;}text.nodeValue=value.slice(0,i+2);await wait(8);}}
   row.inert=false;return t===ticket;
 }
 async function showDirectory(){
   const t=++ticket;restorePrintedText();mode='preboot';resetAnomaly();syncEffects();mode='boot';
   const rows=[node.querySelector('.node-top'),$('node-title'),node.querySelector('.node-banner p'),...directory.querySelectorAll('.node-line'),...directory.querySelectorAll('.node-meta>div'),...directory.querySelectorAll('.node-menu button'),$('node-form'),node.querySelector('.node-foot')];
   // Keep the DOM's reading order: connection, user, metadata, then selection.
   rows.sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
   const animate=motion();if(animate){node.classList.add('node-printing');rows.forEach(row=>{row.classList.add('node-print-row');row.inert=true;});}
   node.hidden=false;frame.hidden=true;directory.hidden=false;response.hidden=true;archive.hidden=true;$('node-error').textContent='';$('node-input').value='';window.scrollTo(0,0);
   if(animate){await wait(100);for(const row of rows){if(t!==ticket)return;if(!await typeRow(row,t))return;await wait(35);}}
   if(t!==ticket)return;restorePrintedText();visited=true;mode='directory';resetAnomaly();focusHeading('node-title');
 }

 function showArchive(){++ticket;restorePrintedText();mode='archive';node.hidden=false;frame.hidden=true;directory.hidden=true;response.hidden=true;archive.hidden=false;resetAnomaly();window.scrollTo(0,0);focusHeading('print-title');}
 function route(){if(location.hash==='#network')showDirectory();else if(location.hash==='#print-archive')showArchive();else {++ticket;restorePrintedText();mode='off';node.hidden=true;frame.hidden=false;resetAnomaly();if(visited)$('enter').focus({preventScroll:true});}}
 function goDirectory(){if(location.hash==='#network')showDirectory();else location.hash='network';}
 window.addEventListener('hashchange',route);
 $('truth-door').addEventListener('click',()=>{$('transmission').close();location.hash='network';});
 function actions(items){$('node-actions').replaceChildren();for(const [text,fn]of items){const b=document.createElement('button');b.className='node-action';b.type='button';b.textContent=text;b.onclick=fn;$('node-actions').append(b);}}
 async function output(lines,t){for(const line of lines){if(t!==ticket)return false;const d=document.createElement('div');d.textContent=line||' ';$('node-log').append(d);await wait(180);}return t===ticket;}
 function confirmArchive(yes){if(mode!=='confirm')return;if(yes)location.hash='print-archive';else goDirectory();}
 async function select(value){if(mode!=='directory')return;const n=String(value).trim();if(!/^[0-8]$/.test(n)){$('node-error').textContent='INVALID SELECTION. ENTER 0–8.';return;}if(n==='0'){location.hash='';return;}const t=++ticket;mode='response';directory.hidden=true;response.hidden=false;archive.hidden=true;resetAnomaly();$('node-log').replaceChildren();actions([['[0] RETURN TO DIRECTORY',goDirectory]]);let lines;
 if(n==='1')lines=['> 1','ACCESSING PRINT ARCHIVE...','INDEXING.................','7 RECORDS FOUND','1 RECORD CORRUPTED','','DISPLAY RECORDS? Y/N'];
 else if(n==='8')lines=['> 8','ACCESS DENIED.','','CLEARANCE LEVEL: OMEGA','YOUR CLEARANCE: CIVILIAN'];
 else if(n==='7')lines=['> 7','NORTHRIDGE SYSTEMS / REV 2.13','STATION 04 — REMOTE ARCHIVE NODE','','INITIAL CONTACT: JUNE 1983','UPTIME: [COUNTER OVERFLOW]','OPERATOR: NO RESPONSE','','NOTICE: This document has been classified','by order of absolutely nobody.'];
 else {const messages={'2':['MOUNTING ARCADE VOLUME...','ERROR 21 / DRIVE NOT READY.'],'3':['MOUNTING VOLUME...','ERROR 23 / MEDIA NOT PRESENT.'],'4':['ACCESSING CASE FILE INDEX...','INDEX DAMAGED. ORIGINAL RECORDS RETAINED OFFLINE.'],'5':['OPENING TRANSMISSION QUEUE...','NO COMPLETE MESSAGES.','LAST FRAGMENT: "LEAVE THE RECEIVER ON."'],'6':['CONNECTING TO LAB TERMINAL...','STATION NOT RESPONDING.','AUTOMATIC RECORDING: STILL ENABLED.']};lines=['> '+n,...messages[n],'','LAST ACCESS: 10/13/1983','RETURNING TO DIRECTORY...'];}
 if(!await output(lines,t))return;
 if(n==='1'){mode='confirm';actions([['[Y] DISPLAY RECORDS',()=>confirmArchive(true)],['[N] RETURN',()=>confirmArchive(false)]]);}
 else if(!['7','8'].includes(n)){await wait(1600);if(t===ticket)goDirectory();}
 }
 node.querySelectorAll('[data-selection]').forEach(b=>b.onclick=()=>select(b.dataset.selection));node.querySelectorAll('[data-directory]').forEach(b=>b.onclick=goDirectory);
 $('node-form').onsubmit=e=>{e.preventDefault();select($('node-input').value);};
 document.addEventListener('keydown',e=>{if(node.hidden||e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;const editing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);if(editing)return;if(mode==='directory'&&/^[0-8]$/.test(e.key)){e.preventDefault();select(e.key);}else if(mode==='confirm'&&/^[yn]$/i.test(e.key)){e.preventDefault();confirmArchive(e.key.toLowerCase()==='y');}else if((e.key==='0'||e.key==='Escape')&&mode!=='off'){e.preventDefault();goDirectory();}});
 route();
})();

