/**
 * 
 * @param {*} state 
 * @param {Array<CellObject>} structure 
 */
export const updateStructure = (state, structure) => {
  state.structure = structure;
}

/**
 * 
 * @param {*} state 
 * @param {Boolean} dropOutFlag 
 */
export const updateDropoutFlag = (state, dropoutFlag) => {
  state.dropoutFlag = dropoutFlag;
}

/**
 * 
 * @param {*} state 
 * @param {Boolean} dropoutCellPath 
 */
 export const updateDropoutCellPath = (state, dropoutCellPath) => {
  state.dropoutCellPath = dropoutCellPath;
}

/**
 * 
 * @param {*} state 
 * @param {fromId: Number, toId: Number} props 
 */
export const addCelltoRefById = (state, {props, getters}) => {
  const {fromId, toId} = props;
  // move cell to reference
  const toCell = getters.getCellById(toId);
  toCell.references.push(fromId);
}

/**
 * 
 * @param {*} state 
 * @param {CellObject} cell 
 */
export const insertCell = (state, cell) => {
  cell.id = state.structure.length + 1;
  state.structure.push(cell);
}

/**
 * 
 * @param {*} state
 * @param {id: Number, position: {x: Number, y: Number}} props
 */
export const updateCellPositionById = (state, {props, getters}) => {
  const {id, position} = props;
  const cell = getters.getCellById(id);
  cell.position = position;
}

/**
 * 
 * @param {*} state
 * @param {path: string, position: {x: Number, y: Number}} props
 */
 export const updateCellPositionByPath = (state, {props, getters}) => {
  const {path, position} = props;
  const cell = getters.getCellByPath(path);
  cell.position = position;
}

/**
 * 
 * @param {*} context 
 * @param {id: Number, inGroup: Boolean} props
 */
 export const updateCellMemberById = (state, {props, getters}) => {
  const {id, inGroup} = props;
  const cell = getters.getCellById(id);
  cell.inGroup = inGroup;
}

/**
 * 
 * @param {*} state
 * @param {id: Number, references: []} props
 */
export const updateCellReferencesById = (state, {props, getters}) => {
  const {id, references} = props;
  const cell = getters.getCellById(id);
  cell.references = references;
}

/**
 * 
 * @param {*} state
 * @param {path: String, references: []} props
 */
 export const updateCellReferencesByPath = (state, {props, getters}) => {
  const {path, references} = props;
  const cell = getters.getCellByPath(path);
  cell.references = references;
}

/**
 * 
 * @param {*} state
 * @param {id: Number, value: String} props
 */
 export const updateCellDisplayValueById = (state, {props, getters}) => {
  const {id, value} = props;
  const cell = getters.getCellById(id);
  cell.value = value;
}

/**
 * 
 * @param {*} state
 * @param {path: String, value: String} props
 */
 export const updateCellDisplayValueByPath = (state, {props, getters}) => {
  const {path, value} = props;
  const cell = getters.getCellByPath(path);
  cell.value = value;
}

/**
 * 
 * @param {*} state
 * @param {String} path
 */
export const removeCellByPath = (state, {path, getters}) => {
  const parentCell = getters.getParentCellByPath(path);
  const steps = path.split('-');
  const childInfo = steps[steps.length - 1].split(':');
  const childIndex = childInfo[1] - 1;
  if(steps.length === 1) {
    // remove cell from structure
    state.structure.splice(childIndex, 1);
  } else {
    // remove cell from parentCell references
    parentCell.references.splice(childIndex, 1);
  }
}

/**
 * 
 * @param {*} state 
 * @param {Number} id 
 * TODO: couldn't get parent cell
 */
export const removeCellById = (state, {id, getters}) => {
  const cell = getters.getCellById(path);
  console.log(cell);
}

/**
 * 
 * @param {*} state 
 * @param {id: Number, amount: Number} props 
 */
export const increaseLevelById = (state, {props, getters}) => {
  const {id, amount} = props;
  const cell = getters.getCellById(id);
  cell.level += amount;
}

/**
 * 
 * @param {*} state 
 * @param {path: String, amount: Number} props 
 */
 export const increaseLevelByPath = (state, {props, getters}) => {
  const {path, amount} = props;
  const steps = path.split('-');
  for (let i = 0; i < steps.length; i ++) {
    const cellId = steps[i].split(':')[0];
    const cell = getters.getCellById(cellId);
    cell.level += amount;
  }
}
