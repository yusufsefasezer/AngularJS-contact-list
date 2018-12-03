var RESIZE_IMAGE = false;
var app = angular.module('contactApp', ['ngRoute']);

/////////////////////////////  Config  /////////////////////////////
app.config(function ($routeProvider) {
  $routeProvider.
    when('/add', {
      templateUrl: 'components/pages/form.html',
      controller: 'addContactCtrl'
    })
    .when('/contact/:id', {
      templateUrl: 'components/pages/show.html',
      controller: 'showContactCtrl'
    })
    .when('/edit/:id', {
      templateUrl: 'components/pages/form.html',
      controller: 'editContactCtrl'
    })
    .otherwise({
      templateUrl: 'components/pages/default.html'
    });
});

/////////////////////////////  Directive  /////////////////////////////
// Header directive
app.directive('contactHeader', function () {
  return {
    templateUrl: 'components/header.html',
    link: function ($scope) {

      // Select contact
      $scope.selectContact = function () {
        $scope.resetStatus();
        $scope.footer = true;
        $scope.isSelect = true;
        $scope.isDelete = true;
      };

      // Add new contact
      $scope.showAdd = function () {
        $scope.resetStatus();
        $scope.footer = true;
        $scope.isAdd = true;
      };

    }
  }
});

// Main directive
app.directive('contactMain', function () {
  return {
    templateUrl: 'components/main.html'
  }
});

// Search form directive
app.directive('searchForm', function () {
  return {
    templateUrl: 'components/partials/search-form.html'
  }
});

// Contact list directive
app.directive('contactList', function () {
  return {
    templateUrl: 'components/partials/contact-list.html',
    scope: true
  }
});

// Contact directive
app.directive('contact', function () {
  return {
    templateUrl: 'components/partials/contact.html',
    replace: true
  }
});

// Footer directive
app.directive('contactFooter', function () {
  return {
    templateUrl: 'components/footer.html'
  }
});

/////////////////////////////  Controller  /////////////////////////////
// Main controller
app.controller('mainCtrl', function ($scope, contactService, $rootScope, $location) {
  $scope.title = 'AngularJS Contact List';
  $scope.contacts = contactService.contactList;
  $rootScope.currentContact;
  $scope.contactForm = {};

  $scope.footer = false;
  $scope.isSelect = false;
  $scope.isAdd = false;
  $scope.isEdit = false;
  $scope.isDelete = false;

  $scope.showContact = function () {
    $scope.resetStatus();
    $scope.footer = true;
    $scope.isEdit = true;
  };

  $scope.showEdit = function () {
    $scope.resetStatus();
    $scope.footer = true;
    $scope.isDelete = true;
  };

  $scope.resetStatus = function () {
    $scope.footer = false;
    $scope.isSelect = false;
    $scope.isAdd = false;
    $scope.isEdit = false;
    $scope.isDelete = false;
    $scope.contacts.forEach(function (contact) {
      contact.checked = false;
    });
  };

  $scope.addContact = function () {
    contactService.add($rootScope.currentContact);
    $scope.contacts = contactService.contactList;
  };

  $scope.deleteContact = function () {
    contactService.delete();
    contactService.deleteById($rootScope.currentContact.id);
    $scope.contacts = contactService.contactList;

    if ($scope.contacts.length > 0) {
      $rootScope.currentContact = $scope.contacts[0];
    } else {
      $location.path('/');
      $scope.resetStatus();
    }
  };

  $scope.showImage = function ($event) {
    if ($event.target.files.length != 1) return false;

    // Select and check
    var selectedFile = $event.target.files[0];
    if (!selectedFile.type.match('image.*')) return false;

    // FileReader
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      var newImage = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        MAX = 75;

      newImage.src = e.target.result;
      newImage.addEventListener('load', function () {
        var ratio = MAX / newImage.height;

        newImage.width *= ratio;
        newImage.height = MAX;

        ctx.clearRect(0, 0, newImage.width, newImage.height);
        canvas.width = newImage.width;
        canvas.height = newImage.height;
        ctx.drawImage(newImage, 0, 0, newImage.width, newImage.height);

        $rootScope.currentContact.photo = RESIZE_IMAGE ? canvas.toDataURL() : newImage.src;
        $scope.$digest();
      });
    });
    reader.readAsDataURL(selectedFile);

    return true;
  };

});

// Contact show controller
app.controller('showContactCtrl', function ($scope, $routeParams, $rootScope, $location) {

  $rootScope.currentContact = $scope.contacts.find(function (contact) {
    return contact.id == $routeParams.id;
  });

  if ($rootScope.currentContact == null)
    $location.path('/');

  $scope.showContact();
});

// Contact edit controller
app.controller('editContactCtrl', function ($scope, $routeParams, $rootScope, $location) {

  $rootScope.currentContact = $scope.contacts.find(function (contact) {
    return contact.id == $routeParams.id;
  });

  if ($rootScope.currentContact == null)
    $location.path('/');

  $scope.showEdit();
});

// Contact add controller
app.controller('addContactCtrl', function ($scope, $rootScope) {
  $rootScope.currentContact = new Contact();
  $rootScope.currentContact.photo = 'img/no-avatar.png';
  $scope.showAdd();
});

/////////////////////////////  Service  /////////////////////////////
// Contact Service
app.service('contactService', function () {

  this.contactList = [
    new Contact('Rhody Farquhar', 'rfarquhar0@va.gov', '2906036054', 'http://prweb.com', 'https://robohash.org/illumetrerum.png?size=100x100&set=set1', '032 Waubesa Avenue', 'vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id'),
    new Contact('Farand Valde', 'fvalde1@reference.com', '7504488204', 'https://uol.com.br', 'https://robohash.org/voluptatemsimiliqueculpa.png?size=100x100&set=set1', '7 Paget Crossing', 'eleifend donec ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim leo rhoncus'),
    new Contact('Sarene Cowdery', 'scowdery2@behance.net', '2518926895', 'https://multiply.com', 'https://robohash.org/illoetsint.png?size=100x100&set=set1', '52256 North Circle', 'turpis enim blandit mi in porttitor pede justo eu massa donec'),
    new Contact('Tasia Oldridge', 'toldridge3@unc.edu', '2552926925', 'http://icio.us', 'https://robohash.org/eumquamexplicabo.png?size=100x100&set=set1', '11 Merrick Point', 'congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum'),
    new Contact('Raina Pigney', 'rpigney4@weibo.com', '1665350879', 'https://imdb.com', 'https://robohash.org/ametquodiusto.png?size=100x100&set=set1', '50 Petterle Hill', 'interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien'),
    new Contact('Rhianna Dermot', 'rdermot5@answers.com', '1657592814', 'https://clickbank.net', 'https://robohash.org/iustoexcepturiquia.png?size=100x100&set=set1', '6565 Sherman Trail', 'lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet'),
    new Contact('Eduard Oakden', 'eoakden6@cpanel.net', '9512879955', 'https://army.mil', 'https://robohash.org/ducimuslaboriosamqui.png?size=100x100&set=set1', '9 2nd Road', 'venenatis turpis enim blandit mi in porttitor pede justo eu massa donec dapibus duis at'),
    new Contact('Gaby Berndtssen', 'gberndtssen7@hubpages.com', '3003138365', 'http://quantcast.com', 'https://robohash.org/eteosblanditiis.png?size=100x100&set=set1', '2925 Aberg Circle', 'magna at nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus'),
    new Contact('Gill Hunnable', 'ghunnable8@dot.gov', '7078567528', 'http://boston.com', 'https://robohash.org/quovoluptatemvoluptas.png?size=100x100&set=set1', '03 Johnson Terrace', 'mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse'),
    new Contact('Bethanne Agius', 'bagius9@oakley.com', '5969400750', 'http://google.it', 'https://robohash.org/harumvelitaut.png?size=100x100&set=set1', '8 American Drive', 'vestibulum vestibulum ante ipsum primis in faucibus orci luctus et')
  ];

  this.add = function (contact) {
    this.contactList.push(contact);
  };

  this.delete = function () {
    this.contactList = this.contactList.filter(function (contact) {
      return !contact.checked
    });
  };

  this.deleteById = function (contactId) {
    this.contactList = this.contactList.filter(function (contact) {
      return contact.id != contactId;
    });
  };

});

/////////////////////////////  Model  /////////////////////////////
// Contact
function Contact(name, email, phone, url, photo, address, notes) {
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.url = url;
  this.photo = photo;
  this.address = address;
  this.notes = notes;
  this.id = Contact._id++;
};

Contact.prototype.formatPhoneNumber = function () {
  if (this.phone) {
    return this.phone.substr(0, 3) + ' ' + this.phone.substr(0, 3) + ' ' + this.phone.substr(0, 3);
  }
  return this.phone;
};

Contact._id = 0;