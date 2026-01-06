import { createInput, createSelect, computeTotalScore, computeGrade } from './formUtils.js';

export function buildBasicInfo(container, student) {
  const h2 = document.createElement("h2");
  h2.textContent = "SECTION 1: BASIC INFO";
  container.appendChild(h2);

  const table = document.createElement("table");
  [["Student Name", student.name], ["Class", student.class], ["Student ID", student.id]]
    .forEach(([label, value]) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.textContent = label;
      const tdValue = document.createElement("td");
      tdValue.appendChild(createInput(value, true));
      tr.appendChild(tdLabel);
      tr.appendChild(tdValue);
      table.appendChild(tr);
    });

  container.appendChild(table);
}

export function buildSubjects(container, student) {
  const h2 = document.createElement("h2");
  h2.textContent = "SECTION 2: SUBJECT RECORDS";
  container.appendChild(h2);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = ["Subject", ...student.subjectRecords[0].scores.map(s => s.name), "Total", "Grade", "Remark"];
  thead.innerHTML = "<tr>" + headerRow.map(h => `<th>${h}</th>`).join("") + "</tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  student.subjectRecords.forEach(subject => {
    const tr = document.createElement("tr");
    // Subject
    tr.appendChild((() => { const td=document.createElement("td"); td.appendChild(createInput(subject.subjectName,true)); return td})());
    // Scores
    const scoreInputs = [];
    subject.scores.forEach(score => {
      const td = document.createElement("td");
      const input = createInput(score.value, false, "number", 0, score.maxValue);
      td.appendChild(input);
      scoreInputs.push(input);
      tr.appendChild(td);
    });
    // Total
    const tdTotal = document.createElement("td");
    const totalInput = createInput(subject.totalScore, true, "number");
    totalInput.classList.add("total-score");
    tdTotal.appendChild(totalInput);
    tr.appendChild(tdTotal);

    // Grade
    const tdGrade = document.createElement("td");
    tdGrade.appendChild(createInput(subject.grade, true));
    tr.appendChild(tdGrade);

    // Remark
    const tdRemark = document.createElement("td");
    tdRemark.appendChild(createInput(subject.remark,false));
    tr.appendChild(tdRemark);

    // Auto-update total and grade when score changes
    scoreInputs.forEach(input=>{
      input.addEventListener("input", () => {
        const total = computeTotalScore(tr, scoreInputs);
        tr.querySelector("td:nth-child(" + (2+scoreInputs.length) + ") input").value = total;
        tr.querySelector("td:nth-child(" + (3+scoreInputs.length) + ") input").value = computeGrade(total);
      });
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

export function buildDomain(container, title, items) {
  if(!items || !items.length) return;
  const h2 = document.createElement("h2");
  h2.textContent = title;
  container.appendChild(h2);

  const table = document.createElement("table");
  const maxRatings = Math.max(...items.map(i=>i.rating.length));
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr>" + ["Trait", ...Array.from({length:maxRatings},(_,i)=>`Rating ${i+1}`), "Remark"].map(h=>`<th>${h}</th>`).join("") + "</tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  items.forEach(item=>{
    const tr = document.createElement("tr");
    tr.appendChild((()=>{const td=document.createElement("td"); td.appendChild(createInput(item.label,true)); return td})());

    item.rating.forEach(r => {
      const td = document.createElement("td");
      const select = createSelect([{value:true,label:"TRUE"},{value:false,label:"FALSE"}], r.value===r.rate);
      td.appendChild(select);
      select.addEventListener("change", ()=>{
        if(select.value==="true"){
          // reset other ratings
          Array.from(tr.querySelectorAll("select")).forEach(s=>{
            if(s!==select) s.value="false";
          });
        }
      });
      tr.appendChild(td);
    });

    const tdRemark = document.createElement("td");
    tdRemark.appendChild(createInput(item.remark || "",true));
    tr.appendChild(tdRemark);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

export function buildComments(container, student) {
  const h2 = document.createElement("h2");
  h2.textContent = "SECTION 5: COMMENTS & SIGNATURES";
  container.appendChild(h2);

  const table = document.createElement("table");
  [["Teacher Comment", student.commentsAndSignatures?.teacherComment || ""],
   ["Head Teacher Comment", student.commentsAndSignatures?.headTeacherComment || ""]]
    .forEach(([label,value])=>{
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td"); tdLabel.textContent = label;
      const tdValue = document.createElement("td"); tdValue.appendChild(createInput(value,false));
      tr.appendChild(tdLabel); tr.appendChild(tdValue);
      table.appendChild(tr);
    });
  container.appendChild(table);
}
