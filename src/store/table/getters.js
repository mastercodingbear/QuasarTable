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
  cell = findCellById(id, state.structure);
  return cell;
}

export const getCellByPath = (state) => (path) => {
  const steps = path.split('-');
  let cell = state.structure[getInfofromStep(steps[0]).index];
  for(let i = 1; i < steps.length; i ++) {
    cell = cell.references[getInfofromStep(steps[i]).index];
  }
  return cell;
}

export const getParentCellByChildPath = (state) => (path) => {
  const steps = path.split('-');
  if (steps.length === 1) {
    return state.structure;
  }
  let parentCell = state.structure[getInfofromStep(steps[0]).index];
  for(let i = 1; i < steps.length - 1; i ++) {
    parentCell = parentCell.references[getInfofromStep(steps[i]).index];
  }
  return parentCell;
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

const getInfofromStep = (step) => {

  const info = step.split(':');
  return {id: Number(info[0]), index:(info[1]) - 1};
}
