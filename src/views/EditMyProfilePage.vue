<template>
  <div class="edit-my-profile page">
    <h1 class="title">This is my page</h1>

    <img :src="user.photoURL" class="rounded" />

    <div class="information">
      <div class="information-title"><u>Google Account</u></div>
      <div class="information-content">{{ user.email }}</div>
      <div class="information-title"><u>Username</u></div>
      <div class="information-content">{{ user.displayName }}</div>
      <div>
        <div class="information-title"><u>Nickname</u></div>
        <input
          class="textarea"
          :value="myNickname"
          @input="newMyNickname = $event.target.value"
        />
      </div>
      <button class="editButton" v-on:click="setMyNickname">Edit</button>
      <button class="cancelButton" v-on:click="cancel">Cancel</button>
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
  padding-top: 5px; /* ←フッターの高さを指定 */
  position: relative; /* ←相対位置 */
  text-align: center;
  box-sizing: border-box;
  min-height: 100vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  background-image: linear-gradient(45deg, #000000 0%, #6e6e6e 100%);
  color: hsl(32, 100%, 50%);
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
.rounded {
  border-radius: 50px;
  border: 2px solid rgb(255, 94, 0);
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
.textarea {
  font-size: 15px;
  margin-top: 5px;
}
.editButton {
  height: 30px;
  width: 70px;
  margin-top: 5px;
  margin-right: 5px;
  background: rgb(0, 0, 0);
  border: 2px solid rgb(255, 94, 0);
  color: rgb(255, 94, 0);
}
.editButton:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
.cancelButton {
  height: 30px;
  width: 70px;
  margin-top: 5px;
  background: rgb(0, 0, 0);
  border: 2px solid rgb(255, 94, 0);
  color: rgb(255, 94, 0);
}
.cancelButton:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
</style>
