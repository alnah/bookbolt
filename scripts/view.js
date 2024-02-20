export function View(library) {
  this.library = library
  this.tbody = document.querySelector("tbody")
}

View.prototype.viewLibrary = function () {
  this.cleanTableBody()
  this.library.getLibrary().forEach(book => {
    const row = this.createAndAppendElement("tr", this.tbody)
    const cols = this.getClassnames(book)
    cols.forEach(col => this.viewRow(row, col, book[col], book))
    this.viewDeleteBtn(row, book)
  })
}

View.prototype.cleanTableBody = function () {
  if (this.tbody) this.tbody.replaceChildren()
}

View.prototype.createAndAppendElement = function(tag, parent, attributes = {}) {
  const element = this.createElement(tag, attributes)
  this.appendElement(parent, element)
  return element
}

View.prototype.getClassnames = function (book) {
  return Object.keys(book).slice(0, -1)
}

View.prototype.viewRow = function (row, col, data, book) {
  const cell = this.createAndAppendElement("td", row, {className: col})
  this.viewCell(col, cell, data, book)
}

View.prototype.viewDeleteBtn = function (row, book) {
  const deleteBtn = this.createElement("td", {className: "delete-btn"})
  deleteBtn.textContent = "✕"
  this.appendId(deleteBtn, book.id)
  this.appendElement(row, deleteBtn)
}

View.prototype.viewCell = function (col, cell, data, book) {
  if (col === "status") this.viewCheckbox(book, data, cell)
  else cell.textContent = data
}

View.prototype.viewCheckbox = function (book, data, cell) {
  const input = this.createElement('input', {
    className: "status-checkbox",
    type: 'checkbox',
    id: `status-${book.id}`,
    name: 'status',
    checked: data === "Read",
  })
  const label = this.createElement("label", {
    className: "status-label",
    htmlFor: `status-${book.id}`
  })
  this.appendId(input, book.id)
  this.appendElement(cell, input)
  this.appendElement(cell, label)
}

View.prototype.createElement = function(tag, attributes = {}) {
  const element = document.createElement(tag)
  Object.keys(attributes).forEach(attr => element[attr] = attributes[attr])
  return element
}

View.prototype.appendElement = function(parent, child) {
  parent.append(child)
}

View.prototype.appendId = function(element, id) {
  element.dataset.id = id
}
