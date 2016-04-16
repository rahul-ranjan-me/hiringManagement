import React, {component} from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Layout from './layout'

import CandidatesList from './pages/candidateList/candidateList';
import AddCandidates from './pages/addNewCandidates/addNewCandidates';
import CandidateFeedback from './pages/candidateFeedback/candidateFeedback';
import ShowCandidate from './pages/showCandidate/showCandidate';
import ScheduleInterview from './pages/scheduleInterview/scheduleInterview';

let node = document.getElementById('app');

ReactDom.render((
	<Router history={browserHistory}>
    	<Route path="/" component={Layout}>
    		<IndexRoute component={CandidatesList} />
    		<Route path="listCandidates" component={CandidatesList} />
    		<Route path="addCandidates" component={AddCandidates} />
    		<Route path="/candidate/:email" component={ShowCandidate} />
      		<Route path="/feedback/:email" component={CandidateFeedback} />
      		<Route path="/schedule/:email" component={ScheduleInterview} />
    	</Route>
  	</Router>
), node)