var app = angular.module("IMRApp", ['slimScroll']);

// app.directive('knob', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             $(element).knob();
//         }
//     };
// });

app.controller('knobs-ctrl', function($scope) {
  $scope.knobIds = ['1','2','3','4'];
});