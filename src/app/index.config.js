export function restangularConfig(RestangularProvider, config) {
  'ngInject';
  RestangularProvider.setBaseUrl(config.api_url);
  RestangularProvider.setResponseExtractor(function (response, operation) {
    var newResponse = null;
    if (operation === 'getList') {
      newResponse = response.objects;
      newResponse.total = response.total;
    } else {
      newResponse = response;
    }

    return newResponse;
  });

}

export function mdThemingConfig($mdThemingProvider) {
  $mdThemingProvider.theme('default').accentPalette('grey');
}
