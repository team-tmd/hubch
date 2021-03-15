<template>
  <div class="my-profile">
    <h1>This is my page</h1>
    <button v-on:click="signOut">ログアウトする</button>
    <h2>ログインしているユーザー情報</h2>
    <img :src="user.photoURL" class="rounded" />
    <div>Googleアカウント：{{ user.email }}</div>
    <div>ユーザー名：{{ user.displayName }}</div>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.log(error)
        })
    },
  },
  computed: {
    user() {
      return firebase.auth().currentUser
    },
  },
}
</script>

<style scoped>
.my-profile {
  text-align: center;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.rounded {
  border-radius: 50px;
}
</style>
