<template>
  <div id="kanbanApp">
    <div class="tit_board">
      <h1>히오의 칸반보드٩( ᐛ )و</h1>
    </div>
    <div class="cont_board">
      <div class="cont_memobox">
        <h2 class="tit_memobox">MEMO</h2>
        <input type="text" v-if="memoMode ==='add'" class="input_memo" v-model="memoInput" @keypress.enter="addNewMemo()" placeholder="메모 내용 입력">
        <input type="text" v-else class="input_memo" v-model="memoInput" @keypress.enter="editMemo()" placeholder="메모 내용 입력">
        <div class="list_memo">
          <memo v-for="(memo, id) in activeMemoList" :label="memo.label" v-bind:key="id"
            @componentClick="toggleMemoState(memo)"
            @editBtnClick="readyToEditMemo(memo)"
            @deleteBtnClick="deleteMemo(memo)"
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
      <Kanban :stages="statuses" :blocks="blocks" @updateBlock="onUpdateBlock">
        <div v-for="stage in statuses" :slot="stage" :key="stage">
          <h2>{{ stage }}</h2>
        </div>
        <div v-for="item in blocks" :slot="item.id" :key="item.id">
          <div class="cont_dday">
            <span class="txt_dday" v-if="item.dDay !== ''">D</span><span class="txt_ddate">{{ item.dDay }}</span>
          </div>
          <div class="cont_text_item">
            <p class="txt_name">{{ item.name }}</p>
            <p class="txt_duedate">{{ item.startDate }} ~ {{ item.endDate }}</p>
            <p class="txt_task">{{ item.task }}</p>
            <div class="cont_block_btns">
              <button type="button" class="btn_edit_block" @click.prevent="() => readyToEditBlock(item)">수정</button>
              <button type="button" class="btn_delete_block" @click.prevent="() => deleteBlock(item)">삭제</button>
            </div>
          </div>
        </div>
      </Kanban>
      <div class="cont_rightbox">
        <div class="cont_taskbox">
          <h2 class="tit_input">Add Task</h2>
          <input type="text" class="text_input_task input_name" v-model="nameInput" placeholder="담당자">      
          <input type="date" class="text_input_task input_startdate" v-model="startDateInput" placeholder="시작 날짜">      
          <input type="date" class="text_input_task input_enddate" v-model="endDateInput" placeholder="종료 날짜">      
          <textarea class="text_input_task input_task" v-model="taskInput" placeholder="업무 내용"></textarea>
          <button v-if="mode === 'add'" type="button" class="btn_taskbox btn_addtask" @click.prevent="() => addBlock()">등록 하기</button>
          <button v-else type="button" class="btn_taskbox btn_edittask" @click.prevent="() => editBlock()">수정 하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-console: "off" */
import Kanban from './components/Kanban';
import Memo from './components/Memo';

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
      mode: 'add',
      blocks: [],
      editedId: -1,
      nameInput: null,
      startDateInput: null,
      endDateInput: null,
      taskInput:null,
      dDay: null,
      // 메모
      memoInput: null,
      memoMode: 'add',
      editedMemoId: -1,
      memoList: [],
      currentState: 'all',
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
      endDate = endDate === null ? null : new Date(endDate).getTime();
      let distance = endDate === null ? '' : Math.floor((nowDate - endDate)/(1000*60*60*24));

      if(distance === 0) {
        distance = `-${distance}`;
      } else if(distance > 0) {
        distance = `+${distance}`;
      }

      return distance;
    },

    addBlock: function () {
      if(this.taskInput === null){
        alert("메모를 입력합써!");
      } else {
        this.blocks.push({
          id: this.blocks.length,
          name: this.nameInput,
          startDate: this.startDateInput,
          endDate: this.endDateInput,
          task: this.taskInput,
          dDay: this.countdate(this.endDateInput),
          status: 'todo',
        });
      }
      
      this.resetBlock();
      this.saveStorage('blocks', this.blocks);
    },
    
    resetBlock() {
      this.nameInput = null,
      this.startDateInput = null,
      this.endDateInput = null,
      this.taskInput = null
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

    readyToEditBlock: function(block) {
      this.mode = 'edit';
      const { id: editedId, name: nameInput, startDate: startDateInput, endDate: endDateInput, task: taskInput } = block;
      Object.assign(this, { editedId, nameInput, startDateInput, endDateInput, taskInput });
    },

    editBlock: function() {
      const currentEditedBlock = {
        name: this.nameInput,
        startDate: this.startDateInput,
        endDate: this.endDateInput,
        task: this.taskInput,
        dDay: this.countdate(this.endDateInput)
      };
      
      this.blocks.some((block) => {
        const isEditedBlock = block.id === this.editedId;
        if(isEditedBlock) {
          Object.assign(block, currentEditedBlock);
        }
        return isEditedBlock;
      });
      
      this.resetBlock();
      this.saveStorage('blocks', this.blocks);
      this.editedId = -1;
      this.mode = 'add';
    },

    deleteBlock: function(block) {
      this.blocks.splice(this.blocks.indexOf(block), 1);
      this.saveStorage('blocks', this.blocks);
    },
    
    // 메모
    addNewMemo() {
      if(this.memoInput === null){
        alert("메모를 입력합써!");
      } else{
          this.memoList.push({
          id: this.memoList.length,
          label: this.memoInput,
          state: 'active'
        });
      
      this.resetMemo();
      this.saveStorage('memoList', this.memoList);
      }
    },

    resetMemo() {
      this.memoInput = null;
    },

    readyToEditMemo: function(memo) {
      this.memoMode = 'edit';
      const {id: editedMemoId, label: memoInput} = memo;
      Object.assign(this, {editedMemoId, memoInput});
    },

    editMemo: function() {
      const currentEditedMemo = {
        label: this.memoInput
      };
      this.memoList.some((memo) => {
        const isEditedMemo = memo.id === this.editedMemoId;
        if(isEditedMemo) {
          Object.assign(memo, currentEditedMemo);
        }
        return isEditedMemo;
      });
      
      this.resetMemo();
      this.saveStorage('memoList', this.memoList);
      this.editedMemoId = -1;
      this.memoMode = 'add';
    },

    deleteMemo(memo) {
      this.memoList.splice(this.memoList.indexOf(memo), 1);
      this.saveStorage('memoList', this.memoList);
    },

    changeCurrentState(state) {
      this.currentState = state;
    },

    toggleMemoState(memo) {
      memo.state = memo.state === 'active' ? 'done' : 'active';
      console.log(memo.state);
      const updatedMemo = this.memoList.find(m => m.id === memo.id);
      this.updateStorage(memo.id, updatedMemo, 'memoList', this.memoList);
    },

    // 공통
    saveStorage: function(key, data) {
      const currentList = JSON.stringify(data);
      localStorage.setItem(key, currentList);
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

<style>
  @import './assets/kanban.css';
</style>

