// ================================== Theme ============================================

const themeToggle = document.querySelector("#theme-toggle");
const themeToggleThumb = document.querySelector("#theme-toggle span");



if (localStorage.getItem("theme") === "dark") {

    document.documentElement.classList.add("dark");

    if (themeToggle && themeToggleThumb) {

        themeToggle.classList.remove("bg-slate-300");
        themeToggle.classList.add("bg-blue-600");

        themeToggleThumb.classList.remove("left-1");
        themeToggleThumb.classList.add("left-7");

    }

}



if (themeToggle && themeToggleThumb) {

    themeToggle.addEventListener("click", () => {

        document.documentElement.classList.toggle("dark");

        const isDark = document.documentElement.classList.contains("dark");

        if (isDark) {

            localStorage.setItem("theme", "dark");

            themeToggle.classList.remove("bg-slate-300");
            themeToggle.classList.add("bg-blue-600");

            themeToggleThumb.classList.remove("left-1");
            themeToggleThumb.classList.add("left-7");

        } else {

            localStorage.setItem("theme", "light");

            themeToggle.classList.remove("bg-blue-600");
            themeToggle.classList.add("bg-slate-300");

            themeToggleThumb.classList.remove("left-7");
            themeToggleThumb.classList.add("left-1");

        }

    });

}



// ================================================= Add Transection ================================================= 






// ================================================= Registration ================================================= 
const registerForm = document.querySelector("#register-form");

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value.trim();

        // Empty Validation

        if (username === "" || password === "") {

            alert("Please fill all fields.");

            return;

        }

        // Check Existing User

        const registeredUser = JSON.parse(localStorage.getItem("user"));

        if (registeredUser) {

            alert("You are already registered.");

            return;

        }

        // Create User

        const user = {

            username,
            password

        };

        // Save User

        localStorage.setItem("user", JSON.stringify(user));

        // Auto Login

        localStorage.setItem("isLoggedIn", "true");

        // Redirect

        window.location.href = "dashboard.html";

    });

}

// ================================================= Logged In Username =================================================

const loggedInUsername = document.querySelector("#logged-in-username");

if (loggedInUsername) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {

        loggedInUsername.textContent = user.username;

    }

}


// ================================================= log-out =================================================


const logoutBtn = document.querySelector("#logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("isLoggedIn");

        window.location.replace("login.html");

    });

}


// ================================================= log-in =================================================

const loginForm = document.querySelector("#login-form");

if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value.trim();

        // Empty Validation

        if (username === "" || password === "") {

            alert("Please fill all fields.");

            return;

        }

        // Check Registered User

        const registeredUser = JSON.parse(localStorage.getItem("user"));

        if (!registeredUser) {

            alert("User not found. Please register first.");

            window.location.href = "register.html";

            return;

        }

        // Check Credentials

        if (

            username === registeredUser.username &&
            password === registeredUser.password

        ) {

            localStorage.setItem("isLoggedIn", "true");

            window.location.href = "dashboard.html";

        }

        else {

            alert("Invalid username or password.");

        }

    });

}


// ================================================= Authentication =================================================

const currentPage = window.location.pathname.split("/").pop();

if (

    (currentPage === "dashboard.html" ||
        currentPage === "settings.html") &&

    localStorage.getItem("isLoggedIn") !== "true"

) {

    window.location.replace("login.html");

}

// ================================================= Add Transection =================================================



// Transaction Modal
const transactionForm = document.querySelector("#transaction-form");
const addTransactionBtn = document.querySelector("#add-transaction-btn");
const transactionModal = document.querySelector("#transaction-modal");
const closeModalBtn = document.querySelector("#close-modal-btn");



// Transaction Form


const saveTransactionBtn = document.querySelector("#save-transaction-btn");

const transactionType = document.querySelector("#transaction-type");
const transactionDescription = document.querySelector("#transaction-description");
const transactionAmount = document.querySelector("#transaction-amount");
const transactionDate = document.querySelector("#transaction-date");
const transactionCategory = document.querySelector("#transaction-category");



// Transactions Array


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];



// Open Modal


if (addTransactionBtn && transactionModal && closeModalBtn) {

    addTransactionBtn.addEventListener("click", () => {

        transactionModal.classList.remove("hidden");
        transactionModal.classList.add("flex");

    });

    closeModalBtn.addEventListener("click", () => {

        transactionModal.classList.add("hidden");
        transactionModal.classList.remove("flex");

    });

    transactionModal.addEventListener("click", (event) => {

        if (event.target === transactionModal) {

            transactionModal.classList.add("hidden");
            transactionModal.classList.remove("flex");

        }

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            transactionModal.classList.add("hidden");
            transactionModal.classList.remove("flex");

        }

    });

}



// Save Transaction

const transactionTableBody = document.querySelector("#transaction-table-body");

if (saveTransactionBtn) {

    saveTransactionBtn.addEventListener("click", (event) => {

        event.preventDefault();

        const type = transactionType.value;
        const description = transactionDescription.value.trim();
        const amount = Number(transactionAmount.value);
        const date = transactionDate.value;
        const category = transactionCategory.value;

        // Validation

        if (
            description === "" ||
            amount <= 0 ||
            date === "" ||
            category === ""
        ) {

            alert("Please fill all fields.");
            return;

        }

        // Transaction Object

        const transaction = {

            id: Date.now(),

            type,

            description,

            amount,

            date,

            category

        };

        // Push Into Array

        transactions.push(transaction);

        // Save Into Local Storage

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

        // Refresh Dashboard

        renderTransactions();

        updateSummaryCards();

        renderCashFlowChart();

        // Reset Form

        transactionForm.reset();

        // Close Modal

        transactionModal.classList.add("hidden");
        transactionModal.classList.remove("flex");

    });

}


// =================================================
// Render Transactions
// =================================================

function renderTransactions() {

    if (!transactionTableBody) return;

    transactionTableBody.innerHTML = "";

    // Empty State

    if (transactions.length === 0) {

        transactionTableBody.innerHTML = `

            <tr>

                <td colspan="6" class="py-16 text-center">

                    <div class="flex flex-col items-center">

                        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">

                            <i class="fa-solid fa-receipt text-2xl text-slate-400"></i>

                        </div>

                        <h3 class="mt-5 text-[18px] font-semibold text-slate-800 dark:text-white">

                            No Transactions Found

                        </h3>

                        <p class="mt-2 text-[14px] text-slate-500 dark:text-slate-400">

                            Add your first transaction to start tracking your finances.

                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

        console.log(transactions);

    }

    // Render Rows

    transactions.forEach((transaction) => {

        transactionTableBody.innerHTML += `

            <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">

                <td class="px-4 py-4">
                    ${transaction.date}
                </td>

                <td class="px-4 py-4">
                    ${transaction.category}
                </td>

                <td class="px-4 py-4">
                    ${transaction.description}
                </td>

                <td class="px-4 py-4 text-right font-semibold">
                    ₹${transaction.amount}
                </td>

                <td class="px-4 py-4 text-center">

 <td class="px-4 py-4 text-center">

    <span class="${
            transaction.type === "Income"
                ? "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }">

        ${transaction.type}

    </span>

</td>

</td>

                <td class="px-4 py-4 text-center">

                    <button class="text-slate-500 hover:text-blue-600">

                        <i class="fa-solid fa-ellipsis"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}


renderTransactions();


// ==========================================================Summary cards ================================================

const currentBalance = document.querySelector("#current-balance");

const totalIncome = document.querySelector("#total-income");

const totalExpense = document.querySelector("#total-expense");

const totalTransactions = document.querySelector("#total-transactions");


function updateSummaryCards() {

    if (

        !currentBalance ||
        !totalIncome ||
        !totalExpense ||
        !totalTransactions

    ) return;

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {

        if (transaction.type === "Income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });

    const balance = income - expense;

    currentBalance.textContent = `₹${balance.toFixed(2)}`;

    totalIncome.textContent = `₹${income.toFixed(2)}`;

    totalExpense.textContent = `₹${expense.toFixed(2)}`;

    totalTransactions.textContent = transactions.length;

}

updateSummaryCards();


// ==========================================================Chart ================================================

let cashFlowChart = null;

function renderCashFlowChart() {

    console.log("Chart Function Called");

    console.log(transactions);

    const chartCanvas = document.querySelector("#cash-flow-chart");

    if (!chartCanvas) return;

    const incomeData = [0, 0, 0, 0, 0, 0];
    const expenseData = [0, 0, 0, 0, 0, 0];

    const labels = [];

    const today = new Date();

    // Last 6 Months

    for (let i = 5; i >= 0; i--) {

        const month = new Date(

            today.getFullYear(),
            today.getMonth() - i,
            1

        );

        labels.push(

            month.toLocaleString("default", {

                month: "short"

            })

        );

    }

    // Calculate Monthly Data

    transactions.forEach((transaction) => {

        const transactionDate = new Date(transaction.date);

        const monthDiff =

            (today.getFullYear() - transactionDate.getFullYear()) * 12 +

            (today.getMonth() - transactionDate.getMonth());

        if (monthDiff >= 0 && monthDiff < 6) {

            const index = 5 - monthDiff;

            if (transaction.type === "Income") {

                incomeData[index] += transaction.amount;

            }

            else {

                expenseData[index] += transaction.amount;

            }

        }

    });

    // Destroy Previous Chart

    if (cashFlowChart) {

        cashFlowChart.destroy();

    }

    cashFlowChart = new Chart(chartCanvas, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {

                    label: "Income",

                    data: incomeData,

                    backgroundColor: "#22C55E",

                    borderRadius: 6,

                    barThickness: 22

                },

                {

                    label: "Expense",

                    data: expenseData,

                    backgroundColor: "#EF4444",

                    borderRadius: 6,

                    barThickness: 22

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "top",

                    labels: {

                        color: "#94A3B8",

                        usePointStyle: true,

                        pointStyle: "rectRounded"

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        color: "#94A3B8"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#94A3B8"

                    },

                    grid: {

                        color: "rgba(148,163,184,.15)"

                    }

                }

            }

        }

    });

}

renderCashFlowChart();

// ================================================= Reset All Data =================================================

const resetDataBtn = document.querySelector("#reset-data-btn");

if (resetDataBtn) {

    resetDataBtn.addEventListener("click", () => {

        const confirmReset = confirm(
            "Are you sure you want to reset all transaction data?"
        );

        if (!confirmReset) return;

        // Clear Transactions

        transactions = [];

        localStorage.removeItem("transactions");

        // Refresh Dashboard

        renderTransactions();

        updateSummaryCards();

        renderCashFlowChart();

        alert("All transaction data has been reset successfully.");

    });

}

// ======================================================= Settings ======================================


// Profile Details


const profileUsername = document.querySelector("#profile-username");

if (profileUsername) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {

        profileUsername.value = user.username;

    }

}

// Profile update ---

const profileForm = document.querySelector("#profile-form");

if (profileForm) {

    profileForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        user.username = profileUsername.value.trim();

        localStorage.setItem("user", JSON.stringify(user));

        // Update Top Bar

        const loggedInUsername = document.querySelector("#logged-in-username");

        if (loggedInUsername) {

            loggedInUsername.textContent = user.username;

        }

        alert("Profile updated successfully.");

    });

}