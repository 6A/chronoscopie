<template lang="pug">
  v-app#dayspan(v-cloak)
    v-layout(align-center, justify-center)
      v-flex(xs4, sm6): v-card: v-form
        v-toolbar(dark, color='primary')
          v-toolbar-title Chronoscopie

        v-card-text
          v-autocomplete(:items='classes', :loading='isLoading', :error='error', :error-messages='errorMessages', v-model='klass',
                         autofocus, cache-items, clearable, label='Class')

        v-card-actions
          v-spacer
          router-link(:to='`/${klass}`')
            v-btn(flat, color='primary', :loading='isLoading', :disabled='klass === 0') Go
</template>

<script lang="ts">
  import { Calendar } from 'dayspan'

  export default {
    name: 'app',

    data: () => ({
      klass: 0,
      isLoading: false,
      error: false,
      errorMessages: [],
      classes: []
    }),

    created () {
      this.load()
    },
  
    methods: {
      async load() {
        this.isLoading = true
        this.classes = []

        function collectClasses(group, classes) {
          for (const child of group.Groups || []) {
            collectClasses(child, classes)
          }

          classes.push({ text: group.Name, value: group.Id })
        }

        try {
          const groups = await this.$chronos.getGroups()
          const classes = []

          groups.forEach(g => collectClasses(g, classes))

          this.classes = classes
        } catch (err) {
          this.error = true
          this.errorMessages = [ err.toString() ]
        } finally {
          this.isLoading = false
        }
      }
    }
  }
</script>
