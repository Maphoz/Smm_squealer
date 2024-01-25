<template>
  <KeepAlive>
    <div key="user-activity-component">
    <div class="page-container">
      <Header :pathId="0" page="smmReviews" pageTitle="REVIEWS"/>
      <SideNav :pathId="0" page="smmReviews"/>
      <div v-if="loading" class="loading-container">
        <div class="loadingContainer">
          <BounceLoader :loading="loading" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>      
      <div v-if="!loading" class="content-container">
        <h1 class="title">Reviews </h1>
        <div v-if="reviewsToShow.length > 0" class="sorting">
          <div class="filterTitle">Ordina reviews</div>
          <div class="sortingContainer">
            <div :class="{'sortOption': sortMethod !== 'dateDown', 'selectedSort': sortMethod == 'dateDown'}" @click="() => setSort('dateDown')">
              Più recenti
            </div>
            <div :class="{'sortOption': sortMethod !== 'dateUp', 'selectedSort': sortMethod == 'dateUp'}" @click="() => setSort('dateUp')">
              Più vecchi
            </div>
            <div :class="{'sortOption': sortMethod !== 'ratingUp', 'selectedSort': sortMethod == 'ratingUp'}" @click="() => setSort('ratingUp')">
              Più alte
            </div>
            <div :class="{'sortOption': sortMethod !== 'ratingDown', 'selectedSort': sortMethod == 'ratingDown'}" @click="() => setSort('ratingDown')">
              Più basse
            </div>
          </div>
        </div>
        <div v-if="reviewsToShow.length > 0" class="reviewsContainer">
          <div v-for="review in reviewsToShow" class="singleClient">
            <div class="nameImage">
              <img :src="review.profileImage" alt="foto cliente" class="clientImage">
              <div class="nameDiv">
                <div class="nameRating">
                  <span class="reviewName">{{ review.nome }}  {{ review.cognome }}</span>
                  <img v-if="review.rating > 0" src="../images/star.png" alt="rating" class="starIcon"/>
                  <img v-if="review.rating > 1" src="../images/star.png" alt="rating" class="starIcon"/>
                  <img v-if="review.rating > 2" src="../images/star.png" alt="rating" class="starIcon"/>
                  <img v-if="review.rating > 3" src="../images/star.png" alt="rating" class="starIcon"/>
                  <img v-if="review.rating > 4" src="../images/star.png" alt="rating" class="starIcon"/>
                  <span class="ratingValue">({{ review.rating }})</span>
                </div>
                <span class="reviewText">{{ review.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="reviewsToShow.length == 0" class="noInfoMessage">
            <img src="../images/alertIcon.png" alt="Nessuna notifica"/>
            <div class="messageNoContainer">
              Non hai recensioni da visualizzare
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
                      Cancella squeal
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Sei sicuro di voler eliminare questo squeal?
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="deleteSquealCall"
                        >
                          Elimina
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
  </div>
  </KeepAlive>
</template>

<script setup>
import SideNav from "../components/sidenav.vue" // Update the path based on your project structure
import { computed, ref, watch, onBeforeMount } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_PROFILE } from '../graphql/queries'; // Adjust the path based on your project structure
import { useRoute } from "vue-router";
import { formatTimeDifference } from "../utils/utils";
import {positiveReactions} from "../utils/fixed"
import {BounceLoader} from "vue3-spinner"
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { DELETE_CLIENT_SQUEALS } from "../graphql/mutations";
import Header from "../components/header.vue";

const { loading: loadingProfile, result: resultProfile, refetch: refetchProfile } = useQuery(GET_PROFILE);


const userInfo = ref({});
const reviews = ref([]);
const reviewsToShow = ref([]);

const fetchData = async () => {
  await refetchProfile();
  userInfo.value = resultProfile.value.getSmmProfile.smm;
  reviews.value = mergeArrays(userInfo.value.reviews, resultProfile.value.getSmmProfile.reviewers).reverse();
  reviewsToShow.value = reviews.value;
};

// Fetch data on component mount
onBeforeMount(() => {
  fetchData();
});

const sortMethod = ref('dateDown');
const setSort = (sortName) => {
  sortMethod.value = sortName;
}

const sortSqueals = (value) => {
  console.log('ordina per', value);
  const sortedReviews = [...reviews.value];  // Create a shallow copy
  console.log('array originale', reviews.value);
  console.log('sortato copiato', sortedReviews);

  if (value == 'dateUp') sortedReviews.reverse();
  else if (value == 'ratingDown') sortedReviews.sort((a, b) => b.rating - a.rating);
  else if (value == 'ratingUp') sortedReviews.sort((a, b) => a.rating - b.rating);
  
  // Assign the sorted array to the reactive variable
  reviewsToShow.value = sortedReviews;
  console.log(reviewsToShow.value);
}

watch(sortMethod, value => {
  sortSqueals(value);
});


const isOpen = ref(false)

function closeModal() {
  isOpen.value = false;
}
function openModal(squealId) {
  squealToDelete.value = squealId;
  isOpen.value = true;
}

const mergeArrays = (arr1, arr2) => {
  return arr1.map(obj1 => {
    const matchingObj = arr2.find(obj2 => obj1.senderId === obj2._id);
    return { ...obj1, ...matchingObj };
  });
};


const showError = ref(false);
const showCorrect = ref(false);
const loadingColor = "#ff3385";
const loadingSize = "60px";

</script>

<style scoped>
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

.nameDiv{
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.singleClient{
  display: flex;
  align-items: center;
  margin: 10px 0px;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
}

.singleClient:hover{
  background: #ff338511;
}
.nameImage{
  display: flex;
  align-items: flex-start;
}
.clientImage{
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.reviewsContainer{
  width: 65%;
}
.nameDiv{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 18px;
}

.nameRating{
  display: flex;
  align-items: center;
}

.reviewName{
  font-weight: 600;
  margin-right: 5px;
}

.ratingValue{
  color: #ff3385;
  margin-left: 5px;
}

.starIcon{
  margin-left: 2px;
  width: 15px;
  height: 15px;
}

.filterTitle{
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.filter{
  padding: 5px 20px;
  border-radius: 10px;
  border: 2px solid black;
}

.selected{
  padding: 5px 20px;
  border-radius: 10px;
  background: #ff3385;
  border: 2px solid #ff3385;
  color: white;
}

.filter:hover{
  cursor: pointer;
  border: 2px solid #ff3385;
  color: #ff3385;
  transition: all 0.2s ease-in-out;

}

.selected:hover{
  cursor: pointer;
}

.sorting{
  width: 750px;
  margin-bottom: 10px;
}
.sortingContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
}
.sortOption{
  padding: 5px 15px;
  border-radius: 10px;
  border: 2px solid black;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;

}
.selectedSort{
  padding: 5px 15px;
  border-radius: 10px;
  color: #ff3385;
  border: 2px solid #ff3385;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;

}

.sortOption:hover{
  cursor: pointer;
  border: 2px solid #ff3385;
  color: #ff3385;
  transition: all 0.2s ease-in-out;

}

.selectedSort:hover{
  cursor: pointer;
}

.bg-w{
  background-color: white;
}

.bg-b{
  background-color: black;
  opacity: 0.25;
}

.dotContainer{
  box-shadow: 0px 3px 5px 5px #ffffffdd;
  margin-right: 10px;
}

.dotContainer:hover{
  cursor: pointer;
}

.dotContainer img{
  width: 15px;
  height: auto;
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

.positionContainer{
  display: flex;
  justify-content: flex-start;  
  margin-top: 5px;
}
.mapNewSqueal{
  width: 450px;
  height: 450px;
}

@media(max-width: 576px){
  .singleSqueal{
    width: 100%;
  }
  .classTag{
    font-size: 12px;
  }

  .videoContainer{
    width: 100%;
    height: auto;
  }

  .dotContainer{
    margin-right: 5px;
  }

  .squealImageContainer img{ 
    width: 100%;
    height: auto;
  }

  .iconsContainer{
    margin-top: 10px;
  }

  .iconDiv{
    margin-right: 10px;
  }

  .content-container{
    padding-inline: 15px;
    margin-top: 60px;
  }

  .loading-container{
    padding-inline: 15px;
  }

  .title{
    display: none;
  }

.sorting{
    width: 100%;
  }

  .sortingContainer{
    width: 90%;
  }

  .reviewsContainer{
    width: 100%;
  }

  .clientImage{
    width: 50px; 
    height: 50px;
  }

  .singleClient{
    padding: 10px 10px;
  }
}

</style>
