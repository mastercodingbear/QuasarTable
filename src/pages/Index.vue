<template>
  <q-page 
    class="overflow-auto content-page"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @drop="onDrop" >
    <div 
      class="contentContainer" 
      ref="contentPage" >
      <group-element v-for="(el, index) in data" 
        :key="el.content" 
        :elementId="el.id" 
        :content="el.content" 
        :level="el.level" 
        :inGroup="el.inGroup"
        :references="el.references"
        :path="`${el.id}`"
        :index="index + 1"
        :position="el.position" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue';
import { scroll } from 'quasar'
import { useStore } from 'vuex'
import data from '../data/cell.json';
import groupElement from '../components/GroupLevelElement.vue';

const { getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'PageIndex',
  components: {
    groupElement,
  },
  data: () => {
    const cellData = data['cells'];

    const store = useStore();
    store.dispatch('table/updateStructure', cellData);
    const structure = store.getters['table/getStructure'];

    return {
      // sections: sections,
      selectedReference: "",
      selectedIndex: -1,
      referenceData: [],
      // background_content: format['reference background color hex'],
      // color_content: format['reference text color hex'],
      // background_refer: format['in-content reference background color hex'],
      // color_refer: format['in-content reference text color hex'],
      data: structure,
      activeDrags: 0,
      store,
    }
  },
  setup() {
    const contentPage = ref(null);
    const contentCells = ref([]);

    onBeforeUpdate(() => {
      contentCells.value = []
    })
    return {
      contentPage,
      contentCells
    }
  },
  methods: {
    onDragStart(e) {
      this.activeDrags ++;
    },
    onDragEnd(e) {
      this.activeDrags --;
    },
    onDragEnter(e) {
      e.preventDefault();
    },
    onDragOver(e) {
      e.preventDefault();
    },
    onDrop(e) {
      // drop out of group
      if(e.target.classList.contains('contentContainer') || 
        e.target.classList.contains('content-page')) {
        this.store.dispatch('table/updateDropoutFlag', true);
      }
      // drop cell onto level 1 element
      const path = e.target.attributes['data-key']?.value;
      const steps = path?.split('-');
      if(steps?.length === 1) {
        const info = steps[0].split(':');
        const structure = this.store.getters['table/getStructure'];
        if(structure[info[1] - 1].level === 1) {
          this.store.dispatch('table/updateDropoutFlag', true);
          this.store.dispatch('table/updateDropoutCellPath', path);
        }
      }
    },
    onSelected(reference) {
      // save selected reference.
      this.selectedReference = reference;
      this.selectedIndex = this.sections.findIndex(element => element['reference'] === reference);
      // add in-content reference blocks.
      this.addReferenceBlock(this.selectedIndex);
    },
    /**
     * height: referenceBlock height
     */
    onReferenceHeight(height) {
      const el = this.contentPage.parentNode;
      const viewHeight = el.clientHeight;
      const cell = this.$refs[`content-cell-${this.selectedIndex + 1}`].$el;
      const offsetTop = cell.offsetTop;
      const cellHeight = cell.clientHeight > height ? cell.clientHeight : height;
      const scroll = getVerticalScrollPosition(el);
      if ( scroll + viewHeight < offsetTop + cellHeight ) {
        // scroll down offset
        const downoffset = offsetTop + cellHeight - viewHeight;
        setVerticalScrollPosition(el, downoffset);
      }
      if ( scroll > offsetTop ) {
        // scroll down offset
        // const downoffset = offsetTop + cellHeight - viewHeight;
        setVerticalScrollPosition(el, offsetTop - 25);
      }
    },
    addReferenceBlock(index) {
      const reference = this.sections[index]['in-content reference'];
      this.referenceData = [];
      for (let i = 0; i < reference.length; i ++) {
        // add block with depth
        const refer = reference[i].filter(element => this.getSelctedIndex(element) >= 0)
        .map(element => {
          return this.getReferenceCell(element)
        })
        this.referenceData.push(refer);
      }
    },
    getSelctedIndex(reference) {
      return this.sections.findIndex(element => element['reference'] === `${reference}`);
    },
    getReferenceCell(reference) {
      const index = this.getSelctedIndex(reference);
      return {reference: reference, content: this.sections[index]['content']};
    },
    _keyListener(e) {
      if (
        [ 33, 34, 35, 36, 38, 40 ].indexOf(e.keyCode) === -1
      ) {
        return
      }
      if (!(e.keyCode === 35 || e.keyCode === 36)) {
        e.preventDefault();
      }
      let index = this.getSelctedIndex(this.selectedReference);
      if (this.selectedReference === "") {
        this.selectedIndex = 0;
        this.selectedReference = this.sections[this.selectedIndex].reference;
        this.addReferenceBlock(this.selectedIndex);
        return
      }
      const lastIndex = this.sections.length - 1;
      const rowsPerPage = 5;
      switch (e.keyCode) {
        case 36: // Home
          index = 0
          break
        case 35: // End
          index = lastIndex
          break
        case 33: // PageUp
          index = index - rowsPerPage >= 0 ? index - rowsPerPage : 0
          break
        case 34: // PageDown
          index = index + rowsPerPage <= lastIndex ? index + rowsPerPage : lastIndex
          break
        case 38: // ArrowUp
          index = index - 1 >= 0 ? index - 1 : 0
          break
        case 40: // ArrowDown
          index = index + 1 <= lastIndex ? index + 1 : lastIndex
          break
      }
      this.selectedIndex = index;
      this.selectedReference = this.sections[index].reference;
      this.addReferenceBlock(index);
    },
  },
  mounted() {
	  window.addEventListener('keydown', this._keyListener);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._keyListener);
  },
})
</script>
<style lang="scss">
  .hovered {
    cursor: pointer;
  }
  .no-pointer-event {
    pointer-events: none;
  }
  .content-page {
    height: calc(100vh - 50px);
  }
  .content-cell {
    margin: 25px;
    width: min-content;
  }
</style>
