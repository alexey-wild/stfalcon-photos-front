import * as angular from 'angular';
import TagCmp from './list/list.cmp';

function routeConfig($stateProvider) {
  $stateProvider
    .state('tags', {
      url: '/tags',
      template: '<tags-cmp></tags-cmp>'
    })
  ;
}
routeConfig.$inject = ['$stateProvider'];

export default angular.module('tag', [])
  .directive('tagsCmp', TagCmp)
  .config(routeConfig)
  .name
