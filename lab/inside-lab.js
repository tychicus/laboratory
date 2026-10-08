/* Fictional teaching cases; never patient records or manufacturer output. */
(() => {
  const cbc = {
    routine: [['6.8 ×10⁹/L','14.2 g/dL','88 fL','248 ×10⁹/L'], 'These selected values fall within the example intervals. That does not rule out every illness or replace the rest of the clinical picture.'],
    anemia: [['6.8 ×10⁹/L','9.4 g/dL · LOW','70 fL · LOW','310 ×10⁹/L'], 'Low hemoglobin with a low MCV is a microcytic anemia pattern: less hemoglobin and smaller red cells. Iron deficiency is one possibility, but the cause needs further investigation—not a guess from this CBC.']
  };
  const chemistry = {
    routine: [['140 mmol/L','4.2 mmol/L','92 mg/dL','0.9 mg/dL'], 'These values fall within the example intervals. Sample checks and acceptable quality control still come before result release.'],
    hemolysis: [['140 mmol/L','6.1 mmol/L · HIGH','92 mg/dL','0.9 mg/dL'], 'Hemolysis alert: potassium may be affected. Hold the affected result for review under the laboratory’s policy, assess interference, and communicate or arrange recollection as appropriate. True hyperkalemia can be urgent; do not dismiss it as a collection problem.']
  };
  function bindCases(attribute, cases, tableId, noteId) {
    const buttons = [...document.querySelectorAll(`[${attribute}]`)];
    buttons.forEach(button => button.addEventListener('click', () => {
      const [values, note] = cases[button.getAttribute(attribute)];
      document.querySelectorAll(`#${tableId} tr`).forEach((row, index) => {
        const result = row.querySelector('td');
        result.textContent = values[index];
        result.classList.toggle('il-flag', /LOW|HIGH/.test(values[index]));
      });
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      document.getElementById(noteId).textContent = note;
    }));
  }
  bindCases('data-cbc', cbc, 'cbc-values', 'cbc-note');
  bindCases('data-chem', chemistry, 'chem-values', 'chem-note');

  // Deterministic schematic clusters, so the counts and visual never disagree.
  const populations = [
    {id:'t',n:120,x:371,y:219,rx:65,ry:36,color:'#8cefe3'},
    {id:'b',n:45,x:159,y:89,rx:48,ry:30,color:'#e1b3ff'},
    {id:'other',n:35,x:152,y:218,rx:43,ry:29,color:'#ffd38c'}
  ];
  const dots = document.getElementById('flow-dots');
  populations.forEach(pop => {
    const group = document.createElementNS('http://www.w3.org/2000/svg','g');
    group.dataset.cluster = pop.id;
    for (let i=0;i<pop.n;i++) {
      const angle = i * 2.39996323, radius = Math.sqrt((i+.5)/pop.n);
      const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx', String(pop.x + Math.cos(angle)*radius*pop.rx));
      dot.setAttribute('cy', String(pop.y + Math.sin(angle)*radius*pop.ry));
      dot.setAttribute('r','2.4'); dot.setAttribute('fill',pop.color);
      group.append(dot);
    }
    dots.append(group);
  });
  const descriptions = {
    all:'Shown: 120 T-cell events, 45 B-cell events, and 35 double-negative events. These invented counts illustrate the plot; they are not normal reference percentages.',
    t:'Highlighted: 120 CD3-positive, CD19-negative T-cell events (60% of this invented 200-event set). A real report uses the validated full gating strategy and marker panel.',
    b:'Highlighted: 45 CD19-positive, CD3-negative B-cell events (22.5% of this invented set). Their position reflects marker fluorescence, not a photograph or a diagnosis.',
    other:'Highlighted: 35 CD3-negative, CD19-negative events (17.5% of this invented set). They cannot all be called NK cells from these two markers alone.'
  };
  const populationButtons = [...document.querySelectorAll('[data-population]')];
  populationButtons.forEach(button => button.addEventListener('click', () => {
    const selected=button.dataset.population;
    dots.querySelectorAll('g').forEach(g => g.setAttribute('opacity', selected==='all'||selected===g.dataset.cluster ? '1':'.14'));
    populationButtons.forEach(b => b.setAttribute('aria-pressed',String(b===button)));
    document.getElementById('flow-note').textContent=descriptions[selected];
  }));
  document.querySelectorAll('[data-qc]').forEach(button => button.addEventListener('click', () => {
    document.getElementById('qc-feedback').textContent = button.dataset.qc==='investigate'
      ? 'Exactly. Hold affected results, investigate the control failure, correct the problem, and confirm acceptable performance under the laboratory’s procedure. Review whether earlier results were affected, too.'
      : 'Speed matters, but an unreliable result can mislead the care team. Hold affected results and investigate. Communicate delays and urgent needs while the problem is resolved.';
  }));
})();
