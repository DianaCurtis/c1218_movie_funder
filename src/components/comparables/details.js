import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { getFinancialData, getMovieData } from '../../actions';
import Nav from '../navbar/index';

class DetailsPage extends Component {

    mapThroughObjects(items){
        let newArray = []
        for(let i = 0; i < items.length; i++){
            newArray.push(items[i].name + '')
        }
        return newArray.join(', ')  
    }

    toggleClass = () => {
        const currentState = this.state.active;
        this.setState({active : !currentState});
    } 

    handleConfirm = () => {
        this.props.getFinancialData(this.props.movies[0].id, this.props.movies[1].id);
    }

    buildMovieDetails(){
        const { movies } = this.props;
        return this.props.movies.map( movie => {
            return (
                <div key={ movie.id } className='modal-movie-img'> 
                    <img src= { movie.image_url } id='movie-1-img' className='movie-image'/>
                    <h3 className='title'>{ movie.title }</h3>
                    <h3 className='genre'>Genre: { movie.genre }</h3>
                    <h3 className='mpaa'>Rating: { movie.mpaa_rating }</h3>
                    <h3 className='audience-satisfaction'>Audience Satisfaction: { movie.audience_satisfaction * 100}%</h3>
                    <h3 className='budget'>Budget: ${parseInt(movie.budget).toLocaleString()}</h3>
                    <h3 className='us-gross'>U.S. Box Office: ${parseInt(movie.us_gross_bo).toLocaleString()}</h3>
                    <h3 className='intl-gross'>International Box Office: ${parseInt(movie.intl_gross_bo).toLocaleString()}</h3>
                    <h3 className='funding-partner'>Funding Partners: { this.mapThroughObjects(movie.funding_partners_info) }</h3>
                    <h3 className='distribution'>Distribution Company: { this.mapThroughObjects(movie.distribution_companies_info)}</h3>
                </div>
            )
        })
    }  

    render(){
        const {movies} = this.props;
        if(!movies[0]['title']){
            return <h1>Loading Data</h1>;
        }
     
        const baseClass = 'movie1_comparison_modal';
        return ( 
            <div>
            <div onClick = { this.props.toggleDetailPage } id='arrow-icon-up' className= { !this.props.detailPageOnclick ? 'hideArrow' : '' } >
            <i className='fas fa-angle-up'></i>
            </div>
            <div className={ this.props.detailPageOnclick ? 'active ' + baseClass : baseClass } id='movie_1'>
                <Nav/>
                {/*<h1>Detailed Information</h1>*/}
                <div className='details-filter'></div>
                <div className='modal-content details-info-container'>
                    { this.buildMovieDetails()}
                </div>

                <div className='details-button-container'>
                    <Link to='/financials'>
                        <button onClick={this.handleConfirm} className='input-submit-button details-page-button'>Confirm</button>
                    </Link>
                </div>
            </div>
         </div>
        )
    }  
}

const mapStateToProps = state => {
  return {
    movies: state.movies.movieList
   
  }
}

export default connect(mapStateToProps, {
  getMovieData, getFinancialData
})(DetailsPage);