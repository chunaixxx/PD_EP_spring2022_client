import Vue from 'vue'
import VueRouter, { type RouteConfig } from 'vue-router'
import Map from '../pages/Map.vue'

const Check = () => import('../pages/Check.vue')

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Map',
		component: Map,
		meta: { title: 'Карты дисциплин' },
	},

	{
		path: '/check',
		name: 'Check',
		component: Check,
		meta: { title: 'Проверка' },
	},
]

const router = new VueRouter({
	mode: 'history',
	base: import.meta.env.BASE_URL,
	routes,
})

const DEFAULT_TITLE = '404 · Карты дисциплин'

router.beforeEach((to, from, next) => {
	document.title = to?.meta?.title || DEFAULT_TITLE
	next()
})

export default router
