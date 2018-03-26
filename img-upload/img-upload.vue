<template>
  <div class="file-update">

    <div class="file-update-hd">
      <button class="update-btn" type="button" @click='submit'>提交</button>
    </div>
    <div class="file-update-bd clearfix">
      <div class="grid">
        <input name="fff" type="file" accept="image/*"
               id="update-input"
               @change="updateFile($event)"
               :disabled="this.files.length >=9"
               multiple>
        <label class="update-label" for="update-input">+</label>
      </div>
      <div class="grid" v-for="(img, i) in files">
        <div class="preview-img-wrap" @click="remove(i)">
          <img class="preview-img" :src="handlerImg(img)" :alt="img.name">
          <span class="remove-btn">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'file-update',
    data () {
      return {
        files: [],
      }
    },
    methods: {
      updateFile (e) {
        let arr = this.files
        arr.push(...e.target.files)
        this.files = arr.slice(0,9)
      },
      handlerImg(v) {
        let URL = window.URL || window.webkitURL;
        return URL.createObjectURL(v)
      },
      remove(i) {
        this.files.splice(i,1)
      },
      submit(e) {
        /*this.$axios({
          methods: 'post',
          url: '/img',
          data: {
            fff: this.files[0]
          },
          headers: {'enctype': 'multipart/form-data'}
        })
        .then(res => {
          alert(res.data)
        })*/
        let xhr = new XMLHttpRequest()
        let formData = new FormData();
        let arr = this.files
        for(let i = 0,l = arr.length; i < l; i ++) {
          formData.append('fff', arr[0]);

        }
        console.log(formData)
        // xhr.onload = uploadSuccess;
        // xhr.upload.onprogress = setProgress;
        xhr.open('post', '/img', true);
        xhr.send(formData);

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
