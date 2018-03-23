<template>
  <div class="swipe-item" :style="style"><slot></slot></div>
</template>

<script>
  export default {
    name: 'swipe-item',
    data () {
      return {
        offset: 0
      }
    },
    computed: {
      style () {
        return {
          transform: `translate${this.axis}(${this.offset}px)`
        }
      }
    }
  }
</script>

