/**
 * 
 * @param {*} context 
 * @param {Array<CellObject>} structure 
 */
export const updateStructure = (context, structure) => {
  context.commit('updateStructure', structure)
}

/**
 * 
 * @param {*} context 
 * @param {Boolean} dropOutFlag 
 */
export const updateDropoutFlag = (context, dropOutFlag) => {
  context.commit('updateDropoutFlag', dropOutFlag)
}

/**
 * 
 * @param {*} context 
 * @param {String} dropOutCellPath 
 */
export const updateDropoutCellPath = (context, dropOutCellPath) => {
  context.commit('updateDropoutCellPath', dropOutCellPath);
}

/**
 * 
 * @param {*} context 
 * @param {fromId: Number, toId: Number} props 
 */
export const addCelltoRefById = ({commit, getters}, props) => {
  commit('addCelltoRefById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {CellObject} cell 
 */
 export const insertCell = (context, cell) => {
  context.commit('insertCell', cell);
  return new Promise((resolve, reject) => {
    resolve(cell.id);
  });
}

/**
 * 
 * @param {*} context 
 * @param {id: Number, position: {x: Number, y: Number}} props
 */
export const updateCellPositionById = ({commit, getters}, props) => {
  commit('updateCellPositionById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {path: String, position: {x: Number, y: Number}} props
 */
 export const updateCellPositionByPath = ({commit, getters}, props) => {
  commit('updateCellPositionByPath', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {id: Number, inGroup: Boolean} props
 */
 export const updateCellMemberById = ({commit, getters}, props) => {
  commit('updateCellMemberById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {id: Number, references: Array} props
 */
export const updateCellReferencesById = ({commit, getters}, props) => {
  commit('updateCellReferencesById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {path: String, references: Array} props
 */
 export const updateCellReferencesByPath = ({commit, getters}, props) => {
  commit('updateCellReferencesByPath', {props, getters});
}

/**
 * @param {*} context 
 * @param {id: Number, value: String} props
 */
 export const updateCellDisplayValueById = ({commit, getters}, props) => {
  commit('updateCellDisplayValueById', {props, getters});
}


/**
 * @param {*} context 
 * @param {path: String, value: String} props
 */
 export const updateCellDisplayValueByPath = ({commit, getters}, props) => {
  commit('updateCellDisplayValueByPath', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {String} path 
 */
export const removeCellByPath = ({commit, getters}, path) => {
  commit('removeCellByPath', {path, getters});
}

/**
 * 
 * @param {*} context 
 * @param {Number} id 
 */
 export const removeCellById = ({commit, getters}, id) => {
  commit('removeCellById', {id, getters});
}

/**
 * 
 * @param {*} context 
 * @param {id: Number, amount: Number} props 
 */
export const increaseLevelById = ({commit, getters}, props) => {
  commit('increaseLevelById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {path: String, amount: Number} props 
 */
 export const increaseLevelByPath = ({commit, getters}, props) => {
  commit('increaseLevelByPath', {props, getters});
}
