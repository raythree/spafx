import React from 'react';
import './App.css';
import TopNav from './TopNav';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { createBrowserHistory } from "history";

import Page1 from './Page1';
import Page2 from './Page2';
import Menu from './Menu';

const history = createBrowserHistory();

function App() {
  return (
    <>
      <TopNav name="SPA Interaction Demo"/>      
      <Container>
        <Router history={history} basename="/spa2">
          <Box>
            <h2>Welcome to SPA 2</h2>
            <br/>
            <Menu/>
            <Box paddingTop="1em">
              <Switch>
                <Route exact path="/page1">
                  <Page1 />
                </Route>
                <Route exact path="/page2">
                  <Page2 />
                </Route>
                <Redirect to="/page1"/>
              </Switch>
            </Box>
          </Box>
        </Router>
      </Container>
    </>
  );
}

export default App;
