export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers }) => ({ login, name, public_repos, followers }))
  }
}
//fetch é o comando que vai buscar as coisa para nos em qualquer URL, e vamos transforma-lo em um JSON
//.then(data => ({})) foi feito dessa forma para que se retorne um objeto, pois caso não tivesse o pararênteses teriamos que adicionar o comando return dentro do objeto