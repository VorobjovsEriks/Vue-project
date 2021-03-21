import { createApp } from "vue";
import Swal from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import App from "./App.vue";


const app = createApp(App);

app.use(Swal);

app.mount("#app");
