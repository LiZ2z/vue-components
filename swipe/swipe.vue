<template>
  <div class="swipe-box"
       @touchstart=" forbidTouch ? '' : touchStart($event)"
       @touchmove="forbidTouch ? '' : touchMove($event)"
       @touchend=" forbidTouch ? '' : touchEnd()"
       :class="{row: axis === 'X'}"
  >

    <div class="swipe-track" :style="style" >
      <slot/>
    </div>
    <!--指示器-->
    <div class="indicator-area" v-if="this.indicator && this.count > 1">
      <div class="indicator-wrap">
        <div class="indicator" v-for="i in count" :class="{active: i === index}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'swipe',
    props: {
      axis: {
        type:String,
        default: 'X',
        validator (v) {
          return v === 'X' || v === 'Y'
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      indicator: {
        type:Boolean,
        default: true
      },
      init: {
        type:Number,
        default: 1
      },
      loop: {
        type:Boolean,
        default: false
      },
      auto: {
        type:Number,
        default: 2000
      },
      forbidTouch: {
        type:Boolean,
        default: false
      }
    },
    data () {
      return {
        active: 1,   // 当前的索引（真正的索引）
        slideDist: 0,      // 滑动距离
        curDuration: this.duration, // 页面切换的 过渡时间

        count: 0,    // 轮播图的总数
      }
    },
    computed:{
      // 控制页面切换
      style () {
        return {
          transform: `translate${this.axis}(${-this.singleSize* (this.active - 1) + this.slideDist}px)`,
          'transition-duration' : `${this.curDuration}ms`
        }
      },
      // 控制指示器， 及向父组件 发送 change事件
      index() {
        let a = this.active
        const c = this.count
        let v =  (a + c) % c
        if( v === 0) v = c
        this.$emit('change', v)
        return v
      }
    },
    methods: {
      initialize(v) {
        this.curDuration = 0
        this.active = v
      },
      Loop(d) {
        this.curDuration = 0
        const active = this.active
        const count = this.count
        const children = this.$children

        this.active = (active > count ? 1 : active < 1 ? count : active)

        children[count - 1].offset = children[0].offset = 0

        if (d < 0) {
          if (active === count || active === 0) {
            children[0].offset = count*this.singleSize
          }
        } else {
          if (active === 1 || active === count + 1) {
            children[count - 1].offset =  -count*this.singleSize
          }
        }
      },
      touchStart (e) {
        if (this.timeout) {clearTimeout(this.timeout)}

        const touch = e.touches[0]
        this.start = {
          X: touch.clientX,
          Y: touch.clientY,
          T: +new Date
        }
        this.slideAxis = ''
      },
      touchMove(e) {
        const touch = e.touches[0],
              start = this.start,
              axis = this.axis

        let dist = {
          X: touch.clientX - start.X,
          Y: touch.clientY - start.Y
        }

        // 判断上下滑动  还是左右滑动
        if (!this.slideAxis) {
          let diff = Math.abs(dist.X) - Math.abs(dist.Y)
          this.slideAxis = diff >= 0 ? 'X' : 'Y'
        }

        let exact = dist[axis]
        if (axis === this.slideAxis && Math.abs(exact) < this.singleSize) {
          e.preventDefault()
          // 这里最好优化一下,没必要每次执行Loop
          // 当滑动方向改变了,或第一次时需要 执行
          this.Loop(exact)
          this.slideDist = exact
        }

      },
      touchEnd() {
        this.curDuration = this.duration

        let dist = this.slideDist,
            absDist = Math.abs(dist),
            time = +new Date - this.start.T

        if ( (time < 200 && absDist > 0)|| absDist > 150) {
          this.active += dist > 0 ? -1 : 1
        }

        this.slideDist = 0

        this.autoPlay()

      },
      autoPlay() {
        const count = this.count
        if (this.auto && count > 1) {
          this.timeout = setTimeout(() => {
            // 轮播图默认向左滑动, 或向上 , 手指这样滑动的话, 根据上面的touchMove函数,
            // slideDist也会是负值, 所以传入 负数
            // Loop函数主要是根据touchMove事件的方向写的内部逻辑, 所以这里直接传负值就行了
            // 传入正值, 把下面的 this.active 改成递减, 轮播图就反过来转了
            this.Loop(-1)

            setTimeout(() => {
              this.curDuration = this.duration
              this.active ++
              this.autoPlay()
            },30)

          }, this.auto)
        }
      }
    },
    mounted () {
      const track = this.$el
      const children = this.$children
      // 判断主轴
      let size ,
          axis = this.axis
      size = axis === 'X'
            ? track.clientWidth
            :track.clientHeight

      this.count = children.length
      this.singleSize = size

      children.forEach((item) => {
        item.axis = axis
      })

      // 初始化
      this.initialize(this.init)
      // 自动轮播
      this.autoPlay()
    },
    destroyed: function destroyed() {
      clearTimeout(this.timeout)
    }
  }
</script>

<style lang='less'>

  .swipe-box{
    position: relative;

    height:100%;
    overflow-x: scroll;
    overflow-y: hidden;

    &.row {
      overflow-x: hidden;
      overflow-y: scroll;
      .swipe-track{
        font-size:0 !important;
        white-space: nowrap;
        .swipe-item{
          display: inline-block;
          font-size:16px;
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }

      .indicator-area{
        left:10px; right:10px;top: auto;
        text-align: center;
      }
      .indicator-wrap{
        top:auto;
      }
      .indicator{
        display: inline-block;
      }
    }
  }
  .swipe-track{
    height:100%;
    transition: transform cubic-bezier(0.3333, 0.66666,0.66666,1) .3s;
  }
  .swipe-item{
    height:100%;
    width:100%;
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .indicator-area{
    position: absolute;
    padding:3px 2px;
    right:0;
    top:0;bottom:0;
    font-size:0;
  }
  .indicator-wrap{
    position: relative;
    top:50%;
  }
  .indicator{
    width:8px;
    height:8px;
    border-radius:50%;
    background:#fff;
    margin:4px;

    &.active{
      background: rgba(0, 0, 0, 0.65);
    }
  }


</style>
