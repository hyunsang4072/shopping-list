const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => addItemToDOM(item));

    // filter items && clear all
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input from User
    if (newItem == '') {
        alert('Please add an item!');
        return;
    }

    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);

        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkDulicateItems(newItem)) {
            alert('This item already exists!');
            return;
        }
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    // Clears input
    itemInput.value = '';
}

function addItemToDOM(item) {
    // Create List Item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

function createButton(className) {
    const newButton = document.createElement('button');
    newButton.className = className;

    const icon = createIcon('fa-solid fa-xmark');
    newButton.appendChild(icon);

    return newButton;
}

function createIcon(className) {
    const newIcon = document.createElement('i');
    newIcon.className = className;
    return newIcon;
}

// use JSON objects to stringify or parse!!!
function addItemToStorage(item) {
    // create an array
    const itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        // if there are no items, set it to empty array
        itemsFromStorage = [];
    } else {
        // if items, parse it
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

// list handler
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkDulicateItems(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');

    // Update Button
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';

    // Get item text to inputForm
    itemInput.value = item.textContent;
}


function removeItem(item) {
    // if (e.target.tagName === 'I') {
    //     if (confirm('Are you sure you want to remove this item?')) {
    //         e.target.parentElement.parentElement.remove();

    //         checkUI();
    //     }
    // }
    if (confirm('Are you sure you want to remove this item?')) {
        // Remove item from DOM
        item.remove();

        // Remove item from localStorage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}


function clearItems() {
    if (confirm('Are you sure to remove this item?')) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }

        // Clear from localStorage
        localStorage.removeItem('items');

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function filterItems(e) {
    // NodeList
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    // console.log(items);

    items.forEach((item) => {
        // get the inside text in lowerCase
        const itemName = item.firstChild.textContent.toLowerCase();

        // item.firstChild is each Node Item from NodeList
        // console.log(item.firstChild);
        // console.log(itemName);

        if (itemName.indexOf(text) != -1) { // indexOf(text) if not matching return -1
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })
}


function checkUI() {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        itemFilter.value = '';
        itemFilter.style.display = 'none';
        clearButton.style.display = 'none';
    } else {
        itemFilter.style.display = 'block';
        clearButton.style.display = 'block';
    }

    // Change button back to Add Item
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}


function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}



init();

