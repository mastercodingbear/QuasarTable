<template>
  <q-page class="flex flex-left">
    <div class="contentContainer">
      <ContentCell v-for="cell of sections" :key="cell.reference"
        :contentReference="cell.reference"
        :contentText="cell.content"
        :referenceData="referenceData"
        :bg_content="background_content"
        :color_content="color_content"
        :bg_refer="background_refer"
        :color_refer="color_refer"
        :selected="selectedReference"
        @selectedCell="onSelected($event)"
        style="margin:25px"
        />    
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import data from '../data/screen.json';
import ContentCell from '../components/ContentCell.vue';

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
      referenceData: [],
      background_content: format['reference background color hex'],
      color_content: format['reference text color hex'],
      background_refer: format['in-content reference background color hex'],
      color_refer: format['in-content reference text color hex'],
    }
  },
  methods: {
    onSelected(reference) {
      this.selectedReference = reference;
      const selectedIndex = this.sections.findIndex(element => element['reference'] === reference);
      this.addReferenceBlock(selectedIndex);
    },
    addReferenceBlock(index) {
      const reference = this.sections[index]['in-content reference'];
      this.referenceData = [];
      for (let i = 0;i < reference.length;i ++) {
        // add block with depth
        const refer = reference[i].map(element => {
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
      e.preventDefault();
      let index = this.getSelctedIndex(this.selectedReference);
      if (this.selectedReference === "") {
        index = 0;
        this.selectedReference = this.sections[index].reference;
        this.addReferenceBlock(index);
        return
      }
      const lastIndex = this.sections.length - 1;
      const rowsPerPage = 5;
      console.log(e.keyCode);
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
          console.log(index);
          index = index + 1 <= lastIndex ? index + 1 : lastIndex
          console.log('arrowdown', index)
          break
      }
      console.log(index);
      this.selectedReference = this.sections[index].reference;
      this.addReferenceBlock(index);
    }
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
  
</style>
