<template>
  <div class="cont_kanban">
    <ul class="list_kanban">
      <li v-for="stage in stages" class="item_kanban" :class="{['item_' + stage]: true}" :key="stage">
        <span class="tit_status">
          <slot :name="stage">
            <h2>{{ stage }}</h2>
          </slot>
        </span>
        <ul class="wrap_item" ref="list" :data-status="stage">
          <li class="item_task"
            :class="{item_asap : block.dDay !== '' && (block.dDay === 0 || block.dDay > 0) && block.status !== 'done'}" 
            v-for="block in getBlocks(stage)" :data-block-id="block.id" :key="block.id">
            <slot :name="block.id">
              <strong>{{ block.status }}</strong>
              <div>{{ block.id }}</div>
            </slot>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint no-console: "off" */
import dragula from 'dragula';

export default {
  name: 'Kanban',

  props: {
      stages: {},
      blocks: {},
    },
    data() {
      return {

      };
    },

    computed: {
      localBlocks() {
        return this.blocks;
      },
    },

    methods: {
      getBlocks(status) {
        return this.localBlocks.filter(block => block.status === status);
      },
    },

    updated() {
      this.drake.containers = this.$refs.list;
    },

    mounted() {
      this.drake = dragula(this.$refs.list)
        .on('drag', (el) => {
          el.classList.add('is_moving');
        })
        .on('drop', (block, list) => {
          let index = 0;
          for (index = 0; index < list.children.length; index += 1) {
            if (list.children[index].classList.contains('is_moving')) break;
          }
          
          block.classList.remove('is_moving');

          window.setTimeout(() => {
            block.classList.add('is_moved');
            window.setTimeout(() => {
              block.classList.remove('is_moved');
              this.$emit('updateBlock', block.dataset.blockId, list.dataset.status);
            }, 100);
          }, 100);
        })
    }
	};
</script>
