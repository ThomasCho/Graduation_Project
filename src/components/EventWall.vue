<template>
  <div style="padding: 20px">
    <div class="event-wall_classify-tab">
      <el-tag class="event-wall_tag"
              @click.native="chooseType('recommend')"
              :class="{ 'event-wall_active-type': isActive === 'recommend' }">
        薦
      </el-tag>
      <el-tag class="event-wall_tag"
              @click.native="chooseType('learning')"
              :class="{ 'event-wall_active-type': isActive === 'learning' }">
        學
      </el-tag>
      <el-tag class="event-wall_tag"
              @click.native="chooseType('eating')"
              :class="{ 'event-wall_active-type': isActive === 'eating' }">
        吃
      </el-tag>
      <el-tag class="event-wall_tag"
              @click.native="chooseType('playing')"
              :class="{ 'event-wall_active-type': isActive === 'playing' }">
        玩
      </el-tag>
      <el-tag class="event-wall_tag"
              @click.native="chooseType('hiking')"
              :class="{ 'event-wall_active-type': isActive === 'hiking' }">
        行
      </el-tag>

      <el-input
        placeholder="选你所爱" :clearable="true"
        suffix-icon="el-icon-search"
        class="event-wall_search"
        v-model="searchWord" @keyup.enter.native="search">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <p class="event-wall_title">在活动墙，寻找你所需</p>
    <waterfall :line-gap="200" :watch="items" :grow="grow"
               ref="waterfall" @click.native="shuffle" v-loading.fullscreen.lock="fullscreenLoading">
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
          <img src="../assets/img/expired.png" class="event-wall_expire-pic" v-show="isExpired(item.time[0])">
          <div class="event-wall_poster" :style="getPosterStyle(item)"></div>
          <div class="event-wall_name" :title="item.name">名称：{{item.name}}</div>
          <div class="event-wall_time" :title="showTime(item)">时间：{{showTime(item)}}</div>
          <div class="event-wall_type" :title="item.type">
            活动类型：{{item.type | convertType}}
          </div>
          <div class="event-wall_desc" :title="item.desc">
            活动形式：
            <p class="event-wall_desc-p">{{item.desc}}</p>
          </div>
          <div class="event-wall_count">
            <i class="el-icon-star-off"></i>&nbsp;{{item.star}}<span style="margin: 0 10%">|</span><i class="el-icon-view"></i>&nbsp;{{item.view}}
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
        grow: [3, 2, 3, 2],
        isActive: 'recommend',
        searchWord: '',
        fullscreenLoading: false
      }
    },
    mounted () {
      this.loadEvent()
    },
    methods: {
      loadEvent (type) {
        let vm = this

        vm.fullscreenLoading = true
        this.fetch({
          url: 'api/loadEvent',
          method: 'get',
          params: { type }
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
            vm.fullscreenLoading = false
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
        // this.$store.dispatch('ChooseEvent', this.items[val])
        localStorage.setItem('currentEvent', JSON.stringify(this.items[val]))
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
      },
      chooseType (type) {
        this.isActive = type
        this.loadEvent(type)
      },
      search () {
        this.loadEvent(this.searchWord)
      },
      isExpired (val) {
        return ((new Date()) - (new Date(val))) > 0
      }
    },
    filters: {
      convertType (val) {
        return val.join(' / ')
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
  .event-wall_type {
    width: 95%;
    height: 10%;
    padding: 0 0 0 10px;
    overflow: hidden;
    border-bottom: 1px solid #EEEEEE;
    line-height: 182%;
  }
  .event-wall_desc {
    width: 95%;
    height: 14%;
    padding: 0 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #EEEEEE;
    line-height: 182%;
  }
  .event-wall_desc-p {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .event-wall_count {
    width: 98%;
    height: 7%;
    padding: 0 0 0 10px;
    overflow: hidden;
    line-height: 130%;
    background-color: orange;
    border-radius: 0 0 7px 7px;
    text-align: center;
  }
  .event-wall_title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    margin: 15px 0;
  }
  .event-wall_classify-tab {
    width: 99%;
    height: 10vh;
    padding: 10px;
    background-size: cover;
    background: url("../assets/img/classify-bar.png") center repeat;
    box-shadow: 0px 0px 5px darkgrey;
  }
  .event-wall_tag {
    border-radius: 50%;
    margin: 0 3%;
    cursor: pointer;
    border: 2px solid black;
    font-weight: bold;
    height: 4rem;
    width: 4rem;
    text-align: center;
    line-height: 4rem;
    font-size: 2rem;
    color: black;
  }
  .event-wall_active-type {
    border: 2px dotted black;
    background-color: #bbbbbb;
  }
  .event-wall_search {
    margin-left: 15%;
    border-radius: 4px;
    width: 20%;
  }
  .event-wall_expire-pic {
    position: absolute;
    width: 20%;
    left: 82%;
    top: -10px;
  }
</style>
