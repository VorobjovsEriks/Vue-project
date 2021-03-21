<template>
  <div class="content">
    <div class="error-container" v-if="this.error">
      <span class="error-message">
        {{ error }}
      </span>
    </div>
    <component
        :is="view"
        :data="data"
        :quizId="quizId"
        :name="name"
        @changeView="changeView"
        @showError="showError"
    >
    </component>
  </div>
</template>

<script>
import quiz from "./components/quiz.vue";
import result from "./components/result.vue";
import quizSelect from "./components/quiz-select.vue";
import ErrorService from "./Services/ErrorService";
import axios from "axios";

export default {
  name: "QuizApp",
  emits: ["changeView", "showError"],
  data() {
    return {
      data: null,
      apiUrl: "https://printful.com/test-quiz.php",
      view: "quiz-select",
      name: null,
      quizId: null,
      error: null,
    };
  },
  components: {
    "quiz": quiz,
    "result": result,
    "quiz-select": quizSelect,
  },
  created() {
    this.getData();
  },
  methods: {
    getData: async function (action = "quizzes") {
      await axios.get(this.apiUrl + "?action=" + action)
          .then((response) => {
            this.data = response.data;
          })
          .catch((err) => {
            ErrorService.onError(err);
            this.showError();
          });
    },
    showError: function () {
      this.error = "Something went wrong please refresh the page and try again.";
      // ErrorService.displayErrorAlert(this.error)
      this.view = "";
    },
    changeView: function (data) {
      let action;
      if (data.view === "quiz") {
        action = "questions&quizId=" + data.id;
        this.data = this.getData(action);
        this.quizId = data.id;
      }
      if (data.view === "result") {
        action = "submit&quizId=" + this.quizId + data.answers;
        this.data = this.getData(action);
      }
      if (data.view === "quiz-select") {
        this.data = this.getData();
      }
      if (data.name) {
        this.name = data.name;
      }

      this.view = data.view;
    }
  }
};
</script>

<style lang="scss">
@import "./assets/style/app.scss";
</style>
