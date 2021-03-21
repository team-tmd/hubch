<template>
  <div>
    <section v-for="message in messages" :key="message.id" class="item">
      <!-- ニックネームを設定している場合 -> nicknameを表示 -->
      <div v-if="message.nickname">
        {{ message.nickname }}
      </div>

      <!-- メッセージがテキストの場合 -> テキストを表示 -->
      <div v-if="message.text">
        <div class="item-message">{{ message.text }}</div>
      </div>
      <!-- メッセージが画像の場合 -> 画像を表示 -->
      <div v-if="message.imageURL">
        <img class="item-image" :src="message.imageURL" />
      </div>
    </section>

    <div class="form">
      <!-- テキストの入力タブ -->
      <form action="" @submit.prevent="sendMessage">
        <textarea
          v-model="inputMessage"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button type="submit">Send message</button>
      </form>
      <!-- 画像の入力タブ -->
      <input type="file" ref="inputFile" accept="image/*" @change="sendImage" />
    </div>
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

    ///チャットの表示（onSnapshotoで変化を監視）
    const col_rooms = firebase
      .firestore()
      .collection("rooms")
      .doc(this.$route.params.id)
      .collection("messages")
      .orderBy("timestamp")
      .limit(30)
    col_rooms.onSnapshot((snapshot) => {
      // messages の初期化
      this.messages = []
      snapshot.docs.forEach((messageDoc) => {
        // messages の userId から そのユーザーが nickname を設定しているか調査
        // .doc(messageDoc.data().userId)で判断している
        firebase
          .firestore()
          .collection("myNicknames")
          .doc(messageDoc.data().userId)
          .get()
          .then((doc) => {
            if (doc.data()) {
              // nickname を設定している場合 => messages に保存
              this.messages.push({
                id: messageDoc.id,
                nickname: doc.data().myNickname,
                ...messageDoc.data(),
              })
            } else {
              // nickname を設定していない場合 => messages に""を保存
              this.messages.push({
                id: messageDoc.id,
                nickname: "",
                ...messageDoc.data(),
              })
            }
          })
          .then(() => {
            this.messages = this.sortedMessagesByTimestamp()
            // console.log(this.messages)
            this.scrollBottom()
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

        const newMessage = {
          userId: this.currentUser.uid,
          text: this.inputMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }

        quary
          .add(newMessage)
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

      strageRef.put(file).then((fileSnapshote) =>
        fileSnapshote.ref.getDownloadURL().then(function(url) {
          quary.add({
            userId: this.currentUser.uid,
            imageURL: url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
      )
    },
  },
}
</script>

<style scoped>
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
</style>
