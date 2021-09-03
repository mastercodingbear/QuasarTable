/*
export function someGetter (state) {
}
*/
export const getStructure = (state) => {
  return state.structure;
}

export const getDropoutFlag = (state) => {
  return state.dropOutFlag;
}

export const getCellById = (state) => (id) => {
  let cell = {};
  cell = findCellById(id, state.structure);
  return cell;
}

const findCellById = (id, array) => {
  for(let i = 0; i < array.length; i ++) {
    if (array[i].id === id) {
      return array[i];
    } else if(array[i].references.length > 0) {
      let temp = findCellById(id, array[i].references);
      if (Object.keys(temp).length > 0)
        return temp;
    }
  }
  return {};
}
