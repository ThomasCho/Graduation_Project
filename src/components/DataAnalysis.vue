<template>
  <div style="padding: 20px;">
    <div class="analysis-page_title">后台数据统计分析</div>
    <div class="analysis-page_row-container">
      <div id="myChart1" class="analysis-page_graphics"></div>
      <div id="myChart2" class="analysis-page_graphics"></div>
      <div id="myChart3" class="analysis-page_graphics"></div>
    </div>
    <div class="analysis-page_row-container">
      <div id="myChart4" class="analysis-page_graphics"></div>
      <div id="myChart5" class="analysis-page_graphics"></div>
      <div id="myChart6" class="analysis-page_graphics"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DataAnalysis',
    data () {
      return {
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        data5: [],
        data6: []
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      loadData () {
        this.fetch({
          url: 'api/dataAnalysis',
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            this.processData(res.data.message)
            this.drawGraph()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      processData (data) {
        let learnEvent = [], eatEvent = [], playEvent = [], hikeEvent = [], maleUser = [], femaleUser = []
        // 活动按类型分类
        data.events.forEach(event => {
          event.type.forEach(type => {
            if (type === '学习') {
              learnEvent.push(event)
            } else if (type === '吃喝') {
              eatEvent.push(event)
            } else if (type === '玩耍') {
              playEvent.push(event)
            } else if (type === '旅行') {
              hikeEvent.push(event)
            }
          })
        })

        // 用户按性别分类
        data.users.forEach(user => {
          if (user.gender === '男') {
            maleUser.push(user)
          } else if (user.gender === '女') {
            femaleUser.push(user)
          }
        })

        // 分别对活动按浏览数、收藏数、参与人数排序一下
        let viewSort = data.events.sort((a, b) => b.view - a.view)
        let starSort = data.events.sort((a, b) => b.star - a.star)
        let joinSort = data.events.sort((a, b) => b.participant.length - a.participant.length)

        this.data1 = [learnEvent.length, eatEvent.length, playEvent.length, hikeEvent.length]
        let learnJoiners = 0, eatJoiners = 0, playJoiners = 0, hikeJoiners = 0
        learnEvent.forEach(val => {
          learnJoiners += val.participant.length
        })
        eatEvent.forEach(val => {
          eatJoiners += val.participant.length
        })
        playEvent.forEach(val => {
          playJoiners += val.participant.length
        })
        hikeEvent.forEach(val => {
          hikeJoiners += val.participant.length
        })
        this.data2 = [Math.round(learnJoiners / learnEvent.length), Math.round(eatJoiners / eatEvent.length),
          Math.round(playJoiners / playEvent.length), Math.round(hikeJoiners / hikeEvent.length)]
        this.data3 = [maleUser.length, femaleUser.length]
        this.data4 = [{
          name: viewSort[0].name,
          count: viewSort[0].view
        }, {
          name: viewSort[1].name,
          count: viewSort[1].view
        }, {
          name: viewSort[2].name,
          count: viewSort[2].view
        }]
        this.data5 = [{
          name: starSort[0].name,
          count: starSort[0].star
        }, {
          name: starSort[1].name,
          count: starSort[1].star
        }, {
          name: starSort[2].name,
          count: starSort[2].star
        }]
        this.data6 = [{
          name: joinSort[0].name,
          count: joinSort[0].participant.length
        }, {
          name: joinSort[1].name,
          count: joinSort[1].participant.length
        }, {
          name: joinSort[2].name,
          count: joinSort[2].participant.length
        }]
      },
      drawGraph () {
        let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
        let myChart5 = this.$echarts.init(document.getElementById('myChart5'))
        let myChart6 = this.$echarts.init(document.getElementById('myChart6'))
        // 绘制图表
        myChart1.setOption({
          title: {
            text: '活动类型分布',
            left: 'center'
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },

          visualMap: {
            show: false,
            min: 0,
            max: 10,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '活动类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                {value: this.data1[0], name: '学习'},
                {value: this.data1[1], name: '吃喝'},
                {value: this.data1[2], name: '玩耍'},
                {value: this.data1[3], name: '旅行'}
              ].sort((a, b) => a.value - b.value),
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#ca8622',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },

              animationType: 'scale',
              animationEasing: 'elasticOut'
            }
          ]
        })
        myChart2.setOption({
          title: {
            text: '每个活动类型的平均参与人数',
            left: 'center'
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },

          visualMap: {
            show: false,
            min: 0,
            max: 3,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '平均参与人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                {value: this.data2[0], name: '学习'},
                {value: this.data2[1], name: '吃喝'},
                {value: this.data2[2], name: '玩耍'},
                {value: this.data2[3], name: '旅行'}
              ].sort((a, b) => a.value - b.value),
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },

              animationType: 'scale',
              animationEasing: 'elasticOut'
            }
          ]
        })
        myChart3.setOption({
          title: {
            text: '系统注册人数',
            left: 'center'
          },
          color: ['#3398DB'],
          tooltip: {},
          xAxis: {
            data: ["男", "女"]
          },
          yAxis: {},
          series: [{
            name: '注册人数',
            type: 'bar',
            data: [this.data3[0], this.data3[1]]
          }]
        })
        myChart4.setOption({
          title: {
            text: '浏览数前三活动',
            left: 'center'
          },
          color: ['#91c7ae'],
          tooltip: {},
          xAxis: {
            data: [this.data4[0].name, this.data4[1].name, this.data4[2].name]
          },
          yAxis: {},
          series: [{
            name: '浏览数',
            type: 'bar',
            data: [this.data4[0].count, this.data4[1].count, this.data4[2].count]
          }]
        })
        myChart5.setOption({
          title: {
            text: '收藏数前三活动',
            left: 'center'
          },
          color: ['#61a0a8'],
          tooltip: {},
          xAxis: {
            data: [this.data5[0].name, this.data5[1].name, this.data5[2].name]
          },
          yAxis: {},
          series: [{
            name: '收藏数',
            type: 'bar',
            data: [this.data5[0].count, this.data5[1].count, this.data5[2].count]
          }]
        })
        myChart6.setOption({
          title: {
            text: '参与人数前三活动',
            left: 'center'
          },
          color: ['#d48265'],
          tooltip: {},
          xAxis: {
            data: [this.data6[0].name, this.data6[1].name, this.data6[2].name]
          },
          yAxis: {},
          series: [{
            name: '参与人数',
            type: 'bar',
            data: [this.data6[0].count, this.data6[1].count, this.data6[2].count]
          }]
        })
      }
    }
  }
</script>

<style>
  .analysis-page_title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
  }
  .analysis-page_row-container {
    position: relative;
    left: 50%;
    width: 50%;
  }
  .analysis-page_graphics {
    position: relative;
    width: 300px;
    height: 300px;
    float: left;
    left: -50%;
  }
</style>
