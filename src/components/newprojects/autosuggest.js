import React, { Component } from 'react';
import { Field } from 'redux-form';
import Input from '../helpers/form/input';
import axios from 'axios';
import _ from 'lodash';
import apiKey from '../../config/tmdb.js';

const moviePoster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';

class Autocomplete extends Component {
  state = {
    fetchedSuggestions: []
  }

  fetchSuggestions = _.debounce((movieTitle) =>{
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + movieTitle).then(response => {
      let top5 = response.data.results.splice(0, 5);
      this.setState({
        fetchedSuggestions: top5
      })
    }) 
  }, 300)

  handleChange = (event) => {
    let titleInput = event.target.value;
    this.props.input.onChange(titleInput);
    this.fetchSuggestions(titleInput)
  };

  handleClick = (movie) => {
    this.props.input.onChange(movie);
    console.log(movie);
    this.setState({
      fetchedSuggestions: []
    })
  }

  buildSuggestions = (movie) => {
    return (
      <li key={movie.id} onClick={() => {
        this.handleClick(movie.title)
      }}>
        <img className='movie-poster' src={moviePoster + movie.poster_path} /> {movie.title}
      </li>
    )
  }

  render(){
    const { input, placeholder, ...props } = this.props;

    return (
      <div>
        <input {...input} id={input.name} placeholder={placeholder} onChange={this.handleChange} {...props} autoComplete='off' />
        <ul className='suggestion-list'>
          {this.state.fetchedSuggestions.map(this.buildSuggestions)}
        </ul>
      </div>
    )
  }
}

export default Autocomplete;