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
 * @param {id: Number, cell: CellObject} props 
 */
export const addCellById = ({commit, getters}, props) => {
  commit('addCellById', {props, getters});
}

/**
 * 
 * @param {*} context 
 * @param {path: String, cell: CellObject} props 
 */
 export const addCellByPath = ({commit, getters}, props) => {
  commit('addCellByPath', {props, getters});
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
 * 
 * @param {*} param0 
 * @param {String} path 
 */
export const removeCellByPath = ({commit, getters}, path) => {
  commit('removeCellByPath', {path, getters});
}

/**
 * 
 * @param {*} param0 
 * @param {id: Number, amount: Number} props 
 */
export const increaseLevelById = ({commit, getters}, props) => {
  commit('increaseLevelById', {props, getters});
}

/**
 * 
 * @param {*} param0 
 * @param {path: String, amount: Number} props 
 */
 export const increaseLevelByPath = ({commit, getters}, props) => {
  commit('increaseLevelByPath', {props, getters});
}
