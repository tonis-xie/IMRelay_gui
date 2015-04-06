angular.module('dropDownDeviceSubnet', ['slimScroll', 'IMRService'])
    .directive('dropDownDeviceSubnet', function() {
        return {
            scope: {},
            templateUrl: 'js/ng/directives/drop-down-device-subnet.html',
            replace: true,
            controller: 'DropDownDeviceSubnetCtrl'
        };
    })
    .controller('DropDownDeviceSubnetCtrl', ['$scope', 'IMRService', function($scope, IMRService) {
        $scope.chosenSubnet = IMRService.GetChosenSubnet();
        $scope.subnets = IMRService.GetSubnets();
        $scope.subnetChanged = function(subnet) {
            $scope.chosenSubnet = subnet;
            IMRService.SetChosenSubnet(subnet);
        };
    }]);
