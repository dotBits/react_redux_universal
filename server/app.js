"use strict";
process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

const __cwd = process.cwd(),
      routes = require('../client/routes.js');

import path from 'path'
import express from 'express'
import config from './config/environments'
import bodyParser from 'body-parser'
import compression from 'compression'
import ITEMS from './items_250'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { match, RouterContext } from 'react-router'
import Reducer from '../client/reducers/index'

import { IntlProvider } from 'react-intl'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'

const app = express();

const userLocale = 'en',
      i18n = {
        "formats": {
          "date": {
              "short": {
                  "day": "numeric",
                  "month": "long",
                  "year": "numeric"
              }
          },
          "time": {
              "hhmm": {
                  "hour": "numeric",
                  "minute": "numeric"
              }
          }
        },
        "messages": {
          "nav.users":"Items",
          "users.list_header":"Item list",
          "users.buttons.new":"New",
          "users.filters.labels.name":"Name",
          "users.filters.labels.email":"Email",
          "users.filters.labels.role":"Role",
          "users.filters.labels.status":"Status",
          "globals.no_results":"No results found. Check the filters or create a new item.",
          "globals.matches":"{nunMatches, plural,\n  =0 {0 results}\n  =1 {1 result}\n  other {# results}\n}",
          "globals.filters":"Filters",
          "globals.filters.reset":"Reset filters",
          "globals.filters.show":"Show search filters",
          "globals.filters.hide":"Hide search filters",
          "globals.filters.name":"Name",
          "globals.filters.uploader":"Uploader",
          "globals.filters.sort.name":"Sort by name",
          "globals.filters.sort.created_at":"Sort by creation",
          "globals.filters.sort.updated_at":"Sort by update",
          "globals.menu.reload":"Reload list",
          "globals.menu.reload.item":"Reload",
          "globals.menu.select.all":"Select all",
          "globals.menu.select.none":"Select none",
          "globals.menu.select.invert":"Invert selection",
          "globals.menu.delete.selection":"Delete selection"
        }
      };


app.use(compression());
app.use(bodyParser.json({limit: '18mb'}));
app.disable('x-powered-by');

//------------------------------------------------------------------------------------------------------------------------
// PAGE RENDER ENGINE SETTINGS
//------------------------------------------------------------------------------------------------------------------------
app.set('view engine', 'pug');
app.set('views', __cwd + '/server/');


//------------------------------------------------------------------------------------------------------------------------
// WEBPACK DEVELOPMENT SETTINGS
//------------------------------------------------------------------------------------------------------------------------
if(process.env.NODE_ENV === 'development') {
  const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackConfig = require('../webpack.config'),
        compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {colors: true}
  }))

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }))
}
app.use('/', express.static( path.join(__cwd, config.env_path)));



//------------------------------------------------------------------------------------------------------------------------
// ROUTES
//------------------------------------------------------------------------------------------------------------------------
app.get('*', function(req, res) {
  match({routes:routes.default, location:req.url}, (error, redirectLocation, renderProps) => {
    if(error) {
      res.status(500).send(error.message);

    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);

    } else if (renderProps) {
      let Store = createStore(Reducer, applyMiddleware(thunk));

      // Grab the initial state from our Redux store
      const preloadedState = Store.getState();

      const promises = renderProps.components.map(function (component, index) {
        if (typeof component.fetchData !== 'function') { return false }

        let gotItemIds = req.url.match(/^\/item\/(\d+)$/),
            gotItemId;

        if(gotItemIds) {
          gotItemId = parseInt( gotItemIds[1] );
          return component.fetchData(Store.dispatch, gotItemId);
        } else {
          return component.fetchData(Store.dispatch);
        }

      })

      Promise.all(promises).then(() => {
        res.render('views/index.pug', {
          app: renderToString(
              <div>
                <IntlProvider locale={userLocale} messages={i18n.messages} formats={i18n.formats}>
                  <Provider store={Store} >
                    <RouterContext {...renderProps} />
                  </Provider>
                </IntlProvider>
              </div>
            ),
          preloadedState: preloadedState
        })


      })

    } else {
      res.status(404).send('Not found');
    }
  })

})



app.post('/api/v1/items/list', function(req, res) {
  let retHash = {items: Array.from(ITEMS), _results:0, _matches:0, message: "Item list loaded"},
      i,
      xhrOffset = 0,
      xhrLimit = 1000,
      xhrSorter = 'items.name ASC';

  if(req.body.pagination) {
    if(req.body.pagination.limit) { xhrLimit = req.body.pagination.limit }
    if(req.body.pagination.offset) { xhrOffset = req.body.pagination.offset }
  }

  if(req.body.filters) {
     if(req.body.filters.name)
      if(req.body.filters.name.length>0)
        retHash.items = retHash.items.filter((x) => { return (x.name.indexOf(req.body.filters.name) !== -1) })

    if(req.body.filters.email)
     if(req.body.filters.email.length>0)
       retHash.items = retHash.items.filter((x) => { return (x.email.indexOf(req.body.filters.email) !== -1) })

    if((req.body.filters.user_status_ids) && (req.body.filters.user_status_ids.length > 0))
      retHash.items = retHash.items.filter((x) => { return (req.body.filters.user_status_ids.indexOf(x.user_status_id) !== -1) })

    if((req.body.filters.user_role_ids) && (req.body.filters.user_role_ids.length > 0))
      retHash.items = retHash.items.filter((x) => { return (req.body.filters.user_role_ids.indexOf(x.user_role_id) !== -1) })

    if(req.body.filters.sorter)
      xhrSorter = req.body.filters.sorter;
  }

  retHash.items = retHash.items.sort(function (a, b) {
    switch(xhrSorter) {
      case 'items.name ASC':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  switch(xhrSorter) {
    case 'items.name DESC':
      retHash.items = retHash.items.reverse();
      break;
  }

  retHash._matches = retHash.items.length;

  retHash.items.slice(xhrOffset, xhrLimit);
  retHash.items = retHash.items.slice(xhrOffset, xhrLimit);

  for(i=0; i<retHash.items.length; i++) {
    retHash.items[i]._checked = false;

    if(retHash.items[i].user_status_id === 1)
      retHash.items[i]._user_status_name = 'Active';
    else
      retHash.items[i]._user_status_name = 'Disabled';

    if(retHash.items[i].user_role_id === 1)
      retHash.items[i]._user_role_name = 'Admin';
    else if(retHash.items[i].user_role_id === 101)
      retHash.items[i]._user_role_name = 'Manager';
    else if(retHash.items[i].user_role_id === 201)
      retHash.items[i]._user_role_name = 'User';
  }

  retHash._results = retHash.items.length;
  res.json(retHash);
});

app.put('/api/v1/items/single/:id(\\d+$)', function(req, res) {
  const itemId = parseInt(req.params.id);
  let retHash = {message:'Item loaded', item: {name:'Item not found', _found:false}}, i;

  for(i=0; i<ITEMS.length; i++) {
    if(itemId === ITEMS[i].id) {
      retHash.item = Object.assign({}, ITEMS[i]);

      if(retHash.item.user_status_id === 1)
        retHash.item._user_status_name = 'Active';
      else
        retHash.item._user_status_name = 'Disabled';

      if(retHash.item.user_role_id === 1)
        retHash.item._user_role_name = 'Admin';
      else if(retHash.item.user_role_id === 101)
        retHash.item._user_role_name = 'Manager';
      else if(retHash.item.user_role_id === 201)
        retHash.item._user_role_name = 'User';

      retHash.item._found = true;
      break;
    }
  }

  res.json(retHash);
})

app.post('/api/v1/items-status/list', function(req, res) {
  const retHash = {item_status: [{id:1, name:'Active'}, {id:101, name:'Disabled'}], message: "Item status list loaded"};
  res.json(retHash);
});

app.post('/api/v1/items-roles/list', function(req, res) {
  const retHash = {
    item_roles:[
      {id:1, name:'Admin'},
      {id:101, name:'Manager'},
      {id:201, name:'User'}
    ],
    message: "Item status list loaded"
  };

  res.json(retHash);
});

app.post('/api/v1/items', function(req, res) {
  res.status(400).json({message: "Not available. This is only a demo"});
});

app.post('/api/v1/items/bulk-delete', function(req, res) {
  res.status(400).json({message: "Not available. This is only a demo"});
});

//------------------------------------------------------------------------------------------------------------------------
// START SERVER
//------------------------------------------------------------------------------------------------------------------------
app.listen(config.expressPort, () => {
  if(process.env.NODE_ENV === 'development') {
    console.log(process.env.NODE_ENV, 'mode');
    console.log(`Listening on port ${config.expressPort}`);
  }
});
