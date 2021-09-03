/*
export function someMutation (state) {
}
*/
export const updateStructure = (state, structure) => {
  state.structure = structure;
}

export const updateDropOutFlag = (state, dropout) => {
  state.dropOutFlag = dropout;
}

export const addCell = (state, cell) => {
  state.structure.push(cell);
}

export const updateCellPosition = (state, {props, getters}) => {
  const {id, position} = props;
  const cell = getters.getCellById(id);
  cell.position = position;  
}
