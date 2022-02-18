// Формирование данных таблицы

const tableBody = document.querySelector('.table-body');

const renderItems = (data) => {
  data.forEach((item, i) => {
    const {id, about, eyeColor, name} = item;
    const tr = document.createElement('tr');

    tr.innerHTML = ` 
      <td>${i + 1}</td>
      <td class="row">${name.firstName}</td>
      <td class="row">${name.lastName}</td>
      <td class="about row">${about}</td>
      <td class="row">${eyeColor}</td>
    `;

    tableBody.append(tr);
  });
}    

fetch('json/db.json')
  .then(response => response.json())
  .then(data => renderItems(data))
  .catch(error => console.log(error));

// Модальное окно 

const table = document.querySelector('table');
const modal = document.querySelector('.modal-edit-table');
const input = document.querySelector('.modal-input');
const modalBtn = document.querySelector('.modal-btn');
const closeBtn = document.querySelector('.close');
const tableRows = document.querySelectorAll('td');

const showModal = () => {
  modal.classList.add('show');
}
const hideModal = () => {
  modal.classList.remove('show');
}

table.addEventListener('click', (e) => {
  const target = e.target;

  if (target && target.classList.contains('row')) {
    getTableRow();
    showModal();
    
  }
})

closeBtn.addEventListener('click', hideModal);

let rIndex;

function getTableRow() {
  for(let i = 1; i < table.rows.length; i++){
    table.rows[i].addEventListener('click', function() {
      
      rIndex = this.rowIndex;
      document.getElementById("fname").value = this.cells[1].innerHTML;
      document.getElementById("lname").value = this.cells[2].innerHTML;
      document.getElementById("about").value = this.cells[3].innerHTML;
      document.getElementById("color").value = this.cells[4].innerHTML;
    })
  }
}

function editRow(){
  table.rows[rIndex].cells[1].innerHTML = document.getElementById("fname").value;
  table.rows[rIndex].cells[2].innerHTML = document.getElementById("lname").value;
  table.rows[rIndex].cells[3].innerHTML = document.getElementById("about").value;
  table.rows[rIndex].cells[4].innerHTML = document.getElementById("color").value;
}

modalBtn.addEventListener('click', editRow);

// tableRows.forEach(item => {
//   item.addEventListener('click', (e) => {
//     showModal();
//     const target = e.target;
//     console.log(target);
//     if (target && target.classList.contains('row')) {
//       tableRows.forEach(item => {
//         if (target == item) {
//           changeContents(item);
//         }
//       });
//     }
//   });
// });

// function changeContents(row) {
  
//   modalBtn.addEventListener('click', () => {

//     row.textContent = input.value;
//   });
// }

// function updateValue(e) {
  
//   tableRows.forEach(item => {
//     item.addEventListener('click', (e) => {
//       e.target.textContent = target;
//     })
//   })

// }

// function btnClick(row) {
//   modalBtn.addEventListener('click', () => {
//     const change = input.value;
//     row.textContent = change;
//   })
// }

// function changeRowContent() {
//   tableRows.forEach(item => {
//     item.addEventListener('click', (e) => {
//       let target = e.target;
//       btnClick(target);
//     })
//   })
// }

// changeRowContent();

// modalBtn.addEventListener('click', () => {
  
//   const target = e.target.value;
//   about.textContent = target;
// });

