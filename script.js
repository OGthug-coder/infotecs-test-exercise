// Дожидаемся, пока браузер загрузит все ресурсы
window.addEventListener("load", main, false )
function main() {

    renderPage = (current_page) => {
        /*
            Функция, которая принимает страницу в виде массива JSON объектов, которая
            отрисовывается в браузере. Это главная функция, которая отображает данные.
        */
        table.innerHTML = ''; // Очистка тела таблицы
        for (let i = 0; i < current_page.length; i++) {
            table.innerHTML += jsonToHyperText(current_page[i]); // Добавление рядов в таблицу
        }
        edit(); // Вызов функций, отвечающих за обработку изменения и сортировки данных.
        sort();
    };

    function sort () {
        /*
            Функция, которая обрабатывает сортировку в таблице.
        */
        let elements = document.getElementsByTagName("th"); // Выбираем все теги th
        for (let i = 0; i < elements.length; i++){
            elements[i].onclick = function() { // Вешаем на каждый элемент функция (при нажатии)
                let column = elements[i].getAttribute('id');
                let order = elements[i].getAttribute('order');
                let text = elements[i].innerHTML.slice(0, -1);

                if (order === 'desc') { // Если сортировка от большего к меньшему
                    elements[i].setAttribute('order', 'asc'); // Меняем тип сортировки
                    current_page = current_page.sort((a, b) => a[column] > b[column] ? 1 : -1);
                    // Сортируем страницу, для этого указываем функции sort паттерн сортировки
                    text += '&#9660'; // Меняем символ (стрелку)
                } else {
                    elements[i].setAttribute('order', 'desc');
                    current_page = current_page.sort((a, b) => a[column] < b[column] ? 1 : -1);
                    text += '&#9650';
                }
                elements[i].innerHTML = text; // Обновляем хедер столбца
                renderPage(current_page); // Ререндерим таблицу
            }
        }
    }

    function edit () {
        /*
            Функция, которая обрабатывает изменение данных в таблице.
        */
        for (let i = 0; i < current_page.length; i++) {
            // Вешаем на каждый ряд таблицы функцию при нажатии
            document.getElementById(current_page[i].id).onclick = function () {
                let row = current_page[i]; 
                let index = i;
                // Отображаем данные в форму
                document.getElementById('edit').innerHTML = form;
                document.getElementById('firstNameInput').value = row.firstName;
                document.getElementById('lastNameInput').value = row.lastName;
                document.getElementById('aboutInput').value = row.about;
                document.getElementById('eyeColorInput').value = row.eyeColor;

                edit_submit.onclick = function () {
                    // При отправку формы обновляем ряд таблицы
                    current_page[index] = {
                        firstName: document.getElementById('firstNameInput').value,
                        lastName: document.getElementById('lastNameInput').value,
                        about: document.getElementById('aboutInput').value,
                        eyeColor: document.getElementById('eyeColorInput').value,
                        id: current_page[i].id
                    }
                    renderPage(current_page); // Ререндерим таблицу
                    document.getElementById('edit').innerHTML = divHolder; // Убираем форму
                }
            }
        }
    }

    cleanData = (data) => {
        /*
            Функция, которая обрабатывает исходный массив данных, и возвращает новый массив
            в более удобном формате.
         */
        let tmp = [];
        for (let i = 0; i < data.length; i++){
            tmp.push({
                firstName: data[i].name.firstName,
                lastName: data[i].name.lastName,
                about: data[i].about,
                eyeColor: data[i].eyeColor,
                id: data[i].id,
            });
        }
        return tmp
    };

    jsonToHyperText = (data) => {
        /*
            Функция, которая обрабатывает JSON объект и возвращает кусок DOM'a (ряд таблицы)
            в виде строки.
        */
        return `
            <tr id="${data.id}">
                <td>${data.firstName}</td>
                <td>${data.lastName}</td>
                <td class="about">${data.about}</td>
                <td><div class="eyeColor" style="background-color: ${data.eyeColor};" /></td>
            </tr>
        `
    };  

    

    pagination = (data) => {
        /*
            Функция, которая отвечает за разделение данных на страницы.
        */
        let n_pages = Math.ceil(data.length / 10); // Вычисляем необходимое количество страниц
        // (округление вверх)
        let pages = [];
        let pagesBlock = document.getElementById('pages');
        for (let i = 0; i < n_pages; i++){
            pages.push([]); // Наполняем двумерный массив страниц и добавляем ссылки
            pagesBlock.innerHTML += `<span href="" id="page_link_${i}" class="page_links"\
            style="color: blue;" onclick="changePage(${i})">Page ${i + 1}</span>\n`;
        }
        document.getElementById(`page_link_${0}`).style.color = 'red'; // Меняем стиль

        let n = 0;
        // Наполняем двумерный массив
        for (let i = 0; i < data.length; i++){
            if (pages[n].length === 10) {
                n++;
            } 
            pages[n].push(data[i]);
        }

        return pages;
    }

    changePage = (n) => {
        /*
            Функция, которая отвечает за переключение страниц.
        */
        current_page = pages[n];
        let links = document.getElementsByTagName('span');
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = 'blue'; // Обновляем стили
        }
        document.getElementById(`page_link_${n}`).style.color = 'red'; // Устанавливаем красный
        // цвет для текущей страницу
        renderPage(current_page); // Ререндерим страницу
    }
    
    
    let table = document.getElementById('table_body'); // Тело таблицы
    let cleanJSON = cleanData(myJSON); // Очищенные данные
    let pages = pagination(cleanJSON); // Разделенные на страницы данные
    let current_page = pages[0]; // Выбираем первую страницу

    renderPage(current_page); // Запускаем отрисовку
}