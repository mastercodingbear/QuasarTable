<template>
  <component 
    :is="!inGroup ? 'Draggable' : 'div'"
    :handle="!inGroup ? 'strong' : null"
    :position="!inGroup ? position : null"
    :class="{
      'level1-class': level === 1, 
      'no-pointer-events': activeDrags, 
      'moving': activeDrags}"
    v-on="{ 
      start: !inGroup ? onStart : null, 
      stop: !inGroup ? onDrop : null,
      move: !inGroup ? onMove : null,
    }"
    :data-key="generatePath"
    >
    <component :is="!inGroup ? 'div' : 'v-fragment'">
      <strong 
        class="move-handle" 
        v-if="!inGroup" 
        :data-key="generatePath">
        {{ content + ' - id: ' + elementId + ', level: ' + level }}
      </strong>
      <VueDraggableNext 
        class="dragArea"
        v-if="level > 1"
        v-bind="dragOptions"
        v-model="getReferences" 
        :group="{ name: 'reference' }"
        :data-key="generatePath"
        @start="onDragStart"
        @end="onDragEnd"
        :class="{
          'no-pointer-events': dragCellFlag}"
        >
        <div 
          class="dragElement" 
          v-for="(el, index) in getReferences"
          :key="elementId + ' ' + el.id" 
          :data-key="generatePath + '-' + el.id + ':' + (index + 1)">
          <p 
            :data-key="generatePath + '-' + el.id + ':' + (index + 1)" 
            v-if="el.level === 1">
            {{ el.content }}
          </p>
          <group-element 
            v-if="el.level > 1"
            :key="el.content" 
            :elementId="el.id" 
            :content="el.content" 
            :level="el.level" 
            :inGroup="el.inGroup"
            :references="el.references"
            :path="generatePath"
            :index="index + 1"
            :position="el.position" />
        </div>
      </VueDraggableNext>
    </component>
  </component>
</template>
<script>
import { Draggable } from '@braks/revue-draggable';
import { VueDraggableNext } from 'vue-draggable-next'

import { useStore } from 'vuex'

export default {
  name: 'group-element',
  props: {
    elementId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    inGroup: {
      type: Boolean,
      default() {
        return false;
      }
    },
    references: {
      type: Array,
      required: true,
    },
    path: {
      // cell path
      type: String,
    },
    index: {
      // cell index in parent
      type: Number,
    },
    position: {
      // cell position
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
        };
      }
    },
  },
  data: (prop) => {
    const store = useStore();
    const structure = store.getters['table/getCellById']();
    return {
      // floating drag flag
      activeDrags: 0,
      dragCell: Object,
      // drag into flag
      dragCellFlag: 0,
      currentStructure: structure,
      store: store
    };
  },
  components: {
    VueDraggableNext,
    Draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost',
      }
    },
    generatePath() {
      return this.path + 
        (this.inGroup ? 
        '-' + this.elementId + ':' + this.index : 
        ':' + this.index);
    },
    getReferences: {
      get() {
        return this.references;
      },
      set(value) {
        this.store.dispatch('table/updateCellReferences', 
          {
            id: this.elementId, 
            references: value
          })
      }
    },
  },
  methods: {
    onStart() {
      this.activeDrags ++;
    },
    onMove(e) {
      // detect drag event onto other cell
      if (e.event.target.classList.contains('revue-draggable') || 
        e.event.target.classList.contains('dragArea') ||
        e.event.target.classList.contains('move-handle')
        ) {
        // TODO: preview
      }
    },
    onDrop(e) {
      this.activeDrags --;
      
      // update cell position
      const { x, y } = e.data;
      this.store.dispatch('table/updateCellPosition', {
        id: this.elementId, 
        position: {x: x, y: y}
      });

      // detect drag event onto other cell
      if (e.event.target.classList.contains('revue-draggable') || 
        e.event.target.classList.contains('dragArea') ||
        e.event.target.classList.contains('move-handle')
        ) {
        // draggedCell -> dragIntoCell
        // get path from dragIntoCell
        const dragIntoCellPath = e.event.target.attributes['data-key'].value;
        const dragIntoCellSteps = dragIntoCellPath.split('-');
        let dragIntoCell = this.findContentByPath(dragIntoCellPath, this.currentStructure);
        // get draggedCell by path
        let draggedCell = this.findContentByPath(this.generatePath, this.currentStructure);
        // clone cell
        let clone = JSON.parse(JSON.stringify(draggedCell));

        /**
         * Merge draggedCell into dragIntoCell
         */
        // exception: level 1 -> level 1 push reference itself
        if ( dragIntoCell.level === 1 ) {
          console.log('level 1 exception')
          let clone = JSON.parse(JSON.stringify(dragIntoCell));
          clone.inGroup = true;
          dragIntoCell.references.push(clone);
        }
        // upgrade dragIntoCell level
        if ( dragIntoCell.level <= clone.level ) {
          const increase = clone.level - dragIntoCell.level + 1;
          const tempCellIndex = this.getInfoFromStep(dragIntoCellSteps[0]).index;
          let tempCell = this.currentStructure[tempCellIndex];
          tempCell.level += increase;
          // upgrade all steps level in path
          for (let i = 1; i < dragIntoCellSteps.length; i ++) {
            const index = this.getInfoFromStep(dragIntoCellSteps[i]).index;
            tempCell = tempCell.references[index];
            tempCell.level += increase;
          }
        }
        // upgrade inGroup
        clone.inGroup = true;
        // move content from draggedCell to dragIntoCell
        dragIntoCell.references.push(clone);
        // remove original one - draggedCell
        const originalCellSteps = this.generatePath.split('-');
        const originalCellIndex = this.getInfoFromStep(originalCellSteps[0]).index;
        this.currentStructure.splice(originalCellIndex , 1);
        // TODO: upgrade other elements position
        // 1. update position of cells which after draggedCell(removed - when original move)
        // 2. update position of cells which after dragIntoCell(merged)
        for (let i = originalCellIndex; i < this.currentStructure.length; i ++) {
          this.currentStructure[i].position.y += clone.level === 1 ? 45 : 150;
        }
      }
    },
    onDragStart(e) {
      // set dragOutFlag false
      this.store.dispatch('table/updateDropOutFlag', false);
    },
    onDragEnd(e) {

      // get dragOutFlag from store
      const drop = this.store.getters['table/getDropoutFlag'];
      console.log(drop);
      // // this.store.dispatch('table/updateStructure', newData);
      // if(this.dragOutFlag) {
      //   console.log(this.dragCell);
      //   // get path from dragIntoCell
      //   const dragCellPath = this.dragCell.attributes['data-key'].value;
      //   let dragCell = this.findContentByPath(dragCellPath, this.currentStructure);
      //   // clone cell
      //   let clone = JSON.parse(JSON.stringify(dragCell));
      //   clone.inGroup = false;
      //   clone.position = {x: 0, y: 0};
      //   $store.dispatch('table/addCell', clone);
      // }
      // this.dragOutFlag = false;
    },
    findContentById(id, array, dragIntoCell) {
      const isEmpty = Object.keys(dragIntoCell).length === 0;
      if (!isEmpty) return;
      for(let i = 0; i < array.length && isEmpty; i ++) {
        if (array[i].id === id) {
          dragIntoCell = array[i];
          return dragIntoCell;
        } else if(array[i].references.length > 0) {
          this.findContentById(id, array[i].references, dragIntoCell);
        }
      }
    },
    findContentByPath(path, structure) {
      const steps = path.split('-');
      const parentIndex = this.getInfoFromStep(steps[0]).index;
      let cell = structure[parentIndex];
      for (let i = 1; i < steps.length; i ++) {
        const index = this.getInfoFromStep(steps[i]).index;
        cell = cell.references[index]; 
      }
      return cell;
    },
    getInfoFromStep(step) {
      const info = step.split(':');
      return {id: Number(info[0]), index:(info[1]) - 1};
    },
  }
}
</script>
<style scoped>
p {
  margin: 0px;
}
.revue-draggable {
  padding: 10px 15px;
  width: 400px;
  height: 150px;
  overflow-y: auto;
  border: 1px solid #288828;
  background-color: #90EE90;
}
.revue-draggable-dragging {
  opacity: 0.5;
}
.level1-class {
  width: max-content;
  height: 45px;
}
.dragArea {
  min-height: 40px;
  width: 100%;
  padding: 10px;
  outline: 1px dashed;
  background-color: khaki;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.dragElement {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0px 5px;
}
.moving {
  z-index: 99999;
  position: relative;
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
