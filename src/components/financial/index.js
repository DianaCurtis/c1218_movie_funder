import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {Redirect, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import NorthAmerica from './northAmerica';
import International from './international';
import Global from './global';
import Other from './other';
import OtherGraphs from '../charts.js/other';
import GlobalGraphs from '../charts.js/global';
import InternationalGraphs from '../charts.js/international';
import NorthAmericaGraphs from './../charts.js/northamerica';
import Disclaimer from '../footer/disclaimer';
import Preloader from '../preloader/index';
import Nav from '../navbar/index';
import { connect } from 'react-redux';
import { getFinancialData, getMovieData, sendToken } from '../../actions';

const token = 'f1f3aabffb332762c3c9c0cd87f9e280380d0a8b';

class FinancialNorthAmerica extends Component {
  state = {
    toShareable: false,
  }

  render(){
    return (
      <div className='main-container'>
        <Preloader/>
        <Nav/>
        <Link to={`/invest/${token}`} target="_blank">
          <button className="share_button page-button">Share</button>
        </Link>
        <h1 className='financial-charts-header'>Financial Calculations</h1>
        <Tabs defaultActiveKey='northAmerica'>
          <Tab eventKey='northAmerica' title='North America' className='tab'>
            <h1 className='chart-header'>Production Gross in Millions</h1>
            <NorthAmericaGraphs/>
            <NorthAmerica/>
          </Tab>
          <Tab eventKey='international' title='International'>
            <h1 className='chart-header'>International Gross Earnings</h1>
            <InternationalGraphs/>
            <International/>
          </Tab>
          <Tab eventKey='global' title='Global'>
            <h1 className='chart-header'>Global Consumer Products</h1>
            <GlobalGraphs/>
            <Global/>
          </Tab>
          <Tab eventKey='other' title='Other'>
            <h1 className='chart-header'>Distributors To Cost Ratio</h1>
            <OtherGraphs/>
            <Other/>
          </Tab>
        </Tabs>
        <Disclaimer/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    movies: state.movies.movieList,
    finance: state.finance.financeList
  }
}

export default connect(mapStateToProps, {
    getFinancialData, getMovieData, sendToken
})(FinancialNorthAmerica);