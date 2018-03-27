<template>
  <div class="file-update">

    <div class="file-update-hd">
      <button class="update-btn" type="button" @click='submit'>提交</button>
    </div>
    <div class="file-update-bd clearfix">
      <div class="grid">
        <input name="fff" type="file" accept="image/*"
               id="update-input"
               @change="uploadImg($event)"
               :disabled="this.imgs.length >=9"
               multiple>
        <label class="update-label" for="update-input">+</label>
      </div>

      <div class="grid" v-for="(img, i) in imgs" :key='i' v-if="img">
        <div class="preview-img-wrap" @click="remove(i)">
          <img class="preview-img" :src="img.src" :alt="img.alt">
          <span class="remove-btn">+</span>
        </div>
      </div>

    </div>
    <canvas ref="canvas" width="750" class="compress-canvas"></canvas>

  </div>
</template>

<script>
  import EXIF from './exif'
  export default {
    name: 'file-update',
    data () {
      return {
        imgs: [],
        previews: []
      }
    },
    mounted() {
      window.URL = window.URL || window.webkitURL
      let canvas = this.$refs.canvas
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      EXIF.call(this)
    },
    methods: {
      uploadImg (e) {
        const len = this.imgs.length
        let newImgs = [...e.target.files]

        newImgs = newImgs.slice(0, 9 - len)

        this.handlerAdd(newImgs)
        // this.handlerPreview(newImgs)
      },
      handlerAdd(imgs) {
        let imgFile = null, blobSrc = ''
        const oldLen = this.imgs.length
        const len = imgs.length
        let arr = new Array(len)

        this.imgs = this.imgs.concat(arr)

        for(let i = 0; i < len; i++) {
          imgFile = imgs[i]
          blobSrc = window.URL.createObjectURL(imgFile)

          // 获取图片拍摄时的旋转角度
          this.EXIF.getData(imgFile, (function(vm){
            return function () {
              // 压缩图片
              vm.compress(blobSrc, vm.EXIF.getTag (this, 'Orientation'), oldLen + i)
            }
          })(this))

        } // END for
      },
      compress(src, ori, i) {
        let img = new Image()
        img.src = src
        img.onload = (function (vm, ori, i) {
          return function () {
            this.onload = null
            window.URL.revokeObjectURL(this.src)

            const w = 750,
              h = (this.height/this.width) * w,
              canvas = vm.canvas,
              ctx = vm.ctx

            canvas.width = w
            canvas.height = h

            let deg = 0,
              drawH = h,
              drawW = w

            switch (ori) {

              case 3:
                deg=Math.PI
                drawW = -w
                drawH = -h
                break;
              case 6:
                canvas.width = h
                canvas.height = w
                drawH = -h
                deg = Math.PI/2
                break;
              case 8:
                canvas.width = h
                canvas.height = w
                deg = Math.PI*3 / 2
                drawW = -w
                break;
              default:
                break;
            }

            ctx.rotate(deg)
            ctx.drawImage(this,0,0,drawW, drawH)

            vm.imgs.splice(i, 1, {
              src: canvas.toDataURL('image/jpeg')
            })

          }
        })(this, ori, i)

      }, // END compress  method
      remove(i) {
        this.imgs.splice(i, 1)
        this.previews.splice(i, 1)
      },
      submit(e) {
        /*this.$axios({
          methods: 'post',
          url: '/img',
          data: {
            fff: this.imgs[0]
          },
          headers: {'enctype': 'multipart/form-data'}
        })
        .then(res => {
          alert(res.data)
        })*/
        let xhr = new XMLHttpRequest()
        let formData = new FormData();
        let arr = this.imgs
        for(let i = 0,l = arr.length; i < l; i ++) {
          formData.append('fff', arr[i]);
          console.log(arr[i])
        }
        // xhr.onload = uploadSuccess;
        // xhr.upload.onprogress = setProgress;
        xhr.open('post', '/img', true);
        xhr.send(formData);
      }
    }

  }
</script>

<style >
  .compress-canvas{display:none;}

  .clearfix:after{
    display: block;
    content: '\0020';
    clear:both;
    height:0;
  }
  .file-update-hd{
    overflow: hidden;
    padding: 0 10px;
  }
  .update-btn{
    float:right;
    background: #000000;
    color:#fff;
    border:none;
    padding:4px 10px;
    border-radius:4px;
  }


  .update-label{
    display: block;
    width:60px;
    height:60px;
    border: 1px dashed #000;
    box-sizing: border-box;
    margin:0 auto;
    font-size:30px;
    text-align: center;
    line-height:58px;
  }
  #update-input{display: none;}

  #update-input:disabled+.update-label{
    border: 1px dashed #aaa;
    color:#aaa;
  }
  .file-update-bd{
    padding:20px 0;
  }

  .grid{
    width:20%;
    float:left;
    margin: 5px 0;
  }

  .preview-img-wrap{
    overflow: hidden;
    height:60px;
    width:60px;
    font-size:0;
    margin:0 auto;
    position: relative;
    line-height:58px;
    border-radius:4px;
    background:#f6f6f6;
  }
  .preview-img{
    width:100%;
    vertical-align: middle;
  }
  .remove-btn{
    display: block;
    position: absolute;
    top:0;right:0;
    background:rgba(0,0,0,.7);
    font-size:16px;line-height:18px;
    width:18px;
    color:#fff;
    text-align: center;
    transform: rotateZ(45deg);
    border-radius:50%;
  }
</style>
