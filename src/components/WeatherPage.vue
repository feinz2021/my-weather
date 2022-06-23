<template>
  <header></header>
  <body>
    <div
      v-if="loading === true"
      style="
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9;
      "
    >
      <div
        v-if="loading === true"
        class="lds-ripple"
        style="margin-left: 46%; margin-top: 40vh"
      >
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="container">
      <!-- Modal Structure -->
      <div
        id="modalLocation"
        class="modal"
        style="
          width: 400px;
          height: 400px;
          background-image: linear-gradient(to bottom right, #43a047, #c8e6c9);
        "
      >
        <div class="modal-content" style="height: 350px; color: white">
          <h5 class="center">Set Location</h5>
          <!-- searchbox -->
          <vue3-simple-typeahead
            id="typeahead_id"
            placeholder="Type Here..."
            :items="this.locationNameList"
            :minInputLength="1"
            @selectItem="locationSelected"
            onfocus="this.value=''"
          >
          </vue3-simple-typeahead>
          <label style="color: white" id="typeahead_id">Type Here⬆️</label>
        </div>
      </div>

      <br />
      <div
        class="card-panel modal-trigger"
        style="
          cursor: pointer;
          background-image: linear-gradient(to bottom right, #43a047, #a5d6a7);
        "
        href="#modalLocation"
      >
        <div class="row">
          <!-- Modal Trigger -->
          <!-- temperature -->
          <div class="col s12 m12 l3">
            <div style="color: white">
              <div class="center" style="font-size: 800%">{{ maxTemp }}°</div>
              <div class="center" style="font-size: 600%">{{ minTemp }}°</div>
            </div>
          </div>

          <!-- location & time -->
          <div class="col s12 m12 l3">
            <div
              class="center"
              id="district"
              style="color: white; font-size: xx-large; margin-top: 30px"
            >
              {{ district }},
            </div>
            <div
              class="center"
              id="state"
              style="color: white; font-size: x-large"
            >
              {{ state }}
            </div>
            <div
              class="center"
              style="color: white; margin-top: 20px; font-size: large"
            >
              {{ todayDateDisplay }}
            </div>
            <div
              class="center"
              style="color: white; margin-top: 20px; font-size: large"
            >
              <span class="material-icons-round" style="font-size: 300%">{{
                iconWeatherSelection(dailySignificantWeather)
              }}</span>
              <br />
              <div style="font-size: larger">
                {{ dailySignificantWeather }}
              </div>
            </div>
          </div>

          <!-- morning -->
          <div class="col s12 m12 l2">
            <div class="center" style="color: white; margin-top: 90px">
              <div style="font-size: x-large">Morning</div>
              <span class="material-icons-round" style="font-size: 300%">{{
                iconWeatherSelection(dailyMorning)
              }}</span>
              <br />
              <div style="font-size: large">
                {{ dailyMorning }}
              </div>
            </div>
          </div>
          <!-- afternoon -->
          <div class="col s12 m12 l2">
            <div class="center" style="color: white; margin-top: 90px">
              <div style="font-size: x-large">Afternoon</div>
              <span class="material-icons-round" style="font-size: 300%">{{
                iconWeatherSelection(dailyAfternoon)
              }}</span>
              <br />
              <div style="font-size: large">
                {{ dailyAfternoon }}
              </div>
            </div>
          </div>
          <!-- night -->
          <div class="col s12 m12 l2">
            <div class="center" style="color: white; margin-top: 90px">
              <div style="font-size: x-large">Night</div>
              <span class="material-icons-round" style="font-size: 300%">{{
                iconWeatherSelection(dailyNight)
              }}</span>
              <br />
              <div style="font-size: large">
                {{ dailyNight }}
              </div>
            </div>
          </div>
        </div>

        <!-- ----- -->
      </div>
    </div>
    <br />
  </body>
  <footer></footer>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // basic
      location: [],
      locationNameList: [],
      generalForecast: [],
      headerToken: {},
      dataTypes: [],

      locationIdSave: "",
      todayDateSave: "",
      locationDropdown: "",

      // loading animation
      loading: false,

      // dashboard display
      minTemp: "",
      maxTemp: "",
      dailySignificantWeather: "",
      dailyMorning: "",
      dailyAfternoon: "",
      dailyNight: "",
      state: "",
      district: "",
      todayDateDisplay: "",
    };
  },
  methods: {
    locationSelected(a) {
      // close the modal after location is selected
      let elem = document.getElementById("modalLocation");
      let instance = window.M.Modal.getInstance(elem);
      instance.close();

      this.loading = true;

      this.generalForecast = [];

      const result = this.location.find(({ name }) => name === a);
      this.locationIdSave = result.id;

      localStorage.setItem("locationIdSave", result.id);

      this.generalForecastFunc();
    },
    generalForecastFunc() {
      axios
        .get(
          "https://api.met.gov.my/v2/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=" +
            this.locationIdSave +
            "&start_date=" +
            this.todayDateSave +
            "&end_date=" +
            this.todayDateSave,
          {
            headers: this.headerToken,
          }
        )
        .then((res) => {
          let resultsLength = res.data.results.length;
          // console.log(resultsLength);
          for (let j = 0; j < resultsLength; j++) {
            this.generalForecast.push(res.data.results[j]);
          }
          // this.temp = this.generalForecast[0].value;
          this.loading = false;
        })
        .then(() => {
          this.dailyMorning = this.generalForecast.find(
            ({ datatype }) => datatype === "FGM"
          ).value;
          this.dailyAfternoon = this.generalForecast.find(
            ({ datatype }) => datatype === "FGA"
          ).value;
          this.dailyNight = this.generalForecast.find(
            ({ datatype }) => datatype === "FGN"
          ).value;
          this.maxTemp = this.generalForecast.find(
            ({ datatype }) => datatype === "FMAXT"
          ).value;
          this.minTemp = this.generalForecast.find(
            ({ datatype }) => datatype === "FMINT"
          ).value;
          this.dailySignificantWeather = this.generalForecast.find(
            ({ datatype }) => datatype === "FSIGW"
          ).value;
          this.state = this.generalForecast[0].locationrootname;
          this.district = this.generalForecast[0].locationname;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    numberSuffix(i) {
      let j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return i + "st";
      }
      if (j == 2 && k != 12) {
        return i + "nd";
      }
      if (j == 3 && k != 13) {
        return i + "rd";
      }
      return i + "th";
    },
    iconWeatherSelection(a) {
      if (a === "No rain") {
        return "cloud_done";
      } else if (a === "Isolated rain") {
        return "water_drop";
      } else if (a === "Isolated thunderstorms") {
        return "thunderstorm";
      } else if (a === "Widespread thunderstorms") {
        return "thunderstorm";
      } else if (a === "Scattered thunderstorms") {
        return "thunderstorm";
      } else {
        return "warning";
      }
    },
  },
  mounted() {
    window.M.AutoInit();

    const nowDate = new Date();
    this.todayDateSave =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();

    this.todayDateDisplay =
      this.numberSuffix(nowDate.getDate()) +
      " " +
      nowDate.toLocaleString("default", { month: "long" }) +
      ", " +
      nowDate.getFullYear();

    this.headerToken = {
      Authorization: process.env.VUE_APP_TOKEN_AUTH,
    };

    let locationHistory = localStorage.getItem("locationIdSave");
    if (locationHistory) {
      this.locationIdSave = locationHistory;
      this.generalForecastFunc();
    }

    let URL1 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT";
    let URL2 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=50";
    let URL3 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=100";
    let URL4 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=150";
    let header = {
      headers: this.headerToken,
    };

    const promise1 = axios.get(URL1, header);
    const promise2 = axios.get(URL2, header);
    const promise3 = axios.get(URL3, header);
    const promise4 = axios.get(URL4, header);

    Promise.all([promise1, promise2, promise3, promise4])
      .then((res) => {
        for (let i = 0; i < 4; +i++) {
          let resultsLength = res[i].data.results.length;
          // console.log(resultsLength);
          for (let j = 0; j < resultsLength; j++) {
            this.location.push(res[i].data.results[j]);
            this.locationNameList.push(res[i].data.results[j].name);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

<style>
.simple-typeahead-list-item-text {
  color: #43a047;
  font-smooth: always;
  font-weight: 600;
}
input#typeahead_id.simple-typeahead-input {
  color: white;
}
body {
  width: 100%;
  height: 100vh;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>