import './toast.css';
// import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

export default {
  install(Vue) {
    const Toast = function(options) {
      if (typeof options === 'string') {
        options = { text: options }
      }
      Toast.render(options)
    }


    Toast.loading = function (options) {
      if(typeof options === 'string') {
        options = {text: options, type: 'loading', duration: 0}
      }
      this.render(options)
    }

    Toast.clear = function () {
      const domList = document.querySelectorAll('.toast__wrap')
      for (let i = 0, len = domList.length; i < len; i++) {
        document.body.removeChild(domList[i])
      }
    }

    Toast.render = function(options) {
      this.clear()
      const div = document.createElement('div')
      const toast = document.createElement('div')
      const bd = document.createElement('div')
      div.setAttribute('class', 'toast__wrap')
      toast.setAttribute('class', 'toast')
      bd.setAttribute('class', 'toast-bd')
      div.appendChild(toast)
      toast.appendChild(bd)
      bd.innerText = options.text || '通知'

      // 位置
      let style = null
      if (options.position) {
        switch (options.position) {
          case 'bottom':
            style = 'bottom: 40px;top:auto;'
        }
      }
      toast.setAttribute('style', style)

      // toast类型
      const type = options.type
      if (type) {
        const hd = document.createElement('div')
        hd.setAttribute('class', 'toast-hd')
        switch (type) {
          case 'loading':
            hd.innerHTML = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1527766711363" class="toast-svg"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3235" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="3236"></path></svg>`
            options.duration = 0
            break;
        }
        toast.insertBefore(hd, bd);
      }


      // 添加
      document.body.appendChild(div)
      // 延时
      if (options.duration === 0) {
        return
      }

      setTimeout(() => {
        try{
          document.body.removeChild(div)
        }catch(err){return}
      }, options.duration || 1000)
    }
    
    

    Vue.$toast = Toast
    Vue.mixin({
      created: function () {
        this.$toast = Vue.$toast
      }
    });
  }
}