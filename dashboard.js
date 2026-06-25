//======================
// SUPABASE CONFIG
//======================

const supabaseUrl = "const supabaseUrl = "https://dqigwxlroejnmhmhxzdm.supabase.co";
const supabaseKey = "sb_publishable_O72-5olasZIGsRiKHqEmdg_SJfUcY7x";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

//======================
// GLOBAL VARIABLES
//======================

let allApplications = [];

//======================
// LOAD DATA
//======================

async function loadData(){

    const { data, error } = await supabaseClient
    .from("loan_applications")
    .select("*")
    .order("id",{ascending:false});

    if(error){

        alert(error.message);

        return;

    }

    allApplications = data;

    updateCards();

    showTable(allApplications);

}

//======================
// DASHBOARD CARDS
//======================

function updateCards(){

    document.getElementById("totalApps").innerHTML =
    allApplications.length;

    let pending = 0;

    let approved = 0;

    let rejected = 0;

    allApplications.forEach(item=>{

        if(item.status=="Approved"){

            approved++;

        }

        else if(item.status=="Rejected"){

            rejected++;

        }

        else{

            pending++;

        }

    });

    document.getElementById("pendingApps").innerHTML =
    pending;

    document.getElementById("approvedApps").innerHTML =
    approved;

    document.getElementById("rejectedApps").innerHTML =
    rejected;

}//======================
// SHOW TABLE
//======================

function getStatusClass(status){

    if(status=="Approved") return "approved";

    if(status=="Rejected") return "rejected";

    return "pending";

}

function showTable(data){

    let html="";

    data.forEach(item=>{

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

<button class="action-btn view"
onclick="viewApplication(${item.id})">

View

</button>

<button class="action-btn delete"
onclick="deleteApplication(${item.id})">

Delete

</button>

</td>

</tr>

`;

    }
                );

    document.getElementById("tableData").innerHTML = html;

}

loadData();
//======================
// LIVE SEARCH
//======================

document
.getElementById("searchBox")
.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const filterData=allApplications.filter(item=>{

return(

(item.full_name||"").toLowerCase().includes(value)

||

(item.mobile||"").toLowerCase().includes(value)

||

(item.email||"").toLowerCase().includes(value)

);

});

showTable(filterData);

});

//======================
// REFRESH BUTTON
//======================

document
.getElementById("refreshBtn")
.addEventListener("click",loadData);

//======================
// VIEW APPLICATION
//======================

function viewApplication(id){

const app=allApplications.find(x=>x.id==id);

if(!app){

return;

}

alert(

"Name : "+app.full_name+

"\n\nMobile : "+app.mobile+

"\n\nEmail : "+app.email+

"\n\nCity : "+app.city+

"\n\nLoan : "+app.loan_type+

"\n\nAmount : ₹"+app.loan_amount+

"\n\nStatus : "+(app.status||"Pending")

);

}
//======================
// DELETE APPLICATION
//======================

async function deleteApplication(id){

const ok = confirm("Delete this application?");

if(!ok){

return;

}

const { error } = await supabaseClient
.from("loan_applications")
.delete()
.eq("id",id);

if(error){

alert(error.message);

return;

}

loadData();

}

//======================
// CHANGE STATUS
//======================

async function updateStatus(id,status){

const { error } = await supabaseClient
.from("loan_applications")
.update({

status:status

})
.eq("id",id);

if(error){

alert(error.message);

return;

}

loadData();

}

//======================
// STATUS DROPDOWN
//======================

function statusDropdown(id,currentStatus){

return `

<select
onchange="updateStatus(${id},this.value)">

<option
value="Pending"
${currentStatus=="Pending"?"selected":""}>
Pending
</option>

<option
value="Approved"
${currentStatus=="Approved"?"selected":""}>
Approved
</option>

<option
value="Rejected"
${currentStatus=="Rejected"?"selected":""}>
Rejected
</option>

</select>

`;

}
//======================
// LOGOUT
//======================

document
.getElementById("logoutBtn")
.addEventListener("click",logout);

function logout(){

const ok = confirm("Are you sure you want to logout?");

if(!ok){

return;

}

localStorage.removeItem("adminLogin");
localStorage.removeItem("adminEmail");
localStorage.removeItem("adminRole");

window.location.href="admin-login.html";

}

//======================
// PAGE LOAD
//======================

window.onload=function(){

loadData();

};
