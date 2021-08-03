<template>
  <q-page class="flex flex-left overflow-auto content-page">
    <div class="contentContainer" ref="contentPage">
      <ContentCell v-for="(cell, i) of sections" :key="cell.reference"
        :contentReference="cell.reference"
        :contentText="cell.content"
        :referenceData="referenceData"
        :bg_content="background_content"
        :color_content="color_content"
        :bg_refer="background_refer"
        :color_refer="color_refer"
        :selected="selectedReference"
        @selectedCell="onSelected($event)"
        @referenceHeight="onReferenceHeight($event)"
        :ref="'content-cell-' + (i + 1)"
        class="content-cell"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue';
import { scroll } from 'quasar'
import data from '../data/screen.json';
import ContentCell from '../components/ContentCell.vue';

const { getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'PageIndex',
  components: {
    ContentCell
  },
  data: () => {
    // get sections data from .json file
    const sections = data['sections'];
    // get format data from .json file
    const format = data['sections format']

    return {
      sections: sections,
      selectedReference: "",
      selectedIndex: -1,
      referenceData: [],
      background_content: format['reference background color hex'],
      color_content: format['reference text color hex'],
      background_refer: format['in-content reference background color hex'],
      color_refer: format['in-content reference text color hex'],
    }
  },
  setup() {
    const contentPage = ref(null)
    const contentCells = ref([])

    onBeforeUpdate(() => {
      contentCells.value = []
    })
    return {
      contentPage,
      contentCells
    }
  },
  methods: {
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
        console.log('down overflow');
        // scroll down offset
        const downoffset = offsetTop + cellHeight - viewHeight;
        setVerticalScrollPosition(el, downoffset);
      }
      if ( scroll > offsetTop ) {
        console.log('up overflow');
        // scroll down offset
        // const downoffset = offsetTop + cellHeight - viewHeight;
        setVerticalScrollPosition(el, offsetTop - 25);
      }
    },
    addReferenceBlock(index) {
      const reference = this.sections[index]['in-content reference'];
      this.referenceData = [];
      for (let i = 0;i < reference.length;i ++) {
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
    console.log("8923urklfjowequf9");
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._keyListener);
  },
})
</script>
<style lang="scss">
  .content-page {
    height: calc(100vh - 50px);
  }
  .content-cell {
    margin: 25px;
    width: min-content;
  }
</style>
