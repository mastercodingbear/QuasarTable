<template>
  <div class="contentCell" @click="passSelectedEvent" :class="{ selectedCell: selected === contentReference}">
    <div class="contentReference" :class="{ selected: selected === contentReference}" :style="{color: color_content, backgroundColor: bg_content}">
      {{contentReference}}
    </div>
    <div class="contentText" :class="{ selected: selected === contentReference}" :style="{color: color_content, backgroundColor: bg_content}">
      {{contentText}}
    </div>
    <ReferenceBlock v-for="(ref, index) in referenceData" 
          :depth="index"
          :reference="ref"
          :backgroundColor="bg_refer"
          :textColor="color_refer"
          :width="400"
          :show="selected === contentReference"
        :key="index"
        />
  </div>
</template>
<script>
import ReferenceBlock from './ReferenceBlock.vue'
export default {
  components: {
    ReferenceBlock
  },
  props: {
    contentReference: String,
    contentText: String,
    bg_content: String,
    color_content: String,
    bg_refer: String,
    color_refer: String,
    referenceData: Array,
    selected: String,
  },
  methods: {
    passSelectedEvent()
    {
      this.$emit('selectedCell', this.contentReference);
    }
  },
}
</script>
<style lang="scss">
  .contentCell {
    display: flex;
    position: relative;
    font-size: 18px;
    &:hover {
      cursor: pointer;
    }
    .contentReference {
      width: 50px;
      text-align: right;
      border: 1px solid transparent;
      height: min-content;
    }
    .contentReference.selected {
      border-right: none!important;;
    }
    .contentText {
      width: 400px;
      padding: 20px 10px;
      border: 1px solid transparent;
      // word-break: break-all;
    }
  }
  .selected {
    border: 1px solid black!important;;
  }
  .selectedCell {
    position: relative;
  }
</style>