import { createRouter, createWebHistory } from 'vue-router'
import Registration from '../views/Registration.vue';
import MainPage from '../views/MainPage.vue';
import HomeSmm from '../views/HomeSmm.vue'
import UserStats from '../views/UserStats.vue'
import UserActivity from '../views/UserActivity.vue'
import UserNotifications from "../views/UserNotifications.vue"
import BuyChars from "../views/BuyChars.vue"
import NewSqueal from "../views/NewSqueal.vue"
import SmmProfile from "../views/SmmProfile.vue"
import SmmNotifications from "../views/SmmNotifications.vue"
import SmmReviews from "../views/SmmReviews.vue"



const router = createRouter({
  history: createWebHistory('/smm'),
  routes: [
    {
      path: '/',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MainPage
    },
    {
      path: '/registration',
      name: 'registration',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Registration
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeSmm
    },
    {
      path: '/profile',
      name: 'smm-profile',
      component: SmmProfile
    },
    {
      path: '/smmNotifications',
      name: 'smm-notifications',
      component: SmmNotifications
    },
    {
      path: '/smmReviews',
      name: 'smm-reviews',
      component: SmmReviews
    },
    {
      path: '/:userId/stats', // Dynamic route with userId parameter
      name: 'user-stats',
      component: UserStats
    },
    {
      path: '/:userId/activity', // Dynamic route with userId parameter
      name: 'user-activity',
      component: UserActivity
    },
    {
      path: '/:userId/notifications', // Dynamic route with userId parameter
      name: 'user-notifications',
      component: UserNotifications
    },
    {
      path: '/:userId/buyChars', // Dynamic route with userId parameter
      name: 'user-buyChars',
      component: BuyChars
    },
    {
      path: '/:userId/newSqueal', // Dynamic route with userId parameter
      name: 'user-newSqueal',
      component: NewSqueal
    },
  ]
})

export default router
