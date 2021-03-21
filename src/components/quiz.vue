<template>
  <div class="quiz-wrapper">
    <div v-if="loading">
      <loading></loading>
    </div>
    <div v-else-if="data">
      <div class="progress-bar-wrapper">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="quiz__question">
        {{ data[currentQuestion].title }}
      </div>
      <div class="quiz__answers" v-if="answers">
        <div class="answer" v-for="answer in answers" :key="answer.id" :ref="'answer__'+answer.id"
             @click="selectAnswer(answer.id)">
          {{ answer.title }}
        </div>

      </div>
      <button class="submit-answer" v-if="finished" @click="finishQuiz()">
        Get results
      </button>
      <button class="submit-answer" v-else @click="nextQuestion()">
        Next
      </button>
      <div class="error-container">
        <span class="error-message" v-if="error">
          {{ error }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import loading from "./loading.vue";
import ErrorService from "@/Services/ErrorService";

export default {
  name: "quiz",
  components: {
    "loading": loading,
  },
  emits: ["changeView", "showError"],
  data() {
    return {
      apiUrl: "https://printful.com/test-quiz.php",
      error: null,
      currentQuestion: 0,
      answers: null,
      answeredIds: [],
      pendingAnswer: null,
      loading: true,
      questionCount: 0,
      finished: false,
      progress: 0,
    };
  },
  props: {
    data: {
      required: true
    },
    quizId: {
      required: true
    },
    name: {
      required: false
    }
  },
  methods: {
    nextQuestion: function () {
      if (this.pendingAnswer) {
        this.addAnswer();
        this.pendingAnswer = null;
        this.currentQuestion++;
        this.updateProgress();
      } else {
        this.error = "select an answer";
      }
    },
    getAnswers: async function () {
      await axios.get(this.apiUrl + "?action=answers&quizId=" + this.quizId + "&questionId="
          + this.data[this.currentQuestion].id)
          .then((response) => {
            this.answers = response.data;
          })
          .catch((err) => {
            ErrorService.onError(err);
            this.$emit("showError");
          });

      this.questionCount = this.data.length;
      this.loading = false;
    },
    selectAnswer: function (id) {
      if (this.error) {
        this.error = null;
      }

      for (let ans of document.getElementsByClassName("answer")) {
        ans.classList.remove("selected");
      }

      let selectedAnswer = `answer__${id}`;
      this.$refs[selectedAnswer].classList.add("selected");
      this.pendingAnswer = id;
    },
    finishQuiz: function () {
      this.addAnswer();
      let userData = {
        "id": this.quizId,
        "answers": this.answersToString(this.answeredIds),
        "view": "result"
      };

      this.$emit("changeView", userData);
    },
    addAnswer: function () {
      if (this.answeredIds.length < this.questionCount) {
        this.answeredIds.push(this.pendingAnswer);
      }
    },
    answersToString: function (answers) {
      let stringifiedAnswers = "";
      for (let answer of answers) {
        stringifiedAnswers = stringifiedAnswers + `&answers[]=${answer}`;
      }
      return stringifiedAnswers;
    },
    updateProgress: function () {
      this.progress = this.currentQuestion / this.questionCount * 100;
    }
  },
  watch: {
    data: function () {
      this.loading = true;
      this.getAnswers();
    },
    currentQuestion: function () {
      if (this.currentQuestion + 1 < this.questionCount) {
        this.loading = true;
        this.getAnswers();
      } else {
        this.loading = true;
        this.getAnswers();
        this.finished = true;
      }
    },
  }
};
</script>

<style lang="scss">
@import "../assets/style/_variables.scss";

.quiz-wrapper {
  padding: 15px;

  @media (min-width: $d-breakpoint) {
    min-width: 550px;
  }
}

.progress-bar-wrapper {
  width: calc(100% - 40px);
  border: 1px solid #e7be0a66;
  height: 10px;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);

  .progress {
    background: #e7be0a;
    height: 100%;
    transition: width ease-in 2s;
  }

  @media (min-width: $d-breakpoint) {
    width: calc(70% - 40px);
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.quiz {
  &__question {
    font-size: $m-text-size;
    padding: 10px 0;
    font-weight: bold;

    @media (min-width: $d-breakpoint) {
      font-size: $d-text-size;
    }
  }

  &__answers {
    display: flex;
    flex-wrap: wrap;
    max-width: 500px;
    margin: auto;

    .answer {
      width: 100%;
      max-width: 400px;
      height: auto;
      padding: 10px;
      background: $bg-yellow;
      color: $black;
      margin: 5px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 5px;
      font-size: $m-text-size;

      &.selected,
      &:hover {
        background: $bg-yellow-hover;
      }

      @media (min-width: $d-breakpoint) {
        max-width: 240px;
        font-size: $d-text-size;
      }
    }
  }
}

.submit-answer {
  max-width: 200px;
  font-size: $m-text-size;

  @media (min-width: $d-breakpoint) {
    font-size: $d-text-size;
  }
}

</style>
