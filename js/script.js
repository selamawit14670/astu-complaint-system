let currentRole = "";
let currentUser = "";

// No default complaints
let complaints = [];

// Predefined users
let users = {
    staff: {
        username: "staff1",
        password: "1234"
    },
    admin: {
        username: "admin1",
        password: "admin123"
    }
};

function login() {
    const role = document.getElementById("role-select").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!role || !username || !password) {
        alert("Please fill all fields");
        return;
    }

    if (role === "staff") {
        if (username === users.staff.username && password === users.staff.password) {
            currentRole = "staff";
            currentUser = username;
            showDashboard("staff");
            renderStaff();
        } else {
            alert("Invalid staff credentials");
        }
    }

    else if (role === "admin") {
        if (username === users.admin.username && password === users.admin.password) {
            currentRole = "admin";
            currentUser = username;
            showDashboard("admin");
            renderAdmin();
        } else {
            alert("Invalid admin credentials");
        }
    }

    else if (role === "student") {
        currentRole = "student";
        currentUser = username;
        showDashboard("student");
        renderStudent();
    }
}

function showDashboard(role) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("staff-dashboard").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");

    document.getElementById(role + "-dashboard").classList.remove("hidden");
}

function logout() {
    currentRole = "";
    currentUser = "";

    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("staff-dashboard").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role-select").value = "";
}

function submitComplaint() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    if (!title || !description || !category) {
        alert("Fill all fields");
        return;
    }

    const newComplaint = {
        id: complaints.length + 1,
        title,
        description,
        category,
        status: "Open",
        remarks: "",
        student: currentUser
    };

    complaints.push(newComplaint);

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";

    renderStudent();
}

function renderStudent() {
    const container = document.getElementById("student-complaints");
    container.innerHTML = "";

    const studentComplaints = complaints.filter(c => c.student === currentUser);

    studentComplaints.forEach(c => {
        container.innerHTML += `
            <p>
                <strong>${c.title}</strong> -
                <span class="status-${c.status.toLowerCase().replace(" ", "-")}">
                    ${c.status}
                </span>
            </p>
        `;
    });

    document.getElementById("student-summary").innerHTML =
        `<p>Total Complaints: ${studentComplaints.length}</p>`;
}

function renderStaff() {
    const container = document.getElementById("staff-complaints");
    container.innerHTML = "";

    complaints.forEach(c => {
        container.innerHTML += `
            <div>
                <strong>${c.title}</strong> (by ${c.student}) - ${c.status}
                <br>
                <select onchange="updateStatus(${c.id}, this.value)">
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
            <hr>
        `;
    });
}

function updateStatus(id, newStatus) {
    const complaint = complaints.find(c => c.id === id);
    complaint.status = newStatus;
    renderStaff();
}

function renderAdmin() {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    const resolutionRate = total === 0 ? 0 : (resolved / total * 100).toFixed(1);

    document.getElementById("admin-summary").innerHTML = `
        <p>Total Complaints: ${total}</p>
        <p>Resolved: ${resolved}</p>
        <p>Resolution Rate: ${resolutionRate}%</p>
    `;

    const container = document.getElementById("admin-complaints");
    container.innerHTML = "";

    complaints.forEach(c => {
        container.innerHTML += `
            <p>${c.title} (by ${c.student}) - ${c.status}</p>
        `;
    });
}