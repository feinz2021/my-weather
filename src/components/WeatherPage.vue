<template>
  <div class="container">
    <button class="btn" @click="getGeneralForecast()">General Forecast</button>
    <button class="btn" @click="getDataTypes()">Get Data Types</button>
    <br />

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
          <td>{{ id.attributes }}</td>
        </tr>
      </tbody>
    </table>

    <table>
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
    </table>

    <table>
      <thead>
        <tr>
          <th>Location ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="locationID in location" v-bind:key="locationID">
          <td>{{ locationID.id }}</td>
          <td>{{ locationID.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      location: [],
      generalForecast: [],
      headerToken: {},
      dataTypes: [],
    };
  },
  methods: {
    getGeneralForecast() {
      axios
        .get(
          "https://api.met.gov.my/v2/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:246&start_date=2022-06-21&end_date=2022-06-21",
          {
            headers: this.headerToken,
          }
        )
        .then((res) => {
          for (let i = 0; i < 4; +i++) {
            let resultsLength = res.data.results.length;
            console.log(resultsLength);
            for (let j = 0; j < resultsLength; j++) {
              this.generalForecast.push(res.data.results[j]);
            }
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
          for (let i = 0; i < 4; +i++) {
            let resultsLength = res.data.results.length;
            console.log(resultsLength);
            for (let j = 0; j < resultsLength; j++) {
              this.dataTypes.push(res.data.results[j]);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    window.M.AutoInit();

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
    // const promise5 = axios.get(URL5, header);

    Promise.all([promise1, promise2, promise3, promise4])
      .then((res) => {
        for (let i = 0; i < 4; +i++) {
          let resultsLength = res[i].data.results.length;
          console.log(resultsLength);
          for (let j = 0; j < resultsLength; j++) {
            this.location.push(res[i].data.results[j]);
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
</style>