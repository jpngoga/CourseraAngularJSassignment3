(function () {
'use strict';

  angular.module('NarrowItDownApp', [])
         .controller('NarrowItDownController', NarrowItDownController)
         .service('MenuSearchService', MenuSearchService)
         .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
         .directive('foundItems', FoundItemsDirective);


  function FoundItemsDirective() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'found-items.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      controller: MenuItemsDirectiveController,
      controllerAs: 'menu',
      bindToController: true
    };

    return ddo;
  }

  function MenuItemsDirectiveController() {
    var menu = this;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.searchTerm = '',

    menu.getItems = function() {
      var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm.toLowerCase());

      promise.then(function(response) {
        menu.foundItems = response;
      });
    };

    menu.removeItem = function(index) {
      menu.foundItems.splice(index, 1);
    }
  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (response) {
        service.items = response.data.menu_items;
        service.matchedItems = [];

        for (var i = 0; i < service.items.length; i++) {
          service.itemDescription = service.items[i].description.toLowerCase();
          if (service.itemDescription.indexOf(searchTerm) !== -1 && searchTerm !== '') {
            service.matchedItems.push(service.items[i]);
          }
        }

        return service.matchedItems;
      });
    };
  }

})();
