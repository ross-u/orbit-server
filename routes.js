'use strict';

const authorize = require('./middlewares/authorize.js');
const gate = require('./middlewares/gate');
const db = require('./models/index').db;
const CategoriesController = require('./controllers/categories.controller');
const EntriesController = require('./controllers/entries.controller');
const SnapshotsController = require('./controllers/snapshots.controller');

//////////////  REACTORED FOR TESTING   ////////////////////////////
const categoriesController = new CategoriesController(db.Category);
const entriesController = new EntriesController(db.User, db.Entry);
const snapshotsController = SnapshotsController(db.Entry);
////////////////////////////////////////////////////////////////////

const usersController = require('./controllers/users.controller');
const workspacesController = require('./controllers/workspaces.controller');

const router = require('koa-router')();

const routes = function (app) {
  // User
  router.get('/log-in', usersController.logIn);
  router.post('/sign-up', usersController.create);
  router.delete('/remove', authorize, gate, usersController.removeUser);

  // Categories
  router.get('/categories', authorize, gate, categoriesController.getAllCategories);
  router.get('/categories/:id', authorize, gate, categoriesController.getCategory);
  router.post('/categories', authorize, gate, categoriesController.addCategory);

  // Workspaces
  router.get('/dashboard', authorize, gate, workspacesController.dashboard);
  router.post('/dashboard', authorize, gate, workspacesController.addWorkspace);
  router.delete('/dashboard/:id', authorize, gate, workspacesController.deleteWorkspace);

  // Entries
  router.get('/dashboard/:workspace_id/', authorize, gate, entriesController.listEntriesByWorkspace);
  router.post('/dashboard/:workspace_id/', authorize, gate, entriesController.addEntry);
  router.delete('/dashboard/:workspace_id/:entryId', authorize, gate, entriesController.deleteEntry);

  // Snapshots
  router.post('/dashboard/:id/:entryId', authorize, gate, snapshotsController.addSnapshot);
  router.delete('/dashboard/:id/:entryId/:snapId', authorize, gate, snapshotsController.deleteSnapshot);

  router.options('/', options);
  router.trace('/', trace);
  router.head('/', head);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};


const head = async () => {
  return;
};

const options = async () => {
  this.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
};

const trace = async () => {
  this.body = 'Smart! But you can\'t trace.';
};

module.exports = routes;
