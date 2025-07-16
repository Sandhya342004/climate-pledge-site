let pledges = [];
let pledgeID = 1;

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const state = document.getElementById("state").value;
  const profile = document.getElementById("profile").value;
  const commitments = Array.from(document.querySelectorAll("input[name='commitment']:checked")).map(cb => cb.value);

  const hearts = "💚".repeat(commitments.length);
  const avatarURL = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;

  const pledge = {
    id: pledgeID++,
    name,
    date: new Date().toLocaleDateString(),
    state,
    profile,
    hearts,
    avatarURL
  };

  pledges.push(pledge);
  updateKPIs();
  updatePledgeWall();
  showCertificate(name, hearts);
  document.getElementById("form").reset();
  document.getElementById("successMessage").style.display = "block";

  // Add social share button
  showShareButtons(name);
});

function updateKPIs() {
  animateCount("pledgeCount", pledges.length);
  animateCount("studentCount", pledges.filter(p => p.profile === "Student").length);
  animateCount("proCount", pledges.filter(p => p.profile === "Working Professional").length);
  animateCount("otherCount", pledges.filter(p => p.profile === "Other").length);
}

function animateCount(id, end) {
  const el = document.getElementById(id);
  let start = 0;
  const speed = Math.ceil(end / 40);
  const interval = setInterval(() => {
    start += speed;
    if (start >= end) {
      el.textContent = end;
      clearInterval(interval);
    } else {
      el.textContent = start;
    }
  }, 50);
}

function updatePledgeWall() {
  const tbody = document.getElementById("pledgeTable");
  tbody.innerHTML = "";
  pledges.forEach(p => {
    const row = `<tr>
      <td><img src="${p.avatarURL}" alt="${p.name}" width="50" height="50" /></td>
      <td>${p.name}</td>
      <td>${p.date}</td>
      <td>${p.state}</td>
      <td>${p.profile}</td>
      <td>${p.hearts}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function showCertificate(name, hearts) {
  const certDiv = document.getElementById("certificate");
  document.getElementById("certificateSection").style.display = "block";
  certDiv.innerHTML = ""; // Clear previous certificate
  certDiv.innerHTML = `
    <div id="certificateContent">
      <h1>🌿 Certificate of Climate Commitment 🌿</h1>
      <p>This acknowledges that</p>
      <h2>${name}</h2>
      <p>has taken meaningful action to protect our planet.</p>
      <p>🌱 Commitments made: <strong>${hearts}</strong></p>
      <p style=\"font-size: 0.9rem; color: #555;\">Issued on ${new Date().toLocaleDateString()}</p>
    </div>
  `;
}

function downloadCertificate() {
  const cert = document.getElementById("certificateContent");
  html2canvas(cert).then(canvas => {
    const link = document.createElement("a");
    link.download = "climate_certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function showShareButtons(name) {
  const message = encodeURIComponent(`I, ${name}, just pledged to take action for the planet 🌍💚! Join me and make your own pledge! #ClimateAction #GoGreen`);
  const twitter = `https://twitter.com/intent/tweet?text=${message}`;
  const whatsapp = `https://wa.me/?text=${message}`;

  const section = document.getElementById("certificateSection");
  const existingDiv = document.getElementById("shareButtonsDiv");
  if (existingDiv) existingDiv.remove();

  const div = document.createElement("div");
  div.id = "shareButtonsDiv";
  div.style.marginTop = "20px";
  div.innerHTML = `
    <p>📢 Share your pledge:</p>
    <a href="${twitter}" target="_blank">🐦 Share on Twitter</a> | 
    <a href="${whatsapp}" target="_blank">📱 Share on WhatsApp</a>
  `;
  section.appendChild(div);
}


