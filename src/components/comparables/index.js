import comparables from '../../section/comparables.scss';
import animation from '../../section/animation.scss';
import React, { Component } from 'react';
import lakehouse from '../../assets/images/lakehouse.png';
import spiderman from '../../assets/images/spiderman.png';
import DetailsPage  from './details';
import { connect } from 'react-redux';

class MovieComparison extends Component {
  toggleClass = () => {
    const currentState = this.props.movies[0].active;
    this.setState({active : !currentState});
  }

  renderMovies(){
    return this.props.movies.map( movie => {
      return (
        <div key = {movie.movieTitle} className='movies'>
          <div className='comparison-movie-display'>
            <img src= { movie.image } id='movie-1-img' className='movie-display'/>
            <div className='movie-title-wrapper'>
              <h3 className='movie-title-subheader'>{ movie.movieTitle } </h3>
              <h3 className='movie-subheader'>Release Date: { new Date(movie.releaseDate).toLocaleDateString('en-US', {day : 'numeric', month : 'long', year : 'numeric'})}</h3>
              <h3 className='movie-subheader'>Total Box Office: ${ (movie.usBoxOffice + movie.intlBoxOffice).toLocaleString() }</h3>
            </div>
          </div>
        </div>
      )
    })
  }

  render(){
    const arrowActive = 'is-active';

    return (
      <div>
        <div className='comparables-wrapper '>
          <div className='comparables-container'>
            <div className='header'>
              <h3 className= 'movie-subtitle'> Movie Comparisons </h3>
            </div>
            <div className='movie-info-container'>
              { this.renderMovies() }
            </div>  
            <div onClick = { this.toggleClass } id='arrow-icon'>
              <i className='fas fa-angle-down'></i>
            </div>
          </div> 
        </div>
        <div>
          <DetailsPage detailPageOnclick = {this.active} toggleDetailPage = {() => { this.toggleClass()}}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      movies: state.movies

  }
}

export default connect(mapStateToProps)(MovieComparison);

