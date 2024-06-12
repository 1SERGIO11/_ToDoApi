let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
let currentCategory = null;
let currentTaskName = ''; // Переменная для хранения значения задачи

function checkUserState() {
    if (currentUser) {
        document.getElementById('form-container').style.left = '90px';
    } else {
        document.getElementById('form-container').style.left = '0px';
    }
}

function loginUser(username, password) {
    fetch('/api/Auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('User logged in:', currentUser);
                hideRegistrationButton();
                showTaskCount(); // Показать количество задач
                showMainDropdown(); // Показать дропдаун
                getCategories();
                getItems();
                updateLogoutButton(); // Обновляем состояние кнопки "Выйти"
                document.getElementById('form-container').style.left = '90px';
                modal.style.display = "none";
                // Очистка полей формы после успешного входа
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                console.log('Login failed');
            }
        })
        .catch(error => console.error('Error:', error));
}

function registerUser(username, password) {
    fetch('/api/Auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('User registered:', currentUser);
                hideRegistrationButton();
                showTaskCount(); // Показать количество задач
                showMainDropdown(); // Показать дропдаун
                getCategories();
                getItems();
                updateLogoutButton(); // Обновляем состояние кнопки "Выйти"
                document.getElementById('form-container').style.left = '90px';
                modal.style.display = "none";

                // Очистка полей формы после успешной регистрации
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';

            } else {
                console.log('Registration failed');
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (currentUser) {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');

    function removeSuccess() {
        logoutBtn.classList.remove('success');
    }

    logoutBtn.addEventListener('click', function () {
        logoutBtn.classList.add('success');
        setTimeout(removeSuccess, 3000);
    });

    // Назначаем обработчик событий для новой кнопки
    logoutBtn.addEventListener('click', logoutUser);

    // Инициализируем состояние кнопки при создании
    updateLogoutButton();

    // Проверка состояния пользователя и установка left для формы
    checkUserState();
});

function logoutUser(event) {
    event.preventDefault(); // Предотвращение перехода по ссылке
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    document.getElementById('form-container').style.left = '0px';
    showRegistrationButton();
    hideTaskCount(); // Скрыть количество задач
    hideMainDropdown(); // Скрыть дропдаун
    document.querySelector('.todo-list').innerHTML = ''; // Очистка списка задач
    console.log('User logged out');
    updateLogoutButton(); // Обновляем состояние кнопки "Выйти"
}

document.getElementById('logoutBtn').addEventListener('click', logoutUser);
updateLogoutButton();

function showCategorySelectionModal() {
    var categoryModal = document.getElementById("categoryTask");
    categoryModal.style.display = "block";
    getCategories(); // Получение категорий перед отображением модального окна
}

document.getElementById("choiceCategory").addEventListener('click', function (event) {
    event.preventDefault();
    var categoryModal = document.getElementById("categoryTask");
    categoryModal.style.display = "none";
    var categorySelectModal = document.getElementById("categorySelect");
    categorySelectModal.style.display = "block";
});

document.getElementById("selectCategoryBtn").addEventListener('click', function () {
    var categorySelect = document.getElementById("categoryDropdown");
    currentCategory = categorySelect.value;
    var categorySelectModal = document.getElementById("categorySelect");
    categorySelectModal.style.display = "none";
    getItems(); // Обновляем список задач на основе выбранной категории
});

function setDropdownCategory(categoryId) {
    const categoryDropdown = document.querySelector('.custom-dropdown select');
    categoryDropdown.value = categoryId;
}

document.getElementById("selectCategoryBtn").addEventListener('click', function () {
    var categorySelect = document.getElementById("categoryDropdown");
    currentCategory = categorySelect.value;
    var categorySelectModal = document.getElementById("categorySelect");
    categorySelectModal.style.display = "none";
    addItemToDatabase(); // Добавляем задачу в базу данных и отображаем на странице
    setDropdownCategory(currentCategory); // Обновляем выбранную категорию в дропдаун списке
});

function hideMainDropdown() {
    document.getElementById('mainDropdown').style.display = 'none';
}

function showMainDropdown() {
    document.getElementById('mainDropdown').style.display = 'block';
}

const uri = '/api/TodoItems';
let todos = [];

// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const form = document.getElementById('todo-form');
const categorySelect = document.querySelector('.custom-dropdown select'); // Объявление переменной для выбора категории

categorySelect.addEventListener('change', function () {
    currentCategory = categorySelect.value;
    getItems(); // Обновляем список задач на основе выбранной категории
    setDropdownCategory(currentCategory); // Обновляем выбранную категорию в дропдаун списке
});
// Event Listeners
form.addEventListener('submit', addItem);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        hideRegistrationButton();
        showTaskCount(); // Показать количество задач
        showMainDropdown(); // Показать дропдаун
        getCategories();
        getItems();
    } else {
        hideTaskCount(); // Скрыть количество задач
        hideMainDropdown(); // Скрыть дропдаун
    }
    getCategories();
    updateLogoutButton(); // Обновляем состояние кнопки "Выйти"
});

categorySelect.addEventListener('change', function () {
    currentCategory = categorySelect.value;
    getItems(); // Обновляем список задач на основе выбранной категории
    setDropdownCategory(currentCategory); // Обновляем выбранную категорию в выпадающем списке
});

standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(localStorage.getItem('savedTheme'));

// Functions
function getItems() {
    if (!currentUser) {
        console.log('User not logged in');
        return;
    }

    const params = new URLSearchParams({ userId: currentUser.id });
    if (currentCategory && currentCategory !== "all") {
        params.append('categoryId', currentCategory);
    }

    fetch(`${uri}?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            todos = data;
            console.log('Fetched items:', todos);
            _displayItems(todos);
        })
        .catch(error => console.error('Unable to get items.', error));
}

function getCategories() {
    if (!currentUser) {
        console.log('User not logged in');
        return;
    }

    fetch('/api/Categories')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched categories:', data);
            populateCategoryDropdown(data);
        })
        .catch(error => console.error('Unable to get categories.', error));
}

function populateCategoryDropdown(categories) {
    const categoryDropdown = document.getElementById('categoryDropdown'); // Добавлено для модального окна
    categorySelect.innerHTML = '<option value="all">Все</option>';
    categoryDropdown.innerHTML = '<option value="all">Все</option>'; // Очистка выпадающего списка в модальном окне

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        const modalOption = document.createElement('option'); // Добавлено для модального окна
        modalOption.value = category.id;
        modalOption.textContent = category.name;
        categoryDropdown.appendChild(modalOption); // Добавление опций в модальное окно
    });
    console.log('Category dropdown populated:', categorySelect.innerHTML);
}

function addItem(event) {
    event.preventDefault();

    if (!currentUser) {
        showRegistrationModal();
        return;
    }

    currentTaskName = toDoInput.value.trim(); // Сохраняем значение задачи

    // Проверяем, пустое ли поле задачи
    if (!currentTaskName) {
        displayTaskError(true);
        return;
    } else {
        displayTaskError(false);
    }

    if (!currentCategory) {
        showCategorySelectionModal();
        return;
    }

    addItemToDatabase(); // Вызываем новую функцию для добавления задачи
}

function displayTaskError(show) {
    const errorElement = document.getElementById('taskError');
    if (show) {
        toDoInput.classList.add('error');
        errorElement.style.display = 'block';
    } else {
        toDoInput.classList.remove('error');
        errorElement.style.display = 'none';
    }
}

function addItemToDatabase() {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const categoryName = categoryDropdown.options[categoryDropdown.selectedIndex].text;

    const item = {
        isComplete: false,
        name: currentTaskName, // Используем сохраненное значение задачи
        userId: currentUser.id,
        categoryId: currentCategory !== "all" ? currentCategory : 0, // Задаем значение по умолчанию
        user: { id: currentUser.id, username: currentUser.username, password: currentUser.password }, // Добавляем объект пользователя с id, username и password
        category: { id: currentCategory, name: categoryName } // Добавляем объект категории с идентификатором и именем
    };

    console.log("Adding item:", item);

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Item added:', data);
            getItems();
            toDoInput.value = ''; // Очистка поля ввода задачи
            currentTaskName = ''; // Очистка сохраненного значения задачи
            setDropdownCategory(currentCategory); // Обновляем выбранную категорию в выпадающем списке
            currentCategory = null; // Сбрасываем текущую категорию после добавления
        })
        .catch(error => console.error('Unable to add item:', error));
}

function showRegistrationModal() {
    var modal = document.getElementById("loginModal");
    modal.style.display = "block";
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        userId: currentUser.id,  // Добавляем userId и categoryId
        categoryId: currentCategory || 0
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();
    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function updateTaskCount(count) {
    const taskCountElement = document.getElementById('countTasks');
    taskCountElement.textContent = getTaskCountText(count);
}


function showTaskCount() {
    const taskCountElement = document.getElementById('countTasks');
    taskCountElement.style.display = 'block';
}

function hideTaskCount() {
    const taskCountElement = document.getElementById('countTasks');
    taskCountElement.style.display = 'none';
}

function _displayItems(data) {
    toDoList.innerHTML = '';

    const filteredData = currentCategory && currentCategory !== "all"
        ? data.filter(item => item.categoryId == currentCategory)
        : data;

    filteredData.sort((a, b) => b.id - a.id);

    updateTaskCount(filteredData.length);

    filteredData.forEach(item => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add('todo', `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = item.name;
        newToDo.classList.add('todo-item');
        newToDo.setAttribute('data-id', item.id);
        if (item.isComplete) {
            newToDo.classList.add('completed');
        }

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        checked.onclick = () => {
            item.isComplete = !item.isComplete;
            updateItemStatus(item);
        };

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        deleted.onclick = () => deleteItem(item.id);

        newToDo.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item.name;
            input.className = 'edit-input';
            input.setAttribute('maxlength', '1000');
            input.style.fontFamily = 'inherit';
            input.style.fontSize = 'inherit';
            input.style.color = 'inherit';
            input.style.backgroundColor = window.getComputedStyle(newToDo).backgroundColor;
            input.style.border = 'none';
            input.style.width = newToDo.offsetWidth + 'px';
            input.style.height = newToDo.offsetHeight + 'px';
            newToDo.innerText = '';
            newToDo.appendChild(input);

            checked.style.display = 'none';
            deleted.style.display = 'none';

            input.focus();

            function resizeInput() {
                input.style.width = 'auto';
                input.style.height = 'auto';
                input.style.width = input.scrollWidth + 'px';
                input.style.height = input.scrollHeight + 'px';
            }

            input.addEventListener('input', resizeInput);
            resizeInput();

            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    item.name = input.value.trim();
                    if (item.name !== '') {
                        updateItemInline(item, newToDo, input.value);
                    }
                }
            });
            input.addEventListener('blur', function () {
                item.name = input.value.trim();
                if (item.name !== '') {
                    updateItemInline(item, newToDo, input.value);
                } else {
                    newToDo.innerText = item.name;
                    checked.style.display = 'inline-block';
                    deleted.style.display = 'inline-block';
                }
            });
        });

        toDoDiv.appendChild(newToDo);
        toDoDiv.appendChild(checked);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}

function updateItemInline(item, listItemElement, newValue) {
    const updatedItem = {
        id: item.id,
        isComplete: item.isComplete,
        name: item.name,
        userId: item.userId,
        categoryId: item.categoryId,
        user: { id: item.userId, username: currentUser.username, password: currentUser.password },
        category: { id: item.categoryId, name: "CategoryName" }
    };

    fetch(`${uri}/${item.id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            listItemElement.innerText = newValue;
            const parentDiv = listItemElement.parentElement;
            const buttons = parentDiv.querySelectorAll('button');
            buttons.forEach(button => button.style.display = 'inline-block');
        })
        .catch(error => console.error('Unable to update item:', error));
}






function updateItemStatus(item) {
    const updatedItem = {
        id: item.id,
        isComplete: item.isComplete,
        name: item.name,
        userId: item.userId,
        categoryId: item.categoryId,
        user: { id: item.userId, username: currentUser.username, password: currentUser.password },
        category: { id: item.categoryId, name: "CategoryName" } // Замените "CategoryName" на правильное имя категории
    };

    console.log("Updating item status:", updatedItem);

    fetch(`${uri}/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            // Возвращаем пустой объект если нет тела ответа
            return response.status !== 204 ? response.json() : {};
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item status:', error));
}

function deletecheck(event) {
    const item = event.target;

    if (item.classList.contains('delete-btn')) {
        item.parentElement.remove();
        deleteItem(item.parentElement.querySelector('.todo-item').dataset.id);
    }

    if (item.classList.contains('check-btn')) {
        item.parentElement.classList.toggle("completed");
    }
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;

    color === 'darker' ?
        document.getElementById('title').classList.add('darker-title') :
        document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed` :
            todo.className = `todo ${color}-todo`;
    });

    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}

function getTaskCountText(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return `${count} Задача`;
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return `${count} Задачи`;
    } else {
        return `${count} Задач`;
    }
}

function hideRegistrationButton() {
    document.getElementById('loginBtn').style.display = 'none';
}

function showRegistrationButton() {
    document.getElementById('loginBtn').style.display = 'block';
}
