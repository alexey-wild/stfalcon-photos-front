export function routeConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: 'HOME PAGE'
    })
  ;

  $urlRouterProvider.otherwise('/');
}

routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
