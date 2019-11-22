<template>
  <div id="kanbanApp">
    <div class="tit_kanban">
      <h1>히오의 칸반보드٩( ᐛ )و</h1>
    </div>
    <Kanban :stages="statuses" :blocks="blocks" @updateBlock="onUpdateBlock">
      <div v-for="stage in statuses" :slot="stage" :key="stage">
        <h2>{{ stage }}</h2>
      </div>
      <div v-for="item in blocks" :slot="item.id" :key="item.id">
        <div class="cont_dday">
          <strong class="txt_dday">D-<span class="txt_ddate">{{ item.dDay }}</span>
          </strong>
        </div>
        <div>
          <p><strong>담당자 : </strong>{{ item.name }}</p>
          <p><strong>기간 : </strong>{{ item.startDate }} ~ {{ item.endDate }}</p>
          <p><strong>업무 : </strong>{{ item.task }}</p>
        </div>
      </div>
    </Kanban>
    <div class="cont_boxetc">
      <div class="cont_input">
        <h2 class="tit_input">Add Task</h2>
        <input type="text" class="input_name" v-model="nameInput" placeholder="담당자">      
        <input type="date" class="input_startdate" v-model="startDateInput" placeholder="시작 날짜">      
        <input type="date" class="input_enddate" v-model="endDateInput" placeholder="종료 날짜">      
        <input type="text" class="input_task" v-model="taskInput" placeholder="업무 내용">      
        <button type="button" class="btn_addtask" @click.prevent="() => addBlock()">등록 하기</button>
      </div>
      <div class="cont_memo">
        <h2 class="tit_memobox">MEMO</h2>
        <input type="text" class="input_memo" v-model="memoInput" @keypress.enter="addNewMemo()" placeholder="메모 내용">      
        <div class="list_memo">
          <memo v-for="(memo, index) in activeMemoList"
            :label="memo.label" v-bind:key="index"
            @componentClick="toggleMemoState(memo)"
            />
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
/* eslint no-console: "off" */
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
      nameInput: '',
      startDateInput: '',
      endDateInput: '',
      taskInput:'',
      dDay: '',
      // 메모
      memoInput:'',
      memoList: [],
      currentState: 'active'
    };
  },

  mounted() {
    const blocks = localStorage.getItem('blocks');
    const memoList = localStorage.getItem('memoList');

    if (!blocks) {
      this.blocks = [];
    } else {
      this.blocks = JSON.parse(blocks);
    }

    if(!memoList) {
      this.memoList = [];
    } else {
      this.memoList = JSON.parse(memoList);
    }
  },

  computed: {
    // 메모
    activeMemoList() {
      return this.memoList.filter(memo => this.currentState === 'all' || memo.state === this.currentState);
    }
  },

  methods: {
    // 칸반
    countdate: function(endDate) {
      const nowDate = new Date().getTime();
      endDate = endDate === '' ? '' : new Date(endDate).getTime();
      const distance = endDate === '' ? '미정' : Math.floor((nowDate - endDate)/(1000*60*60*24)) * -1;
      
      return distance;
    },

    addBlock: function () {
      this.blocks.push({
        id: this.blocks.length,
        name: this.nameInput,
        startDate: this.startDateInput,
        endDate: this.endDateInput,
        task: this.taskInput,
        dDay: this.countdate(this.endDateInput),
        status: 'todo',
      });

      this.nameInput = '',
      this.startDateInput = '',
      this.endDateInput = '',
      this.taskInput = ''

      this.saveStorage('blocks', this.blocks);
    },

     updateBlockStatus: function (id, status) {
      this.blocks.find(b => b.id === Number(id)).status = status;
    },

    onUpdateBlock: function(id, status) {
      id = Number(id);
      this.updateBlockStatus(id, status);
      const updatedBlock = this.blocks.find(b => b.id === id);
      this.updateStorage(id, updatedBlock, 'blocks', this.blocks);
    },
    
    // 메모
    addNewMemo() {
      this.memoList.push({
        id: this.memoList.length,
        label: this.memoInput,
        state: 'active'
        });
      this.memoInput = '';
 
      this.saveStorage('memoList', this.memoList);
    },

    changeCurrentState(state) {
      this.currentState = state;
    },

    toggleMemoState(memo) {
      memo.state = memo.state === 'active' ? 'done' : 'active';
      
      const updatedMemo = this.memoList.find(m => m.id === memo.id);
      this.updateStorage(memo.id, updatedMemo, 'memoList', this.memoList);
    },

    // 공통
    saveStorage: function(key, data) {
      const currentBlocks = JSON.stringify(data);
      localStorage.setItem(key, currentBlocks);
    },
    updateStorage: function(id, item, key, data) {
      for(let i = 0; i < data.length; i++) {
          if(i === id) {                    
          data[i] = item;
          break;
        }
      }
      const stringifyData = JSON.stringify(Array.from(data));
      localStorage.setItem(key, stringifyData);
    }
  }
};
</script>

<style lang="scss">
  @import './assets/kanban.css';
</style>

