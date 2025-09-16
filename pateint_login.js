document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  const defaultUsername = "ridhi09012002";
  const defaultPassword = "09012002";

  if (username === "" || password === "") {
    message.style.color = "red";
    message.textContent = "⚠️ Please fill in all fields.";
  } else if (username === defaultUsername && password === defaultPassword) {
    message.style.color = "green";
    message.textContent = "✅ Login successful!";
    setTimeout(() => {
      window.location.href = "front.html"; // your dashboard page
    }, 1000);
  } else {
    message.style.color = "red";
    message.textContent = "❌ Invalid username or password.";
  }
});
