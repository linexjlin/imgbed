import _ from 'lodash'
import axios from 'axios'

export default class Ipfs {
  BASE_URL = 'https://ipfs.ee/api/add'

  static title = 'IPFS'

  static params = [{
    name: 'requestUrl',
    label: '加速域名地址：',
    component: 'input',
    type: 'text',
    placeholder: 'https://ipfs.ee/ipfs'
  }]

  static rules = {
    requestUrl: [
      { required: false, message: '请加速域名地址', trigger: 'blur' },
      { type: 'url', message: '格式形如 https://ipfs.ee/ipfs', trigger: 'blur' }
    ]
  }

  constructor (requestUrl) {
    this.requestUrl = requestUrl
  }

  getEndpoint () {
    return this.BASE_URL
  }

  successHandle (file, res) {
    let burl = _.trimEnd(this.requestUrl, '/')
    if (burl === '') {
      burl = 'https://ipfs.ee/ipfs'
    }
    let name = _.get(res, 'data.Name')
    if (name === 'image.png') {
      name = _.get(res, 'data.Size') + '.png'
    }
    let url = burl + '/' + _.get(res, 'data.Hash') + '/' + name
    return {
      url,
      name: file.name,
      thumb: url + '#80x80',
      preview: url + '#320x180'
    }
  }

  errorHandle (err) {
    return {
      message: _.get(err, 'response.data.message') || err.message
    }
  }

  upload (file, onProgress, onError, onSuccess) {
    let url = this.getEndpoint()
    let formData = new FormData()
    formData.append('file', file)

    axios.post(url, formData, {
      onUploadProgress: onProgress
    }).then((res) => {
      return onSuccess(this.successHandle(file, res))
    }).catch((err) => {
      return onError(this.errorHandle(err))
    })
  }
}
