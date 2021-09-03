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

export const getCellById = (state, id) => {
  let cell = {};
  cell = findCellById(id, state.structure, cell);
  return cell;
}

function findCellById(id, array, cell) {
  const isEmpty = Object.keys(cell).length === 0;
  if (!isEmpty) return;
  for(let i = 0; i < array.length && isEmpty; i ++) {
    if (array[i].id === id) {
      cell = array[i];
      return cell;
    } else if(array[i].references.length > 0) {
      findCellById(id, array[i].references, cell);
    }
  }
}