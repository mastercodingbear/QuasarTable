<template>
  <component :is="!inGroup ? 'Draggable' : 'div'"
    handle="strong"
    >
    <div>
      <strong class="move-handle" v-if="!inGroup">{{content}}</strong>
      <VueDraggableNext 
        class="dragArea"
        v-if="level > 1"
        :list="references" 
        :group="{ name: 'reference' }"
        v-bind="dragOptions"
        >
        <div 
          class="dragElement" 
          v-for="el in references"
          :key="elementId + ' ' + el.id" 
          type="transition" 
          name="flip-list">
          <p>{{ el.content }}</p>
          <group-element 
            v-if="el.level > 1"
            class="bg-gray-100 pl-5"
            :key="el.content" 
            :elementId="el.id" 
            :content="el.content" 
            :level="el.level" 
            :inGroup="el.inGroup" 
            :references="el.references" 
            :currentStructure="currentStructure" />
        </div>
      </VueDraggableNext>
    </div>
  </component>
</template>
<script>

// import Vue3DraggableResizable from 'vue3-draggable-resizable'
import { Draggable } from '@braks/revue-draggable';

//default styles
// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

import { VueDraggableNext } from 'vue-draggable-next'
export default {
  name: 'group-element',
  props: {
    elementId: {
      type: Number,
    },
    content: {
      type: String
    },
    level: {
      type: Number,
    },
    references: {
      required: true,
      type: Array,
    },
    currentStructure: {
      required: true,
      type: Array,
    },
    inGroup: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {
    VueDraggableNext,
    /* eslint-disable */
    // 'vue-draggable-resizable': VueDraggableResizable,
    // Vue3DraggableResizable,
    Draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        // disabled: false,
        ghostClass: 'ghost',
      }
    },

  },
  methods: {
    isInGroup() {
      this.currentStructure.forEach(element => {
        // console.log('content', this.content);
        // console.log('ungroup element', element.content);
        if(element.content == this.content) {
          return true;
        }
      });
      console.log(this.content);
      return false;
    },
  }
}
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  padding: 10px;
  outline: 1px dashed;
  background-color: khaki;
  display: flex;
  flex-wrap: wrap;
}
.dragElement {
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  width: min-content;
}
.move-handle {
  cursor: pointer;
}
.grid-move {
  transition: all 0.3s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
