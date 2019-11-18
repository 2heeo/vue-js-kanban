<template>
  <button class="item_memo" @click="clickButton">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: ['label'],
  methods: {
    clickButton() {
      this.$emit('componentClick');
    }
  }
};
</script>
