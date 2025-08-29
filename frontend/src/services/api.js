// services/api.js
export async function fetchStates() {
  const res = await fetch("http://localhost:8000/meta/states");
  return res.json();
}

export async function fetchCommissions(commissionId) {
  const res = await fetch(`http://localhost:8000/meta/commissions?commissionId=${commissionId}`);
  return res.json();
}

export async function fetchCommissionAddress(commissionId) {
  const res = await fetch(`http://localhost:8000/meta/commission-address?commissionId=${commissionId}`);
  return res.json();
}

export async function searchCases(payload) {
  const res = await fetch("http://localhost:8000/meta/case-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
