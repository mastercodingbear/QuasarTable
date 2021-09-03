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

/**
 * 
 * @param {id: number, position: {x: number, y: number}} props
 */
export const updateCellPosition = (state, {props, getters}) => {
  const {id, position} = props;
  const cell = getters.getCellById(id);
  cell.position = position;
}

/**
 * 
 * @param {id: number, references: []} props
 */
export const updateCellReferences = (state, {props, getters}) => {
  const {id, references} = props;
  const cell = getters.getCellById(id);
  cell.references = references;
}
