document.getElementById("medicalLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "medical" && password === "store123") {
    alert("✅ Login Successful!");
    window.location.href = "medical_front.html"; // redirect to dashboard
  } else {
    alert("❌ Invalid login credentials");
  }
});
