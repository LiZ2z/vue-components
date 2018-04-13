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

      <div class="grid" v-for="(img, i) in imgs" :key='i' >
        <div class="preview-img-wrap" @click="remove(i)">
          <img class="preview-img" :src="img"  v-if="img">
          <span class="remove-btn">+</span>
        </div>
      </div>
    </div>

  

  </div>
</template>

<script>
  import EXIF from './exif'
  export default {
    name: 'file-update',
    data () {
      return {
        imgs: []
      }
    },
    props:{
      ratio: {
        type: Number,
        default: 0.2
      },
      max: {
        type: Number,
        default: 9
      }
    },
    mounted() {
      window.URL = window.URL || window.webkitURL
      let canvas = document.createElement('canvas')
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      EXIF.call(this)
    },
    methods: {
      uploadImg (e) {
        let newImgs = [...e.target.files]
        const imgs = this.imgs
        const oldLen = imgs.length
        // 限制用户上传图片数量, 最多9张
        newImgs = newImgs.slice(0, this.max - oldLen)
        if (newImgs.length) {
          // 记录新增上传列表
          this.newImgs = this.newImgs ? this.newImgs.concat(newImgs) : newImgs
          // 先记录一下当前文件列表长度, 因为是异步处理图片,当图片处理完成后,
          // 根据此长度将图片插入相应位置, 以保证上传的图片顺序跟用户选择的图片顺序一致
          if (!this.len) { this.len =  oldLen }
          const arr = new Array(newImgs.length)
          this.imgs = imgs.concat(arr)
          this.getOrientation(0)
        }
      },
      // 获取图片拍摄时的旋转角度
      getOrientation(i) {
        const imgFile = this.newImgs[i]
        const blobSrc = window.URL.createObjectURL(imgFile)
        // 调用EXIF库 获取图片信息
        this.EXIF.getData(imgFile, function(vm) {
          return function () {
            // 压缩图片
            vm.compress(blobSrc, vm.EXIF.getTag(this, 'Orientation'), i)
          }
        }(this))
      },
      // 压缩图片
      compress(src, ori, i) {
        let img = new Image()
        img.crossOrigin = "anonymous"
        img.src = src
        img.onload = (function (vm, ori, i) {
          return function () {
            window.URL.revokeObjectURL(this.src)
            const w = this.width,
                  h = this.height,
                  canvas = vm.canvas,
                  ctx = vm.ctx
            canvas.width = w
            canvas.height = h
            let deg = 0,
                drawH = h,
                drawW = w
            // 矫正图片旋转方向
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
            // ctx.save()
            ctx.rotate(deg)
            // png图片在转成jpeg时, png的透明部分在canvas中表现为黑色,
            // 这里把canvas底色设置成白色
            ctx.fillStyle = "#fff"
            ctx.fillRect(0, 0, drawW, drawW)
            ctx.drawImage(this,0,0,drawW, drawH)
            // ctx.restore()
            vm.imgs.splice((vm.len + i), 1, canvas.toDataURL('image/jpeg', vm.ratio) )
            // 一次选中多个上传文件, 循环调用
            if (i < vm.newImgs.length - 1) {
              vm.getOrientation(++i)
            } else {
              vm.len = 0
              vm.newImgs = []
            }
          }
        })(this, ori, i)
      }, // END compress  method
      remove(i) {
        // 正在处理上传图片的时候不允许删除
        if (!this.newImgs || !this.newImgs.length) {
          this.imgs.splice(i, 1)
        }
      },
      base64ToBinary(v) {
        const arr = v.split(',')
        const dataURL = arr[1]
        const mime = arr[0].match(/:(.*);/)[1]
        let i = dataURL.length
        const u8arr = new Uint8Array(i)
        while (i--) {
          u8arr[i] = dataURL.charCodeAt(i)
        }
        return new Blob(u8arr, {type: mime})
      },
      submit() {
        let imgs = this.imgs,
        base64ToBinary = this.base64ToBinary;
        for(let i = 0, len = imgs.length; i < len; i++) {
          imgs[i] = base64ToBinary(imgs[i])
        }
        this.$emit('sumbit', imgs)
      }
    }
  }
</script>

<style >
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
    background: #000;
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
