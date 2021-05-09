const ulList = document.querySelector('.titleList');
const loadBtn = document.querySelector('.loadBtn');
const titleListContainer = document.querySelector('.titleListContainer');
const saveBtn = document.querySelector('.saveBtn');
const titleInput = document.querySelector('.titleInput');
const textarea = document.querySelector('div.textarea');
const textareaBtns = document.querySelectorAll('.cmdBtn');
const clearBtn = document.querySelector('.clearBtn');
const form = document.querySelector('.form');

const initCmdBtnListeners = () => {
   textareaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
         btn.classList.toggle('btn-active');
         textarea.focus();
         const command = btn.dataset['command'];
         document.execCommand(command, false, null);
      });
   });
}

const createLi = (linkName, id = null) => {
   const newLi = document.createElement('li');
   newLi.classList.add('liEl');
   ulList.appendChild(newLi);

   const newA = document.createElement('a');
   newA.classList.add('aLink');
   newA.innerText = linkName;
   newA.dataset.id = id;
   newLi.appendChild(newA);
   newA.addEventListener('click', (e) => {
      const index = e.target.dataset.id;
      getData().then(data => {
         textarea.innerHTML = data.entries[index].content;
      });
   });
}

const getData = async () => {
   const response = await fetch('./data');
   const data = await response.json();
   return data;
}

const createTitlesList = () => {
   getData()
   .then(data => data.entries.forEach(entry => createLi(entry.title, entry.id)));
}

const handleLoadBtn = () => {
   titleListContainer.classList.toggle('hidden');
}

const handleClearBtn = () => {
   textarea.innerText = '';
}

const handleSubmit = async (e) => {
   e.preventDefault();
   const data = await getData();

   const id = data.entries.length;
   const title = titleInput.value;
   const content = textarea.innerHTML;

   const noWhitespaceRegEx = /^[^\s]+(\s+[^\s]+)*$/;
   const regExResult = noWhitespaceRegEx.test(textarea.innerText);

   if(textarea.innerHTML === '' || regExResult == false){
      alert('No white spaces at the beginning and the end');
      titleInput.value = '';
      textarea.innerHTML = '';
      return;
   }
   
   const newEntry = {
      id,
      title,
      content,
   }
   
   fetch(`./newEntry/${newEntry.id}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
   });

   createLi(title, id); 

   titleInput.value = '';
   textarea.innerHTML = '';
}

const init = () => {
   createTitlesList();
   initCmdBtnListeners();
   form.addEventListener('submit', (e) => handleSubmit(e));
   loadBtn.addEventListener('click', handleLoadBtn);
   clearBtn.addEventListener('click', handleClearBtn);
   textarea.innerHTML = '';
}

init();