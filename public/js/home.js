

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

// Closing the menu if the user clicks out
window.onclick = function(event) {
    if (!event.target.matches('.dropobtn')) {
        let drop_menu = document.getElementsByClassName('dropdown_content');
        for (let i = 0; i < drop_menu.length; i++) {
            let open_dropdown = drop_menu[i];
            if (open_dropdown.classList.contains('show')) {
                open_dropdown.classList.remove('show');
            }
        }
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
    document.getElementById('graph').src = './img/chart.png';
})