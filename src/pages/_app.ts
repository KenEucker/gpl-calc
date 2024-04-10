import '@formkit/themes/genesis'
import '@formkit/pro/genesis'

import type { App } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import { createProPlugin, dropdown, mask } from '@formkit/pro'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'


export default (app: App) => {
    const pro = createProPlugin('fk-75a7008f008', { mask, dropdown })
    
    app.use(plugin, defaultConfig({ plugins: [pro] }))
    app.component('VueDatePicker', VueDatePicker)
    app.component('EasyDataTable', Vue3EasyDataTable)
    app.use(autoAnimatePlugin)
};