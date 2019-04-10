import axios from 'axios';

export const getFinancialData = (id1, id2) => {
  return async dispatch => {
    const response = await axios.get('/api/financial.php', {
      params: {
        id1,
        id2
      }
    });

    dispatch({
      type: 'GET_FINANCIAL_DATA',
      payload: response
    });
  }
}

export const getMovieData = (film1, film2) => {
  return async dispatch => {
    const response = await axios.get('/api/comparables.php', {
      params: {
        title1: film1,
        title2: film2
      }
    });

    dispatch({
      type: 'GET_MOVIE_DATA',
      payload: response.data
    });
  }
}

export const getMovieTitles = (title1, title2) => {
  return {
    type: 'PROJECT_COMPARABLES',
    payload: {title1, title2}
  };
}

export const getMyProjects = () => {
  return async dispatch => {
    const response = await axios.get('/api/myprojects.php');

    dispatch({
      type: 'GET_MY_PROJECTS',
      payload: response
    });
  }
}

export const getProjectTitle = title => {
  return {
    type: 'GET_PROJECT_TITLE',
    title: title
  }
}

export const sendContactForm = values => {
  const { firstName, lastName, phoneNumber, email, message } = values;

  return async dispatch => {
    const response = await axios.post('/api/contactform.php', {
        firstName, lastName, phoneNumber, email, message
    })

  dispatch({
    type: 'SEND_CONTACT_FORM',
    payload: response
  })
}
}

export const sendProjectData = values => {
  const { title, runtime, logline, releasedYear, genre, mpaa, developmentStage, synopsis, film1, film2 } = values;

  return async dispatch => {
    await axios.post('/api/addproject.php', {
      newProject: {
        title, runtime, logline, releasedYear, genre, mpaa, developmentStage, synopsis, film1, film2
      } 
    });

    const compare = {
      title1: film1,
      title2: film2,
    }

    dispatch({
      type: 'STORE_MOVIE_COMPARISONS',
      payload: compare
    });
  }
}

export const signIn = values => {
  const { email, password } = values;

  return async dispatch => {
    const response = await axios.post('/api/signin.php', {
      login: {
        email, password
      } 
    });

    dispatch({
      type: 'SIGN_IN',
      payload: response
    });
  }
}

export const signOut = values => {
  return async dispatch => {
    const response = await axios.get('/api/signout.php');

    dispatch({
      type: 'SIGN_OUT',
      payload: response
    });
  }
}

export const sendToken = (token) => {
  return async dispatch => {
    const response = await axios.get('/api/sharable.php', {
      params: {token: token}
    });

    dispatch({
      type: 'SEND_TOKEN',
      payload: response
    });
  }
}