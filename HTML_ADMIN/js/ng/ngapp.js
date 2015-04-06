angular.module("IMRApp", ['slimScroll', 'dropDownDeviceSubnet', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/feedingTimes', {
                templateUrl: 'js/ng/pages/feeding-times.html'
            })
            .when('/feederSettings', {
                templateUrl: 'js/ng/pages/feeder-settings.html'
            })
            .when('/feederLog', {
                templateUrl: 'js/ng/pages/feeder-log.html'
            })
            .otherwise({redirectTo: '/feedingTimes'});
    }])
    .controller('knobs-ctrl', function ($scope) {
        $scope.knobIds = ['1', '2', '3', '4'];
    });

// .directive('knob', function() {
//     return {
//         restrict: 'A',
//         replace: true,
//         link: function(scope, element, attrs) {
//             $(element).knob();
//         }
//     };
// });
