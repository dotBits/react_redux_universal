import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router';
import App from './App';
import ListRx from './components/items/ListRx'
import SingleRx from './components/items/SingleRx'
import NotFoundPage from './components/404_not_found_page/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ListRx}/>
    <Route path="items" component={ListRx} />
    <Route path="/item/:itemId" component={SingleRx} />
  </Route>
)

/*
<Route path="*" component={NotFoundPage}/>
*/
