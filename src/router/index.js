import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import About from "../views/About.vue"
import MyPage from "../views/MyPage.vue"
import ChatRoom from "../components/ChatRoom.vue"
import EditMyProfilePage from "../views/EditMyProfilePage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/my-page",
    name: "MyPage",
    component: MyPage,
  },
  {
    path: "/edit-my-profile-page",
    name: "EditMyProfilePage",
    component: EditMyProfilePage,
  },
  {
    path: "components/chat-room/:id",
    name: "ChatRoom",
    component: ChatRoom,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
