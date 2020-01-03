<template>
  <div class="cont_memo">
    <button class="item_memo" :class="{done: label != ''}" @click="clickButton">
      {{ label }}
    </button>
    <div class="cont_memo_btns">
      <button type="button" class="btn_edit_memo" @click="clickEditBtn">수정</button>
      <button type="button" class="btn_delete_memo" @click="clickDeleteBtn">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['label'],
  methods: {
    clickButton() {
      this.$emit('componentClick');
    },
    clickEditBtn() {
      this.$emit('editBtnClick');
    },
    clickDeleteBtn() {
      this.$emit('deleteBtnClick');
    }
  }
};
</script>
