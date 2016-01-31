export class AppCtrl { }

export default function Application() {
  return {
    restrict: 'E',
    template: require('./app.html'),
    controller: AppCtrl,
    controllerAs: 'app'
  };
}
