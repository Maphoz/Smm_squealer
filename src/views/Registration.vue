<template>
  <div class="main-page">
      <div class="mainTitle">Registrati</div>
      <RegistrationForm />
  </div>
</template>

<script>
import RegistrationForm from "../components/RegistrationForm.vue"; // Update the path based on your project structure

export default {
  components: {
    RegistrationForm,
  },
};
</script>

<style scoped>
.main-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.mainTitle{
  margin-top: 20px;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 30px;
}

@media only screen and (max-width: 768px) {
  form{
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .mainTitle{
    margin-top: 10px;
    background: linear-gradient(to right, #ff00ff, #ff3385);
    -webkit-background-clip: text;
    color: transparent;
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
    }
}
</style>
