/*
export function someAction (context) {
}
*/
export const updateStructure = (context, structure) => {
  context.commit('updateStructure', structure)
}

export const updateDropOutFlag = (context, dropout) => {
  context.commit('updateDropOutFlag', dropout)
}

export const addCell = (context, cell) => {
  context.commit('addCell', cell);
}

/**
 * 
 * @param {id: number, position: {x: number, y: number}} props
 */
export const updateCellPosition = ({commit, getters}, props) => {
  commit('updateCellPosition', {props, getters});
}

/**
 * 
 * @param {id: number, references: []} props
 */
export const updateCellReferences = ({commit, getters}, props) => {
  commit('updateCellReferences', {props, getters});
}