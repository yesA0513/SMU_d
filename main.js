let menuData;
let selectedDayIndex = getCurrentDayIndex();

document.addEventListener('DOMContentLoaded', function() {
    showAlert();
    
    fetch('menu_info/menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            initializeMenus();
            updateDateDisplay();
        });
});

function showAlert() {
    const alertModal = document.getElementById('alert-modal');
    if (alertModal) {
        alertModal.style.display = 'block';
    }
}

function closeAlert() {
    const alertModal = document.getElementById('alert-modal');
    if (alertModal) {
        alertModal.style.display = 'none';
    }
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const alertContent = document.querySelector('.alert-content');
    if (alertContent) {
        alertContent.style.backgroundColor = '#2a2c36';
        alertContent.style.color = '#c7c7c7';
    }
}

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
    
    if (campus === 'seoul') {
        if (type === 'food_court1' || type === 'food_court2') {
            // food_court 메뉴는 selectedDayIndex - 1 번째 배열의 모든 항목을 표시
            menuItems = menuData?.seoul?.[type]?.[selectedDayIndex - 1] || [];
        } else {
            menuItems = menuData?.seoul?.[type]?.[selectedDayIndex - 1] || [];
        }
    } else if (campus === 'cheonan') {
        if (type.startsWith('student_')) {
            const mealType = type.split('_')[1];
            menuItems = menuData?.[campus]?.student?.[mealType]?.[selectedDayIndex - 1] || [];
        } else {
            menuItems = menuData?.[campus]?.[type]?.[selectedDayIndex - 1] || [];
        }
    }

    const menuElement = campus === 'seoul' 
        ? document.getElementById('seoul_menu').querySelector('ul')
        : document.getElementById('cheonan_student_dropdown').querySelector('ul');
    
    menuElement.innerHTML = '';

    if (Array.isArray(menuItems)) {
        menuItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            menuElement.appendChild(li);
        });
    }
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

window.addEventListener('load', function() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        document.getElementById('installguide').style.display = 'none';
    }
});

