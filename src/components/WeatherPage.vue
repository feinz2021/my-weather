<template>
  <div class="container">
    <pre>{{ temp[3] }}</pre>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      temp: [],
    };
  },
  mounted() {
    window.M.AutoInit();
    // axios
    //   .get(
    //     // "https://api.met.gov.my/v2/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:237&start_date=2022-06-21&end_date=2022-06-21",
    //     "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=163",
    //     {
    //       headers: {
    //         Authorization: `METToken 79a6cd59e081e56a1aea2335888829e118dfa29b`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     this.temp = res;
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    let URL1 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT";
    let URL2 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=50";
    let URL3 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=100";
    let URL4 =
      "https://api.met.gov.my/v2.1/locations?locationcategoryid=DISTRICT&offset=150";
    let header = {
      headers: {
        Authorization: `METToken 79a6cd59e081e56a1aea2335888829e118dfa29b`,
      },
    };

    const promise1 = axios.get(URL1, header);
    const promise2 = axios.get(URL2, header);
    const promise3 = axios.get(URL3, header);
    const promise4 = axios.get(URL4, header);
    // const promise5 = axios.get(URL5, header);

    Promise.all([promise1, promise2, promise3, promise4])
      .then((res) => {
        this.temp = res;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

<style>
</style>