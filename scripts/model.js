import {books} from "./utils.js"

export function Book({title, author, pages, year, status, id}) {
  this.title = title
  this.author = author
  this.pages = pages
  this.year = year
  this.status = status
  if (id !== undefined) this.id = id
}

Book.prototype.toggleBookStatus = function () {
  return this.status === "Read" ? this.status = "Unread" : this.status = "Read"
}

export function Library() {
  this.books = this.getLibrary()
  this.id = this.books.reduce((maxId, book) => Math.max(maxId, book.id), 0) + 1
  this.canPopulate = false
  if (this.books.length === 0) books.map(book => this.addBook(book))
}

Library.prototype.getLibrary = function () {
  const books = JSON.parse(localStorage.getItem("Library"))
  return books.map(book => new Book(book))
}

Library.prototype.saveLibrary = function () {
  localStorage.setItem("Library", JSON.stringify(this.books))
}

Library.prototype.resetLibrary = function () {
  this.books = []
  this.saveLibrary()
  this.canPopulate = true
}

Library.prototype.populateLibrary = function () {
  if (this.canPopulate) books.forEach(book => this.addBook(book))
  this.saveLibrary()
  this.canPopulate = false
}

Library.prototype.addBook = function (book) {
  book.id = this.id++
  this.books.push(book)
  this.saveLibrary()
}

Library.prototype.removeBook = function (id) {
  const id_ = Number(id)
  this.books = this.books.filter(book => book.id !== id_)
  this.saveLibrary()
}

Library.prototype.toggleBookStatus = function (id) {
  const id_ = Number(id)
  const book = this.books.find(book => book.id === id_)
  book.status = book.toggleBookStatus()
  this.saveLibrary()
}

Library.prototype.sortBy = function (key, order = "asc") {
  this.books.sort((a, b) => {
    let comparison = 0
    let varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
    let varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]
    if (varA > varB) comparison = 1
    else if (varA < varB) comparison = -1
    return (order === 'desc') ? (comparison * -1) : comparison
  })
  this.saveLibrary()
}
