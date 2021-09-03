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
  console.log('addCell', cell)
  context.commit('addCell', cell);
}

export const updateCellPosition = ({context, getters}, props) => {
  context.commit('updateCellPosition', {props, getters});
}

