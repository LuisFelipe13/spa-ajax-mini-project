$(document).ready(function(){
  app = new App
  app.render()
})

class App {
  constructor() {
    this.categoriesList = new CategoriesList()
    this.withCats = document.getElementById('with-cats')
    this.categoryButton = document.getElementById('category-button')
    this.categories = []

    this.withCats.addEventListener("click", (event) => {
      if (event.target.dataset.type === "category") {
        event.target.classList.toggle('white')
        event.target.classList.toggle('blue')
      } else if (event.target.id === "category-button") {
        document.querySelectorAll('.blue').forEach((cat) => this.categories.push(cat.dataset.category))
        this.switchView()
        this.renderSources()
      }
    })

    this.withArts = document.getElementById('with-arts')
    this.sources = []
    this.sourcesList = new SourcesList()

  }

  render() {
    this.renderCategories()
  }

  renderCategories() {
    this.categoriesList.createCategories()
    this.categoriesList.render()
  }

  switchView() {
    this.withCats.classList.toggle('hide')
    this.withArts.classList.toggle('hide')
  }

  renderSources() {
    this.categories.map((cat) => {
      this.sourcesList.fetchSources(cat)
      this.sourcesList.render()
    })
  }

}

class Adapter {
  constructor () {
    this.baseUrl = 'https://newsapi.org/v1/'
    this.key = '&apiKey=e20512689bbe4c0484e25751de5c40af'
    this.sources = this.baseUrl + 'sources'
    this.articles = this.baseUrl + 'articles'
  }

  getSources (category){
    return fetch(this.sources + '?category=' + category)
  }

  getArticles(sourceId, sortMethod){
    return fetch(this.articles + '?source=' + sourceId + sortMethod + this.key)
  }
}

class Source {
  constructor (name, id) {
    this.name = name
    this.id = id
  }

  render() {
    return (
      `<div class="switch">
        <label>
          Off
          <input type="checkbox">
          <span class="lever"></span>
          On
        </label>
        <label><strong> ${this.name}</strong></label>
      </div>`
    )
  }

}

class SourcesList {
  constructor () {
    this.sources = []
    this.sourcesContainer = document.getElementById('sources')
    this.adapter = new Adapter()
  }

  renderSources() {
    return this.sources.map(source => source.render()).join('')
  }

  fetchSources(category) {
    this.adapter.getSources(category)
      .then(r => this.getJson(r))
      .then(r => this.createSources.bind(r))
  }

  getJson(resp) {
    resp.json()
  }

  createSources(resp) {
    this.sources = resp.sources.map(source => new Source(source.name, source.id ))
  }

  render() {
    this.sourcesContainer.innerHTML += this.renderSources()
  }

}

class Category {
  constructor (name) {
    this.name = name
    this.prettyName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  render() {
    return (
      `<div class="col s4" >
        <div class="card-panel center-align white" data-category="${this.name}" data-type="category">
          <span class="black-text">
            ${this.prettyName}
          </span>
        </div>
      </div>`
    )
  }

}

class CategoriesList {
  constructor () {
    this.categoryNames = ['business', 'entertainment', 'gaming', 'general', 'music', 'politics', 'science-and-nature', 'sport', 'technology']
    this.categories = []
    this.categoryContainer = document.getElementById('categories')
  }

  createCategories() {
    this.categories = this.categoryNames.map(string => new Category(string))
  }

  renderCategories() {
    return this.categories.map(category => category.render()).join('')
  }

  render() {
    this.categoryContainer.innerHTML = this.renderCategories()
  }

}
