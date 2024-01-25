<template>
  <div class="page-container">
      <SideNav page="buyChar" />  
      <Header page="buyChar" pageTitle="ACQUISTA CARATTERI"/>

      <div class="content-container">
        <h1 class="title">Acquista caratteri</h1>
        <div v-if="loadingClient" class="loadingContainer">
          <BounceLoader :loading="loadingClient" :color="loadingColor" :size="loadingSize"/>
        </div>
        <div v-if="!loadingClient" class="purchaseContainer">
          <div class="currentCharContainer">
            <div class="remainingTitle">
              <img :src="userInfo.profileImage || noImagePath" />
              Caratteri rimanenti di {{ userInfo.nome }} {{ userInfo.cognome }}
            </div>
            <div class="mainCardsContainer">
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="letterContainer">
                    G
                  </div>
                  <div class="cardTitle">
                    Caratteri giornalieri
                    <div class="cardValue">
                      {{ userInfo.caratteri_giornalieri_rimanenti }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="letterContainer">
                    S
                  </div>
                  <div class="cardTitle">
                    Caratteri settimanali
                    <div class="cardValue">
                      {{ userInfo.caratteri_settimanali_rimanenti }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="letterContainer">
                    M
                  </div>
                  <div class="cardTitle">
                    Caratteri mensili
                    <div class="cardValue">
                      {{ userInfo.caratteri_mensili_rimanenti }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="infoText">
            Puoi procede ad acquistare caratteri aggiuntivi per il tuo cliente. Non vi sono limiti di acquisto di caratteri. Più lunga sarà la durata degi caratteri aggiuntivi, maggiore sarà il costo per carattere. Alla fine del mese, vi verranno accreditati i soliti caratteri.
          </div>
          <div class="inputRow">
            <span>Quanti caratteri vuoi acquistare? </span>
            <div class="inputDiv">
              <input v-model="charsToPurchase" type="number" pattern="\d*" >
            </div>
          </div>
          <div class="cardContainer">
            <div v-for="tariffa in tariffe" class="vipCard">
              <div class="centerDiv">
                <div class="smallTitle">{{tariffa.durata}}</div>
                <div class="tariffa">({{ tariffa.tariffa }}€/carattere)</div>
                <div class="paymentCost">Totale €{{ (charsToPurchase * tariffa.tariffa).toFixed(2) }}</div>
                <div class="greyDescription">{{ tariffa.string }}</div>
                <div class="buttonContainer">
                  <MainButton :active="true" :buttonText="purchaseText" :onClick=" () => openModal((charsToPurchase * tariffa.tariffa).toFixed(2), tariffa.periodo)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TransitionRoot appear :show="isOpen" as="template">
          <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-b" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-w p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      Conferma acquisto
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Sei sicuro di voler acquistare <b>{{ charsToPurchase }}</b> caratteri {{ periodSelected }} a <b>€{{ total }}</b>?
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="buyCharsCall"
                        >
                          Conferma
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent emptyB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          @click="closeModal"
                        >
                          Annulla
                        </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>      
    </div>
    <div v-if="showCorrect">
      <CorrectMessage :correctText="correctText" />
    </div>
    <div v-if="showError">
      <ErrorMessage :errorText="errorText" />
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_CLIENT } from '../graphql/queries'; // Adjust the path based on your project structure
import { BUY_CHARS_CLIENT } from "../graphql/mutations"
import SideNav from '../components/sidenav.vue';
import { useRoute, useRouter } from 'vue-router';
import { BounceLoader } from 'vue3-spinner';
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { formatTimeDifference } from '../utils/utils';
import { tariffe } from '../utils/fixed';
import MainButton from '../components/MainButton.vue';
import Header from '../components/header.vue';

const route = useRoute();
const userId = route.params.userId;
const router = useRouter();

const { loading: loadingClient, result: resultClient, refetch: refetchClient } = useQuery(GET_CLIENT, {
  clientId: userId,
});
const { mutate: buyChars, onDone, onError } = useMutation(BUY_CHARS_CLIENT);

const charsToPurchase = ref(0);
const userInfo = ref({});
const periodSelected = ref();
const total = ref();

const fetchData = async () => {
  if(userId == 0){
    router.push('/home');
  }
  await refetchClient({ clientId: userId });
  userInfo.value = resultClient.value.getClient;
};

onBeforeMount(() => {
  fetchData();
});

onDone(() => {
  fetchData();
  showCorrect.value = true;
  setTimeout(() => {
    showCorrect.value = false;
  }, 1500)
});

onError(() => {
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 1500)
});

const popUpPurchase = (totalCost, period) => {
  periodSelected.value = period;
  total.value = totalCost;
};

const purchaseText = "Acquista";

const buyCharsCall = () => {
  buyChars({
    clientId: userId,
    chars: parseInt(charsToPurchase.value),
    period: periodSelected.value,
  });
  charsToPurchase.value = 0;
  closeModal();
};

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
const openModal = (totalCost, period) => {
  isOpen.value = true;
  periodSelected.value = period;
  total.value = totalCost;
};

const showError = ref(false);
const showCorrect = ref(false);

const noImagePath = new URL(`../images/no_image.png`, import.meta.url).href;
const loadingColor = "#ff3385";
const loadingSize = "60px";
const correctText = "Caratteri acquistati con successo.";
const errorText = "Caratteri non acquistati."
</script>

<style scoped>

.buttonContainer{
  width: 70%;
}

.purchaseContainer{
  width: 70%;
}
.loadingContainer{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .content-container{
    padding-left: 18%;
    padding-bottom: 100px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
  .loading-container{
    padding-left: 18%;
    margin-top: 10%;
  }

  .loadingContainer{
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .title {
  margin-top: 30px;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

.infoText{
  font-size: 16px;
  margin-bottom: 30px;

}
.red{
  color: red;
}

.bg-w{
  background-color: white;
}

.bg-b{
  background-color: black;
  opacity: 0.25;
}

.inputRow{
  display: flex;
  align-items: flex-start;
  font-size: 18px;
}

.inputRow span{
  margin-right: 10px;
}

.inputDiv input{
  border: 2px solid lightgray;
  border-radius: 5px;
  padding-left: 10px;
}

.inputDiv input:focus{
  border: 2px solid #ff3385;
  box-shadow: 0px 0px 1px 1px #ff3385;
  outline: none;
}

.cardContainer{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-inline: 10px;
  margin-top: 15px;
  padding-bottom: 70px;
}

.vipCard{
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px;
  padding: 10px 0px;
  border-radius: 5px;
  border: 2px solid #ff3385;
}
.centerDiv{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

.smallTitle{
  font-size: 1.4em;
  font-weight: 700;
  padding-inline: 5px;
  color:  #ff3385;
}

.paymentCost{
  font-size: 1.8em;
  font-weight: 700;
  padding-inline: 15px;
  color: #ff3385;
  margin-bottom: 10px;
}

.tariffa{
  font-size: 12px;
  margin-bottom: 20px;
}

.greyDescription{
  font-size: 16px;
  color: #949494;
  margin-bottom: 30px;
  padding-inline: 10px;
  text-align: center;
}

.currentCharContainer{

}
.remainingTitle{
  font-size: 20px;
  display: flex;
  align-items: flex-end;
}

.remainingTitle img{
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin-right: 10px;
}
.mainCardsContainer{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-bottom: 10px;
}
.mainCard{
  display: flex;
  padding: 10px 5px 10px 15px;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0px 0px 10px 2px lightgray;
  border-radius: 15px;
  width: 250px;
  background: #fafafa;
  margin-bottom: 15px;
}

.mainCard:hover{
  box-shadow: 0px 0px 10px 2px #ff338566;
}
.cardInfo{
  display: flex;
  align-items: center;
}
.letterContainer{
  color: #ff3385;
  background: #ff338544;
  border-radius: 50%;
  margin-right: 10px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.cardTitle{
  font-size: 20px;
  color: grey;
}
.cardValue{
  font-size: 24px;
  color: #ff3385;
  font-weight: 600;
  margin-left: 10px;
  margin-top: -5px;
}

.fullB{
  color: white;
  background-color: #ff3385;
  border: 1px solid #ff3385;
}

.fullB:hover{
  color: #ff3385;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.emptyB{
  color: white;
  background-color: black;
  border: 1px solid black;
}

.emptyB:hover{
  color: black;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

@media(max-width: 576px){

  .content-container{
    padding-inline: 10px;
    margin-top: 60px;
  }
  .loading-container{
    padding-inline: 10px;
  }

  .title{
    display: none;
  }
 .inputRow{
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  font-size: 16px;
 }

 .cardContainer{
  flex-direction: column;
  padding-inline: 10%;
 }

 .purchaseContainer{
  width: 90%;
 }
}
</style>
