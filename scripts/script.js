// Формирование данных таблицы

const tableBody = document.querySelector('.table-body');
const tableTh = document.querySelectorAll('th');
let rowId;

const checkbox = document.querySelectorAll('.table-checkbox');

function sortData(res) {
  let column;
  let order;

  tableTh.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = e.target;
      column = target.getAttribute('data-column');
      column = column.split(' ');
      let len = column.length;

      order = target.getAttribute('data-order')  == 'asc' ? 'desc' : 'asc';
      
      target.setAttribute('data-order', order);

      res = res.sort((a, b) => {
        let i = 0;

        while( i < len ) { a = a[column[i]]; b = b[column[i]]; i++; }
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


const renderItems = (data) => {
  tableBody.innerHTML = '';
  
  data.forEach(item => {
    
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

}

function returnData () {
  return fetch('json/db.json')
  .then(response => response.json())
  .then(data => {
    const tableData = data;
    return tableData;
  })
  .catch(error => console.log(error));
}

returnData()
.then(res => {
  renderItems(res);
  sortData(res);
});

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
}
modalBtn.addEventListener('click', editRow);



function hideColumn() {
  checkbox.forEach(item => {
    item.addEventListener('change', () => {
      const targetId = item.getAttribute('id');
      const columnSelector = '#' + targetId;
      const cellsColumn = table.querySelectorAll(columnSelector);

      if (item.checked) {
        cellsColumn.forEach(cell => cell.classList.toggle('hide'));
      } else {
        cellsColumn.forEach(cell => cell.classList.toggle('hide'));
      }
    })
  })
}
hideColumn();

