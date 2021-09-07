export const getStructure = (state) => {
  return state.structure;
}

export const getDropoutFlag = (state) => {
  return state.dropoutFlag;
}

export const getDropoutPath = (state) => {
  return state.dropoutCellPath;
}

export const getCellById = (state) => (id) => {
  let cell = {};
  cell = findCellById(Number(id), state.structure);
  return cell;
}

export const getCellByPath = (state) => (path) => {
  const steps = path.split('-');
  const cellId = getInfofromStep(steps[steps.length - 1]).id;
  const cell = findCellById(cellId, state.structure);
  return cell;
}

export const getParentCellByPath = (state) => (path) => {
  const steps = path.split('-');
  if (steps.length === 1) {
    return state.structure;
  }
  const parentCellId = getInfofromStep(steps[steps.length - 2]).id;
  let parentCell = findCellById(parentCellId, state.structure);
  return parentCell;
}

// const findCellById = (id, array) => {
//   for(let i = 0; i < array.length; i ++) {
//     if (array[i].id === id) {
//       return array[i];
//     } else if(array[i].references.length > 0) {
//       let temp = findCellById(id, array[i].references);
//       if (Object.keys(temp).length > 0)
//         return temp;
//     }
//   }
//   return {};
// }

const findCellById = (id, array) => {
  for(let i = 0; i < array.length; i ++) {
    if (array[i].id === id) {
      return array[i];
    }
  }
  return {};
}

const getInfofromStep = (step) => {

  const info = step.split(':');
  return {id: Number(info[0]), index:(info[1]) - 1};
}
