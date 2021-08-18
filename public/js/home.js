

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
    "xaxis":{"title":"Age","min":"0","max":"15"},"yaxis":{"title":"Weight","min":"0","max":"15"},"points":"[8, 1],[4, 5]", "title":"Age vs. Weight comparison"
    };
    req.open('POST', 'http://flip2.engr.oregonstate.edu:3003/scatter', false);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    console.log(req.responseText);
    console.log('request has been sent')
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', req.responseText)
})