import React, { Component } from 'react';
import DetailsPage  from './details';
import { connect } from 'react-redux';
import { getFinancialData, getMovieData } from '../../actions';
import Disclaimer from '../footer/disclaimer';
import {Link} from 'react-router-dom';
import Nav from '../navbar/index';
import Preloader from '../preloader/index';

class MovieComparison extends Component {
  state = {
    active: false,
    pageHasLoaded:false
  }

  toggleClass = () => {
    const currentState = this.state.active;
    this.setState({active : !currentState});
  } 

  async componentDidMount(){
    const { title1, title2 } = this.props.comparables;

    setTimeout(()=>{
      this.setState({ pageHasLoaded: true })
    },1000)

    await this.props.getMovieData(title1, title2);
  }

  handleConfirm = () => {
    this.props.getFinancialData(this.props.movies[0].id, this.props.movies[1].id);
  }

  renderMovies(){
    const { movies } = this.props;

    return this.props.movies.map( (movie, index) => {
      let inactiveClass = "";
      if(!this.state.pageHasLoaded){
        if(index === 0){
          inactiveClass = "movie-image inactive-left";
        } else {
          inactiveClass = "movie-image inactive-right";
        }
      }
      else{
        inactiveClass = 'movie-image';
      }

      return (
        <div key = {movie.id} className='movies'>
          <div className='comparison-movie-display'>
            <img src= { movie.image_url } id='movie-1-img' className={ inactiveClass }/>
            <div className='movie-title-wrapper'>
              <h3 className='movie-title-subheader'>{ movie.title } </h3>
              <h3 className='movie-subheader'>Release Date: { new Date(movie.us_theatrical_release).toLocaleDateString('en-US', {day : 'numeric', month : 'long', year : 'numeric'})}</h3>
              <h3 className='movie-subheader'>Total Box Office: ${(parseInt(movie.us_gross_bo) + parseInt(movie.intl_gross_bo)).toLocaleString()}</h3>
            </div>
          </div>
        </div>
      )
    }) 
  }

  render(){
    const arrowActive = 'is-active';
    const { movies } = this.props;

    if(movies.length === 0){
        return <h1>Loading Data</h1>;
    }

    return (
      <div>
        <div className='comparables-wrapper'>
          <div className="comparables-filter"></div>
          <div className='comparables-container'>
          <Nav/>
            <h1> Movie Comparisons</h1>
            <div className='movie-info-container'>
              { this.renderMovies() }
            </div>  
            <div className='comparables-button-container'>
              <div onClick = {this.toggleClass} id='arrow-icon' className='button-btn'>
                <button className="input-submit-button page-button">More Details</button>
              </div>
              <div className='comparables-button-btn'>
                <Link to='/financials'>
                  <button onClick={this.handleConfirm} className="input-submit-button page-button">Confirm</button>
                </Link>
              </div>
            </div>
          </div> 
        </div>
        <DetailsPage detailPageOnclick={this.state.active} toggleDetailPage={() => { this.toggleClass()}} />
        <Disclaimer/>
      </div> 
    )
  }
}

const mapStateToProps = state => {
  return {
    comparables: state.comparables,
    movies: state.movies.movieList
  }
} 

export default connect(mapStateToProps, {
  getMovieData, getFinancialData
})(MovieComparison);