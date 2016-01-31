import * as angular from 'angular';
import config from './../../conf.ts';

declare var require:any;

export default function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    template: require('./list.html'),
    styles: require('./list.css'),
    controller: PhotoListComponent,
    controllerAs: 'vm'
  }
}

export class PhotoListComponent {
  private file:File;
  private PhotoRest:restangular.IElement;
  private TagRest:restangular.IElement;
  private tags;
  private photos;
  private pearPage:number = 2;
  private currentPage:number = 1;

  private selectedTags = [];
  private selectedTag = null;
  private searchText = null;

  constructor(Restangular:restangular.IService, private $mdDialog) {
    this.PhotoRest = Restangular.all('photo');
    this.TagRest = Restangular.all('tag');

    this.activate();
  }

  protected round(x: number) {
    return Math.round(x);
  }

  protected onSearchTagUpdated(chip) {
    this.getPhotos();
  }

  protected transformChip(chip) {
    if (angular.isObject(chip)) {
      return chip.name;
    }

    return chip
  }

  protected queryTag(query) {
    return query ? this.tags.filter(this.createFilterFor(query)) : [];
  }

  protected createFilterFor(query) {
    return function filterFn(tag) {
      return tag.name.indexOf(query) === 0;
    };
  }

  activate() {
    this.getPhotos();
    this.getTags();
  }

  toPrevPage() {
    this.currentPage--;
    this.getPhotos(this.currentPage);
  }

  toNextPage() {
    this.currentPage++;
    this.getPhotos(this.currentPage);
  }

  getPhotos(page?:number) {
    var queryParams = {};

    if (this.selectedTags) {
      queryParams['tags[]'] = this.selectedTags;
    }

    if (!page) {
      page = 1;
    }

    queryParams['page'] = page;

    this.PhotoRest.getList(queryParams).then((photos:any) => {
      photos.forEach(function(photo:any) {
        photo['url'] = config.photos_url + photo.name;
      });

      this.photos = photos;
    });
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

  editPhoto(ev, photo) {
    var self = this;
    this.$mdDialog.show({
      controller: ['$mdDialog', function ($mdDialog) {
        var self = this;
        self.formError = null;
        self.file = null;

        self.selectedTag = null;
        self.searchText = null;

        self.selectedTags = [];
        photo.tags.forEach(function (tag:any) {
          self.selectedTags.push(tag.name);
        });

        self.close = () => $mdDialog.cancel();

        self.save = (photo) => {
          photo.tags = self.selectedTags;
          photo.put().then(res => {
            if (res.error) {
              self.formError = res.error.message;
            } else {
              $mdDialog.hide(res);
            }
          });
        }
      }],
      controllerAs: 'vm',
      template: require('./dialogs/edit-dialog.html'),
      styles: require('./dialogs/edit-dialog.css'),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        createFilterFor: this.createFilterFor,
        queryTag: this.queryTag,
        transformChip: this.transformChip,
        photo: photo,
        tags: this.tags,
        PhotoRest: this.PhotoRest
      },
      bindToController: true
    }).then(function () {
      self.activate();
    }, function () { });
  }

  addPhoto(ev) {
    var self = this;
    this.$mdDialog.show({
      controller: ['$mdDialog', function ($mdDialog) {
        var self = this;
        self.formError = null;
        self.file = null;

        self.selectedTag = null;
        self.searchText = null;
        self.selectedTags = [];

        self.close = () => $mdDialog.cancel();

        self.upload = () => {
          var formData = new FormData();
          formData.append('file', self.file, self.file.name);
          self.selectedTags.forEach(function (element:any) {
            formData.append('tags[]', element);
          });

          self.PhotoRest
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(formData, undefined, undefined, {'Content-Type': undefined})
            .then(res => {
              if (res.error) {
                self.formError = res.error.message;
              } else {
                $mdDialog.hide(res);
              }
            });
        }
      }],
      controllerAs: 'vm',
      template: require('./dialogs/add-dialog.html'),
      styles: require('./dialogs/add-dialog.css'),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        createFilterFor: this.createFilterFor,
        queryTag: this.queryTag,
        transformChip: this.transformChip,
        tags: this.tags,
        PhotoRest: this.PhotoRest
      },
      bindToController: true
    }).then(function () {
      self.activate();
    }, function () { });
  }

  removePhoto(ev, photo) {
    var self = this;
    this.$mdDialog.show(
      this.$mdDialog.confirm({
        title: 'You want remove this photo?',
        ariaLabel: 'You want remove this photo?',
        targetEvent: ev,
        ok: 'Yes',
        cancel: 'No',
        bindToController: true,
      })
    ).then(function() {
      photo.remove().then(res => {
        if (res.success) {
          self.photos.splice(self.photos.indexOf(photo), 1);
        }
      });
    }, function() { });
  }
}
