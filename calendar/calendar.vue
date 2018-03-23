<template>
  <div class="calendar ">
    <div class="calender-hd">
      <p @click="switchMonth(-1)" class="calender-hd-btn">上月</p>
      <div class="calendar-title">
        <div class="top">当前:{{displayDate.year+'年'+displayDate.month+'月'}}</div>
        <div class="bottom">今天:{{todayDate.year+'年'+todayDate.month+'月'+todayDate.day+'日'}}</div>
      </div>
      <p @click="switchMonth(1)"  class="calender-hd-btn">下月</p>
    </div>
    <ul class="week-ul calender-list">
      <li class="week-li calender-item">日</li>
      <li class="week-li calender-item">一</li>
      <li class="week-li calender-item">二</li>
      <li class="week-li calender-item">三</li>
      <li class="week-li calender-item">四</li>
      <li class="week-li calender-item">五</li>
      <li class="week-li calender-item">六</li>
    </ul>
    <ul class="calender-list">
      <li class="calender-item"
          v-for="item in dateList"
          :class="{
                  'other-month' : !item.isMainMonth,
                  'today' : item.isToday,
                   'checked': isChecked(item.date)
                   }"
          :style="{backgroundImage: isChecked(item.date) ? 'url('+labelBG+')' : ''}"
      >
        {{item.day}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'calendar',
    data () {
      return {
        todayDate: {},  // 今天的日期
        displayDate: {},  //日历上当前的日期
        labelBG: require('@/assets/lesson/coming.png')
      }
    },
    props:['checkedList'],// 出勤的课程
    computed:{
      dateList () {
        let cur=this.displayDate
        return this.init(cur.year,cur.month);
      }
    },
    methods:{
      isChecked (v) {
        let list = this.checkedList
        for ( let i = list.length - 1; i >= 0; i--){
          if (v === list[i] ){
            return true
          }
        }
      },
      init (year, month) {
        year = parseInt(year)
        month = parseInt(month)
        let thisMonth = new Date(year, month - 1),
          nextMonth = month === 12 ? new Date(year + 1, 0) : new Date(year, month),
          thisMonthFirstDay = thisMonth.getDay(), //这个月第一天的星期
          nextMonthFirstDay = nextMonth.getDay(),  //下个月的第一天的星期
          //这个月的所有天数的数量 28 || 29 || 30 || 31
          allThisMonthDay = (nextMonth.getTime() - thisMonth.getTime()) /1000/60/60/24,
          // 日历 要显示的所有天数的数量
          allDisplayDay = allThisMonthDay +
                  thisMonthFirstDay +
                  (nextMonthFirstDay===0?0:7-nextMonthFirstDay),
          //  日历上第一个日期的毫秒数
          beginDay = thisMonth.getTime() -
                      thisMonthFirstDay*24*60*60*1000,

          today = this.todayDate ,
          arr=[], m_date, m_day, m_month, m_year, m_ms, i, dateObj = {};

        for(i = 0; i < allDisplayDay; i++){
          m_ms = beginDay + i*24*60*60*1000
          m_date = new Date( m_ms )
          m_year = m_date.getFullYear()
          m_month = m_date.getMonth()+1
          m_day = m_date.getDate()
          dateObj = {
            year: m_year,
            month: m_month > 9 ? m_month : '0' + m_month,
            day: m_day > 9 ? m_day : '0' + m_day
          }

          arr.push(Object.assign({
            date: dateObj.year + '-' + dateObj.month + '-' + dateObj.day,
            isMainMonth: m_month === month,
            isToday: m_ms === today.ms,
            isFuture: m_ms > today.ms
          }, dateObj))

        }
        return arr
      },
      switchMonth (v) {
        // 引用类型， date的改变会引起 this.displayDate的改变
        let date = this.displayDate
        if ( date.month === 1 && v < 0 ){
          date.year -= 1;
          date.month = 12;
        } else if ( date.month === 12 && v > 0 ) {
          date.year += 1;
          date.month = 1;
        } else {
          date.month += v;
        }
      }
    },
    created () {
      let date = new Date(),
        obj = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
      }
      this.todayDate = Object.assign({
        ms: +new Date(obj.year, obj.month-1, obj.day),
        format: obj.year + '-' + obj.month + '-' + obj.day
      }, obj)
      this.displayDate = Object.assign({
        year: obj.year,
        month: obj.month
      })


      let random = Math.round(Math.random()*18)+1
      this.labelBG = require('@/assets/lesson/c'+random+'.png')
    }
  }
</script>

<style scoped lang='less'>
    @import "../Less/base";
    /*日历组件*/
    .calendar{
      padding:10px;
      background:#fff;
      font-weight:bold;
      position: relative;
      .radius(6px);
      &.active{ z-index: 10; }
    }
    .calender-hd{
      text-align: center;
      padding: 4px 0 8px;
      .flexbox();
      .justify-content(space-between);
      .align-items(center);
    }
    .calender-hd-btn{
      padding: 10px 5px;
      -webkit-user-select: none;
      user-select: none;
      &:active{ background:#ddd; }
    }
    .calendar-title{
      .flexbox();
      .direction-col();
      .bottom{
        color:#999;
        font-size:0.13rem;
        padding:3px 0;
      }
    }
    .calender-list{
      .flexbox();
      .align-items(center);
      .justify-content(flex-start);
      .flex-flow(wrap);
      text-align: center;
    }
    .calender-item{
      flex-basis: 14.285714285714%;
      padding:6px 0;
      &.checked{
        background-repeat: no-repeat;
        background-position: center ;
        background-size:auto 100%;
        color:rgba(0,0,0,0)
      }
    }

    .other-month{color:#ccc;}
    .today{ color:#fff; background:#2386FB ; }

    .week-ul{
      font-size:0.14rem;
      color:#999;
    }

</style>
