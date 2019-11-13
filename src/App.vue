<template>
  <div id="kanbanApp">
    <div class="tit_kanban">
      <h1>히오의 칸반보드٩( ᐛ )و</h1>
    </div>
    <Kanban/>
  </div>
</template>

<script>
import Kanban from './components/Kanban';

export default {
  name: 'App',

  components: {
    Kanban
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
  @import './assets/kanban.css';
</style>