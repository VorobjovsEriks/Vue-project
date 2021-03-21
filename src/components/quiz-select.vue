<template>
  <div class="quiz-select-wrapper" v-if="data">
    <h1 class="title">Technical task</h1>
    <label>
      <input id="userName" type="text" @input="removeError()" v-model="name" placeholder="Enter yout name">
    </label>
    <label>
      <select id="userQuiz" v-model="quizId">
        <option v-for="quiz in data" :value="quiz.id" :key="quiz.id">
          {{ quiz.title }}
        </option>
      </select>
    </label>
    <button id="startQuiz" @click="startQuiz()">Start</button>
    <div class="error-container">
      <span class="error-message" v-if="error">
        {{ error }}
      </span>
    </div>
  </div>
  <div v-else>
    <loading></loading>
  </div>
</template>

<script>
import loading from "./loading.vue";

export default {
  name: "quizSelect",
  components: {
    "loading": loading,
  },
  data() {
    return {
      name: null,
      error: null,
      quizId: null,
    };
  },
  mounted(){
    this.hasName();
  },
  props: {
    data: {
      required: true
    },
  },
  methods: {
    startQuiz: function () {
      if (!this.name) {
        this.error = "please enter a name to start your quiz";
        return;
      }
      if (!this.quizId) {
        this.error = "please select quiz";
        return;
      }

      let userData = {
        "id": this.quizId,
        "name": this.name,
        "view": "quiz"
      };

      this.$emit("changeView", userData);
    },
    removeError: function () {
      this.error = null;
    },
    hasName: function (){
      if(localStorage.name) {
        this.name = localStorage.name;
      }
    }
  },
};
</script>

<style lang="scss">
@import "../assets/style/_variables.scss";

.quiz-select-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 10%;

  #startQuiz {
    max-width: 250px;
    margin: 15px auto;
  }
}

.title {
  font-size: $m-title-size;

  @media (min-width: $d-breakpoint) {
    font-size: $d-title-size;
  }
}

</style>
