<template>
  <body style="background-color: green; position: absolute">
    <div
      v-if="loading === true"
      style="
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);;
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

      <div class="card-panel" style="margin-top: 40px">
        {{ temp }}

        <span class="material-icons">cloud</span>
        <!-- Modal Trigger -->
        <a
          class="waves-effect waves-light btn modal-trigger"
          href="#modalLocation"
          >Modal</a
        >

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

        <!-- generalforecast -->
        <table>
          <thead>
            <tr>
              <th>locationrootname</th>
              <th>locationname</th>
              <th>date</th>
              <th>datatype</th>
              <th>value</th>
              <th>latitude</th>
              <th>longitude</th>
              <th>attributes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="id in generalForecast" v-bind:key="id">
              <td>{{ id.locationrootname }}</td>
              <td>{{ id.locationname }}</td>
              <td>{{ id.date }}</td>
              <td>{{ id.datatype }}</td>
              <td>{{ id.value }}</td>
              <td>{{ id.latitude }}</td>
              <td>{{ id.longitude }}</td>
              <td>{{ id.attributes.when }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- datatype -->
      <!-- <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>datasetid</th>
          <th>datacategoryid</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="id in dataTypes" v-bind:key="id">
          <td>{{ id.id }}</td>
          <td>{{ id.name }}</td>
          <td>{{ id.datasetid }}</td>
          <td>{{ id.datacategoryid }}</td>
        </tr>
      </tbody>
    </table> -->

      <!-- location -->
      <!-- <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>locationcategoryid</th>
          <th>locationrootid</th>
          <th>latitude</th>
          <th>longitude</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="id in location" v-bind:key="id">
          <td>{{ id.id }}</td>
          <td>{{ id.name }}</td>
          <td>{{ id.locationcategoryid }}</td>
          <td>{{ id.locationrootid }}</td>
          <td>{{ id.latitude }}</td>
          <td>{{ id.longitude }}</td>
        </tr>
      </tbody>
    </table> -->
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

      // modalClose
      modalClose: "",

      // dashboard display
      temperature: 0,
      minTemp: 0,
      maxTemp: 0,
      locationDashboard: "",
      dailySignificantWeather: "",
      dailyMorning: "",
      dailyAfternoon: "",
      dailyNight: "",

      temp: "",
    };
  },
  methods: {
    locationSelected(a) {
      let elem = document.getElementById("modalLocation");
      let instance = window.M.Modal.getInstance(elem);
      instance.close();

      this.loading = true;

      this.generalForecast = [];

      const result = this.location.find(({ name }) => name === a);
      this.locationIdSave = result.id;
      // console.log(result.id);

      localStorage.setItem("locationIdSave", result.id);

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
        .catch((error) => {
          console.error(error);
        });
    },
    getGeneralForecast() {
      axios
        .get(
          "https://api.met.gov.my/v2/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:246&start_date=2022-06-21&end_date=2022-06-21",
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
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDataTypes() {
      axios
        .get("https://api.met.gov.my/v2.1/datatypes", {
          headers: this.headerToken,
        })
        .then((res) => {
          let resultsLength = res.data.results.length;
          // console.log(resultsLength);
          for (let j = 0; j < resultsLength; j++) {
            this.dataTypes.push(res.data.results[j]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
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

    this.headerToken = {
      Authorization: `METToken 79a6cd59e081e56a1aea2335888829e118dfa29b`,
    };

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