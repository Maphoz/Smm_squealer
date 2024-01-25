<template>
  <div class="page-container" key="user-stats-component">
      <SideNav page="stats"/>
      <Header page="stats" pageTitle="STATISTICHE"/>
      <div v-if="(loadingMonth || loadingStats)" class="loading-container text-center">
        <div class="loadingContainer">
          <BounceLoader :loading="(loadingMonth || loadingStats)" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>
      <div v-if="!(loadingMonth || loadingStats)" class="content-container">
        <div class="clientInfo">
          <div class="clientImage">
            <div class="profile-border">
              <img class="profile-image" :src="userInfo.client.profileImage || noImagePath" />
            </div>
          </div>
          <div class="infoContainer">
            <div class="clientName">
              {{ userInfo.client.nome + ' ' + userInfo.client.cognome }}
            </div>
            <div class="clientUsername">
              @{{ userInfo.client.username }}
            </div>
            <div class="clientBio">
              {{ userInfo.client.bio }}
            </div>
          </div>
        </div>
        <div class="mainCardsContainer">
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/positive_theme_2.png" />
              </div>
              <div class="cardTitle">
                Reazioni positive
                <div class="cardValue">
                  {{ userInfo.totalPositive}}
                </div>
              </div>
            </div>
          </div>
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/negative_theme_2.png" />
              </div>
              <div class="cardTitle">
                Reazioni negative
                <div class="cardValue">
                  {{ userInfo.totalNegative}}
                </div>
              </div>
            </div>
          </div>          
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/comment_theme_2.png" />
              </div>
              <div class="cardTitle">
                Totale commenti
                <div class="cardValue">
                  {{ userInfo.totalComments}}
                </div>
              </div>
            </div>
          </div>          
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/views_theme_2.png" />
              </div>
              <div class="cardTitle">
                Totale views
                <div class="cardValue">
                  {{ userInfo.totalViews}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mainCardsContainer">
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/positive_theme_2.png" />
              </div>
              <div class="cardTitle">
                Positive /post
                <div class="cardValue">
                  {{ (userInfo.totalPositive / userInfo.totalPosts).toFixed(1)}}
                </div>
              </div>
            </div>
          </div>
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/negative_theme_2.png" />
              </div>
              <div class="cardTitle">
                Negative /post
                <div class="cardValue">
                  {{ (userInfo.totalNegative  / userInfo.totalPosts).toFixed(1) }}
                </div>
              </div>
            </div>
          </div>          
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/comment_theme_2.png" />
              </div>
              <div class="cardTitle">
                Commenti /post
                <div class="cardValue">
                  {{ (userInfo.totalComments  / userInfo.totalPosts).toFixed(1)}}
                </div>
              </div>
            </div>
          </div>          
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/views_theme_2.png" />
              </div>
              <div class="cardTitle">
                Views /post
                <div class="cardValue">
                  {{ (userInfo.totalViews  / userInfo.totalPosts).toFixed(1)}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="pieSqueals.length > 0 && userInfo.totalPosts > 0" class="chartSection">
          <div class="chartTitle">
            Classificazione degli squeals
          </div>
          <div class="chartContainer">
            <Pie :data="chartData" :options="pieOptions"/>
          </div>
        </div>
        <div v-if="pieSqueals.length > 0 && userInfo.totalPosts > 0" class="linechartSection">
          <div class="linechartTitle">
            Squeals periodo
          </div>
          <div class="linechartContainer">
            <Line :data="lineData" :options="lineOptions"/>
          </div>
        </div>
        <div class="mainCardsContainer">
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/message_theme_2.png" />
              </div>
              <div class="cardTitle">
                Squeals
                <div class="cardValue">
                  {{ userInfo.client.squeals.length}}
                </div>
              </div>
            </div>
          </div>
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/friends_theme_2.png" />
              </div>
              <div class="cardTitle">
                Amici
                <div class="cardValue">
                  {{ userInfo.client.friends.length}}
                </div>
              </div>
            </div>
          </div>
          <div class="mainCard">
            <div class="cardInfo">
              <div class="iconContainer">
                <img src="../images/channel_theme_2.png" />
              </div>
              <div class="cardTitle">
                Canali
                <div class="cardValue">
                  {{ userInfo.client.channels.length}}
                </div>
              </div>
            </div>
          </div>    
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_CLIENT_STATS, CLIENT_MONTH_DATA } from '../graphql/queries';
import { Pie, Line } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title } from 'chart.js';
import { pieColors, pieOptions, lineOptions } from '../chartsConfig/chartConfig';
import { BounceLoader } from 'vue3-spinner';
import { useRoute, useRouter } from 'vue-router';
import SideNav from '../components/sidenav.vue';
import Header from '../components/Header.vue';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title);

const route = useRoute();
const userId = route.params.userId;
const router = useRouter();

const { loading: loadingStats, result: resultStats, refetch: refetchStats } = useQuery(GET_CLIENT_STATS, {
  clientId: userId,
});

const { loading: loadingMonth, result: resultMonth, refetch: refetchMonth } = useQuery(CLIENT_MONTH_DATA, {
  clientId: userId,
});

const userInfo = ref({});
const pieSqueals = ref([]);
const lineSqueals = ref({
  popular: null,
  impopular: null,
  normal: null,
  controverse: null
})

const fetchData = async () => {
  if(userId == 0){
    router.push('/home');
  }
  await refetchStats({ clientId: userId });
  await refetchMonth({ clientId: userId});
  userInfo.value = resultStats.value.getClientStats;
  pieSqueals.value = [
    userInfo.value.populars,
    userInfo.value.impopulars,
    userInfo.value.controverse,
    userInfo.value.regular,
  ];
  lineSqueals.value = {
    popular: resultMonth.value.monthDataClient.popular,
    impopular: resultMonth.value.monthDataClient.impopular,
    normal: resultMonth.value.monthDataClient.normal,
    controverse: resultMonth.value.monthDataClient.controverse,
  }
  console.log(lineSqueals.value.normal.map(obj => obj.label));
  console.log(lineSqueals.value.impopular.map(obj => obj.value));
};

// Fetch data on component mount
onBeforeMount(() => {
  fetchData();
});

const chartData = computed(() => ({
  labels: ['Popolari', 'Impopolari', 'Controversi', 'Normali'],
  datasets: [
    {
      labels: ['Popolari', 'Impopolari', 'Controversi', 'Normali'],
      data: pieSqueals.value,
      backgroundColor: pieColors,
      borderWidth: 2,
      borderColor: 'white',
    },
  ],
}));

const lineData = computed(() => ({
  labels: lineSqueals.value.normal.map(obj => obj.label),
  datasets: [
    {
      label: 'Normali',
      data: lineSqueals.value.normal.map(obj => obj.value),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.2,
      fill: true
    },
    {
      label: 'Popolari',
      data: lineSqueals.value.popular.map(obj => obj.value),
      backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue color
      borderColor: "rgba(54, 162, 235, 1)", // Blue color
      tension: 0.2,
      fill: true
    },
    {
      label: 'Impopolari',
      data: lineSqueals.value.impopular.map(obj => obj.value),
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
      tension: 0.2,
      fill: true
    },
    {
      label: 'Controversi',
      data: lineSqueals.value.controverse.map(obj => obj.value),
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      tension: 0.2,
      fill: true
    },
  ],
}));

const noImagePath = new URL(`../images/no_image.png`, import.meta.url).href
const loadingColor = "#ff3385";
const loadingSize = "60px";

</script>

<style scoped>
  .content-container{
    padding-left: 18%;
    padding-bottom: 100px;
  }

  .loading-container{
    padding-left: 18%;
    margin-top: 10%;
  }

  .clientImage{
    display: flex;
  }

  .cardInfo{
    display: flex;
    align-items: center;
  }
  .clientInfo{
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
  }
  .profile-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid white;
}
.profile-border {
  margin-top: 10px;
  border-radius: 50%;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  display: flex;
  padding: 2px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.infoContainer{
  margin-top: 10px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.clientName{
  font-weight: 600;
}

.clientUsername{
  color: #888;
}

.clientBio{
  margin-top: 15px;
}


.mainCardsContainer{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 40px;
  padding-inline: 60px;
}
.mainCard{
  display: flex;
  padding: 10px 0px 10px 20px;
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

.iconContainer{
  padding: 10px;
  background: #ff338544;
  border-radius: 50%;
  margin-right: 10px;
}

.iconContainer img{
  width: 30px;
  height: 30px;
}

.chartSection{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.loadingContainer{
  width: 100%;
  display: flex;
  justify-content: center;
}

.chartTitle{
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
}
.chartContainer{
  position: relative;
  width: 400px;
  height: 400px;
}

.linechartSection{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.linechartTitle{
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
}

.linechartContainer{
  width: 700px;
}
@media(max-width:576px){
  .content-container{
    margin-top: 40px;
    padding-inline: 15px;
  }

  .loading-container{
    padding-inline: 15px;
  }

  .profile-image{
    width: 90px;
    height: 90px;
  }

  .clientBio{
    margin-top: 5px;
    max-width: 200px;
  }

  .chartTitle{
    font-size: 20px;
  }

  .chartContainer{
    width: 300px;
    height: 300px;
  }

  .linechartTitle{
    font-size: 20px;
  }

  .linechartContainer{
    width: 300px;
    height: 250px;
  }
}

</style>
