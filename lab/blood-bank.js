(() => {
 const examples={
  A:{values:[true,false,true,false,true],note:'This simplified pattern is A, RhD positive: A and D antigens are detected; the plasma reacts with B cells. Appropriate controls and agreement checks are assumed.'},
  O:{values:[false,false,false,true,true],note:'This simplified pattern is O, RhD negative: A, B, and D are not detected in this example; the plasma reacts with both A₁ and B cells. Actual RhD interpretation follows the validated method and patient context.'},
  AB:{values:[true,true,true,false,false],note:'This simplified pattern is AB, RhD positive: A, B, and D antigens are detected; reverse grouping shows no reaction with A₁ or B cells. The pattern does not replace other pre-transfusion checks.'}
 };
 const buttons=[...document.querySelectorAll('[data-type]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const ex=examples[button.dataset.type];
  document.querySelectorAll('#typing-values td').forEach((td,i)=>td.textContent=ex.values[i]?'Positive':'Negative');
  ['a','b','d'].forEach((id,i)=>document.getElementById('well-'+id).classList.toggle('positive',ex.values[i]));
  document.getElementById('typing-note').textContent=ex.note;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
 const compatible={red:{A:['A','O'],B:['B','O'],AB:['AB','A','B','O'],O:['O']},plasma:{A:['A','AB'],B:['B','AB'],AB:['AB'],O:['O','A','B','AB']}};
 function updateMatch(){
  const recipient=document.getElementById('recipient').value;
  const component=document.querySelector('input[name="component"]:checked').value;
  const groups=compatible[component][recipient];
  document.getElementById('donor-groups').replaceChildren(...groups.map(group=>{const tag=document.createElement('span');tag.textContent=group;return tag}));
  document.getElementById('match-note').textContent=`For a group ${recipient} recipient, this ABO-only model permits ${groups.join(' / ')} ${component==='red'?'red cells. The donor cells must avoid A or B antigens targeted by the recipient’s usual ABO antibodies.':'plasma. The donor plasma must avoid anti-A or anti-B that would target the recipient’s red cells.'} ABO-identical components are generally preferred when available and appropriate.`;
 }
 document.getElementById('recipient').addEventListener('change',updateMatch);
 document.querySelectorAll('input[name="component"]').forEach(input=>input.addEventListener('change',updateMatch));
 document.querySelectorAll('[data-bank-answer]').forEach(button=>button.addEventListener('click',()=>{
  document.getElementById('bank-feedback').textContent=button.dataset.bankAnswer==='investigate'
   ?'Exactly. Identify the antibody, review the history, and select suitable units. When a clinically significant antibody is identified, this commonly means antigen-negative units and an appropriate serologic crossmatch. Keep the clinical team informed.'
   :'A matching ABO/RhD label is not enough. A positive screen may reveal an antibody against another red-cell antigen. Investigate before routine issue; urgent cases follow authorized emergency-release procedures.';
 }));
})();
