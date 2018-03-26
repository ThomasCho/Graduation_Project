<template>
  <div style="padding: 20px">
    <p class="event-wall_title">在活动墙，寻找你所需</p>
    <waterfall :line-gap="200" :watch="items" :grow="grow" ref="waterfall" @click.native="shuffle">
      <waterfall-slot
        v-for="(item, index) in items"
        :width="item.width"
        :height="item.height"
        :order="index"
        :key="item.id"
        move-class="item-move"
        @click.native="viewEvent(index)"
      >
        <div class="item" :style="item.style" :index="item.index">
          <div class="event-wall_poster" :style="getPosterStyle(item)"></div>
          <div class="event-wall_name" :title="item.name">名称：{{item.name}}</div>
          <div class="event-wall_time" :title="showTime(item)">时间：{{showTime(item)}}</div>
          <div class="event-wall_desc" :title="item.desc">
            活动形式：
            <p class="event-wall_desc-p">{{item.desc}}</p>
          </div>
        </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
  import Waterfall from 'vue-waterfall/lib/waterfall'
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

  export default {
    name: 'EventWall',
    components: {
      Waterfall,
      WaterfallSlot
    },
    data () {
      return {
        items: [],
        grow: [3, 2, 3, 2]
      }
    },
    mounted () {
      this.loadEvent()
    },
    methods: {
      loadEvent () {
        this.fetch({
          url: 'api/loadEvent',
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            let items = res.data.message.map((val, index) => {
              val.width = 30
              val.height = 30
              val.id = index
              val.index = index
              val.style = {
                fontSize: '100%'
              }
              return val
            })
            this.items = JSON.parse(JSON.stringify(items))
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })

        this.$notify.info({
          title: '',
          message: this.$createElement('span', { style: 'color: #909399'}, '任意点击可刷新'),
          position: 'bottom-right'
        })
      },
      shuffle () {
        this.items.sort(() => {
          return Math.random() - 0.5
        })
      },
      viewEvent (val) {
        this.$store.dispatch('ChooseEvent', this.items[val])
        this.$router.push({path: '/event'})
      },
      getPosterStyle (item) {
        return {
          backgroundImage: 'url(http://localhost:3000/img/poster' + item.poster + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      },
      convertDate (val) {
        let date = new Date(val)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + ' '

        return Y + M + D
      },
      convertTime (val) {
        let date = new Date(val)
        let h = date.getHours() + ':'
        let m = date.getMinutes() + ':'
        let s = date.getSeconds()

        return h + m + s
      },
      showTime (item) {
        return this.convertDate(item.date) + '  ' + this.convertTime(item.time[0]) + ' 至 ' + this.convertTime(item.time[1])
      }
    }
  }
</script>

<style>
  .item-move {
    transition: all .5s cubic-bezier(.55,0,.1,1);
    -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .item {
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 1px solid #EEEEEE;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0px 0px 5px darkgrey;
  }
  .item:hover {
    animation: bigborder 0.5s;
    -webkit-animation: bigborder 0.5s;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards;
  }
  @keyframes bigborder
  {
    from {border: 1px solid #EEEEEE;}
    to {border: 1px solid black;}
  }
  @-webkit-keyframes bigborder
  {
    from {border: 1px solid #EEEEEE;}
    to {border: 1px solid black;}
  }
  .event-wall_poster {
    width: 100%;
    height: 50%;
  }
  .event-wall_name {
    width: 95%;
    height: 10%;
    padding: 0 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #EEEEEE;
    line-height: 182%;
  }
  .event-wall_time {
    width: 95%;
    height: 10%;
    padding: 0 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #EEEEEE;
    line-height: 182%;
  }
  .event-wall_desc {
    width: 95%;
    height: 30%;
    padding: 0 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 182%;
  }
  .event-wall_desc-p {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .event-wall_title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    margin: 10px 0;
  }
</style>
