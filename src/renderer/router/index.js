import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/components/index'
import ProjectAdd from '@/components/project_add'

export default new Router({
  routes: [
    { path: '/', name: 'index', component: ProjectAdd },
    { path: '/project_add', name: 'projectAdd', component: ProjectAdd },
    { path: '*', redirect: '/' }
  ]
})