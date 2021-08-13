

// Toggles between showing and hiding the content
function dropDown() {
    document.getElementById('dropdown-content').classList.toggle('show');
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
let undoIncomeWindow;
function undoIncome() {
    undoIncomeWindow = window.open('/income/undo' );
}

// Loading graph
window.addEventListener('load', (event) => {
    let req = new XMLHttpRequest();
    let payload = {
        "column":[{"type":"string","title":"Toppings"}, {"type":"number","title":"Slices"}],
        "row":[{"name":"Mushrooms","value":"3"},{"name":"Onions","value":"1"},{"name":"Olives","value":"2"}]
    };
    req.open('POST', 'http://flip2.engr.oregonstate.edu:3003/', false);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
})