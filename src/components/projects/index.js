import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Nav from '../navbar/index';
import '../../section/projects.scss'; 
import { connect } from 'react-redux';
import { getMyProjects, signIn, getFinancialData, getMovieData, getMovieTitles } from '../../actions';

class Projects extends Component {
  state = {
    toComparables: false,
    toFinancials: false
  }

  componentDidMount(){
    setTimeout(()=>{
      this.setState({ pageHasLoaded: true })
    },1000)
    this.props.getMyProjects();
  }

  seeComparables = (projectId) => {
    this.props.getMovieTitles(this.props.comparables[projectId][0].title, this.props.comparables[projectId][1].title);
    this.setState({toComparables: true})
  }

  seeFinancials = (projectId) => {
    this.props.getFinancialData(this.props.comparables[projectId][0].id, this.props.comparables[projectId][1].id).then(() => {
      this.setState({toFinancials: true})
    })
  }

  buildProject = (project) => {
    return (
        <div key={project.id} className='project-container'>
          <h1 className='project-title'>{project.title}</h1>
          <div className='multiple-fields'>
            <p className='project-detail'><span>Genre:</span> {project.genre}</p>
            <p className='project-detail'><span>Runtime:</span> {project.runtime}</p>
            <p className='project-detail'><span>MPAA Rating:</span> {project.mpaa_rating}</p>
            <p className='project-detail'><span>Release Year:</span> {project.year}</p>
          </div>
          <p className='project-detail'><span>Production Stage:</span> {project.production_stage}</p>
          <p className='project-detail'><span>Logline:</span> {project.logline}</p>
          <p className='project-detail'><span>Synopsis:</span> {project.synopsis}</p>
          <div className="my-projects-button-container">
            <button className='my-project-comparables-button page-button' onClick={() => {this.seeComparables(project.id)}}>Comparables</button>

            <button className='my-project-financial-button page-button' onClick={() => {this.seeFinancials(project.id)}}>Financials</button>
          </div> 
        </div>
    )
  }

  render(){
    
    if (this.state.toComparables === true) {
      return <Redirect to='/comparisons' />
    } else if (this.state.toFinancials === true){
      return <Redirect to='/financials' />
    }

    const projectCard = this.props.my_projects.map(this.buildProject);

    return (
      <div className='my-projects-wrapper'>
        <Nav />
        <h1 className='my-projects-title'>My Projects</h1>
        {projectCard}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    my_projects: state.myprojects.my_projects,

    comparables: state.session.user.projects

  }
}

export default connect(mapStateToProps, {
    getMyProjects, signIn, getFinancialData, getMovieData, getMovieTitles
})(Projects);
