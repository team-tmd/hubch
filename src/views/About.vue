<template>
  <div class="about">
    <ChatRoom />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import ChatRoom from "@/components/ChatRoom.vue"

export default {
  components: {
    ChatRoom,
  },
}
</script>
