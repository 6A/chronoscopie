<template lang="pug">
  v-app#dayspan(v-cloak)
    ds-calendar-app(:calendar='calendar', :events='events', read-only)
</template>

<script lang="ts">
  import { Calendar, Weekday } from 'dayspan'
  import toMaterialStyle from 'material-color-hash'

  export default {
    name: 'app',

    data: () => ({
      calendar: Calendar.months(2),
      events: []
    }),

    created () {
      this.load()
    },
  
    watch: {
      '$route': 'load'
    },

    methods: {
      loadWeekIntoEvents(week: any, events: any[]) {
        for (const day of week.DayList) {
          for (const course of day.CourseList) {
            const beginDate = new Date(Date.parse(course.BeginDate))

            const ev = {
              data: this.$dayspan.getDefaultEventDetails(),
              schedule: {
                month: [ beginDate.getMonth() ],
                dayOfMonth: [ beginDate.getDate() ],
                times: [ beginDate.getHours() ],
                duration: course.Duration,
                durationUnit: 'minutes'
              }
            }

            const style = toMaterialStyle(course.Name)

            ev.data.title    = course.Name
            ev.data.location = course.RoomList[0].Name
            ev.data.color     = style.backgroundColor
            ev.data.forecolor = style.color

            // Extend the previous event if the current event is the same, with a longer duration
            const prev = events.length ? events[events.length - 1] : null

            if (prev                                                      &&
                prev.schedule.dayOfMonth[0] === ev.schedule.dayOfMonth[0] &&
                prev.data.title             === ev.data.title             &&
                prev.data.location          === ev.data.location          &&
                prev.schedule.times[0] + (prev.schedule.duration / 60) === ev.schedule.times[0]) {
              prev.schedule.duration += ev.schedule.duration
            } else {
              events.push(ev)
            }
          }
        }
      },

      async load() {
        const group  = this.$route.params.group
        const date   = this.$route.params.date

        const weekId = this.$chronos.getWeekId(date
                        ? Date.parse(date)
                        : new Date())
          
        const events = []

        for (let i = 0; i < 3; i++) {
          const week = await this.$chronos.getWeek(weekId + i, group)

          this.loadWeekIntoEvents(week, events)
          this.events = events
        }

        this.$forceUpdate()
      }
    }
  }
</script>
