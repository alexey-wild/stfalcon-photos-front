import * as angular from 'angular';
import PhotosCmp from './list/list.cmp';

function routeConfig($stateProvider) {
  $stateProvider
    .state('photos', {
      url: '/photos',
      template: '<photos-cmp></photos-cmp>'
    })
  ;
}
routeConfig.$inject = ['$stateProvider'];

export default angular.module('photo', [])
  .directive('photosCmp', PhotosCmp)
  .directive('inputFile', function inputFile() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        inputFile: '&'
      },
      link: function link(scope:any, element:any, attrs:any, ctrl:any) {
        element.on('change', onChange);

        scope.$on('destroy', function () {
          element.off('change', onChange);
        });

        function onChange() {
          attrs.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
        }
      }
    }
  })
  .config(routeConfig)
  .name
