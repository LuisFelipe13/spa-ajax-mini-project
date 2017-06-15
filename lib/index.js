class Adapter {
  constructor () {
    this.baseUrl = 'https://newsapi.org/v1/'
    this.key = '&apiKey=e20512689bbe4c0484e25751de5c40af'
    this.sources = this.baseUrl + 'sources'
    this.articles = this.baseUrl + 'articles'
  }

  getSources (){
    return fetch(this.sources)
  }

  getArticles(sourceId, sortMethod){
    return fetch(this.articles + '?source=' + sourceId + sortMethod + this.key)
  }
}

class Source {
  constructor () {
  }

  render() {
  }

}

class SourcesList {
  constructor () {
  }

  render() {
  }

}

class Category {
  constructor (name) {
    this.name = name
    this.prettyName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  render() {
    return (
      `<div class="col s3" >
        <div class="card-panel white" data-category="${this.name}">
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
    this.categories = this.categoryNames.map(name, string => new Category(string))
  }

  renderCategories() {
    return this.categories.map(category => category.render()).join('')
  }

  render()
    this.categoryContainer.innerHTML = this.renderCategories()
  }

}

class App {
  constructor() {
    this.categoriesList = new CategoriesList()
  }

  render() {
    this.categoriesList.createCategories()
    this.categoriesList.render()
  }

}

app = new App
app.render()
