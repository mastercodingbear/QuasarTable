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
      touchstart: onStop,
      contextmenu: onStop,
    }"
    :data-key="generatePath" >
    <div>
      <q-menu
        touch-position
        context-menu
        :modelValue="bContextMenuOpened"
        @update:modelValue="bContextMenuOpened = $event"
      >
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>{{generatePath}}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <ElementHeader 
        :elementId="elementId"
        :content="content"
        :level="level"
        :inGroup="inGroup"
        :displayType="displayType"
        :displayValue="displayValue"
        :path="path"
        :index="index"
      />
      <VueDraggableNext 
        class="dragArea"
        v-if="level > 1"
        v-bind="dragOptions"
        v-model="getReferences" 
        :id="elementId"
        :group="{ name: 'reference', pull: onCtrl ? 'clone' : null}"
        :data-key="generatePath"
        @start="onDragCellStart"
        @end="onDragCellEnd"
        @add="onAddCell"
        :class="{
          'no-pointer-events': dragCellFlag}" >
        <div 
          class="dragElement" 
          v-for="(refId, index) in getReferences"
          :id="refId"
          :key="refId" 
          :data-key="generatePath + '-' + refId + ':' + (index + 1)"
          >
          <ElementContent
            :elementId="refId"
            :content="getCellById(refId).content"
            :level="getCellById(refId).level"
            :inGroup="getCellById(refId).inGroup"
            :displayType="getCellById(refId).type"
            :displayValue="getCellById(refId).value"
            :path="generatePath"
            :index="index + 1"
          />
          <group-element 
            v-if="getCellById(refId).level > 1"
            :key="getCellById(refId).content" 
            :elementId="refId" 
            :content="getCellById(refId).content" 
            :level="getCellById(refId).level" 
            :inGroup="getCellById(refId).inGroup"
            :references="getCellById(refId).references"
            :displayType="getCellById(refId).type"
            :displayValue="getCellById(refId).value"
            :path="generatePath"
            :index="index + 1"
            :position="getCellById(refId).position" />
        </div>
      </VueDraggableNext>
    </div>
  </component>
</template>
<script>
import { Draggable } from '@braks/revue-draggable';
import { VueDraggableNext } from 'vue-draggable-next'
import ElementHeader from './ElementHeader.vue'
import ElementContent from './ElementContent.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'group-element',
  components: {
    VueDraggableNext,
    Draggable,
    ElementHeader,
    ElementContent,
  },
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
    displayType: {
      type: String,
      required: true,
    },
    displayValue: {
      type: String,
      required: true,
    },
    path: {
      // cell path
      type: String,
      required: true,
    },
    index: {
      // cell index in parent
      type: Number,
      required: true,
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
  data: (props) => {
    const store = useStore();
    const structure = store.getters['table/getStructure'];
    return {
      // floating drag flag
      activeDrags: 0,
      dragCell: Object,
      // drag into flag
      dragCellFlag: 0,
      currentStructure: structure,
      store: store,
      bContextMenuOpened: false,
      onCtrl: false,
    };
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
  updated() {
    // console.log('asdf');
    // TODO leader line
  },
  methods: {
    onStop(e) {
      e.stopPropagation();
    },
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
      this.store.dispatch('table/updateCellPositionById', {
        id: this.elementId, 
        position: {x: x, y: y}
      });
      // detect drag event onto other cell
      if (e.event.target.classList.contains('revue-draggable') || 
        e.event.target.classList.contains('dragArea') ||
        e.event.target.classList.contains('move-handle')
        ) {
        // draggedCell -> dragIntoCell(detected)
        const dragIntoCellPath = e.event.target.attributes['data-key'].value;
        this.moveCell(this.generatePath, dragIntoCellPath);
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
        this.moveCell(dragCellPath, path);
      } else {
        const dragCellPath = this.dragCell.attributes['data-key'].value;
        const dragCell = this.getCellByPath(dragCellPath);
        // clone cell
        let clone = JSON.parse(JSON.stringify(dragCell));
        clone.inGroup = false;
        clone.position = {x: 0, y: 0};
        this.store.dispatch('table/insertCell', clone);
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
      const draggedCell = this.getCellById(draggedCellInfo.id);
      let dragIntoCell = this.getCellByPath(dragIntoCellPath);
      
      /* upgrade dragIntoCell level */
      if ( dragIntoCell.level <= draggedCell.level ) {
        const increase = draggedCell.level - dragIntoCell.level + 1;
        // upgrade all steps level in path
        this.store.dispatch('table/increaseLevelByPath', {path: dragIntoCellPath, amount: increase});
      }
    },
    onContextMenuOpen(value) {
      console.log(this.generatePath + '- ' + value);
      this.bContextMenuOpened = value;
    },
    moveCell(fromPath, toPath) {
      // console.log(fromPath);
      // draggedCell -> dragIntoCell(detected)
      // get draggedCell by Id
      const draggedCellPath = fromPath;
      const dragIntoCellPath = toPath;
      const fromId = this.getCellInfofromPath(draggedCellPath).id;
      const toId = this.getCellInfofromPath(dragIntoCellPath).id;
      let draggedCell = this.getCellById(fromId);
      // get path from dragIntoCell
      let dragIntoCell = this.getCellById(toId);
      // clone cell
      // let clone = JSON.parse(JSON.stringify(draggedCell));

      /**
       * Move draggedCell into dragIntoCell
       */
      // exception: level 1 -> level 1 push itself to reference 
      if ( dragIntoCell.level === 1 ) {
        let clone = JSON.parse(JSON.stringify(dragIntoCell));
        clone.inGroup = true;
        this.store.dispatch('table/insertCell', clone).then(newId => {
          this.store.dispatch('table/addCelltoRefById', {fromId: newId, toId: toId});
        });
      }
      /* upgrade dragIntoCell level */
      const prevLevel = dragIntoCell.level;
      if ( prevLevel <= draggedCell.level ) {
        const increase = draggedCell.level - dragIntoCell.level + 1;
        // upgrade all steps level in path
        this.store.dispatch('table/increaseLevelByPath', {path: dragIntoCellPath, amount: increase});
      }
      // TODO: upgrade other elements position
      // 1. update position of cells which after draggedCell(if main cell move)
      // 2. update position of cells which after dragIntoCell(exception: upgarde 1 -> n changed height)
      if (!draggedCell.inGroup) {
        // main cell
        const draggedCellIndex = this.getMainCellInfofromPath(draggedCellPath).index;
        const removedCellHeight = draggedCell.level === 1 ? 52 : 150;
        for (let i = draggedCellIndex; i < this.currentStructure.length; i ++) {
          if (this.currentStructure[i].inGroup === true) {
            continue;
          }
          const prevPosition = this.currentStructure[i].position;
          const currentPosition = {x: prevPosition.x, y: prevPosition.y + removedCellHeight};
          this.store.dispatch('table/updateCellPositionById', {
            id: this.currentStructure[i].id, 
            position: currentPosition
          });
        }
      } else {
        // remove cell from parent
        this.store.dispatch('table/removeCellByPath', draggedCellPath);
      }
      let dragIntoCellIndex = this.getCellInfofromPath(dragIntoCellPath).index;
      if (prevLevel === 1) {
        const increaseHeight = 150 - 52;
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
      /* cell move draggedCell -> dragIntoCell reference */
      // upgrade inGroup
      this.store.dispatch('table/updateCellMemberById', {
        id: fromId, 
        inGroup: true
      });
      // set position
      this.store.dispatch('table/updateCellPositionById', {
        id: fromId, 
        position: {x: 0, y: 0}
      });
      this.store.dispatch('table/addCelltoRefById', {fromId: fromId, toId: toId});
    },
    getCellById(id) {
      const getCellById = this.store.getters['table/getCellById'];
      const cell = getCellById(id);
      return cell;
    },
    getCellByPath(path) {
      const cellId = this.getCellInfofromPath(path).id;
      const getCellById = this.store.getters['table/getCellById'];
      const cell = getCellById(cellId);
      return cell;
    },
    getCellInfofromPath(path) {
      const steps = path.split('-');
      const cellStep = steps[steps.length - 1];
      return this.getInfoFromStep(cellStep);
    },
    getMainCellInfofromPath(path) {
      const steps = path.split('-');
      const mainCellStep = steps[0];
      return this.getInfoFromStep(mainCellStep);
    },
    getParentCellInfofromPath(path) {
      const steps = path.split('-');
      const parentCellStep = steps[steps.length - 2];
      return this.getInfoFromStep(parentCellStep);
    },
    getInfoFromStep(step) {
      const info = step.split(':');
      return {id: Number(info[0]), index: (info[1]) - 1};
    },
  }
}
</script>
<style scoped>
p {
  margin: 0px;
}
.revue-draggable {
  padding: 5px;
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
  height: 52px;
  display: flex;
  align-items: center;
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
  text-align: center;
  vertical-align:center;
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
