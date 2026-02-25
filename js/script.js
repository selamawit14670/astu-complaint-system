let complaints = [];
let currentUser = "";
let currentRole = "";

// LOGIN
function login() {
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!role || !username || !password) {
        alert("Fill all fields");
        return;
    }

    if (role === "admin" && username === "admin" && password === "1234") {
        currentRole = "admin";
        showDashboard("admin-dashboard");
        renderAdmin();
    }

    else if (role === "staff" && username === "staff" && password === "1234") {
        currentRole = "staff";
        showDashboard("staff-dashboard");
        renderStaff();
    }

    else if (role === "student") {
        currentRole = "student";
        currentUser = username;
        showDashboard("student-dashboard");
        renderStudent();
    }

    else {
        alert("Invalid credentials");
    }
}

function showDashboard(id) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("staff-dashboard").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");

    document.getElementById(id).classList.remove("hidden");
}

function logout() {
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("staff-dashboard").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");

    currentUser = "";
    currentRole = "";
}

// CATEGORY DYNAMIC FIELDS
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("category").addEventListener("change", function () {

        const category = this.value;
        const extra = document.getElementById("extra-fields");
        extra.innerHTML = "";

        if (category === "Dormitory") {
            extra.innerHTML = `
                <input type="text" id="block" placeholder="Block">
                <input type="text" id="room" placeholder="Room Number">
            `;
        }

        else if (category === "Laboratory") {
            extra.innerHTML = `
                <input type="text" id="labName" placeholder="Lab Name">
                <input type="text" id="equipment" placeholder="Equipment">
            `;
        }

        else if (category === "Internet") {
            extra.innerHTML = `
                <input type="text" id="location" placeholder="Location">
                <input type="text" id="issueType" placeholder="Issue Type">
            `;
        }

        else if (category === "Classroom") {
            extra.innerHTML = `
                <input type="text" id="building" placeholder="Building">
                <input type="text" id="classroomNumber" placeholder="Classroom Number">
            `;
        }
    });
});

// SUBMIT COMPLAINT
function submitComplaint() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("fileUpload");

    if (!title || !description || !category) {
        alert("Fill all fields");
        return;
    }

    let extraInfo = "";

    if (category === "Dormitory") {
        extraInfo = `Block: ${document.getElementById("block")?.value || ""}, Room: ${document.getElementById("room")?.value || ""}`;
    }

    if (category === "Laboratory") {
        extraInfo = `Lab: ${document.getElementById("labName")?.value || ""}, Equipment: ${document.getElementById("equipment")?.value || ""}`;
    }

    if (category === "Internet") {
        extraInfo = `Location: ${document.getElementById("location")?.value || ""}, Issue: ${document.getElementById("issueType")?.value || ""}`;
    }

    if (category === "Classroom") {
        extraInfo = `Building: ${document.getElementById("building")?.value || ""}, Room: ${document.getElementById("classroomNumber")?.value || ""}`;
    }

    const newComplaint = {
        id: complaints.length + 1,
        title,
        description,
        category,
        extraInfo,
        status: "Open",
        student: currentUser,
        fileName: fileInput.files[0] ? fileInput.files[0].name : "",
        date: new Date(),
    };

    complaints.push(newComplaint);

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("fileUpload").value = "";
    document.getElementById("extra-fields").innerHTML = "";

    renderStudent();
}

// RENDER STUDENT
function renderStudent() {
    const container = document.getElementById("student-complaints");
    container.innerHTML = "";

    complaints
        .filter(c => c.student === currentUser)
        .forEach(c => {
            container.innerHTML += `
                <div>
                    <strong>${c.title}</strong><br>
                    ${c.description}<br>
                    ${c.extraInfo ? c.extraInfo + "<br>" : ""}
                    ${c.fileName ? "File: " + c.fileName + "<br>" : ""}
                    Status: ${c.status}
                    <hr>
                </div>
            `;
        });
}

// RENDER STAFF
function renderStaff() {
    const container = document.getElementById("staff-complaints");
    container.innerHTML = "";
    if (complaints.length === 0) {
    container.innerHTML = "<p>No complaints available.</p>";
    return;
}

    complaints.forEach(c => {
        container.innerHTML += `
            <div>
                <strong>Title:</strong> ${c.title}<br>
                <strong>Description:</strong> ${c.description}<br>
                <strong>Category:</strong> ${c.category}<br>
                ${c.extraInfo ? c.extraInfo + "<br>" : ""}
                <strong>Student:</strong> ${c.student}<br>
                ${c.fileName ? "File: " + c.fileName + "<br>" : ""}
                <strong>Status:</strong> ${c.status}<br>

                <select onchange="updateStatus(${c.id}, this.value)">
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                </select>
                <hr>
            </div>
        `;
    });
}

// RENDER ADMIN
function renderAdmin() {
    const container = document.getElementById("admin-complaints");
    container.innerHTML = "";


    // ====== STATISTICS ======
    const total = complaints.length;
    const open = complaints.filter(c => c.status === "Open").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    container.innerHTML += `
        <h3>System Overview</h3>
        <p><strong>Total Complaints:</strong> ${total}</p>
        <p class="status-open">Open: ${open}</p>
        <p class="status-in-progress">In Progress: ${inProgress}</p>
        <p class="status-resolved">Resolved: ${resolved}</p>
        <hr>
    `;

    // ====== FILTER DROPDOWN ======
    container.innerHTML += `
        <label>Filter by Status:</label>
        <select onchange="filterAdmin(this.value)">
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
        </select>
        <hr>
        <div id="admin-list"></div>
    `;

    displayAdminList("All");
    renderAdminChart();
    renderMonthlyReport();
}
function filterAdmin(status) {
    displayAdminList(status);
}

function displayAdminList(status) {
    const listContainer = document.getElementById("admin-list");
    listContainer.innerHTML = "";

    let filtered = complaints;

    if (status !== "All") {
        filtered = complaints.filter(c => c.status === status);
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = "<p>No complaints found.</p>";
        return;
    }

    filtered.forEach(c => {
        listContainer.innerHTML += `
            <div style="margin-bottom:15px;">
                <strong>Title:</strong> ${c.title}<br>
                <strong>Student:</strong> ${c.student}<br>
                <strong>Category:</strong> ${c.category}<br>
                <strong>Status:</strong> ${c.status}
                <hr>
            </div>
        `;
    });
}

// UPDATE STATUS
function updateStatus(id, newStatus) {
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
        complaint.status = newStatus;
        renderStaff();
    }
}
let adminChartInstance = null;

function renderAdminChart() {

    const open = complaints.filter(c => c.status === "Open").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    const ctx = document.getElementById("adminChart");
    if (!ctx) return;

    // Destroy old chart before creating new one
    if (adminChartInstance) {
        adminChartInstance.destroy();
    }

    adminChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Open", "In Progress", "Resolved"],
            datasets: [{
                label: "Complaint Status",
                data: [open, inProgress, resolved]
            }]
        },
        options: {
            responsive: true
        }
    });
}
function renderMonthlyReport() {

    const reportContainer = document.getElementById("monthly-report");
    if (!reportContainer) return;

    const monthlyData = {};

    complaints.forEach(c => {
        const month = new Date(c.date).toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }

        monthlyData[month]++;
    });

    reportContainer.innerHTML = "<h3>Monthly Report</h3>";

    for (let month in monthlyData) {
        reportContainer.innerHTML += `
            <p><strong>${month}:</strong> ${monthlyData[month]} complaints</p>
        `;
    }
}
function searchStaff() {
    const searchValue = document.getElementById("staffSearch").value.toLowerCase();
    const container = document.getElementById("staff-complaints");

    container.innerHTML = "";

    const filtered = complaints.filter(c =>
        c.title.toLowerCase().includes(searchValue) ||
        c.student.toLowerCase().includes(searchValue) ||
        c.category.toLowerCase().includes(searchValue)
    );

    if (filtered.length === 0) {
        container.innerHTML = "<p>No matching complaints found.</p>";
        return;
    }

    filtered.forEach(c => {
        container.innerHTML += `
            <div>
                <strong>Title:</strong> ${c.title}<br>
                <strong>Category:</strong> ${c.category}<br>
                <strong>Student:</strong> ${c.student}<br>
                <strong>Status:</strong> ${c.status}
                <hr>
            </div>
        `;
    });
}
function filterByCategory(category) {

    const container = document.getElementById("staff-complaints");
    container.innerHTML = "";

    let filtered = complaints;

    if (category !== "All") {
        filtered = complaints.filter(c => c.category === category);
    }

    if (filtered.length === 0) {
        container.innerHTML = "<p>No complaints in this category.</p>";
        return;
    }

    filtered.forEach(c => {
        container.innerHTML += `
            <div>
                <strong>Title:</strong> ${c.title}<br>
                <strong>Category:</strong> ${c.category}<br>
                <strong>Student:</strong> ${c.student}<br>
                <strong>Status:</strong> ${c.status}
                <hr>
            </div>
        `;
    });
}