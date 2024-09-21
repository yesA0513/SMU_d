let menuData;

fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        menuData = data;
        initializeMenus();
    });

function initializeMenus() {
    const currentMeal = getCurrentMeal();
    showMenu('seoul', currentMeal);
    showMenu('cheonan', 'student_' + currentMeal);
    
    document.getElementById('seoul_select').value = currentMeal;
    document.getElementById('cheonan_student_select').value = 'student_' + currentMeal;
    document.getElementById('restaurant_select').value = 'student';
    
    document.getElementById('cheonan_student_select').style.display = 'inline-block';
}

function getCurrentDayIndex() {
    const today = new Date().getDay();
    return today === 0 || today === 6 ? 0 : today - 1; // 주말이면 월요일 메뉴 표시
}

function getCurrentMeal() {
    const currentHour = new Date().getHours();
    return currentHour < 11 ? 'breakfast' : 'lunch';
}

function showMenu(campus, type) {
    let menuItems = [];
    const dayIndex = getCurrentDayIndex();

    if (campus === 'cheonan') {
        if (type.startsWith('student_')) {
            const mealType = type.split('_')[1];
            menuItems = menuData[campus].student[mealType][dayIndex];
        } else {
            menuItems = menuData[campus][type][dayIndex];
        }
    } else {
        menuItems = menuData[campus][type][dayIndex];
    }

    const menuElement = campus === 'seoul' 
        ? document.getElementById('seoul_menu').querySelector('ul')
        : document.getElementById('cheonan_student_dropdown').querySelector('ul');
    
    menuElement.innerHTML = '';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        menuElement.appendChild(li);
    });
}

function handleSeoulDropdownChange(event) {
    const selectedValue = event.target.value;
    showMenu('seoul', selectedValue);
}

function handleCheonanDropdownChange(event) {
    const selectedValue = event.target.value;
    showMenu('cheonan', selectedValue);
}

function handleRestaurantChange(event) {
    const selectedValue = event.target.value;
    const cheonanStudentSelect = document.getElementById('cheonan_student_select');
    
    if (selectedValue === 'student') {
        cheonanStudentSelect.style.display = 'inline-block';
        showMenu('cheonan', cheonanStudentSelect.value);
    } else {
        cheonanStudentSelect.style.display = 'none';
        showMenu('cheonan', 'staff');
    }
}