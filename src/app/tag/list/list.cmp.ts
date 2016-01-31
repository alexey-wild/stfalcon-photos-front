import * as angular from 'angular';

declare var require:any;

export default function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: require('./list.html'),
    styles: require('./list.css'),
    controller: TagListComponent,
    controllerAs: 'vm'
  }
}

export class TagListComponent {
  private TagRest:restangular.IElement;
  private tags;

  constructor(Restangular:restangular.IService, private $mdDialog) {
    this.TagRest = Restangular.all('tag');

    this.activate();
  }

  activate() {
    this.getTags();
  }

  getTags(limit?:number) {
    var queryParams = {};
    if (limit) {
      queryParams['limit'] = limit;
    }

    this.TagRest.getList(queryParams).then((tags:any) => {
      this.tags = tags;
      if (tags.total > tags.length) {
        this.getTags(tags.total);
      }
    });
  }

  removeTag(ev, tag) {
    var self = this;
    this.$mdDialog.show(
      this.$mdDialog.confirm({
        title: 'You want remove this tag?',
        ariaLabel: 'You want remove this tag?',
        targetEvent: ev,
        ok: 'Yes',
        cancel: 'No',
        bindToController: true,
      })
    ).then(function() {
      tag.remove().then(res => {
        if (res.success) {
          self.tags.splice(self.tags.indexOf(tag), 1);
        }
      });
    }, function() { });
  }
}
