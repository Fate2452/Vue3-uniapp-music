import config from '@/utils/config.js' // 前置地址
export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + options.url,
      method: options.method || 'GET', // 不传methods，则默认为get
      data: options.data || {},
      success: (res) => {
        resolve(res.data) //这里要return出来哦
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
