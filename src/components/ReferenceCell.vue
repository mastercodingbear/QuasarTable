<template>
  <div class="referenceCell">
    <div class="referenceNumber" :style="{color: textColor, backgroundColor: backgroundColor}">
      {{referenceNumber}}
    </div>
    <div class="referenceText" :style="{color: textColor, backgroundColor: backgroundColor, width: (width - 50) + 'px'}">
      {{referenceText}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    referenceNumber: Number,
    referenceText: String,
    referenceArray: [],
    backgroundColor: String,
    textColor: String,
    width: Number
  }
}
</script>
<style lang="scss">
  .referenceCell {
    display: flex;
    font-size: 18px;
    margin-bottom: 25px;
    &:hover {
      cursor: pointer;
    }
    .referenceNumber {
      text-align: right;
      width: 50px;
      height: min-content;
    }
    .referenceText {
      padding: 20px 10px;
      // word-break: break-all;
    }
  }
</style>