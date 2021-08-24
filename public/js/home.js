
// Toggles between showing and hiding the content
function dropIncome() {
    document.getElementById('incomeDropMenu').classList.toggle('show');
}

function dropExpense() {
    document.getElementById('expenseDropMenu').classList.toggle('show');
}

function dropGoal() {
    document.getElementById('goalDropMenu').classList.toggle('show');
}

function tutorial() {
    p = document.getElementById('tutText');
    if (!p.innerText) {
        p.innerText = 'Hello! Add your income by clicking Pay Day and entering in your income information. \n\n' +
            'If you have expenses that need to be recorded, click on the "Expenses" button and add it there.\n\n' +
            'If you would like to enter a new savings goal, or would like to check the status of all your existing goals, \n' +
            'click on Goals and enter your new goal as well as see your progress on existing goals.\n\n' +
            'Finally, the graph below shows all your sources of income by default. \n\n' +
            'Click on the "switch chart" button to show how much of your expenses are using your income.\n\n' +
            'To close this window, click on the "Tutorial" button again.';
    } else {
        p.innerText = '';
    }
}



// Undo option
let sucIncomeWindow;
function sucIncome() {
    sucIncomeWindow = window.open('/income/success');
}

let sucExpenseWindow;
function sucExpense() {
    sucExpenseWindow = window.open('/expense/success');
}

let sucGoalWindow;
function sucGoal() {
    sucGoalWindow = window.open('/goal/success');
}

// Loading graph
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('graph').src = './img/incomes.png';
})


// Switching charts
function changeChart() {
    let chart = document.getElementById('graph');
    if (chart.src.match('./img/incomes.png')) {
        chart.setAttribute('src', './img/expenses.png');
    } else {
        chart.src = './img/incomes.png';
    }
}
