// ================= TAB SWITCH =================
function showLoginForm() {
    document.getElementById("login-box").style.display = "block";
    document.getElementById("signup-box").style.display = "none";

    document.getElementById("login-tab").classList.add("active");
    document.getElementById("signup-tab").classList.remove("active");
}

function showSignupForm() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("signup-box").style.display = "block";

    document.getElementById("signup-tab").classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
}

// ================= LOGIN =================
async function handleLoginAPI(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    try {
        const res = await fetch("http://localhost:8081/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!data.token) {
            alert(data.message || "Login failed");
            return;
        }

        localStorage.setItem("token", data.token);

        alert("Login success");

        // REDIRECT FIX
        window.location.replace("../html/dashboard.html");

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// ================= SIGNUP =================
async function handleSignupAPI(e) {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (!name || !email || !password || !confirm) {
        alert("All fields required");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetch("http://localhost:8081/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Signup failed");
            return;
        }

        alert("Signup successful! Please login.");

        //  SWITCH TAB FIX
        showLoginForm();

        //  CLEAR FIELDS
        document.getElementById("formSignup").reset();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// ================= GOOGLE =================
async function handleGoogleResponse(response) {
    try {
        const res = await fetch("http://localhost:8081/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: response.credential
            })
        });

        const data = await res.json();

        if (!data.token) {
            alert("Google login failed");
            return;
        }

        localStorage.setItem("token", data.token);

        //  REDIRECT FIX
        window.location.replace("../html/dashboard.html");

    } catch (err) {
        console.error(err);
        alert("Google error");
    }
}

// ================= INIT =================
window.onload = function () {

    //  GOOGLE INIT
    google.accounts.id.initialize({
        client_id: "464577427173-7950va68opt82k71u9vefv7o9oe0eaks.apps.googleusercontent.com",
        callback: handleGoogleResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        { theme: "outline", size: "large", width: "100%" }
    );

    google.accounts.id.renderButton(
        document.getElementById("googleSignupBtn"),
        { theme: "outline", size: "large", width: "100%" }
    );

    //  EVENTS
    document.getElementById("formLogin").addEventListener("submit", handleLoginAPI);
    document.getElementById("formSignup").addEventListener("submit", handleSignupAPI);

    //  DEFAULT TAB
    showLoginForm();
};