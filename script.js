let menuData;
let selectedDayIndex = getCurrentDayIndex();

document.addEventListener('DOMContentLoaded', () => {
    fetch('menu_info/menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            initializeMenus();
            updateDateDisplay();
        });
});

function initializeMenus() {
    const currentMeal = getCurrentMeal();
    showMenu('seoul', currentMeal);
    showMenu('cheonan', 'student_' + currentMeal);
    
    document.getElementById('seoul_select').value = currentMeal;
    document.getElementById('cheonan_student_select').value = 'student_' + currentMeal;
    document.getElementById('restaurant_select').value = 'student';
    
    document.getElementById('cheonan_student_select').style.display = 'inline-block';
    document.getElementById('day_select').value = selectedDayIndex;
}

function getCurrentDayIndex() {
    const today = new Date().getDay();
    if (today === 0 || today === 6) {
        return 1; // 주말이면 월요일(1) 메뉴 표시
    }
    return today;
}

function isWeekend() {
    const today = new Date().getDay();
    return today === 0 || today === 6; // 일요일(0) 또는 토요일(6) 체크
}

function getCurrentMeal() {
    const currentHour = new Date().getHours();
    return currentHour < 11 ? 'breakfast' : 'lunch';
}

function showMenu(campus, type) {
    let menuItems = [];
    
    if (campus === 'cheonan') {
        if (type.startsWith('student_')) {
            const mealType = type.split('_')[1];
            menuItems = menuData?.[campus]?.student?.[mealType]?.[selectedDayIndex - 1] || [];
        } else {
            menuItems = menuData?.[campus]?.[type]?.[selectedDayIndex - 1] || [];
        }
    } else {
        menuItems = menuData?.[campus]?.[type]?.[selectedDayIndex - 1] || [];
    }

    const menuElement = campus === 'seoul' 
        ? document.getElementById('seoul_menu').querySelector('ul')
        : document.getElementById('cheonan_student_dropdown').querySelector('ul');
    
    menuElement.innerHTML = '';

    if (isWeekend()) {
        const notice = document.createElement('p');
        notice.textContent = '다음주 월요일 메뉴';
        menuElement.appendChild(notice);
    }

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

function handleDayChange(event) {
    selectedDayIndex = parseInt(event.target.value, 10);
    updateDateDisplay();
    initializeMenus();
}

function updateDateDisplay() {
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToSelectedDay = (selectedDayIndex >= currentDay) 
        ? selectedDayIndex - currentDay 
        : selectedDayIndex - currentDay + 7;
    
    const selectedDate = new Date();
    selectedDate.setDate(today.getDate() + distanceToSelectedDay);
    
    const month = selectedDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
    const date = selectedDate.getDate();

    document.getElementById('current_date').textContent = `${month}월 ${date}일`;
}
