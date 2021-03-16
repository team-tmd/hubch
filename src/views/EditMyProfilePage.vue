<template>
  <div class="edit-my-profile">
    <h1>This is my page</h1>
    <h2>ログインしているユーザー情報</h2>
    <img :src="user.photoURL" class="rounded" />
    <div>Googleアカウント：{{ user.email }}</div>
    <div>ユーザー名：{{ user.displayName }}</div>
    <div>
      ニックネーム：
      <input :value="myNickname" @input="newMyNickname = $event.target.value" />
    </div>
    <button v-on:click="setMyNickname">プロフィールを更新する</button>
    <button v-on:click="cancel">キャンセル</button>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      user: {},
      myNickname: "",
      newMyNickname: "",
    }
  },
  methods: {
    setMyNickname() {
      if (this.newMyNickname) {
        const myNickname = {
          userId: this.user.uid,
          myNickname: this.newMyNickname,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
        firebase
          .firestore()
          .collection("myNicknames")
          .doc(this.user.uid)
          .set(myNickname)
          .then((ref) => {
            console.log(ref)
            this.$router.push("/my-page")
          })
      } else {
        if (
          confirm("何も入力されていません。ニックネームの編集を中断しますか？")
        ) {
          this.$router.push("/my-page")
        }
      }
    },
    cancel() {
      if (confirm("変更内容は保存されません。よろしいですか？")) {
        this.$router.push("/my-page")
      }
    },
  },
  created() {
    // ログイン状態を識別
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}

      if (user) {
        // ニックネームを取得
        firebase
          .firestore()
          .collection("myNicknames")
          .doc(this.user.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              this.myNickname = doc.data().myNickname
              this.newMyNickname = doc.data().myNickname
            }
          })
      } else {
        this.$router.push("/my-page")
      }
    })
  },
}
</script>

<style scoped>
.edit-my-profile {
  text-align: center;
}
.rounded {
  border-radius: 50px;
}
</style>
