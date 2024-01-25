<!-- ButtonComponent.vue -->
<template>
  <div class="container">
    <div class="messageContainer">
      <img src="../images/checkIcon.png" alt="">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    correctText: String,
  },
  data() {
    return {
      text: this.correctText,
    };
  },
};
</script>

<style scoped>
@keyframes slide-up{
  0% {
      transform: translateY(100%);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
}
.container{
  position: fixed;
  width: 100%;
  bottom: 100px;
  display: flex;
  justify-content: center;
  animation: slide-up 0.3s ease-out forwards;
}

.messageContainer{
  display: flex;
  align-items: center;
  margin-top: 5px;
  white-space: nowrap;
  color: white;
  background: black;
  font-size: 15px;
  padding: 15px 18px;
  border-radius: 15px;
}

img{
  margin-right: 10px;
  width: 22px;
  height: 22px;
}
</style>
