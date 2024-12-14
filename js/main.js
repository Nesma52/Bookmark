
var siteNameInput =  document.getElementById('bookmarkName');
var siteUrlInput =  document.getElementById('bookmarkURL');
var submitButton = document.getElementById('addBTN');
var tableBody = document.getElementById('table-body');
var deleteButton;
var visitButton;
var closeButton = document.getElementById('closeBtn');
var error = document.getElementById('alertList');
var bookmarksList=[];


// get bookmark from local storage
if (localStorage.getItem("bookmarksList")) {
	bookmarksList = JSON.parse(localStorage.getItem("bookmarksList"));
	for (var i = 0; i < bookmarksList.length; i++) {
		displayBookmark(i);
	}
}

// Display Bookmark
function displayBookmark(index) {
	var bookmark = bookmarksList[index];
	var url = bookmark.url;
	var formattedUrl = url.startsWith("http") ? url : `https://${url}`;
	var cleanUrl = url.replace(/^https?:\/\//, "");

	var bookmarkData = `
              <tr>
                <td>${index + 1}</td>
                <td>${bookmark.name}</td>              
                <td><button class="btn btn-visit" data-index="${index}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit</button>
                </td>
                <td>
                  <button class="btn btn-delete" data-index="${index}">
                    <i class="fa-solid fa-trash-can pe-2"></i>Delete </button>
                </td>
              </tr>
            `;
	tableBody.innerHTML += bookmarkData;

	// Update Event Listeners
	updateEventListeners();
}

// clear Input Fields
function clearInputFields() {
	siteNameInput.value = "";
	siteUrlInput.value = "";
}

function capitalizeString(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add Bookmark
submitButton.addEventListener("click", function () {
	if (
		siteNameInput.classList.contains("is-valid") &&
		siteUrlInput.classList.contains("is-valid")) 
        {
		var newBookmark = {
			name: capitalizeString(siteNameInput.value),
			url: siteUrlInput.value,
		};
		bookmarksList.push(newBookmark);
		localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
		displayBookmark(bookmarksList.length - 1);
		clearInputFields();
		siteNameInput.classList.remove("is-valid");
		siteUrlInput.classList.remove("is-valid");
	} else {
		error.classList.remove("d-none");
	}
});

// Delete Website
function deleteBookmark(e) {
	var indexToDelete = e.target.dataset.index;
	bookmarksList.splice(indexToDelete, 1);
	localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
	refreshTable();
}

// Visit URL
function visitBookmark(e) {
	var indexToVisit = e.target.dataset.index;
	var url = bookmarksList[indexToVisit].url;
	var formattedUrl = url.startsWith("http") ? url : `https://${url}`;
	window.open(formattedUrl, "_blank");
}

// Refresh Table
function refreshTable() {
	tableBody.innerHTML = "";
	for (var i = 0; i < bookmarksList.length; i++) {
		displayBookmark(i);
	}
}

// Regular Expressions
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
// Validate site name
siteNameInput.addEventListener("input", function () {
	validateInput(siteNameInput, nameRegex);
});
// Validate URL
siteUrlInput.addEventListener("input", function () {
	validateInput(siteUrlInput, urlRegex);
});

function validateInput(inputElement, regex) {
	if (regex.test(inputElement.value)) {
		inputElement.classList.add("is-valid");
		inputElement.classList.remove("is-invalid");
	} else {
		inputElement.classList.add("is-invalid");
		inputElement.classList.remove("is-valid");
	}
}

// Sweet Alert Function
function closeModal() {
	error.classList.add("d-none");
}

// Sweet Alert Event Listeners
closeButton.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closeModal();
	}
});

document.addEventListener("click", function (e) {
	if (e.target.classList.contains("alertList")) {
		closeModal();
	}
});

// Update Event Listeners
function updateEventListeners() {
	deleteButton = document.querySelectorAll(".btn-delete");
	for (var i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener("click", deleteBookmark);
	}

	visitButton = document.querySelectorAll(".btn-visit");
	for (var j = 0; j < visitButton.length; j++) {
		visitButton[j].addEventListener("click", visitBookmark);
	}
}
