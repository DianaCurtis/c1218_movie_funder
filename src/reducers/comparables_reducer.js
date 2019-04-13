const DEFAULT_STATE = {
  title1: '',
  title2: '',
  projectID: null
}

const comparablesReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'STORE_MOVIE_COMPARISONS':
    console.log("RESPONSE", action.payload.response.data.success)
      return { title1: action.payload.compare.title1, title2: action.payload.compare.title2, project_id: action.payload.response }
    case 'PROJECT_COMPARABLES':
      return action.payload
    default:
      return state;
  }
}

export default comparablesReducer;