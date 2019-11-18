// TODO-heeo.
// 1. 하단의 업무등록 버튼 따로 빼서 우측상단 input으로 데이터 받아오기(담당자,날짜,업무)
// 2. 디데이 계산
// 3. 담당자 썸네일
// 4. 드래드드랍시 .item_task:after 색상 부분 처리
// 5. 마크업 및 css 가이드화 및 필요없는 선언 삭제
// 6. DONE 처리 css 추가
// 7. dragula 클래스 수정 가능하다면 언더바적용

<template>
  <div id="kanbanApp">
    <div class="tit_kanban">
      <h1>히오의 칸반보드٩( ᐛ )و</h1>
    </div>
    <Kanban :stages="statuses" :blocks="blocks" @update-block="updateBlock">
      <div v-for="stage in statuses" :slot="stage" :key="stage">
        <h2>{{ stage }}</h2>
      </div>
      <div v-for="item in blocks" :slot="item.id" :key="item.id">
        <div class="cont_dday">
          <strong class="txt_dday">D-<span class="txt_ddate">{{ item.dDay }}</span>
          </strong>
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
    <div class="cont_boxetc">
      <div class="cont_input">
        <h2 class="tit_input">Add Task</h2>
        <input type="text" class="input_name" v-model="nameInput" placeholder="담당자">      
        <input type="date" class="input_startdate" v-model="startDateInput" placeholder="시작 날짜">      
        <input type="date" class="input_enddate" v-model="endDateInput" placeholder="종료 날짜">      
        <input type="text" class="input_task" v-model="taskInput" placeholder="업무 내용">      
        <button type="button" class="btn_addtask">등록 하기</button>
      </div>
      <div class="cont_memo">
        <h2 class="tit_memobox">MEMO</h2>
        <input type="text" class="input_memo" v-model="memoInput" @keyup.enter="addNewMemo" placeholder="메모 내용">      
        <div class="list_memo">
          <template v-for="memo in activeMemoList">
            <memo
              :label="memo.label" v-bind:key="memo"
              @componentClick="toggleMemoState(memo)"
              />
          </template>      
        </div>
        <div class="cont_btntype">
          <span class="desc_btntype">보기 방식 : </span>
          <button type="button" @click="changeCurrentState('active')" class="btn_viewtype" :class="{on:currentState === 'active'}" >할 일</button>
          <button type="button" @click="changeCurrentState('done')" class="btn_viewtype" :class="{on:currentState === 'done'}">완료</button>
          <button type="button" @click="changeCurrentState('all')" class="btn_viewtype" :class="{on:currentState === 'all'}">전체</button>
          <p class="desc_memo">* 클릭하면 완료/완료 취소 처리됨 *</p>
        </div>    
      </div>
    </div>
  </div>
</template>

<script>
import faker from 'faker';
import { debounce } from 'lodash';
import Kanban from './components/Kanban';
import Memo from './components/Memo'

export default {
  name: 'app',
  components: {
    Kanban,
    Memo
  },
  data() {
    return {
      // 칸반
      statuses: ['backlog', 'todo', 'doing', 'done'],
      blocks: [],
      // 메모
      memoInput:'',
      memoList: [],
      currentState: 'active',
      selected: undefined
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

  computed: {
    activeMemoList() {
      return this.memoList.filter(memo => this.currentState === 'all' || memo.state === this.currentState);
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

    changeCurrentState(state) {
      this.currentState = state;
    },
    addNewMemo() {
      this.memoList.push({
        label: this.memoInput,
        state: 'active'
        });
      this.memoInput = '';
    },
    toggleMemoState(memo) {
        memo.state = memo.state === 'active' ? 'done' : 'active';
    }
  }
};
</script>

<style lang="scss">
  @import './assets/kanban.css';
</style>
