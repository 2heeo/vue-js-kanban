<template>
  <div id="kanbanApp">
    <div class="tit_kanban">
      <h1>히오의 칸반보드٩( ᐛ )و</h1>
    </div>
    <Kanban :stages="statuses" :blocks="blocks" @update-block="updateBlock">
      <div v-for="stage in statuses" :slot="stage" :key="stage">
        <h2>
          {{ stage }}
          <a>+</a>
        </h2>
      </div>
      <div v-for="item in blocks" :slot="item.id" :key="item.id">
        <div>
          <strong>id:</strong> {{ item.id }}
        </div>
        <div>
          {{ item.title }}
        </div>
      </div>
      <div v-for="stage in statuses" :key="stage" :slot="`footer-${stage}`">
          <a href="" @click.prevent="() => addBlock(stage)">+ Add new block</a>
      </div>
    </Kanban>
  </div>
</template>

<script>
import faker from 'faker';
import { debounce } from 'lodash';
import Kanban from './components/Kanban';

export default {
  name: 'app',
  components: {
    Kanban,
  },
  data() {
    return {
      statuses: ['on-hold', 'in-progress', 'needs-review', 'approved'],
      blocks: [],
    };
  },
  mounted() {
    for (let i = 0; i <= 10; i += 1) {
      this.blocks.push({
        id: i,
        status: this.statuses[Math.floor(Math.random() * 4)],
        title: faker.company.bs(),
      });
    }
  },

  methods: {
    updateBlock: debounce(function (id, status) {
      this.blocks.find(b => b.id === Number(id)).status = status;
    }, 500),
    addBlock: debounce(function (stage) {
      this.blocks.push({
        id: this.blocks.length,
        status: stage,
        title: faker.company.bs(),
      });
    }, 500),
  },
};
</script>

<style lang="scss">
  @import './assets/kanban.css';
</style>


<style lang="scss">
// 기존꺼
* {box-sizing: border-box}
body {background: #33363d;color: white;font-family: 'Lato';font-weight: 300;line-height: 1.5;-webkit-font-smoothing: antialiased}
.drag-column .drag-column-header > div {width: 100%}
.drag-column .drag-column-header > div h2 > a {float: right}
.drag-column .drag-column-footer > div {margin-left: 10px}
.drag-column .drag-column-footer > div a {text-decoration: none;color: white}
.drag-column .drag-column-footer > div a:hover {text-decoration: underline}
.drag-column-on-hold .drag-column-header, .drag-column-on-hold .is-moved, .drag-column-on-hold .drag-options {background: #fb7d44}
.drag-column-in-progress .drag-column-header, .drag-column-in-progress .is-moved, .drag-column-in-progress .drag-options {background: #2a92bf}
.drag-column-needs-review .drag-column-header, .drag-column-needs-review .is-moved, .drag-column-needs-review .drag-options {background: #f4ce46}
.drag-column-approved .drag-column-header, .drag-column-approved .is-moved, .drag-column-approved .drag-options {background: #00b961}
.section {padding: 20px;text-align: center}
.section a {color: white;text-decoration: none;font-weight: 300}
.section h4 {font-weight: 400}
.section h4 a {font-weight: 600}
</style>