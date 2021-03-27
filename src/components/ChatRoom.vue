<template>
  <div class="main-field">
    <!-- 自分のチャット -->
    <header class="roomTitle">Room：{{ this.$route.params.title }}</header>
    <section v-for="message in messages" :key="message.id" class="item">
      <div class="myMessage" v-if="message.orMyMessage === true">
        <!-- メッセージがテキストの場合 -> テキストを表示 -->
        <div v-if="message.text">
          <div class="item-myMessage">{{ message.text }}</div>
        </div>
        <!-- メッセージが画像の場合 -> 画像を表示 -->
        <div v-if="message.imageURL">
          <img class="item-myImage" :src="message.imageURL" />
        </div>
      </div>

      <!-- 自分以外のチャット -->
      <div v-else>
        <div class="otherMessageText" v-if="message.text">
          <img class="rounded" :src="message.userImage" alt="" />
          <div class="log-right">
            <!-- ニックネームを設定している場合 -> nicknameを表示 -->
            <div class="log-name" v-if="message.userNickname">
              {{ message.userNickname }} <br />
            </div>
            <!-- メッセージがテキストの場合 -> テキストを表示 -->
            <div class="item-otherMessage">{{ message.text }}</div>
          </div>
        </div>
        <!-- メッセージが画像の場合 -> 画像を表示 -->
        <div class="otherMessageImage" v-if="message.imageURL">
          <img class="rounded" :src="message.userImage" alt="" />
          <div class="log-right">
            <!-- ニックネームを設定している場合 -> nicknameを表示 -->
            <div class="log-name" v-if="message.userNickname">
              {{ message.userNickname }} <br />
            </div>
            <img class="item-otherImage" :src="message.imageURL" />
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="input-tab">
        <!-- テキストの入力タブ -->
        <form class="inputTextArea" action="" @submit.prevent="sendMessage">
          <textarea
            class="textArea"
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            cols="50"
            rows="3"
          ></textarea>
          <button class="inputTextButom" type="submit">
            Send <br />
            Text
          </button>
        </form>
        <!-- 画像の入力タブ -->
        <div class="imageButton">
          <label for="inputImageButton">
            <div class="buttonText">
              Send <br />
              Image
            </div>
            <input
              id="inputImageButton"
              class="inputImageButom"
              type="file"
              ref="inputFile"
              accept="image/*"
              @change="sendImage"
            />
          </label>
        </div>
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

  // created() {
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
          if (this.currentUser.uid == doc.data().userId) {
            this.messages.push({
              id: doc.id,
              orMyMessage: true,
              ...doc.data(),
            })
          } else {
            this.messages.push({
              id: doc.id,
              orMyMessage: false,
              ...doc.data(),
            })
          }
        })
        //一番下にスクロール
        this.scrollBottom()
        // アクションを起こすことで強制的にラグ(lag)をなくす
        this.messages.splice()
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

    //スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },

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
header {
  left: 43%;
  margin-right: -50%;
  position: fixed;
  color: rgb(255, 94, 0);
  font-size: 30px;
  font-weight: bold;
}
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
  height: 60px;
  width: 60px;
  border-radius: 50px;
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
.myMessage {
  width: 100%;
}
.item-myMessage {
  position: relative;
  float: right;
  margin-right: 5px;
  padding: 0.8em;
  background-color: hsl(32, 100%, 50%);
  border-radius: 4px;
  line-height: 1.2em;
}
.item-myImage {
  width: 20%;
  float: right;
  margin-right: 5px;
}
.otherMessageText {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
}
.otherMessageImage {
  display: flex;
}
.item-otherMessage {
  position: relative;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
  margin-left: 5px;
}
.item-otherImage {
  width: 50%;
  margin-left: 5px;
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
  border: 2px solid rgb(255, 94, 0);
}
.input-tab {
  display: flex;
  justify-content: center;
  align-items: center;
}
.textArea {
  height: 50px;
  border-left: 2px solid rgb(255, 94, 0);
  border-right: 2px solid rgb(255, 94, 0);
}
.inputTextArea {
  display: flex;
  justify-content: center;
  align-items: center;
}
.inputTextButom {
  font-size: 15px;
  height: 50px;
  width: 70px;
  background-color: black;
  color: rgb(255, 94, 0);
  border: 2px solid rgb(255, 94, 0);
}
.inputTextButom:hover {
  font-weight: bold;
}
.inputImageButom {
  display: none;
}
.imageButton {
  font-size: 15px;
  height: 50px;
  width: 70px;
  color: rgb(255, 94, 0);
  border: 2px solid rgb(255, 94, 0);
}
.buttonText {
  margin-top: 5px;
  margin-left: 13px;
}
label:hover {
  font-weight: bold;
}
</style>
