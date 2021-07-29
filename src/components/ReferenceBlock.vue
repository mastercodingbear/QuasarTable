<template>
  <div class="referenceBlock" v-if="show" :style="{right: -((width + 50) * (depth + 1)) + 'px'}">
    <ReferenceCell v-for="cell of reference" :key="cell.reference"
      :referenceNumber="cell.reference"
      :referenceText="cell.content"
      :backgroundColor="backgroundColor"
      :textColor="textColor"
      :width="width"
      />
  </div>
</template>
<script>
import ReferenceCell from './ReferenceCell.vue'

export default {
  components: {
    ReferenceCell
  },
  props: {
    reference: Array,
    depth: Number,
    backgroundColor: String,
    textColor: String,
    width: Number,
    show: Boolean
  }
}
</script>
<style lang="scss">
  .referenceBlock {
    position: absolute;
  }
</style>