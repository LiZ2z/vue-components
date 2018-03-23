<template>
    <div class="keyboard">
        <div class="kbd-plugin">
            <slot name="kbd-plugin">
                <div class="pw-display">
                    <div class="pw-title"><slot name="pw-title"></slot></div>
                    <div class="pw clearfix">
                        <p class="pw-dot" :class="{active:len>0}"></p>
                        <p class="pw-dot" :class="{active:len>1}"></p>
                        <p class="pw-dot" :class="{active:len>2}"></p>
                        <p class="pw-dot" :class="{active:len>3}"></p>
                        <p class="pw-dot" :class="{active:len>4}"></p>
                        <p class="pw-dot" :class="{active:len>5}"></p>
                    </div>
                </div>
            </slot>
        </div>
        <div class="banner">
            <div class="close" @click="hideKbd">关闭</div>
        </div>
        <div class="keys-area" @click="key($event)">
            <ul class="keys">
                <li class="key" data-key="1">1</li>
                <li class="key" data-key="4">4</li>
                <li class="key" data-key="7">7</li>
                <li class="key" data-key=".">.</li>
            </ul>
            <ul class="keys">
                <li class="key" data-key="2">2</li>
                <li class="key" data-key="5">5</li>
                <li class="key" data-key="8">8</li>
                <li class="key" data-key="0">0</li>
            </ul>
            <ul class="keys">
                <li class="key" data-key="3">3</li>
                <li class="key" data-key="6">6</li>
                <li class="key" data-key="9">9</li>
                <li class="key" @click="hide">
                    <i class="iconfont icon-ycjp"></i>
                </li>
            </ul>
            <ul class="tools">
                <li class="tool del" @touchstart='del($event)' @touchend="del($event)">
                    <i class="iconfont icon-tuige"></i>
                </li>
                <li class="tool ok" @click="ok">确定</li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'keyboard',
    data () {
      return {
        pw:'',
        longTouchTimeout:'',
        longTouchInterval:''
      }
    },
    computed:{
      len () {
        return this.pw.length;
      }
    },
    methods:{
      key (eve) {
        let val=eve.target.getAttribute("data-key");
        if(val){
          if(this.pw.length<6){
            this.pw+=val;
          }
          this.$emit("key",val);
        }
      },
      ok (){
        this.$emit("password",this.pw);
        this.$emit("ok","ok");
        this.pw='';
      },
      hide (){
        this.$emit("hide","hide");
        this.pw='';
      },
      del  (event) {
        if(event.type == 'touchstart'){
          this.pw=this.pw.slice(0,-1);
          this.$emit("del","del");
          let _this = this;
          this.longTouchTimeout = setTimeout(function () {
            _this.longTouchInterval = setInterval(function () {
              _this.pw=_this.pw.slice(0,-1);
              _this.$emit("del","del");
            },20);
          },300);
        }else{
          clearTimeout(this.longTouchTimeout);
          clearInterval(this.longTouchInterval);
        }
      },
      hideKbd () {this.$emit("hide",'hide');}
    }
  }
</script>

<style scoped lang='less'>
    /*--键盘--*/
    @margin:0.02rem;
    @key-height:0.7rem;
    @key-border-bg:#ccc;
    .keyboard{
        position: fixed;
        bottom: 0;right:0;left:0;  top:0;
        background:#fff;
        font-size:0.22rem;
        -webkit-user-select: none;
        user-select: none;
        z-index:100;
        .iconfont{
            font-size:0.36rem !important;
            color:#222 !important;
        }
        .keys-area{
            position: absolute;
            bottom:0;left:0;
            width:100%;
            background:#fff;
            -webkit-animation: slideInDown ease 0.3s;
            animation: slideInDown ease 0.3s;
        }
        .banner{
            position: absolute;
            bottom:2.8rem;right:0;left:0;
            color:#444;
            font-size:0.16rem;
        }
        .close{
            float: right;
            padding:0.1rem;
        }
        /*边框*/
        .keys:after{
            content:"\0020";
            display: block;
            height:100%;
            width:1px;
            -webkit-transform: scaleX(0.5);
            transform: scaleX(0.5);
            background:@key-border-bg;
            position: absolute;
            top:0;right:0;
        }
        .key:before,
        .tool:not(:last-of-type):before{
            content:"\0020";
            display: block;
            height:1px;
            width:100%;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            background:@key-border-bg;
            position: absolute;
            top:0;right:0;
        }
        .keys,
        .tools{
            width:25%;
            float:left;
            position: relative;
        }
        .key,
        .tool{
            text-align:center;
            box-sizing:border-box;
            line-height:@key-height;
            color: #222;
            position: relative;
            background: #fff;
            font-family:"等线 Light";
            font-size:0.34rem;
            border-radius:2px;
        }
        .tool{
            line-height:2*@key-height;
        }
        .tool.ok{
            background:#6db74b  ;
            color:#fff;
            font-size:0.28rem;
        }
        .tool.ok:active{
            background: #65aa46;
        }
        .key:active,
        .key:active,
        .tool.del:active{
            background: #e6e6e6;
        }
    }
    .keyboard.color{
        .banner,
        .keys:after,
        .key:before,
        .tool:not(:last-of-type):before{
            display: none;
        }
        .keys-area{
            -webkit-box-shadow: 0 1px 20px 1px rgba(19, 120, 254, 0.35);
            box-shadow: 0 0 12px 2px rgba(135, 187, 255, 0.35);
        }
        .tool.ok{
            background: rgba(42, 109, 197, 0.8);
        }
        .tool.ok:active{
            background: rgb(42, 109, 197);
        }

    }
    .kbd-plugin{
        background: #fff;
        color: #444;
        padding: 0.04rem;
        position: absolute;top: 0;left: 0;right: 0;bottom: 2.8rem;
        text-align: right;
        overflow: scroll;
        -webkit-animation: slideInUp ease 0.3s;
        animation: slideInUp ease 0.3s;
    }

    /*键盘密码显示*/
    .pw-display{
        margin-top:1.3rem;
    }
    .pw-title{
        color:#444;
        padding-bottom:0.1rem ;
        font-weight:bold ;
        text-align: center;
        font-size:16px;
    }
    .pw{
        margin-bottom:0.06rem;
        border:1px solid @key-border-bg;
    }
    .pw-dot{
        float:left;
        width:16.666666%;
        box-sizing:border-box;
        height:0.5rem;
        position: relative;
    }
    .pw-dot:not(:first-of-type){
        border-left:1px solid @key-border-bg;
    }
    .pw-dot.active:after{
        display: block;
        content: '\0020';
        background: #444;
        width:0.1rem;height:0.1rem;
        border-radius:50%;
        position: absolute;
        left:50%;top:50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }

</style>