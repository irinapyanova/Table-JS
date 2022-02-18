// Формирование данных таблицы

const tableBody = document.querySelector('.table-body');
let rowId;

const renderItems = (data) => {
  data.forEach((item, i) => {
    const {id, about, eyeColor, name} = item;
    const tr = document.createElement('tr');
    tr.classList.add('row');
    tr.setAttribute('id', `${id}`);

    tr.innerHTML = ` 
      <td>${i + 1}</td>
      <td>${name.firstName}</td>
      <td>${name.lastName}</td>
      <td class="about">${about}</td>
      <td>${eyeColor}</td>
    `;

    tableBody.append(tr);

    tr.addEventListener('click', (e) => {
      const target = e.target.parentElement;
      rowId = target.rowIndex;
      const rowCells = target.children;
      let arr = [...rowCells];
      let textContent = arr.map(item => item.innerHTML);
      
      document.getElementById("fname").value = textContent[1];
      document.getElementById("lname").value = textContent[2];
      document.getElementById("about").value = textContent[3];
      document.getElementById("color").value = textContent[4];
      showModal();
    })
  });
}    
fetch('json/db.json')
  .then(response => response.json())
  .then(data => renderItems(data))
  .catch(error => console.log(error));

// Модальное окно 
const table = document.querySelector('table');
const modal = document.querySelector('.modal-edit-table');
const modalBtn = document.querySelector('.modal-btn');
const closeBtn = document.querySelector('.close');

const showModal = () => {
  modal.classList.add('show');
}

const hideModal = () => {
  modal.classList.remove('show');
}

closeBtn.addEventListener('click', hideModal);

function editRow(){
  table.rows[rowId].cells[1].innerHTML = document.getElementById("fname").value;
  table.rows[rowId].cells[2].innerHTML = document.getElementById("lname").value;
  table.rows[rowId].cells[3].innerHTML = document.getElementById("about").value;
  table.rows[rowId].cells[4].innerHTML = document.getElementById("color").value;
}
modalBtn.addEventListener('click', editRow);