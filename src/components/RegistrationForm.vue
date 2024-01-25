<script>
import FormField from "../components/FormField.vue"; // Update the path based on your project structure
import MainButton from "./MainButton.vue";
import EmptyButton from "./EmptyButton.vue"
import {ref, computed} from "vue"
import { useMutation } from "@vue/apollo-composable";
import {REGISTER_USER} from "../graphql/mutations"
import { useRouter } from "vue-router";
import CorrectMessage from "./CorrectMessage.vue";
import ErrorMessage from "./ErrorMessage.vue";


export default {
  components: {
    FormField,
    MainButton,
    EmptyButton,
    CorrectMessage,
    ErrorMessage
  },
  setup() {
    const router = useRouter();
    const {
      onDone,
      mutate: createSmm,
      onError,
    } = useMutation(REGISTER_USER);

    /**
     * mutation handling
     */
    const showCorrect = ref(false);
    const showError = ref(false);

    const correctText = ref('Registrazione avvenuta con successo!');
    const errorText = ref('');

    onDone((result) => {
      showCorrect.value = true;
      setTimeout( () => {
        showCorrect.value = false;
        router.push('/');
      }, 1500)
    });

    onError((error) => {
      errorText.value = error.message;
      showError.value = true;
      setTimeout( () => {
        showError.value = false;
        formStep.value = 1;
      }, 1500)
    });

    const uploadImage = ref(null);
    const name = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const username = ref('');
    const confirmPassword = ref('');
    const fieldWidth = '100%';
    const buttonActive = ref(true);
    const submitText = 'Continua';
    const emptySubmitText = 'Torna al login';
    const halfWidth = '48%';
    const selectedImage = ref(null);
    const formStep = ref(1);
    const completeText = 'Completa registrazione';
    const goBackText = 'Torna indietro';
    const bio = ref('');
    const monthlyCost = ref(null);
    const fileImage = ref(null);

    const updateValue = ({ key, value }) => {
      if(key == 'name'){
        name.value = value;
      }
      if(key == 'lastName') lastName.value = value;
      if (key == 'username') username.value = value;
      if (key == 'confirmPassword') updateConfirm(value);
      if (key == 'password') updatePassword(value);
      if (key == 'email') updateEmail(value);
    };

    const updateEmail = (newEmail) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      email.value = newEmail;
      if (email.value === ""){
        emailError.value = false;
      }
      else{
        emailError.value = !emailRegex.test(email.value);
      }
    }

    const updatePassword = (newPassword) => {
      password.value = newPassword;
      if (password.value === ""){
        passwordError.value = false;
      }
      else if (checkPassword(password.value)){
        passwordError.value = false;
      }
      else{
        passwordError.value = true;
      }
    }

    function checkPassword(str){
      const hasNumber = /\d/.test(str);
      const hasLetter = /[a-zA-Z]/.test(str);
      const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(str);
      const minLength = str.length >= 8;

      return hasNumber && hasLetter && hasSpecialSymbol && minLength;
    }

    const updateConfirm = (newConfirm) => {
      confirmPassword.value = newConfirm;
      if(confirmPassword.value == ""){
        confirmPasswordError.value = false;
      }
      else if(confirmPassword.value === password.value){
        confirmPasswordError.value = false;
      } else{
        confirmPasswordError.value = true;
      }
    }

    const submitForm = () => {
      console.log('Form submitted:', {
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        selectedImage: selectedImage.value,
      });
    };

    const goNextStep = () => {
      formStep.value = 2;
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];

      if (file) {
        fileImage.value = file;
        const reader = new FileReader();

        reader.onload = (e) => {
          selectedImage.value = e.target.result;
        };

        reader.readAsDataURL(file);
      }
    };

    const openImagePicker = () => {
      uploadImage.value.click();
    };

    const goToLogin = ( ) => {
      router.push('/');
    }

    const completeRegistration = () => {
      const userInfo = {
        email: email.value,
        password: password.value,
        username: username.value,
        bio: bio.value,
        nome: name.value,
        cognome: lastName.value,
        typeOfUser: 'SMM',
        price: parseFloat(monthlyCost.value),
      };

      console.log(userInfo);
      console.log(fileImage.value);

      createSmm({
          userInfo: {...userInfo},
          file: fileImage.value,
        },
      );
    };

    const goBack = () => {
      formStep.value = 1;
    };

    // Return the values and functions that need to be exposed to the template
    //form validation
    const emailError = ref(false);
    const passwordError = ref(false);
    const confirmPasswordError = ref(false);

    const nextStepActive = computed(() => {
      return (
        !emailError.value &&
        !passwordError.value &&
        !confirmPasswordError.value &&
        name.value.trim() !== '' &&
        lastName.value.trim() !== '' &&
        email.value.trim() !== '' &&
        username.value.trim() !== '' &&
        password.value.trim() !== '' &&
        confirmPassword.value.trim() !== ''
      );
    });

    const completeActive = computed(() => {
      return (
        selectedImage.value &&
        bio.value.trim() !== '' &&
        monthlyCost.value !== null
      );
    });
    return {
      name,
      lastName,
      email,
      password,
      username,
      confirmPassword,
      fieldWidth,
      buttonActive,
      submitText,
      emptySubmitText,
      halfWidth,
      selectedImage,
      formStep,
      completeText,
      goBackText,
      bio,
      monthlyCost,
      fileImage,
      updateValue,
      submitForm,
      goNextStep,
      handleImageChange,
      openImagePicker,
      completeRegistration,
      goBack,
      uploadImage,
      goToLogin,
      emailError,
      passwordError,
      confirmPasswordError,
      nextStepActive,
      completeActive,
      showCorrect,
      showError,
      correctText,
      errorText
    };
  },
};
</script>

<template>
    <div class="form">
      <div v-if="formStep === 1" class="step1">
        <div class="form-row">
          <FormField :value="name" :width="halfWidth" name="Nome" inputName="name" @update:value="updateValue"/>
          <FormField :value="lastName" :width="halfWidth" name="Cognome" inputName="lastName" @update:value="updateValue"/>
        </div>
        <FormField :value="email" :width="fieldWidth" name="Email" :error="emailError" errorMessage="L'email non ha un formato corretto" inputName="email" type="email" @update:value="updateValue"/>
        <FormField :value="username" :width="fieldWidth" name="Username" inputName="username" type="email" @update:value="updateValue"/>
        <FormField :value="password" :width="fieldWidth" :password="true" :error="passwordError" errorMessage="La password deve contenere: 1 numero, 1 lett. maiuscola, 1 carattere speciale, almeno lunghezza 8." name="Password" inputName="password" @update:value="updateValue"/>
        <FormField :value="confirmPassword" :width="fieldWidth" :password="true"  :error="confirmPasswordError" errorMessage="Le password non combaciano" name="Confirm Password" inputName="confirmPassword" @update:value="updateValue"/>

        <div class="buttonContainer">
          <MainButton :onClick="goNextStep" :buttonText="submitText" :active="nextStepActive"/>
        </div>
        <div class="buttonContainer">
          <EmptyButton :onClick="goToLogin" :buttonText="emptySubmitText" :active="buttonActive"/>
        </div>
      </div>

      <div v-if="formStep === 2" class="step2">
        <div class="image-picker">
          <img v-if="selectedImage" :src="selectedImage" alt="Selected" />
          <img v-else src="../images/user_image.jpg" alt="No Profile" />
          <input ref="uploadImage" type="file" accept="image/*" @change="handleImageChange" />
          <button class="fullB" @click="openImagePicker">{{ selectedImage ? 'Cambia' : 'Carica' }}</button>
        </div>
        <div class="registrationText">
          Descriviti ai tuoi futuri clienti!
        </div>
        <div class="textarea-container">
          <textarea
            class="bio-textarea"
            placeholder="Inserisci la tua biografia qui..."
            v-model="bio"
          ></textarea>
        </div>
        <div class="registrationText">
          Inserisci la tua tariffa
        </div>
        <div class="input-container">
          <div class="euro-icon">&#x20AC;</div>
          <input
            class="cost-input"
            type="number"
            placeholder="Tariffa mensile"
            v-model="monthlyCost"
          />
          <div class="per-month-text">/month</div>
        </div>
        <div class="buttonContainer">
          <MainButton :onClick="completeRegistration" :buttonText="completeText" :active="completeActive"/>
        </div>
        <div class="buttonContainer">
          <EmptyButton :onClick="goBack" :buttonText="goBackText" :active="buttonActive"/>
        </div>
        <div class="flex justify-center" v-if="showCorrect">
          <CorrectMessage :correctText="correctText" />
        </div>
        <div class="flex justify-center" v-if="showError">
          <ErrorMessage :errorText="errorText" />
        </div>
      </div>
    </div>
</template>

<style scoped>

.form{
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttonContainer{
  width: 100%;
  margin-bottom: 15px;
  font-size: 18px;
}

.textarea-container {
  width: 100%;
  margin-bottom: 15px;
}

.bio-textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;
  height: 100px;

  &:focus{
    border-color: #ff3385; /* Purple border when focused */
    outline: none;
  }
}

.input-container {
  position: relative;
  margin-bottom: 25px;
}

.euro-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #ff3385; /* Purple color */
}

.cost-input {
  width: calc(100% - 30px);
  padding-left: 30px;
  outline: none;
  font-size: 18px;
  line-height: 40px;
  border-radius: 10px;
  border: 2px solid black;
  transition: 0.2s ease;
  box-sizing: border-box;

  &:focus{
    border-color: #ff3385;
  }

  &:valid{
    border-color: #ff3385;
  }
}

.per-month-text {
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #555; /* Adjust color as needed */
}

@media only screen and (max-width: 768px) {
  .form{
    width: 90%;
  }

  .registrationText{
    font-size: 16px;
    text-align: left;
    margin-bottom: 5px;
  }

  .image-picker button{
    width: 50%;
  }
  .bio-textarea {
    font-size: 16px;
  }
}

.step1, .step2{
  width: 100%;
}

.registrationText{
  margin-top: 10px;
  font-size: 18px;
  text-align: left;
  margin-bottom: 20px;
}

.form-row{
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.image-picker {
  margin: 0px 0px 25px 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
}

.fullB{
  background-color: #ff3385;
  color: white;
  border: 2px solid #ff3385;
  border-radius: 10px;
  padding: 5px 10px;
}

.fullB:hover{
  color: #ff3385;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.image-picker button{
  width: 30%;
}

.image-picker img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 2px 2px #eeeeee;
}

.image-picker input {
  display: none;
}
</style>
