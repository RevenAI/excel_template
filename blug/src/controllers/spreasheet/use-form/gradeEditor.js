import { createInput, createSelect, computeTotalScore, computeGrade } from './formUtils.js';

async function fetchStudent() {
  const resp = await fetch("/api/student?id=1"); // pass id dynamically if needed
  if(!resp.ok) throw new Error("Failed to fetch student");
  return await resp.json();
}

function populateBasicInfo(student) {
  document.getElementById("student-name").value = student.name;
  document.getElementById("student-class").value = student.class;
  document.getElementById("student-id").value = student.id;
}

function populateSubjects(student) {
  const tbody = document.querySelector("#subjects-table tbody");
  tbody.innerHTML = "";

  student.subjectRecords.forEach(subject => {
    const tr = document.createElement("tr");

    // Subject
    const tdSub = document.createElement("td");
    tdSub.appendChild(createInput(subject.subjectName,true));
    tr.appendChild(tdSub);

    const scoreInputs = [];
    subject.scores.forEach(score => {
      const td = document.createElement("td");
      const input = createInput(score.value,false,"number",0,score.maxValue);
      td.appendChild(input);
      tr.appendChild(td);
      scoreInputs.push(input);

      input.addEventListener("input", () => {
        const total = computeTotalScore(tr, scoreInputs);
        tr.querySelector("td:nth-child(5) input").value = total;
        tr.querySelector("td:nth-child(6) input").value = computeGrade(total);
      });
    });

    // Total
    const tdTotal = document.createElement("td");
    tdTotal.appendChild(createInput(subject.totalScore,true));
    tr.appendChild(tdTotal);

    // Grade
    const tdGrade = document.createElement("td");
    tdGrade.appendChild(createInput(subject.grade,true));
    tr.appendChild(tdGrade);

    // Remark
    const tdRemark = document.createElement("td");
    tdRemark.appendChild(createInput(subject.remark,false));
    tr.appendChild(tdRemark);

    tbody.appendChild(tr);
  });
}

function populateDomain(tableId, items) {
  if(!items?.length) return;
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";

  items.forEach(item => {
    const tr = document.createElement("tr");

    // Trait
    const tdTrait = document.createElement("td");
    tdTrait.appendChild(createInput(item.label,true));
    tr.appendChild(tdTrait);

    item.rating.forEach(r => {
      const td = document.createElement("td");
      const select = createSelect([{value:true,label:"TRUE"},{value:false,label:"FALSE"}], r.value===r.rate);
      td.appendChild(select);
      tr.appendChild(td);
    });

    // Remark
    const tdRemark = document.createElement("td");
    tdRemark.appendChild(createInput(item.remark||"",true));
    tr.appendChild(tdRemark);

    tbody.appendChild(tr);
  });
}

async function init() {
  try {
    const student = await fetchStudent();
    populateBasicInfo(student);
    populateSubjects(student);
    populateDomain("affective-table", student.affectiveDomain?.items);
    populateDomain("psychomotor-table", student.psychomotorSkills?.items);

    document.getElementById("teacher-comment").value = student.commentsAndSignatures?.teacherComment||"";
    document.getElementById("head-comment").value = student.commentsAndSignatures?.headTeacherComment||"";

    document.getElementById("save").addEventListener("click", async ()=>{
      // build payload from form
      const payload = {...student};

      payload.subjectRecords = Array.from(document.querySelectorAll("#subjects-table tbody tr")).map((tr,i)=>{
        const cells = tr.querySelectorAll("input");
        const scores = Array.from(cells).slice(1,4).map((input,j)=>({
          name: student.subjectRecords[i].scores[j].name,
          value: Number(input.value),
          maxValue: student.subjectRecords[i].scores[j].maxValue
        }));
        const totalScore = Number(cells[4].value);
        const grade = cells[5].value;
        const remark = cells[6].value;
        return { subjectName: cells[0].value, scores, totalScore, grade, remark };
      });

      // Domain
      const domainRows = (id)=>Array.from(document.querySelectorAll(`#${id} tbody tr`)).map(tr=>{
        const inputs = tr.querySelectorAll("input, select");
        return { 
          label: inputs[0].value,
          rating: Array.from(inputs).slice(1,-1).map(s=>({ rate:1, value: s.value==="true"?1:null })),
          remark: inputs[inputs.length-1].value
        };
      });
      payload.affectiveDomain = { items: domainRows("affective-table") };
      payload.psychomotorSkills = { items: domainRows("psychomotor-table") };

      payload.commentsAndSignatures = {
        teacherComment: document.getElementById("teacher-comment").value,
        headTeacherComment: document.getElementById("head-comment").value
      };

      // Save via API
      const resp = await fetch("/api/save-grades", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      if(!resp.ok) throw new Error("Failed to save");
      alert("Saved successfully!");
    });

  } catch(err) {
    console.error(err);
    document.getElementById("grade-editor").innerHTML = "<p style='color:red'>Failed to load student data</p>";
  }
}

init();


// import { buildBasicInfo, buildSubjects, buildDomain, buildComments } from './buildForm.js';

// // Fetch dynamic student data from backend
// async function fetchStudent() {
//   const resp = await fetch("/api/student"); // returns IStudentRecord JSON
//   if(!resp.ok) throw new Error("Failed to fetch student");
//   return await resp.json();
// }

// async function init() {
//   try {
//     const student = await fetchStudent();

//     buildBasicInfo(document.getElementById("basic-info-section"), student);
//     buildSubjects(document.getElementById("subjects-section"), student);
//     buildDomain(document.getElementById("affective-section"), "SECTION 3: AFFECTIVE DOMAIN", student.affectiveDomain?.items);
//     buildDomain(document.getElementById("psychomotor-section"), "SECTION 4: PSYCHOMOTOR SKILLS", student.psychomotorSkills?.items);
//     buildComments(document.getElementById("comments-section"), student);

//     document.getElementById("save").addEventListener("click", async ()=>{
//       const payload = { studentId: student.id };

//       // Build payload from DOM
//       payload.subjectRecords = Array.from(document.querySelectorAll("#subjects-section tbody tr")).map(tr=>{
//         const cells = tr.querySelectorAll("input");
//         const scores = Array.from(cells).slice(1,1+student.subjectRecords[0].scores.length).map((input,i)=>({
//           name: student.subjectRecords[0].scores[i].name,
//           value: Number(input.value),
//           maxValue: student.subjectRecords[0].scores[i].maxValue
//         }));
//         const totalScore = Number(cells[1+scores.length].value);
//         const grade = cells[2+scores.length].value;
//         const remark = cells[3+scores.length].value;
//         return { subjectName: cells[0].value, scores, totalScore, grade, remark };
//       });

//       payload.affectiveDomain = { items: Array.from(document.querySelectorAll("#affective-section tbody tr")).map(tr=>{
//         const inputs = tr.querySelectorAll("input, select");
//         return {
//           label: inputs[0].value,
//           rating: Array.from(inputs).slice(1,-1).map(s=>({ rate:1, value: s.value==="true"?1:null })),
//           remark: inputs[inputs.length-1].value
//         };
//       })};

//       payload.psychomotorSkills = { items: Array.from(document.querySelectorAll("#psychomotor-section tbody tr")).map(tr=>{
//         const inputs = tr.querySelectorAll("input, select");
//         return {
//           label: inputs[0].value,
//           rating: Array.from(inputs).slice(1,-1).map(s=>({ rate:1, value: s.value==="true"?1:null })),
//           remark: inputs[inputs.length-1].value
//         };
//       })};

//       payload.commentsAndSignatures = {
//         teacherComment: document.querySelector("#comments-section tbody tr:first-child input").value,
//         headTeacherComment: document.querySelector("#comments-section tbody tr:last-child input").value
//       };

//       try{
//         const resp = await fetch("/api/save-grades", {
//           method:"POST",
//           headers:{"Content-Type":"application/json"},
//           body: JSON.stringify(payload)
//         });
//         if(!resp.ok) throw new Error("Server error");
//         alert("Saved successfully!");
//       }catch(err){
//         console.error(err);
//         alert("Failed to save grades.");
//       }
//     });

//   } catch(err) {
//     console.error(err);
//     document.getElementById("grade-editor").innerHTML = `<p style="color:red">Failed to load student data</p>`;
//   }
// }

// init();
