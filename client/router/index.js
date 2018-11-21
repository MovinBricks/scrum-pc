import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const Point = () => import('../views/Point.vue');
const PointsChart = () => import('../views/PointsChart.vue');

export function createRouter() {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/point', component: Point },
            { path: '/pointsChart', component: PointsChart },
            { path: '/', redirect: '/pointsChart' }
        ]
    })
}
