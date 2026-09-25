//======================
// FIREBASE CONFIG
//======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


//======================
// FIREBASE CONFIG
//======================

const firebaseConfig = {

    apiKey: "YOUR_FIREBASE_API_KEY",

    authDomain: "jatav-7b9f8.firebaseapp.com",

    databaseURL: "https://jatav-7b9f8-default-rtdb.firebaseio.com",

    projectId: "jatav-7b9f8",

    storageBucket: "jatav-7b9f8.firebasestorage.app",

    messagingSenderId: "337613651577",

    appId: "1:337613651577:web:d8159dc0cf3de766da9ea8",

    measurementId: "G-NXEHPZ992X"

};


//======================
// INITIALIZE FIREBASE
//======================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


//======================
// GLOBAL VARIABLES
//======================

let allApplications = [];


//======================
// LOAD DATA
//======================

function loadData() {

    const applicationsRef = ref(db, "loan_applications");

    onValue(applicationsRef, (snapshot) => {

        const data = snapshot.val();

        allApplications = [];

        if (data) {

            Object.keys(data).forEach(key => {

                allApplications.push({

                    id: key,

                    ...data[key]

                });

            });

        }

        updateCards();

        showTable(allApplications);

    }, (error) => {

        console.error(error);

        alert("Firebase data load error: " + error.message);

    });

}


//======================
// DASHBOARD CARDS
//======================

function updateCards() {

    document.getElementById("totalApps").innerHTML =
        allApplications.length;

    let pending = 0;

    let approved = 0;

    let rejected = 0;


    allApplications.forEach(item => {

        if (item.status === "Approved") {

            approved++;

        }

        else if (item.status === "Rejected") {

            rejected++;

        }

        else {

            pending++;

        }

    });


    document.getElementById("pendingApps").innerHTML =
        pending;

    document.getElementById("approvedApps").innerHTML =
        approved;

    document.getElementById("rejectedApps").innerHTML =
        rejected;

}


//======================
// STATUS CLASS
//======================

function getStatusClass(status) {

    if (status === "Approved")
        return "approved";

    if (status === "Rejected")
        return "rejected";

    return "pending";

}


//======================
// SHOW TABLE
//======================

function showTable(data) {

    let html = "";


    data.forEach(item => {

        html += `

<tr>

<td>${item.full_name || ""}</td>

<td>${item.mobile || ""}</td>

<td>${item.email || ""}</td>

<td>${item.city || ""}</td>

<td>${item.loan_type || ""}</td>

<td>₹ ${item.loan_amount || 0}</td>

<td>

<span class="status ${getStatusClass(item.status)}">

${item.status || "Pending"}

</span>

</td>

<td>

<button
class="action-btn view"
onclick="viewApplication('${item.id}')">

View

</button>

<button
class="action-btn delete"
onclick="deleteApplication('${item.id}')">

Delete

</button>

</td>

</tr>

`;

    });


    document.getElementById("tableData").innerHTML = html;

}


//======================
// LIVE SEARCH
//======================

document
.getElementById("searchBox")
.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();


    const filterData = allApplications.filter(item => {

        return (

            (item.full_name || "")
                .toLowerCase()
                .includes(value)

            ||

            (item.mobile || "")
                .toLowerCase()
                .includes(value)

            ||

            (item.email || "")
                .toLowerCase()
                .includes(value)

        );

    });


    showTable(filterData);

});


//======================
// REFRESH BUTTON
//======================

document
.getElementById("refreshBtn")
.addEventListener("click", function () {

    loadData();

});


//======================
// VIEW APPLICATION
//======================

window.viewApplication = function (id) {

    const app = allApplications.find(
        x => x.id === id
    );


    if (!app) {

        return;

    }


    alert(

        "Name : " + (app.full_name || "") +

        "\n\nMobile : " + (app.mobile || "") +

        "\n\nEmail : " + (app.email || "") +

        "\n\nCity : " + (app.city || "") +

        "\n\nLoan : " + (app.loan_type || "") +

        "\n\nAmount : ₹" + (app.loan_amount || "") +

        "\n\nStatus : " + (app.status || "Pending")

    );

};


//======================
// DELETE APPLICATION
//======================

window.deleteApplication = async function (id) {

    const ok = confirm(
        "Delete this application?"
    );


    if (!ok) {

        return;

    }


    try {

        const applicationRef =
            ref(db, "loan_applications/" + id);


        await remove(applicationRef);


        alert(
            "Application deleted successfully."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Delete error: " + error.message
        );

    }

};


//======================
// CHANGE STATUS
//======================

window.updateStatus = async function (id, status) {

    try {

        const applicationRef =
            ref(db, "loan_applications/" + id);


        await update(applicationRef, {

            status: status

        });


    }

    catch (error) {

        console.error(error);

        alert(
            "Status update error: " +
            error.message
        );

    }

};


//======================
// STATUS DROPDOWN
//======================

window.statusDropdown = function (
    id,
    currentStatus
) {

    return `

<select
onchange="updateStatus('${id}',this.value)">

<option
value="Pending"
${currentStatus === "Pending" ? "selected" : ""}>
Pending
</option>

<option
value="Approved"
${currentStatus === "Approved" ? "selected" : ""}>
Approved
</option>

<option
value="Rejected"
${currentStatus === "Rejected" ? "selected" : ""}>
Rejected
</option>

</select>

`;

};


//======================
// LOGOUT
//======================

document
.getElementById("logoutBtn")
.addEventListener("click", logout);


function logout() {

    const ok = confirm(
        "Are you sure you want to logout?"
    );


    if (!ok) {

        return;

    }


    localStorage.removeItem("adminLogin");

    localStorage.removeItem("adminEmail");

    localStorage.removeItem("adminRole");


    window.location.href =
        "admin-login.html";

}


//======================
// START
//======================

loadData();
