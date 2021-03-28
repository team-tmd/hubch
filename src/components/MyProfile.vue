<template>
  <div class="my-profile">
    <h1 class="title">This is my page</h1>
    <button class="LogOutButton" v-on:click="signOut">Log-Out</button>
    <br />

    <img :src="user.photoURL" class="rounded" />

    <div class="information">
      <div class="information-title"><u>Google Account</u></div>
      <div class="information-content">{{ user.email }}</div>
      <div class="information-title"><u>Username</u></div>
      <div class="information-content">{{ user.displayName }}</div>

      <div v-if="myNickname">
        <div class="information-title"><u>Nickname</u></div>
        <div>
          <div class="information-content">{{ myNickname }}</div>
          <router-link to="/edit-my-profile-page">
            <button class="editButton">Edit</button>
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="information-title"><u>ニックネーム</u></div>
        <div>
          <div class="information-content">まだ設定されていません</div>
          <router-link to="/edit-my-profile-page">
            <button>Nicname</button>
          </router-link>
        </div>
      </div>
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
      myImageURL: "",
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
              this.myImageURL = doc.data().myImageURL
            }
          })
      }
    })
  },
}
</script>

<style scoped>
.my-profile {
  padding-top: 5px; /* ←フッターの高さを指定 */
  position: relative; /* ←相対位置 */
  text-align: center;
  box-sizing: border-box;
  min-height: 100vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  background-image: linear-gradient(45deg, #000000 0%, #6e6e6e 100%);
  color: hsl(32, 100%, 50%);
}
* {
  box-sizing: border-box;
}
.title {
  font-size: 35px;
  margin-top: 15px;
  color: black;
  text-shadow: 0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0),
    0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0),
    0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0),
    0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0),
    0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0),
    0 0 3px rgb(255, 94, 0), 0 0 3px rgb(255, 94, 0);
}
body {
  margin: 0;
}
.rounded {
  border-radius: 50px;
  border: 2px solid rgb(255, 94, 0);
}
.LogOutButton {
  height: 40px;
  width: 100px;
  font-size: 20px;
  margin-bottom: 30px;
  background: rgb(0, 0, 0);
  border: 2px solid rgb(255, 94, 0);
  color: rgb(255, 94, 0);
}
.LogOutButton:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
.information-title {
  font-size: 30px;
  font-weight: bold;
  margin-top: 15px;
  color: black;
  text-shadow: 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0);
}
.information-content {
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
  color: black;
  text-shadow: 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0),
    0 0 1px rgb(255, 94, 0), 0 0 1px rgb(255, 94, 0);
}
.editButton {
  height: 30px;
  background: rgb(0, 0, 0);
  border: 2px solid rgb(255, 94, 0);
  color: rgb(255, 94, 0);
}
.editButton:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
</style>
