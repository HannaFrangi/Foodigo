import { legacy_createStore as createStore } from 'redux'

// Initial state with authUser
const initialState = {
  sidebarShow: true,
  theme: 'light',
  authUser: null,
}
const changeState = (state = initialState, { type, payload, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setAuthUser':
      return { ...state, authUser: payload }
    case 'clearAuthUser':
      return { ...state, authUser: null }
    default:
      return state
  }
}

// Create the Redux store
const store = createStore(changeState)

export default store
