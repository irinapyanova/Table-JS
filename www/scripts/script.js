// Формирование данных таблицы
let dataJson;

async function getData() {
  const response = await fetch('json/db.json');
  dataJson = await response.json();
  return dataJson;
}

getData().catch(error => console.log(error));
window.addEventListener('click', () => {

  console.log(dataJson);
})

// function returnData () {
//   return fetch('json/db.json')
//   .then(response => response.json())
//   .then(res => {
//     const state = {
//     'dataSet': res,
//     'page': 1,
//     'rows': 10
//     }

//     data = pagination(state.dataSet, state.page, state.rows);
    
//     renderItems(data.dataSet);
//     sortData(data.dataSet);
//     pageButtons(data, state);
//   })
//   .catch(error => console.log(error));
// }

// returnData();

const tableBody = document.querySelector('.table-body');
const tableTh = document.querySelectorAll('th');
let rowId;

const checkbox = document.querySelectorAll('.table-checkbox');

let column;
let order;
const sortBtn = document.querySelectorAll('.icon-sort');

function sortData(res) {

  sortBtn.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = e.target.parentElement;
      column = target.getAttribute('data-column');
      column = column.split(' ');
      let len = column.length;
      order = target.getAttribute('data-order')  == 'asc' ? 'desc' : 'asc';
      
      target.setAttribute('data-order', order);
      console.log(order);
      res = res.sort((a, b) => {
        let i = 0;

        while (i < len) {a = a[column[i]]; b = b[column[i]]; i++;}
        if (a < b) {
          return order == 'asc' ? 1 : -1;
        } else if (a > b) {
          return order == 'asc' ? -1 : 0;
        } else {
          return 0;
        }
      })

      renderItems(res);
    })
    
  })

}


const renderItems = (res) => {
  tableBody.innerHTML = '';
  
  res.forEach(item => {
    
    const {about, eyeColor, name} = item;
    const tr = document.createElement('tr');
    tr.classList.add('row');

    tr.innerHTML = ` 
      <td id="fname-checkbox" >${name.firstName}</td>
      <td id="lname-checkbox" >${name.lastName}</td>
      <td id="about-checkbox" class="about">${about}</td>
      <td id="color-checkbox"  class="color" style="color: ${eyeColor}">${eyeColor}</td>
    `;

    tableBody.append(tr);

    tr.addEventListener('click', (e) => {
      const target = e.target.parentElement;
      rowId = target.rowIndex;
      const rowCells = target.children;
      let arr = [...rowCells];
      let textContent = arr.map(item => item.innerHTML);
      
      document.getElementById("fname").value = textContent[0];
      document.getElementById("lname").value = textContent[1];
      document.getElementById("about").value = textContent[2];
      document.getElementById("color").value = textContent[3];
      showModal();
    })
    
  });

  hideColumn();
}

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

function pageButtons(data, state) {
  const pagWrapper = document.querySelector('.pagination-wrapper');
  pagWrapper.innerHTML = '';

  for(let page = 1; page <= data.pages; page++) {
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
      // sortData(data.dataSet);
    })
    
  })
  
}

// Модальное окно 
const table = document.querySelector('table');
const modal = document.querySelector('.modal-edit-table');
const modalBtn = document.querySelector('.modal-btn');
const closeBtn = document.querySelector('.close');

const showModal = () => {
  modal.classList.add('show', 'fade');
}

const hideModal = () => {
  modal.classList.remove('show', 'fade');
}

closeBtn.addEventListener('click', hideModal);

function editRow(){
  
  table.rows[rowId].cells[0].innerHTML = document.getElementById("fname").value;
  table.rows[rowId].cells[1].innerHTML = document.getElementById("lname").value;
  table.rows[rowId].cells[2].innerHTML = document.getElementById("about").value;
  table.rows[rowId].cells[3].innerHTML = document.getElementById("color").value;
  let about = table.rows[rowId].cells[2].innerHTML;

  if (about.length > 20) {
    let aboutTrim = about.trim().substring(0, 20).split(" ").join(" ") + "…";
    table.rows[rowId].cells[2].innerHTML = aboutTrim;
  } 
}
modalBtn.addEventListener('click', editRow);



function hideColumn() {
  checkbox.forEach(item => {
    item.addEventListener('change', () => {
      const targetId = item.getAttribute('id');
      const columnSelector = '#' + targetId;
      const cellsColumn = table.querySelectorAll(columnSelector);

      if (item.checked) {
        cellsColumn.forEach(cell => cell.classList.add('hide'));
      } else {
        cellsColumn.forEach(cell => cell.classList.remove('hide'));
      }
    })
  })
}