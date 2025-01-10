const calendarElement = document.getElementById('calendar');
const headerElement = document.getElementById('calendar-header');

let currentInternetDate = null;

// Функция для получения даты из TimeAPI.io
function fetchInternetDate(callback) {
    const apiUrl = 'https://timeapi.io/api/time/current/zone?timeZone=Asia%2FShanghai'; // Используем таймзону для Пекина
    const xhr = new XMLHttpRequest();

    xhr.open('GET', apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const newDate = new Date(response.dateTime);
                    callback(newDate);
                    console.log('Дата получена');
                } catch (error) {
                    console.error('Ошибка обработки ответа от API:', error);
                }
            } else {
                console.error('Ошибка загрузки времени:', xhr.status, xhr.statusText);
            }
        }
    };

    xhr.onerror = function () {
        console.error('Ошибка сети при попытке получить дату.');
    };

    xhr.send();
}

// Функция для генерации календаря
function generateCalendar(date) {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const today = date.getDate();

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    headerElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarElement.innerHTML = '';

    dayNames.forEach(day => {
        const dayNameElement = document.createElement('div');
        dayNameElement.classList.add('day', 'day-name');
        dayNameElement.textContent = day;
        calendarElement.appendChild(dayNameElement);
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    firstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendarElement.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            dayElement.classList.add('weekend');
        }

        if (day === today) {
            dayElement.classList.add('today');
        }

        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    }
}

// Функция для проверки и обновления даты
function updateDate() {
    fetchInternetDate(function (newDate) {
        if (
            !currentInternetDate ||
            currentInternetDate.toDateString() !== newDate.toDateString()
        ) {
            currentInternetDate = newDate;
            generateCalendar(newDate);
        }
    });
}

// Запускаем обновление даты каждые 30 секунд
setInterval(updateDate, 30000);

// Инициализация
updateDate();
