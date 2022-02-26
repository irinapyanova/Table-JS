// Получение данных JSON

let data;

async function getData() {
  const response = await fetch('json/db.json');
  const dataJson = await response.json();
  
  // Переменная для хранения данных для постраничного выводa (page - первоначальная страница, rows - количество выводимых строк таблицы)
  let state = {
    'dataSet': dataJson,
    'page': 1,
    'rows': 10
  }

  data = pagination(state.dataSet, state.page, state.rows);

  renderItems(data.dataSet);
  pageButtons(data.pages, state);
  sortData(state);
  hideColumn();
}

getData().catch(error => console.log(error));

// Формирование таблицы 

const tableBody = document.querySelector('.table-body');
const tableTh = document.querySelectorAll('th');
let rowId;

/* Функция перебирает объкет данных, приходящий из fetch, для каждого item'а объекта создает элемент tr, 
    внутрь которого помещает html с ячейками таблицы, сформированный динамически, затем добавляет эти структуры в конец тега <tbody>.
    Также здесь вызывается функция formModalInputData, так как она работает с tr, который формируется динамически в renderItems
*/

const renderItems = (res) => {
  tableBody.innerHTML = '';

  res.forEach(item => {
    
    const {about, eyeColor, name} = item;
    const tr = document.createElement('tr');
    tr.classList.add('row');

    tr.innerHTML = ` 
      <td id="fname-checkbox">${name.firstName}</td>
      <td id="lname-checkbox">${name.lastName}</td>
      <td id="about-checkbox" class="about">${about}</td>
      <td id="color-checkbox" class="color" style="color: ${eyeColor}">${eyeColor}</td>
    `;

    tableBody.append(tr);
    
    formModalInputData(tr);
  });

}

// Формирование данных импутов редактирования при нажатии на строку таблицы

/* Функция при нажатии на ячейку таблицы получает индекс строки, в которой находится ячейка (нужен в функции editRow), 
  а также формирует массив из текстового контента, находящегося внутри этих ячеек, затем находит каждый input по определенному id и 
  записывает в их значение соответствующий ему текстовый контент ячейки таблицы, затем открывается модальное окно редактирования данных таблицы
*/

function formModalInputData(row) {
      
  row.addEventListener('click', (e) => {
    const target = e.target.parentElement;
    rowId = target.rowIndex;
    const rowCells = Array.from(target.children);
    let textContent = rowCells.map(item => item.innerHTML);
    
    document.getElementById("fname").value = textContent[0];
    document.getElementById("lname").value = textContent[1];
    document.getElementById("about").value = textContent[2];
    document.getElementById("color").value = textContent[3];
    showModal();
  })
}

// Редактирование данных таблицы при нажатии на кнопку модального окна

const table = document.querySelector('table');
const modalBtn = document.querySelector('.modal-btn');

/* Функция по индексу нажатой в formModalInputData строки записывает в ячейки этой строки новые ("отредактированные") 
    значения соответствующих им по id imput'ов, также проводится проверка длины значения imput'а с id about 
    и добавление к концу строки троеточия для корректного отображения в таблице.
  Функция вызывается при нажатии на кнопку в модальном окне редактирования таблицы
*/

function editRow(){
  
  table.rows[rowId].cells[0].textContent = document.getElementById("fname").value;
  table.rows[rowId].cells[1].textContent = document.getElementById("lname").value;
  table.rows[rowId].cells[2].textContent = document.getElementById("about").value;
  table.rows[rowId].cells[3].textContent = document.getElementById("color").value;
  let about = table.rows[rowId].cells[2].innerHTML;

  if (about.length > 20) {
    let aboutTrim = about.trim().substring(0, 20).split(" ").join(" ") + "…";
    table.rows[rowId].cells[2].innerHTML = aboutTrim;
  } 
}

modalBtn.addEventListener('click', editRow);

// Сортировка данных колонки таблицы

const sortBtn = document.querySelectorAll('.icon-sort');

/* Функция при нажатии на иконку сортировки получает из <thead> два атрибута и записывает их в переменные column и order:
    column - параметр, внутри которого данные подлежат сортировке, order - направление сотрировки (здесь же меняет его на противоположное значение 
    и новое значение записывает в атрибут).
    Затем происходит сортировка данных: в цикле while, при наличии вложенности объектов, достаем подлежащий сортировке объект
    (в нашем случае только объект name имеет подобъекты - firstName и lastName), затем происходит непосредственно сортировка - 
    сравнение значений в данном массиве между собой 
*/

function sortData(state) {
  data = pagination(state.dataSet, state.page, state.rows);

  sortBtn.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = e.target.parentElement;
      let column = target.getAttribute('data-column');
      column = column.split(' ');
      let len = column.length;
      let order = target.getAttribute('data-order') == 'asc' ? 'desc' : 'asc';

      target.setAttribute('data-order', order);

      let newRes = data.dataSet.sort((a, b) => {
        let i = 0;

        while (i < len) {a = a[column[i]]; b = b[column[i]]; i++;}

        if (a < b) {
          return order == 'asc' ? 1 : -1;
        } else if (a > b) {
          return order == 'asc' ? -1 : 1;
        } else {
          return 0;
        }
      })

      renderItems(newRes);
    })
  })
}

// Скрытие\показ колонки

const checkbox = document.querySelectorAll('.table-checkbox');

/* Функция при клике на чекбокс получает значение id кликнутого чекбокса и путем конкатенации преображает id в селектор, 
по котому мы находим все ячейки с данным id, затем проверяет состояние чекбокса - если checked, то скрывает все ячейки, наоборот - показвыает
*/

function hideColumn() {
  checkbox.forEach(item => {
    item.addEventListener('change', () => {
      const targetId = '#' + item.getAttribute('id');
      const cellsColumn = table.querySelectorAll(targetId);

      if (item.checked) {
        cellsColumn.forEach(cell => cell.classList.add('hide'));
      } else {
        cellsColumn.forEach(cell => cell.classList.remove('hide'));
      }
    })
  })
}

// Модальное окно

const modal = document.querySelector('.modal-edit-table');
const closeBtn = document.querySelector('.close');

const showModal = () => {
  modal.classList.add('show', 'fade');
}

const hideModal = () => {
  modal.classList.remove('show', 'fade');
}

closeBtn.addEventListener('click', hideModal);

// Формирование данных для постраничного вывода таблицы

/* Функция на основе переданных в нее аргументов из переменной state, 
  полученной в fetch(в данном случае - JSON-файл, page = 1 и rows = 10), обрезает JSON-файл в 
  зависимости от количества выводимых строк и номера первоначальной страницы 
  (при первоночальном вызове в fetch - обрезает все, кроме первых десяти подобъектов JSON).
  Также формирует общее количество страниц, затем возвращает эти данные (в данном случае в переменную data при вызове функции)
*/

function pagination (dataSet, page, rows) {
  let trimStart = (page - 1) * rows;
  let trimEnd = trimStart + rows;

  let trimmedData = dataSet.slice(trimStart, trimEnd);
  let pages = Math.ceil(dataSet.length / rows);

  return {
    'dataSet': trimmedData,
    'pages': pages
  }
}

// Формирование кнопок для переключения постраничного переключения

/* Функция динамически формирует html кнопок для постраничного вывода данных в зависимости от количества страниц, сформированых в функции pagination,
  затем при нажатии на любую из этих кнопок выполняется функция pagination для формирования нового массива данных для отображения(dataSet) 
  в зависимости от номера кликнутой кнопки, после этого заново динамически формируется таблица с новыми данными(renderData)
*/

function pageButtons(pages, state) {
  const pagWrapper = document.querySelector('.pagination-wrapper');
  pagWrapper.innerHTML = '';

  for (let page = 1; page <= pages; page++) {
    pagWrapper.innerHTML += `<button value=${page} class="btn-page">${page}</button>`;
  }

  const pageBtn = document.querySelectorAll('.btn-page');

  pageBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tableBody.innerHTML = '';
      const targetValue = e.target.getAttribute('value');

      state.page = targetValue;
      data = pagination(state.dataSet, state.page, state.rows);

      hideModal();
      checkbox.forEach(item => item.checked = false);
      tableTh.forEach(th => th.classList.remove('hide'));
      renderItems(data.dataSet);
    })
  })
}
