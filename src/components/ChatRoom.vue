<template>
  <div class="main-field">
    <section
      id="chat"
      v-for="message in messages"
      :key="message.id"
      class="item"
    >
      <img class="rounded" :src="message.userImage" alt="" />
      <div class="log-right">
        <!-- ニックネームを設定している場合 -> nicknameを表示 -->
        <div class="log-name" v-if="message.userNickname">
          {{ message.userNickname }} <br />
        </div>
        <!-- メッセージがテキストの場合 -> テキストを表示 -->
        <div v-if="message.text">
          <div class="item-message">{{ message.text }}</div>
        </div>
        <!-- メッセージが画像の場合 -> 画像を表示 -->
        <div v-if="message.imageURL">
          <img class="item-image" :src="message.imageURL" />
        </div>
      </div>
    </section>

    <footer>
      <div class="input-tab">
        <!-- テキストの入力タブ -->
        <form action="" @submit.prevent="sendMessage">
          <textarea
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            cols="50"
            rows="1"
          ></textarea>
          <button type="submit">Send message</button>
        </form>
        <!-- 画像の入力タブ -->
        <input
          type="file"
          ref="inputFile"
          accept="image/*"
          @change="sendImage"
        />
      </div>
    </footer>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase"

export default {
  data() {
    return {
      // 入力欄の文字
      inputMessage: "",

      // id、text、timestamp、userId、nickname を Objectとして保存
      messages: [],

      // ログインしているユーザー(自分)の情報
      currentUser: {},
    }
  },

  created() {
    // ログイン状態を識別
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user ? user : {}
    })

    firebase
      .firestore()
      .collection("rooms")
      .doc(this.$route.params.id)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        this.messages.length = 0
        snapshot.docs.forEach((doc) => {
          this.messages.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },

  methods: {
    // messages を timestamp 順に並び替える
    sortedMessagesByTimestamp() {
      return this.messages.sort((a, b) => {
        return a.timestamp < b.timestamp
          ? -1
          : a.timestamp > b.timestamp
          ? 1
          : 0
      })
    },

    // スクロール位置を一番下に移動
    // scrollBottom() {
    //   this.$nextTick(() => {
    //     window.scrollTo(0, document.body.clientHeight)
    //   })
    // },

    //送信されたテキストをfiresoreに追加
    sendMessage() {
      if (this.inputMessage.length) {
        const quary = firebase
          .firestore()
          .collection("rooms")
          .doc(this.$route.params.id)
          .collection("messages")
        let getUserNickname = ""
        let getUserImage = ""

        firebase
          .firestore()
          .collection("users")
          .doc(this.currentUser.uid)
          .get()
          .then((userSnapshot) => {
            getUserNickname = userSnapshot.data().myNickname
            getUserImage = userSnapshot.data().userImage
            // userProfileFigure = userSnapshot.data().myNickname
          })
          .then(() => {
            quary.add({
              userId: this.currentUser.uid,
              userImage: getUserImage,
              userNickname: getUserNickname,
              text: this.inputMessage,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
          })
          .catch(function(error) {
            console.error("Error writing new message to database", error)
          })
          .then(() => {
            this.inputMessage = ""
          })
      }
      this.scrollBottom()
    },

    //送信された画像をStorageに追加
    sendImage() {
      const file = this.$refs.inputFile.files[0]
      const quary = firebase
        .firestore()
        .collection("rooms")
        .doc(this.$route.params.id)
        .collection("messages")
      const strageRef = firebase
        .storage()
        .ref()
        .child("rooms/" + this.$route.params.id + "/messages")
      let getUserNickname = ""
      let getUserImage = ""

      firebase
        .firestore()
        .collection("users")
        .doc(this.currentUser.uid)
        .get()
        .then((userSnapshot) => {
          getUserNickname = userSnapshot.data().myNickname
          getUserImage = userSnapshot.data().userImage
          // userProfileFigure = userSnapshot.data().myNickname
        })
        .then(() => {
          strageRef.put(file).then((fileSnapshot) =>
            fileSnapshot.ref.getDownloadURL().then((url) => {
              quary.add({
                userId: this.currentUser.uid,
                userImage: getUserImage,
                userNickname: getUserNickname,
                imageURL: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
            })
          )
        })
        .catch(function(error) {
          console.error("Error writing new message to database", error)
        })
        .then(() => {
          this.inputMessage = ""
        })
      this.scrollBottom()
    },
  },
}
</script>

<style scoped>
.main-field {
  min-height: 100vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  position: relative; /* ←相対位置 */
  padding-bottom: 60px; /* ←フッターの高さを指定 */
  box-sizing: border-box;
  background-color: rgb(50, 50, 50);
  /* ↑ヘッダーやフッターを含むすべての要素の高さ＝min-height:100vhになるように指定 */
  background-image: linear-gradient(45deg, #000000 0%, #6e6e6e 100%);
}
.rounded {
  height: 50px;
  width: 50px;
  border-radius: 50px;
}
.log-right {
}
.log-name {
  color: #f5f5f5;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-image {
  width: 50%;
  height: 50%;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: black;
}
.input-tab {
  text-align: center;
}
</style>
