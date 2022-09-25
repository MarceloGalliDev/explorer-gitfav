//class que vai conter a lógica dos dados
//como os dados serão estruturados
//class que vai criar a visualização e eventos do HTML
import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    //GithubUser.search('MarceloGalliDev').then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)
      if (userExists) {
        throw new Error('Usuário já cadastrado!')
      }
      //higher order, recebe funções como argumento ou retornam funções como argumento 

      const user = await GithubUser.search(username)
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]//criamos um novo array(não quebra a imutabilidade), e espalhamos os user após o capturado.
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }//para códigos assíncronos usamos o async com await, está aguardando a promessa

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    
    this.entries = filteredEntries //atribuindo um novo array ao this.entries
    this.update()
    this.save()
  }// higher order functions = funções de alta order (map, filter, find, reduce)
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    //aqui estamos selecionando somente os tr dentro do tbody
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Are you sure you want to remove')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/MarceloGalliDev.png" alt="Imagem de Marcelo">
        <a href="https://github.com/MarceloGalliDev" target="_blank">
          <p>Marcelo</p>
          <span>MarceloGalliDev</span>
        </a>
      </td>
      <td class="repositories">
        2
      </td>
      <td class="followers">
        1
      </td>
      <td class="buttonRemove">
        <button class="remove">Remove</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    //aqui estamos selecionando somente os tr dentro do tbody
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
    //vai criar um nodeList(array like)
    //.forEach = para cada tr vai executar uma função
  }
}
//com esse comando estamos extendendo a class Favorites para dentro do super, fazer uma cópia