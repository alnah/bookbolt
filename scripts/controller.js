import {Book} from "./model.js"

export function Controller(library, view) {
  this.library = library
  this.view = view
}

Controller.prototype.getElements = function () {
  return {
    form: document.querySelector("form"),
    tbody: document.querySelector("tbody"),
    thead: document.querySelector("thead"),
    dialog: document.querySelector("dialog"),
    openAddBookDialogBtn: document.querySelector("#open-add-book-dialog-btn"),
    closeAddBookDialogBtn: document.querySelector("#close-add-book-dialog-btn"),
    resetLibraryBtn: document.querySelector("#reset-library-btn"),
    populateLibraryBtn: document.querySelector("#populate-library-btn")
  }
}

Controller.prototype.setListeners = function () {
  const elements = this.getElements()
  elements.form.addEventListener("submit", event => {
    this.handleNewBookForm(event)
  })
  elements.tbody.addEventListener("click", event => {
    this.handleBookDeletion(event)
    this.handleReadStatus(event)
  })
  elements.thead.addEventListener("click", event => {
    let target = event.target
    this.handleSortingBy(event, target)
  })
  elements.openAddBookDialogBtn.addEventListener("click", () => {
    this.handleOpenAddBookDialog(elements.dialog)
  })
  elements.closeAddBookDialogBtn.addEventListener("click", () => {
    this.handleCloseAddBookDialog(elements.dialog)
  })
  elements.resetLibraryBtn.addEventListener("click", () => {
    this.handleResetLibrary()
  })
  elements.populateLibraryBtn.addEventListener("click", () => {
    this.handlePopulateLibrary()
  })
}

Controller.prototype.handleNewBookForm = function (event) {
  event.preventDefault()
  const inputs = this.getInputs()
  const book = new Book({
    title: inputs.title,
    author: inputs.author,
    pages: Number(inputs.pages),
    year: Number(inputs.year),
    status: inputs.status
  })
  this.validateYear()
  this.library.addBook(book)
  this.view.viewLibrary()
  this.resetInputs(book)
}

Controller.prototype.handleBookDeletion = function (event) {
  this.targetValueOfDataAttribute(event, ".delete-btn", "data-id", id => {
    this.library.removeBook(id)
  })
}

Controller.prototype.handleReadStatus = function (event) {
  this.targetValueOfDataAttribute(event, ".status-checkbox", "data-id", id => {
    this.library.toggleBookStatus(id)
  })
}

Controller.prototype.handleSortingBy = function (event, target) {
  this.targetValueOfDataAttribute(event, ".sort-btn", "data-sort", value => {
    let [key, order] = value.split("-")
    this.library.sortBy(key, order)
    order === "asc" ? order = "desc" : order = "asc"
    target.dataset.sort = [key, order].join("-")
  })
}

Controller.prototype.handleOpenAddBookDialog = function (dialog) {
  dialog.showModal()
}

Controller.prototype.handleCloseAddBookDialog = function (dialog) {
  dialog.close()
}

Controller.prototype.handleResetLibrary = function () {
  this.library.resetLibrary()
  this.view.viewLibrary()
}

Controller.prototype.handlePopulateLibrary = function () {
  this.library.populateLibrary()
  this.view.viewLibrary()
}

Controller.prototype.targetValueOfDataAttribute = function (event, selector, attribute, callback) {
  let target = event.target.closest(selector)
  if (!target) return
  const value = target.getAttribute(attribute)
  if (value) callback(value)
  this.view.viewLibrary()
}

Controller.prototype.getInputs = function() {
  return {
    title: document.querySelector("#title").value,
    author: document.querySelector("#author").value,
    pages: document.querySelector("#pages").value,
    year: document.querySelector("#year").value,
    status: document.querySelector("#status").checked ? "Read" : "Unread"
  }
}

Controller.prototype.resetInputs = function(book) {
  let selectors = Object.keys(book).slice(0, -2)
  selectors.forEach(selector => {
    document.querySelector(`#${selector}`).value = ""
  })
  document.querySelector("#title").focus()
}

Controller.prototype.validateYear = function() {
  const currentYear = new Date().getFullYear()
  const inputYear = document.querySelector("#year")
  inputYear.setAttribute("max", String(currentYear))
}
