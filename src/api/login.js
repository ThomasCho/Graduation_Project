import fetch from '../util/fetch'

export function loginByEmail (email, password) {
  const data = {
    email,
    password
  }
  return fetch({
    url: 'api/loginbyemail',
    method: 'post',
    data
  })
}

export function getInfo (email) {
  return fetch({
    url: 'api/user/info',
    baseURL: '/',
    method: 'get',
    params: {
      email
    }
  })
}
