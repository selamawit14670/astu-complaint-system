let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
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

    else if (role === "staff") {

    if (username === "dorm" && password === "1234") {
        currentRole = "staff";
        currentUser = "Dormitory";
    }

    else if (username === "lab" && password === "1234") {
        currentRole = "staff";
        currentUser = "Laboratory";
    }

    else if (username === "it" && password === "1234") {
        currentRole = "staff";
        currentUser = "Internet";
    }

    else if (username === "class" && password === "1234") {
        currentRole = "staff";
        currentUser = "Classroom";
    }

    else {
        alert("Invalid staff credentials");
        return;
    }

    showDashboard("staff-dashboard");
    renderStaff();
}

    else if (role === "student") {

    if (!username) {
        alert("Enter your Student ID");
        return;
    }

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
            sendBotMessage("You selected Dormitory. Please fill Block and Room Number.");
        }

        else if (category === "Laboratory") {
            extra.innerHTML = `
                <input type="text" id="labName" placeholder="Lab Name">
                <input type="text" id="equipment" placeholder="Equipment">
            `;
            sendBotMessage("You selected Laboratory. Please fill Lab Name and Equipment.");
        }

        else if (category === "Internet") {
            extra.innerHTML = `
                <input type="text" id="location" placeholder="Location">
                <input type="text" id="issueType" placeholder="Issue Type">
            `;
            sendBotMessage("You selected Internet. Please fill Location and Issue Type.");
        }

        else if (category === "Classroom") {
            extra.innerHTML = `
                <input type="text" id="building" placeholder="Building">
                <input type="text" id="classroomNumber" placeholder="Classroom Number">
            `;
            sendBotMessage("You selected Classroom. Please fill Building and Classroom Number.");
        }
    });

});

function submitComplaint() {

    const errorDiv = document.getElementById("form-error");
    errorDiv.innerHTML = "";

    // Remove old red borders
    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("input-error");
    });

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("fileUpload");

    let hasError = false;

    if (!title) {
        document.getElementById("title").classList.add("input-error");
        hasError = true;
    }

    if (!description) {
        document.getElementById("description").classList.add("input-error");
        hasError = true;
    }

    if (!category) {
        errorDiv.innerHTML = "Please select a category.";
        return;
    }

    let extraInfo = "";

    if (category === "Dormitory") {
        const block = document.getElementById("block");
        const room = document.getElementById("room");

        if (!block.value.trim()) {
            block.classList.add("input-error");
            hasError = true;
        }

        if (!room.value.trim()) {
            room.classList.add("input-error");
            hasError = true;
        }

        extraInfo = `Block: ${block.value}, Room: ${room.value}`;
    }

    else if (category === "Laboratory") {
        const labName = document.getElementById("labName");
        const equipment = document.getElementById("equipment");

        if (!labName.value.trim()) {
            labName.classList.add("input-error");
            hasError = true;
        }

        if (!equipment.value.trim()) {
            equipment.classList.add("input-error");
            hasError = true;
        }

        extraInfo = `Lab: ${labName.value}, Equipment: ${equipment.value}`;
    }

    else if (category === "Internet") {
        const location = document.getElementById("location");
        const issueType = document.getElementById("issueType");

        if (!location.value.trim()) {
            location.classList.add("input-error");
            hasError = true;
        }

        if (!issueType.value.trim()) {
            issueType.classList.add("input-error");
            hasError = true;
        }

        extraInfo = `Location: ${location.value}, Issue: ${issueType.value}`;
    }

    else if (category === "Classroom") {
        const building = document.getElementById("building");
        const classroomNumber = document.getElementById("classroomNumber");

        if (!building.value.trim()) {
            building.classList.add("input-error");
            hasError = true;
        }

        if (!classroomNumber.value.trim()) {
            classroomNumber.classList.add("input-error");
            hasError = true;
        }

        extraInfo = `Building: ${building.value}, Room: ${classroomNumber.value}`;
    }

    if (hasError) {
        errorDiv.innerHTML = "Please fill all required fields before submitting.";
        return;
    }

    const newComplaint = {
        id: Date.now(),
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
    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("fileUpload").value = "";
    document.getElementById("extra-fields").innerHTML = "";
    errorDiv.innerHTML = "";

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
    if (currentRole !== "staff") return;
    const container = document.getElementById("staff-complaints");
    container.innerHTML = "";

    const departmentComplaints = complaints.filter(c => c.category === currentUser);

    if (departmentComplaints.length === 0) {
        container.innerHTML = "<p>No complaints available for your department.</p>";
        return;
    }

    departmentComplaints.forEach(c => {
        container.innerHTML += `
            <div>
                <strong>Title:</strong> ${c.title}<br>
                <strong>Description:</strong> ${c.description}<br>
                <strong>Category:</strong> ${c.category}<br>
                <strong>Student:</strong> ${c.student}<br>
                <strong>Status:</strong> ${c.status}<br>

                <select onchange="updateStatus(${c.id}, this.value)" 
                    ${c.status === "Resolved" ? "disabled" : ""}>
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
    if (currentRole !== "admin") return;
    const container = document.getElementById("admin-complaints");
    container.innerHTML = "";


    // ====== STATISTICS ======
    const total = complaints.length;
    const open = complaints.filter(c => c.status === "Open").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    const resolutionRate = total > 0 
    ? ((resolved / total) * 100).toFixed(1) 
    : 0;

    container.innerHTML += `
    <h3>System Overview</h3>
    <p><strong>Total Complaints:</strong> ${total}</p>
    <p class="status-open">Open: ${open}</p>
    <p class="status-in-progress">In Progress: ${inProgress}</p>
    <p class="status-resolved">Resolved: ${resolved}</p>
    <p><strong>Resolution Rate:</strong> ${resolutionRate}%</p>
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
    renderCategoryChart();
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

            <strong>Category:</strong>
            <button onclick="adminDeleteComplaint(${c.id})" style="color:red;">
                Delete
            </button>
            <select onchange="adminChangeCategory(${c.id}, this.value)">
                <option value="Dormitory" ${c.category === "Dormitory" ? "selected" : ""}>Dormitory</option>
                <option value="Laboratory" ${c.category === "Laboratory" ? "selected" : ""}>Laboratory</option>
                <option value="Internet" ${c.category === "Internet" ? "selected" : ""}>Internet</option>
                <option value="Classroom" ${c.category === "Classroom" ? "selected" : ""}>Classroom</option>
            </select>
            <br>
        </div>
    `;
});
}

// UPDATE STATUS
function updateStatus(id, newStatus) {
    const complaint = complaints.find(c => c.id === id);

    if (!complaint) return;

    // 🚦 Enforce workflow rules
    if (complaint.status === "Open" && newStatus === "Resolved") {
        alert("You must move to 'In Progress' before resolving.");
        return;
    }

    if (complaint.status === "Resolved") {
        alert("Resolved complaints cannot be changed.");
        return;
    }

    if (complaint.status === "In Progress" && newStatus === "Open") {
        alert("Cannot move backward to Open.");
        return;
    }

    complaint.status = newStatus;

    localStorage.setItem("complaints", JSON.stringify(complaints));

    renderStaff();
}
let adminChartInstance = null;

function renderAdminChart() {

    const open = complaints.filter(c => c.status === "Open").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    const ctx = document.getElementById("adminChart");
    if (!ctx) return;

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
}   // ✅ CLOSE IT HERE


// ✅ OUTSIDE the previous function
let categoryChartInstance = null;

function renderCategoryChart() {

    const ctx = document.getElementById("categoryChart");
    if (!ctx) return;

    const categories = {};

    complaints.forEach(c => {
        if (!categories[c.category]) {
            categories[c.category] = 0;
        }
        categories[c.category]++;
    });

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
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

// Admin: Change Category
function adminChangeCategory(id, newCategory) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    complaint.category = newCategory;
    localStorage.setItem("complaints", JSON.stringify(complaints));

    renderAdmin();
}

// Admin: Delete Complaint
function adminDeleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    complaints = complaints.filter(c => c.id !== id);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    renderAdmin();
}


// ================= CHATBOT =================
document.addEventListener("DOMContentLoaded", function () {

    let detectedCategory = "";
    let detectedIssue = "";

    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatContainer = document.getElementById("chatbot-container");
    const chatInput = document.getElementById("chatbot-input");

    function sendBotMessage(message) {
        const chatMessages = document.getElementById("chatbot-messages");
        if (!chatMessages) return;

        chatMessages.innerHTML += `<div><strong>Bot:</strong> ${message}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            chatContainer.classList.toggle("hidden");
        });
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {

                const userMessage = this.value.trim();
                if (!userMessage) return;

                const chatMessages = document.getElementById("chatbot-messages");
                chatMessages.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;

                this.value = "";

                const response = getBotResponse(userMessage);
                sendBotMessage(response);
            }
        });
    }

  function getBotResponse(message) {

    const msg = message.toLowerCase();
    const words = msg.split(/\s+/);

    // ================= FIELD HELP (HIGHEST PRIORITY) =================

    if (msg.includes("lab name") && detectedCategory === "Laboratory") {
        return "Write the official name of the laboratory. Example: Computer Lab 1 or Chemistry Lab A.";
    }

    if (msg.includes("equipment") && detectedCategory === "Laboratory") {
        return "Write the name of the damaged equipment. Example: Microscope, Projector, Beaker.";
    }

    if (msg.includes("location") && detectedCategory === "Internet") {
        return "Write where the internet problem happens. Example: Block B Room 203.";
    }

    if (msg.includes("issue type") && detectedCategory === "Internet") {
        return "Write the type of internet issue. Example: No connection, Slow speed, Router problem.";
    }

    if (msg.includes("block") && detectedCategory === "Dormitory") {
        return "Write your dormitory block. Example: Block A.";
    }

    if (msg.includes("room") && detectedCategory === "Dormitory") {
        return "Write your room number. Example: Room 12.";
    }

    // ===== TITLE HELP =====

if (msg.includes("title")) {

    if (detectedCategory === "Dormitory") {
        return "Write a short summary of the problem. Example: 'Broken Bed - Dormitory' or 'Water Leakage in Block A'.";
    }

    if (detectedCategory === "Laboratory") {
        return "Write a short summary of the problem. Example: 'Broken Microscope - Laboratory' or 'Projector Not Working in Lab'.";
    }

    if (detectedCategory === "Internet") {
        return "Write a short summary of the problem. Example: 'WiFi Not Working - Internet' or 'Slow Network in Block B'.";
    }

    if (detectedCategory === "Classroom") {
        return "Write a short summary of the problem. Example: 'Broken Chair - Classroom' or 'Projector Not Working in Room 12'.";
    }

    return "Write a short summary of your problem. Example: 'Broken Chair in Dormitory'.";
}
    // ===== DESCRIPTION HELP =====
    if (msg.includes("description")) {
        return "In the description, explain the problem in detail. Mention what happened, where exactly it happened, and any important information. Example: 'The chair in Classroom 12 has a broken leg and may cause injury to students.'";
}
    // ================= LOCATION DETECTION =================

    if (words.includes("dorm") || words.includes("hostel")) {
        detectedCategory = "Dormitory";
        return "This seems to be a Dormitory issue. Please select Dormitory category.";
    }

    if (words.includes("lab") || words.includes("laboratory")) {
        detectedCategory = "Laboratory";
        return "This appears to be a Laboratory issue. Please select Laboratory category.";
    }

    if (words.includes("class") || words.includes("classroom")) {
        detectedCategory = "Classroom";
        return "This sounds like a Classroom issue. Please select Classroom category.";
    }

    if (words.includes("internet") || words.includes("wifi") || words.includes("network")) {
        detectedCategory = "Internet";
        return "This is an Internet issue. Please select Internet category.";
    }

    // ================= ISSUE DETECTION =================

    if (msg.includes("chair") || msg.includes("table") || msg.includes("bed") || msg.includes("projector")) {
        return "Please mention where this issue is happening (Dormitory, Classroom, Laboratory).";
    }

    if (msg.includes("broken") || msg.includes("missing") || msg.includes("not working")) {
        return "Please mention what item has the issue and where it is happening.";
    }

    // ================= DEFAULT RESPONSE =================

    return "Please describe your issue clearly and mention where it is happening.";
}
});