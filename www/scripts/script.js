let data;

async function getData() {
  const response = await fetch('json/db.json');
  const dataJson = await response.json();
  
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