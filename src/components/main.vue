<template>
  <!-- 制作一个框架包裹slider -->
  <div style="width: 100%; height: 100%" @mousewheel="handleMouseWheel">
    <!-- 配置slider组件 -->
    <slider :pages="pages" :sliderinit="sliderinit" ref="slider"></slider>
  </div>
</template>

<script>
  import slider from 'vue-concise-slider'
  import main_one from './common/main_one.vue'
  import main_two from './common/main_two.vue'
  import main_three from './common/main_three.vue'
  import main_four from './common/main_four.vue'

  export default {
    name: 'Main',
    data () {
      return {
        pages:[
          {
            style: {
              backgroundImage: "url(" + require("../assets/img/page1-bg.png") + ")",
              fontFamily: "Microsoft YaHei UI Light"
            },
            component: main_one
          },
          {
            style: {
              color: '#333333',
              fontFamily: "Microsoft YaHei UI Light"
            },
            component: main_two
          },
          {
            style: {
              color: '#333333',
              fontFamily: "Microsoft YaHei UI Light"
            },
            component: main_three
          },
          {
            style: {
              fontFamily: "Microsoft YaHei UI Light",
              backgroundColor: '#4D4D4D'
            },
            component: main_four
          }
        ],
        //Sliding configuration [obj]
        sliderinit: {
          currentPage: 0,
          thresholdDistance: 500,
          thresholdTime: 1000,
          loop: false,
          direction: 'vertical',
          slidesToScroll: 1,
          timingFunction: 'ease',
          duration: 1000
        }
      }
    },
    components: {
      slider
    },
    methods: {
      handleMouseWheel (e) {
        if (e.wheelDeltaY < 0) {
          this.$refs.slider.$emit('slideNext')
        } else {
          this.$refs.slider.$emit('slidePre')
        }
      }
    }
  }
</script>
