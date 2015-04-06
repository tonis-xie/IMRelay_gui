angular.module("IMRApp", ['slimScroll', 'dropDownDeviceSubnet'])
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
