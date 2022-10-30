
const buku = [];
const RENDER_EVENT = 'render-buku';



document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputDataBuku');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      
      addBuku();
      
    });

    if (isStorageExist()) {
      loadDataFromStorage();
      clearFill();
      showModul();
      
    }

      
    
});



function addBuku() {
    const textJudul = document.getElementById('title').value;
    const textPenulis = document.getElementById('author').value;
    const numTahun = document.getElementById('year').value;
   
    const generatedID = generateId();
    const bukuObject = generateBukuObject(generatedID, textJudul, textPenulis, numTahun, false);
    buku.push(bukuObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    
    alert('Data sukses tersimpan!');
    
  }

function generateId() {
  return +new Date();
}
 
function generateBukuObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}  



document.addEventListener(RENDER_EVENT, function () {
    
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    incompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';
 
    for (const bukuItem of buku) {
        const bukuElement = makeBuku(bukuItem);
        if (!bukuItem.isCompleted) 
        incompletedBookList.append(bukuElement);
        else
        completedBookList.append(bukuElement);    
       
    }
});



// Search form

const BUKU_ITEMID = 'makeBuku.id'; 
const searchTitle = document.getElementById('searchForm');

searchTitle.addEventListener("submit", function (event) {
    event.preventDefault();
    searchByTitle();
});


function searchByTitle(){
const listIncompleted = document.getElementById('incompleteBookshelfList');
const listCompleted = document.getElementById('completeBookshelfList');

const judul = document.getElementById('searchTitle').value.toLowerCase();


listIncompleted.innerHTML = '';
listCompleted.innerHTML = '';
for(const bukuItem of buku){
    if(judul == ''){
      location.reload();
      
    }else if ((bukuItem.title.toLowerCase()).includes(judul)) {
     

        console.log(bukuItem.title.toLowerCase());
        const newBukuItem = makeBuku(bukuItem);
        
        newBukuItem[BUKU_ITEMID] = bukuItem.id;
       
        if(bukuItem.isCompleted){
            listCompleted.append(newBukuItem);
        } else {
            listIncompleted.append(newBukuItem);
        }

       
    }
 }
}

// show hide clear modul/form input

const btnInput = document.querySelector('#btn-input');
const btnreset = document.querySelector('.reset-btn');
const tutup = document.querySelector('#close');
const reloaded = document.querySelector('.logo');



btnInput.addEventListener("click", ()=> {
  
  showModul();
  
});


tutup.addEventListener("click", ()=> {
  
  tutupModul();
});  


btnreset.addEventListener("click", ()=> {
  
  clearFill();
});  


reloaded.addEventListener("click", ()=> {
  
  reloadedData();
});  



function showModul() {
    let modul = document.querySelector("#modul");
    if (modul.style.display === "none") {
        modul.style.display = "block";
        
    } else {
        modul.style.display = "none";
    }
}


function clearFill() {
  document.getElementById("inputDataBuku").reset();
}


function reloadedData() {
  location.reload();
}



function tutupModul() {
  let modul = document.querySelector("#modul");
  if (modul.style.display === "block") {
      modul.style.display = "none";
      
  } else {
      modul.style.display = "block";
  }
}




function makeBuku(bukuObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bukuObject.title.toUpperCase();
    const textPenulis = document.createElement('p');
    textPenulis.innerText = "Penulis: " + bukuObject.author;
    
    
    
    const numYear = document.createElement('p');
    numYear.innerText = "Tahun: " + bukuObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textPenulis, numYear);
   
    const container = document.createElement('div');
    
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `buku-${bukuObject.id}`);



    if (bukuObject.isCompleted) {
        
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.classList.add("green");
        undoButton.innerText = `Belum selesai`;

     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(bukuObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.classList.add("red");
        trashButton.innerText = `Hapus`;
        
        trashButton.addEventListener('click', function () {
          
        removeTaskFromCompleted(bukuObject.id);
                 
        });

     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.classList.add("green");
        checkButton.innerText = `Selesai dibaca`;
        
        

        checkButton.addEventListener('click', function () {
          addTaskToCompleted(bukuObject.id);
        });

        
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.classList.add("red");
        trashButton.innerText = `Hapus`;
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bukuObject.id);
        });
        
        
        container.append(checkButton, trashButton);
      }
     

    return container;

}


function addTaskToCompleted (bukuId) {
    const bukuTarget = findBuku(bukuId);
   
    if (bukuTarget == null) return;
   
    bukuTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBuku(bukuId) {
    for (const bukuItem of buku) {
      if (bukuItem.id === bukuId) {
        return bukuItem;
      }
    }
    return null;
}


function removeTaskFromCompleted(bukuId) {

  const deleted = confirm('Anda yakin ingin menghapus data buku ini?');
  if (deleted){
    const bukuTarget = findBukuIndex(bukuId);
      
    if (bukuTarget === -1) return;
 
      buku.splice(bukuTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}
 
 
function undoTaskFromCompleted(bukuId) {
  const bukuTarget = findBuku(bukuId);
 
  if (bukuTarget == null) return;
 
  bukuTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBukuIndex(bukuId) {
    for (const index in buku) {
      if (buku[index].id === bukuId) {
        return index;
      }
    }
   
    return -1;
  }

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = 'saved-buku';
  const STORAGE_KEY = 'BUKU-APPS';
   
  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    
  });


  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const datas of data) {
        buku.push(datas);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }


      


