<!-- ButtonComponent.vue -->
<template>
  <div class="container">
    <div class="messageContainer">
      <img src="../images/error_icon.png" alt="">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorText: String,
  },
  data() {
    return {
      text: this.errorText,
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

@keyframes shake{
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
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
  animation: shake 0.5s ease-out 0.5s;
}

img{
  margin-right: 10px;
  width: 22px;
  height: 22px;
}
</style>
