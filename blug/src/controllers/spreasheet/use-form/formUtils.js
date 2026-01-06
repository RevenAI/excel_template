export function createInput(value = "", readOnly = false, type = "text", min, max) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.readOnly = readOnly;
  if(type === "number") {
    if(min !== undefined) input.min = min;
    if(max !== undefined) input.max = max;
  }
  return input;
}

export function createSelect(options = [], selected) {
  const select = document.createElement("select");
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.text = opt.label;
    if(opt.value === selected) o.selected = true;
    select.appendChild(o);
  });
  return select;
}

export function computeTotalScore(row, scoreInputs) {
  let total = 0;
  scoreInputs.forEach(input => total += Number(input.value || 0));
  row.querySelector(".total-score").value = total;
  return total;
}

export function computeGrade(total) {
  if(total >= 75) return "A1";
  if(total >= 65) return "B2";
  if(total >= 55) return "C4";
  if(total >= 45) return "D6";
  return "F9";
}
