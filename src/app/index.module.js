import * as angular from 'angular';
import 'styles/index.css';

import '!!style!css!angular-material/angular-material.css';

require('expose?_!lodash');
require('restangular');

import config from './conf.ts';
import {routeConfig} from './index.route';
import {restangularConfig, mdThemingConfig} from './index.config';

import App from './main/app.cmp';
import PhotoCmp from './photo/photo.cmp';
import TagCmp from './tag/tag.cmp';

angular.module(APP_NAME, [
    require('angular-messages'),
    require('angular-ui-router'),
    require('angular-material'),
    'restangular',

    PhotoCmp,
    TagCmp
  ])
  .constant('config', config)

  .directive('app', App)

  .config(routeConfig)
  .config(mdThemingConfig)
  .config(restangularConfig)
;


angular.element(document).ready(function () {
  angular.bootstrap(document, [APP_NAME]);
});
