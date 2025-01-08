document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.getElementById("login-popup");
  const signupPopup = document.getElementById("signup-popup");
  const dashboardPopup = document.getElementById("dashboard");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const userIcon = document.getElementById("user-icon");
  const closeButtons = document.querySelectorAll(".close-btn");
  

  loginBtn.addEventListener("click", () => {
      loginPopup.classList.remove("hidden");
  });

  signupBtn.addEventListener("click", () => {
      signupPopup.classList.remove("hidden");
  });

  closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
          loginPopup.classList.add("hidden");
          signupPopup.classList.add("hidden");
          dashboardPopup.classList.add("hidden");
      });
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      loginPopup.classList.add("hidden");
      userIcon.style.display = "inline-block";
  });

  document.getElementById("signup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      signupPopup.classList.add("hidden");
      userIcon.style.display = "inline-block";
  });

  userIcon.addEventListener("click", () => {
      dashboardPopup.classList.remove("hidden");
  });
});



document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = e.target[0].value;
    const middleName = e.target[1].value || null;
    const lastName = e.target[2].value;
    const phoneNumber = e.target[3].value;
    const email = e.target[4].value;

    const response = await fetch("signup.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, middleName, lastName, phoneNumber, email }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message || "Sign-up successful!");
        document.getElementById("signup-popup").classList.add("hidden");
    } else {
        alert(result.error || "Sign-up failed!");
    }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target[1].value;

    const response = await fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message || "Login successful!");
        document.getElementById("login-popup").classList.add("hidden");
    } else {
        alert(result.error || "Login failed!");
    }
});
