angular.module('app.services', [])

.factory('pouchdb', function() {
  return new PouchDB('myApp');
})

.service('BlankService', [function(){

}]);

