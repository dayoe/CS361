

//Toggles between showing and hiding the content
function dropDown() {
    document.getElementById('dropdown-content').classList.toggle('show');
}

//Closing the menu if the user clicks out
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

