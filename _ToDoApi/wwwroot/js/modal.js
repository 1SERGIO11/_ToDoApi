// Get the modal
var modal = document.getElementById("loginModal");

// Get the button that opens the modal
var btn = document.getElementById("loginBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the elements for toggling
var modalTitle = document.getElementById("modalTitle");
var toggleText = document.getElementById("toggleText");

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to toggle between Registration and Login
function toggleForm(event) {
    event.preventDefault();
    if (modalTitle.innerText === "Регистрация") {
        modalTitle.innerText = "Вход";
        toggleText.innerHTML = 'Впервые у нас? <a href="#" id="toggleLink">Зарегистрироваться</a>';
    } else {
        modalTitle.innerText = "Регистрация";
        toggleText.innerHTML = 'Я уже <a href="#" id="toggleLink">зарегистрирован</a>';
    }
    // Reassign the toggleLink variable to the new link element
    var toggleLink = document.getElementById("toggleLink");
    toggleLink.addEventListener('click', toggleForm);
}

// Initial assignment of the click event
var toggleLink = document.getElementById("toggleLink");
toggleLink.addEventListener('click', toggleForm);

// Example form submission handling for login
document.getElementById('signin').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    if (modalTitle.innerText === "Регистрация") {
        registerUser(username, password);
    } else {
        loginUser(username, password);
    }
});
