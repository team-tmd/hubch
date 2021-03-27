<template>
  <div class="nav__bar">
    <!-- router-link の仕事は URL を書きかえることだけ -->
    <router-link to="/" class="nav__logo nav__link">
      HubCh
    </router-link>
    <div class="nav__items">
      <router-link to="/about" class="nav__item nav__link">About</router-link>
      <router-link to="/my-page" class="nav__item nav__link">
        <div v-if="isSignIn" class="nav__my-page">
          <img :src="user.photoURL" class="rounded" />
        </div>
        <div v-else>SignIn</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      isSignIn: false,
      user: {}, // ユーザー情報
    }
  },
  created() {
    // ログイン状態を識別
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}

      if (user) {
        this.isSignIn = true
      } else {
        this.isSignIn = false
      }
    })
  },
}
</script>

<style scoped>
.nav__bar {
  /* 常時navbarを表示 */
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 500;

  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background-color: black;
  border: 2px solid rgb(255, 94, 0);
}
.nav__link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #eee;
  text-decoration: none;
}
.nav__link:visited {
  color: rgb(255, 94, 0);
}
.nav__link:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
.nav__logo {
  width: 130px;
}
.nav__items {
  display: flex;
}
.nav__item {
  width: 100px;
  /* border-left: 1px solid rgb(50, 50, 50); */
  border-left: 2px solid rgb(255, 94, 0);
}
.rounded {
  border: 2px solid rgb(255, 94, 0);
  border-radius: 50px;
  height: 40px;
  width: 40px;
  opacity: 70%;
}
.rounded:hover {
  border-radius: 50px;
  height: 50px;
  width: 50px;
  opacity: 100%;
}
.nav__my-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
