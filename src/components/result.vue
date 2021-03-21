<template>
  <div class="result-wrapper" v-if="data.total">
    <h1 class="title">{{ `Thanks, ${name}!` }}</h1>
    <div class="results">
      {{ `You responded correctly to ${data.correct} out of ${data.total} questions.` }}
    </div>
    <button @click="retry()">Try another</button>
  </div>
  <div v-else>
   <loading></loading>
  </div>
</template>

<script>
import loading from "./loading.vue";

export default {
  name: "result",
  components: {
    "loading": loading,
  },
  emits: ["changeView"],
  props: {
    data: {
      required: true
    },
    quizId: {
      required: true
    },
    name: {
      default: ""
    }
  },

  methods: {
    retry: function () {
      let userData = {
        "view": "quiz-select"
      };

      localStorage.name = this.name;

      this.$emit("changeView", userData);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/style/_variables.scss";
.title {
  padding: 0 20px;
}

.results {
  font-size: $m-text-size;
  padding: 20px;

  @media (min-width: $d-breakpoint) {
    font-size: $d-text-size;
  }
}

</style>
