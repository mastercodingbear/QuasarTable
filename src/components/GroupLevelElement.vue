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
      start: !inGroup ? onDragGroupStart : null, 
      stop: !inGroup ? onDragGroupDrop : null,
      move: !inGroup ? onDragGroupMove : null,
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
        @start="onDragCellStart"
        @end="onDragCellEnd"
        @add="onAddCell"
        :class="{
          'no-pointer-events': dragCellFlag}"
        >
        <div 
          class="dragElement" 
          v-for="(el, index) in getReferences"
          :key="el.id" 
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
    const structure = store.getters['table/getStructure'];
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
        this.store.dispatch('table/updateCellReferencesById', 
          {
            id: this.elementId, 
            references: value
          })
      }
    },
  },
  methods: {
    onDragGroupStart() {
      this.activeDrags ++;
    },
    onDragGroupMove(e) {
      // detect drag event onto other cell
      if (e.event.target.classList.contains('revue-draggable') || 
        e.event.target.classList.contains('dragArea') ||
        e.event.target.classList.contains('move-handle')
        ) {
        // TODO: preview cell
      }
    },
    onDragGroupDrop(e) {
      this.activeDrags --;
      
      // update cell position
      const { x, y } = e.data;
      this.store.dispatch('table/updateCellPositionByPath', {
        path: this.generatePath, 
        position: {x: x, y: y}
      });
      // detect drag event onto other cell
      if (e.event.target.classList.contains('revue-draggable') || 
        e.event.target.classList.contains('dragArea') ||
        e.event.target.classList.contains('move-handle')
        ) {
        // draggedCell -> dragIntoCell(detected)
        const dragIntoCellPath = e.event.target.attributes['data-key'].value;
        this.moveCellByPath(this.generatePath, dragIntoCellPath);
      }
    },
    onDragCellStart(e) {
      // set dragoutFlag false
      this.store.dispatch('table/updateDropoutFlag', false);
      this.store.dispatch('table/updateDropoutCellPath', '');
      this.dragCell = e.item;
    },
    onDragCellEnd(e) {

      // get dragoutFlag from store
      const drop = this.store.getters['table/getDropoutFlag'];
      // drop onto level1 element
      const path = this.store.getters['table/getDropoutPath'];
      console.log();
      if (!drop) {
        return true;
      }
      // except 2 cases : move cell to other or change order in same cell
      if (e.from !== e.to || (e.from === e.to && e.newIndex !== e.oldIndex)) {
        return true;
      }
      if (path) {
        // drag onto level1 element
        const dragCellPath = this.dragCell.attributes['data-key'].value;
        this.moveCellByPath(dragCellPath, path);
      } else {
        const dragCellPath = this.dragCell.attributes['data-key'].value;
        const dragCell = this.getCellByPath(dragCellPath);
        console.log(dragCell);
        // clone cell
        let clone = JSON.parse(JSON.stringify(dragCell));
        clone.inGroup = false;
        clone.position = {x: 0, y: 0};
        this.store.dispatch('table/addCellById', {id: 0, cell: clone});
        // remove cell
        this.store.dispatch('table/removeCellByPath', dragCellPath);
      }
    },
    onAddCell(e) {
      const draggedCellPath = e.item.attributes['data-key'].value;
      const draggedCellSteps = draggedCellPath.split('-');
      const dragIntoCellPath = e.to.attributes['data-key'].value;
      // upgrade cell level
      const draggedCellInfo = this.getInfoFromStep(draggedCellSteps[draggedCellSteps.length - 1]);
      console.log(draggedCellInfo);
      console.log(this.currentStructure);
      const draggedCell = this.getCellById(draggedCellInfo.id);
      let dragIntoCell = this.getCellByPath(dragIntoCellPath);
      
      /* upgrade dragIntoCell level */
      if ( dragIntoCell.level <= draggedCell.level ) {
        const increase = draggedCell.level - dragIntoCell.level + 1;
        // upgrade all steps level in path
        this.store.dispatch('table/increaseLevelByPath', {path: dragIntoCellPath, amount: increase});
      }
    },
    moveCellByPath(fromPath, toPath) {
      // draggedCell -> dragIntoCell(detected)
      // get path from dragIntoCell
      const draggedCellPath = fromPath;
      const dragIntoCellPath = toPath;
      const draggedCellSteps = draggedCellPath.split('-');
      const dragIntoCellSteps = dragIntoCellPath.split('-');
      let dragIntoCell = this.getCellByPath(dragIntoCellPath);
      // get draggedCell by path
      let draggedCell = this.getCellByPath(draggedCellPath);
      // clone cell
      let clone = JSON.parse(JSON.stringify(draggedCell));

      /**
       * Merge draggedCell into dragIntoCell
       */
      // exception: level 1 -> level 1 push reference itself
      if ( dragIntoCell.level === 1 ) {
        let clone = JSON.parse(JSON.stringify(dragIntoCell));
        clone.inGroup = true;
        this.store.dispatch('table/addCellByPath', {path: dragIntoCellPath, cell: clone});
      }

      /* upgrade dragIntoCell level */
      const prevLevel = dragIntoCell.level;
      if ( dragIntoCell.level <= clone.level ) {
        const increase = clone.level - dragIntoCell.level + 1;
        // upgrade all steps level in path
        this.store.dispatch('table/increaseLevelByPath', {path: dragIntoCellPath, amount: increase});
      }

      /* cell move draggedCell -> dragIntoCell reference */
      // upgrade inGroup
      clone.inGroup = true;
      // set position
      clone.position = {x: 0, y: 0};
      this.store.dispatch('table/addCellByPath', {path: dragIntoCellPath, cell: clone});

      // TODO: upgrade other elements position
      // 1. update position of cells which after draggedCell(removed - when main cell move)
      // 2. update position of cells which after dragIntoCell(exception: upgarde 1 -> n changed height)
      if (draggedCellSteps.length === 1) {
        const draggedCellIndex = this.getInfoFromStep(draggedCellSteps[0]).index;
        const removedCellHeight = clone.level === 1 ? 45 : 150;
        for (let i = draggedCellIndex; i < this.currentStructure.length; i ++) {
          const path = this.currentStructure[i].id + ':' + (i + 1);
          const prevPosition = this.currentStructure[i].position;
          const currentPosition = {x: prevPosition.x, y: prevPosition.y + removedCellHeight};
          this.store.dispatch('table/updateCellPositionByPath', {
            path: path, 
            position: currentPosition
          });
        }
      }
      let dragIntoCellIndex = this.getInfoFromStep(dragIntoCellSteps[0]).index;
      if (prevLevel === 1) {
        const increaseHeight = 150 - 45;
        for (let i = dragIntoCellIndex + 1; i < this.currentStructure.length; i ++ ) {
          const path = this.currentStructure[i].id + ':' + (i + 1);
          const prevPosition = this.currentStructure[i].position;
          const currentPosition = {x: prevPosition.x, y: prevPosition.y - increaseHeight};
          this.store.dispatch('table/updateCellPositionByPath', {
            path: path, 
            position: currentPosition
          });
        }
      }
      // remove draggedCell
      this.store.dispatch('table/removeCellByPath', draggedCellPath);
    },
    getCellById(id) {
      const getCellById = this.store.getters['table/getCellById'];
      const cell = getCellById(id);
      return cell;
    },
    getCellByPath(path) {
      const getCellByPath = this.store.getters['table/getCellByPath'];
      const cell = getCellByPath(path);
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
