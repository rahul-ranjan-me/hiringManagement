import React, {component} from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Layout from './layout'
import $ from 'jquery';

import CandidatesList from './pages/candidateList/candidateList';
import AddCandidates from './pages/addNewCandidates/addNewCandidates';
import CandidateFeedback from './pages/candidateFeedback/candidateFeedback';
import ShowCandidate from './pages/showCandidate/showCandidate';
import ScheduleInterview from './pages/scheduleInterview/scheduleInterview';
import Login from './pages/login/login';
import Logout from './pages/login/logout';
import loginStatus from './pages/login/loginStatus';

const node = document.getElementById('app'),
    renderUI = () => {
        ReactDom.render((
            <Router history={browserHistory}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={CandidatesList} />
                    <Route path="login" component={Login} />
                    <Route path="logout" component={Logout} />
                    <Route path="listCandidates" component={CandidatesList} />
                    <Route path="addCandidates" component={AddCandidates} />
                    <Route path="/candidate/:email" component={ShowCandidate} />
                    <Route path="/feedback/:email" component={CandidateFeedback} />
                    <Route path="/schedule/:email" component={ScheduleInterview} />
                </Route>
            </Router>
        ), node)
    }

$.ajax({
    url: "http://localhost:8082/isLoggedIn",
    method: 'get',
    success: function(result){
        if(result.status){
            loginStatus.status = true;
            loginStatus.username = result.username;
        }else{
            loginStatus.status = false;
        }
        renderUI();
    }
});