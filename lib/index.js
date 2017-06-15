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
        this.categories = []
        document.querySelectorAll('.blue').forEach((cat) => this.categories.push(cat.dataset.category))
        this.switchView()
        this.renderSources()
        var self = this
        setTimeout(function() {self.setSources()}, 250)
        setTimeout(function() {self.renderArticles()}, 300)
      }
    })

    this.withArts = document.getElementById('with-arts')
    this.sources = []
    this.sourcesList = new SourcesList()

    this.articles = document.getElementById('articles')
    this.articleList = new ArticleList()

    this.withArts.addEventListener("click", (event) => {
      if (event.target.type === "checkbox") {
        this.setSources()
        this.articles.innerHTML = ""
        this.renderArticles()
      } else if (event.target.id === "source-button") {
        this.switchView()
      }
    })

  }

  setSources() {
    this.sources = []
    document.querySelectorAll('.source').forEach((ipt) => {
      if (ipt.checked) {
        this.sources.push(ipt.dataset.source)
      }
    })
  }

  render() {
    this.renderCategories()
  }

  renderCategories() {
    this.categoriesList.createCategories()
    this.categoriesList.render()
  }

  switchView() {
    this.sources = []
    document.getElementById('sources').innerHTML = " "
    document.getElementById('articles').innerHTML = " "
    this.withCats.classList.toggle('hide')
    this.withArts.classList.toggle('hide')
  }

  renderSources() {
    this.categories.map((cat) => {
      this.sourcesList.fetchSources(cat)
    })
  }

  renderArticles() {
    this.sources.map((src) => {
      this.articleList.fetchArticles(src)
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

  getArticles(sourceId, sortMethod = ''){
    return fetch(this.articles + '?source=' + sourceId + sortMethod + this.key)
  }
}

class Article {
  constructor(title, description, url, urlToImage, publishedAt) {
    this.title = title
    this.description = description
    this.url = url
    this.urlToImage = urlToImage
    this.publishedAt = publishedAt
  }

  render() {
    return (
      `<div class="col s6">
          <div class="card">
            <div class="card-image">
              <img src="${this.urlToImage}">
            </div>
            <div class="card-content">
              <h5>${this.title}</h5>
              <p>${this.description}</p>
              <label>${this.publishedAt}</label>
            </div>
            <div class="card-action">
              <a href="${this.url}" target="_blank">Read More</a>
            </div>
          </div>
        </div>`
    )
  }
}

class ArticleList {
  constructor () {
    this.articles = []
    this.articlesContainer = document.getElementById('articles')
    this.adapter = new Adapter()
  }

  renderArticles() {
    return this.articles.map(article => article.render()).join('')
  }

  fetchArticles(source) {
    this.adapter.getArticles(source)
      .then(r => this.getJson(r))
      .then(r => this.createArticles(r))
      .then(this.render.bind(this))
  }

  getJson(resp) {
    return resp.json()
  }

  createArticles(resp) {
    this.articles = resp.articles.map(article => new Article(article.title, article.description, article.url, article.urlToImage, article.publishedAt))
  }

  render() {
    this.articlesContainer.innerHTML += this.renderArticles()
  }

}


class Source {
  constructor (name, id) {
    this.name = name
    this.id = id
  }

  render() {
    return (
      `<div class="switch" >
        <label>
          <input class="source" type="checkbox" checked data-source="${this.id}">
          <span class="lever"></span>
          ${this.name}
        </label>
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
      .then(r => this.createSources(r))
      .then(this.render.bind(this))
  }

  getJson(resp) {
    return resp.json()
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
