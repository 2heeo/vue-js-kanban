// TODO-heeo.
// 1. 하단의 업무등록 버튼 따로 빼서 우측상단 input으로 데이터 받아오기(담당자,날짜,업무)
// 2. 디데이 계산
// 3. 담당자 썸네일
// 4. 드래드드랍시 .item_task:after 색상 부분 처리
// 5. 마크업 및 css 가이드화 및 필요없는 선언 삭제
// 6. DONE 처리 css 추가
// 7. dragula 클래스 수정 가능하다면 언더바적용
// 8. 우측하단 일반 메모 추가

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
        <div class="cont_dday">
          <strong class="txt_dday">D-<span class="txt_ddate">{{ item.dDay }}</span>
          </strong>
        </div>
        <div>
          <strong>id:</strong> {{ item.id }}
        </div>
        <div>
          <p><strong>담당자 : </strong>이히오</p>
          <p><strong>기간 : </strong>2019.00.00 ~ 2019.00.00</p>
          <p><strong>업무 : </strong>{{ item.title }}</p>
        </div>
      </div>
      <div v-for="stage in statuses" :key="stage" :slot="`footer_${stage}`">
          <a href="" @click.prevent="() => addBlock(stage)">+ 업무 등록하기</a>
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
      statuses: ['backlog', 'todo', 'doing', 'done'],
      blocks: [],
    };
  },
  mounted() {
    for (let i = 0; i <= 10; i += 1) {
      this.blocks.push({
        id: i,
        status: this.statuses[Math.floor(Math.random() * 4)],
        title: faker.company.bs(),
        dDay: this.countdate(),
      });
    }
  },

  methods: {
    countdate: function() {
      var countDate = faker.date.recent().getTime();
      var currentDate = faker.date.recent().getTime();
      var distance = countDate - currentDate;      
      
      return Math.floor(distance/(1000*60*60*24));
    },
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
