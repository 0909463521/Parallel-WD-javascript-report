
import request from 'request'
import BPromise from 'bluebird'


const requestAsync = BPromise.promisify(request, {multiArgs: true})

function removeSlash(text) {
  return (text) ? text.replace(/\/$/, '') : text
}

export default class Authorize {
    getToken(username , password) {
        const encode = new Buffer.from(`${username}:${password}`).toString('base64')
        this._token = this._token ? this._token : encode
        return this._token
    }
    _getAbsoluteUrl(url,path) {
        return `${url}/v1/${removeSlash(path)}`
    }
    async _send({username,password,method = 'GET', json = true, url, path, headers, body = {}} = {}) {
        const finalHeaders = headers || {
          'authorization': `Basic ${this.getToken(username,password)}`,
          'content-type': 'application/json'
        }
    
        const requestURL = this._getAbsoluteUrl(url,path)
    
        const finalOptions = {
          method,
          json,
          url: requestURL,
          headers: finalHeaders,
          body
        }
    
        const [response, resBody] = await requestAsync(finalOptions)
        return [resBody, response]
    }

    async get(options = {}) {
    return await this._send({
        ...options,
        method: 'GET'
    })
    }
}
