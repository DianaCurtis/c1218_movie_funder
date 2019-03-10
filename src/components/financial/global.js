import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Tabs, Tab } from 'react-bootstrap';
import financial from '../../section/financial.scss';
import { connect } from 'react-redux';
import { getFinancialData } from '../../actions';

class Global extends Component {

    componentDidMount(){
        this.props.getFinancialData();
    }

    render(){
        return(
            <div className='card-financial-global-wrapper'>
                <div className='card financial-card'>
                    <h5 className='financial-header'>Global Consumer Products</h5>
                    <div className="financial-body">
                        <p>Royalties Gross:<br/> ${this.props.finance['royalties gross'].toLocaleString()}</p>
                        <p>Merchandising Distribution Fee:<br/> ${this.props.finance['merchandising distribution fee'].toLocaleString()}</p>
                        <p>Sales Agent Fee:<br/> ${this.props.finance['sales agent fee'].toLocaleString()}</p>
                        <p>Distributor's Net:<br/> ${this.props.finance['distributor\'s net'].toLocaleString()}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    finance: state.finance.financeList[0]['global consumer products']
  }
}

export default connect(mapStateToProps, {
    getFinancialData
})(Global);