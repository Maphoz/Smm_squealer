<template>
  <div class="page-container">
    <div class="image-div">
      <img src="../images/logo_theme.png" alt="Squealer Logo" />
    </div>
    <div class="login-div">
      <h1 class="title">SQUEALER SMM</h1>
      <div class="sub-title"><i>Track stats, Grow Impact</i></div>
      <form @submit.prevent="handleSubmit">
        <FormField :value="user.username" :width="fieldWidth" inputName="username" name="Email o username" @update:value="updateValue"/>
        <FormField :value="user.password" :width="fieldWidth" inputName="password" name="Password" @update:value="updateValue" :password="true"/>
        <div class="button-row" v-if="!loading">
          <div class="buttonContainer">
            <MainButton :onClick="login" :buttonText="loginText" :active="loginActive"/>
          </div>
          <div class="buttonContainer">
            <EmptyButton :onClick="goToRegistration" :buttonText="registrationText" :active="registratationActive"/>
          </div>
        </div>
        <div v-if="loading" class="loadingContainer">
          <BounceLoader :loading="loading" :color="loadingColor" :size="loadingSize"/>
        </div>
      </form>
    </div>
  </div>
  <div v-if="showCorrect">
      <CorrectMessage :correctText="correctText" />
    </div>
    <div v-if="showError">
      <ErrorMessage :errorText="errorText" />
    </div>
</template>

<script>
import FormField from "../components/FormField.vue"; // Update the path based on your project structure
import MainButton from "../components/MainButton.vue";
import EmptyButton from "../components/EmptyButton.vue"
import CorrectMessage from "../components/CorrectMessage.vue"
import ErrorMessage from "../components/ErrorMessage.vue"
import {VueElement, ref} from "vue";
import { useMutation } from "@vue/apollo-composable";
import { LOGIN } from "../graphql/mutations";
import { useCookies} from "vue3-cookies"
import {useRouter} from "vue-router"
import {BounceLoader} from "vue3-spinner"

export default {
  components: {
    FormField,
    MainButton,
    EmptyButton,
    BounceLoader,
    CorrectMessage,
    ErrorMessage
  },
  setup(){
    const router = useRouter();
    const {
      onDone,
      mutate: loginUser,
      onError,
      loading
    } = useMutation(LOGIN);
    const {cookies} = useCookies();
    const showCorrect = ref(false);
    const showError = ref(false);

    onDone((result) => {
      showCorrect.value = true;
      cookies.set("accessTokenSmm", result.data.login.accessToken);
      setTimeout(() => {
        showCorrect.value = false;
        router.push('/home');
      }, 1500)
    })

    onError((error) =>  {
      console.log(error);
      user.value.password = '';
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 1500)
    })

    const user = ref({
      username: null,
      password: null
    });
    const loginActive = ref(true);
    const registratationActive = ref(true);
    const loginText = "Accedi";
    const registrationText = "Registrati";
    const fieldWidth = "100%";

    const updateValue = ({key, value}) => {
      console.log(key, value);
      if (key == 'username') user.value.username = value;
      if (key == 'password') user.value.password = value;
    }

    const login = () => {
      console.log(user.value)
      loginUser({
        loginUserInput: user.value
      })
    }

    const goToRegistration = () => {
      router.push('/registration');
    }

    return{
      user,
      loginActive,
      registratationActive,
      loginText,
      registrationText,
      fieldWidth,
      updateValue,
      login,
      goToRegistration,
      loading,
      loadingColor: "#ff3385",
      loadingSize: "60px",
      errorText: "Email o password errati",
      correctText: "Accesso effettuato",
      showCorrect,
      showError
    }
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  padding-inline: 15%;

}
@media (max-width: 768px) {
  .page-container{
    flex-direction: column;
    align-items: center;
    padding-inline: 5%;
  }
}

.image-div {
  margin-top: 150px;

  img {
    width: 400px;
    height: 400px;
  }

}
@media (max-width: 768px) {
  .image-div{
    order: -1;
    margin-top: 0;

    img {
      width: 200px;
      height: 200px;
    }
  }
}

.login-div {
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;

}
@media (max-width: 768px) {
  .login-div{
    width: 100%;
  }
}

.title {
  font-family: 'Horizon';
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
  font-size: 60px;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 40px;
  }
}

.sub-title {
  color: black;
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 120px;
  margin-top: 0px;

  @media (max-width: 768px) {
    margin-top: -10px;
    font-size: 18px;
    margin-bottom: 20px;
  }
}

.button-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.buttonContainer{
  width: 48%;
  margin-bottom: 15px;
}

form{
  width: 80%;
}

.loadingContainer{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

</style>
