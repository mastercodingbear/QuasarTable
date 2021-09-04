<template>
  <template v-if="level === 1">
    <template v-if="displayType === 'checkbox'">
      <q-checkbox 
        :data-key="generatePath"
        size="xs" 
        v-model="value" 
        v-for="val in groups"
        @update:model-value="onUpdate"
        :val="val"
        :key="val"
        :label="val" />
    </template>
    <template v-else-if="displayType === 'radio'">
      <q-radio 
        :data-key="generatePath"
        size="xs" 
        v-model="value" 
        v-for="val in groups"
        :val="val"
        :key="val"
        :label="val" />
    </template>
    <template
      v-else-if="displayType === 'image'" >
      <q-img 
        style="width: 150px"
        :data-key="generatePath"
        :alt="content"
        :src="displayValue"/>
    </template>
    <template v-else >
      <p 
        :data-key="generatePath" >
        {{ content }}
      </p>
    </template>
  </template>
</template>
<script>
import { ref } from 'vue';
import { useStore } from 'vuex'

export default {
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
  },
  data: (props) => {
    let displayValue = props.displayValue;
    let groups = props.content;
    const store = useStore();
    if(props.displayType === "checkbox") {
      displayValue = displayValue.split(',');
    }
    if(props.displayType === "checkbox" ||
      props.displayType === "radio") {
      groups = groups.split(',');
    }
    return {
      store,
      groups,
      value: ref(displayValue),
    };
  },
  computed: {
    generatePath() {
      return this.path + '-' + this.elementId + ':' + this.index;
    },
  },
  methods: {
    onUpdate(value, evt) {
      console.log(value);
      const displayValue = value.join(',');
      this.store.dispatch('table/updateCellDisplayValueByPath', {path: this.generatePath, value: displayValue})
    }
  },
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
