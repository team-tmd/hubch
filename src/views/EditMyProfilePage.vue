<template>
  <div class="edit-my-profile page">
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
        // newMyNicknameに（空欄に）何らかの値が入っている場合

        const myNickname = {
          userId: this.user.uid,
          myNickname: this.newMyNickname,
          userImage: this.user.photoURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }

        // ニックネームを保存
        firebase
          .firestore()
          .collection("users")
          .doc(this.user.uid)
          .set(myNickname)
          .then((ref) => {
            console.log(ref)
            // 保存に成功したら MyPage に戻る
            this.$router.push("/my-page")
          })
      } else {
        // newMyNicknameに（空欄に）何も入力されていない場合
        if (
          confirm("何も入力されていません。ニックネームの編集を中断しますか？")
        ) {
          // MyPage に戻る
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
          .collection("users")
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
