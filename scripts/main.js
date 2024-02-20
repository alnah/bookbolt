import {Library} from "./model.js"
import {View} from "./view.js"
import {Controller} from "./controller.js"

function main() {
  const library = new Library()
  const view = new View(library)
  const controller = new Controller(library, view)
  view.viewLibrary()
  controller.setListeners()
}

main()
