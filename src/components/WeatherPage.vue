<template>
  <body
    style="
      background-image: linear-gradient(to bottom right, #80cbc4, #e0f2f1);
      position: absolute;
    "
  >
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
      <!-- <button class="btn" @click="getGeneralForecast()">General Forecast</button>
    <button class="btn" @click="getDataTypes()">Get Data Types</button>
    <br /> -->
      <!-- Modal Structure -->
      <div id="modalLocation" class="modal">
        <div class="modal-content">
          <h4>Enter Location</h4>
          <!-- searchbox -->
          <vue3-simple-typeahead
            id="typeahead_id"
            placeholder="Type Here..."
            :items="this.locationNameList"
            :minInputLength="1"
            @selectItem="locationSelected"
          >
          </vue3-simple-typeahead>
          <label id="typeahead_id">Type Here⬆️</label>
        </div>
      </div>

      <div
        class="card-panel"
        style="
          margin-top: 40px;
          background-image: linear-gradient(to bottom right, #43a047, #a5d6a7);
        "
      >
        <!-- {{ temp }} -->

        <!-- <span class="material-icons">cloud</span> -->
        <!-- Modal Trigger -->

        <div class="row">
          <!-- temperature -->
          <div class="col s12 m12 l3">
            <div
              class="modal-trigger"
              style="cursor: pointer; color: white"
              href="#modalLocation"
            >
              <div class="center" style="font-size: 600%">{{ maxTemp }}°</div>
              <div class="center" style="font-size: 400%">{{ minTemp }}°</div>
            </div>
          </div>

          <!-- location & time -->
          <div class="col s12 m12 l3">
            <div
              class="center"
              id="district"
              style="color: white; font-size: x-large; margin-top: 20px"
            >
              {{ district }},
            </div>
            <div
              class="center"
              id="state"
              style="color: white; font-size: large"
            >
              {{ state }}
            </div>
            <div class="center" style="color: white; margin-top: 20px">
              {{ todayDateDisplay }}
            </div>
            <div
              class="center"
              style="color: white; margin-top: 20px; font-size: large"
            >
              <span class="material-icons-round">warning</span>
              <br />
              {{ dailySignificantWeather }}
            </div>
          </div>

          <!-- morning -->
          <div class="col s12 m12 l2">
            {{ dailyMorning }}
          </div>
          <!-- afternoon -->
          <div class="col s12 m12 l2">
            {{ dailyAfternoon }}
          </div>
          <!-- night -->
          <div class="col s12 m12 l2">
            {{ dailyNight }}
          </div>
        </div>

        <!-- ----- -->
      </div>
    </div>
  </body>
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
      // temperature: "0",
      minTemp: "",
      maxTemp: "",
      dailySignificantWeather: "",
      dailyMorning: "",
      dailyAfternoon: "",
      dailyNight: "",
      state: "",
      district: "",
      todayDateDisplay: "",

      temp: "",
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
  },
  mounted() {
    const a = process.env.VUE_APP_TESTING;
    console.log(a);
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
      Authorization: `METToken 79a6cd59e081e56a1aea2335888829e118dfa29b`,
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