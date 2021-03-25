<template>
  <div class="my-profile">
    <h1>This is my page</h1>
    <button v-on:click="signOut">ログアウトする</button>
    <h2>ログインしているユーザー情報</h2>
    <img :src="user.photoURL" class="rounded" />
    <div>Googleアカウント：{{ user.email }}</div>
    <div>ユーザー名：{{ user.displayName }}</div>

    <div v-if="myNickname">
      <div>ニックネーム：{{ myNickname }}</div>
      <router-link to="/edit-my-profile-page">
        <button>ニックネームを編集する</button>
      </router-link>
    </div>

    <div v-else>
      <div>ニックネーム：まだ設定されていません</div>
      <router-link to="/edit-my-profile-page">
        <button>ニックネームを設定する</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      user: {},
      myNickname: "",
    }
  },
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
  created() {
    // ユーザー情報の取得
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}

      if (user) {
        // ニックネームを取得
        firebase
          .firestore()
          .collection("users")
          .doc(this.user.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              this.myNickname = doc.data().myNickname
            }
          })
      }
    })
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
