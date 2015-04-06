angular.module('dropDownDeviceSubnet', ['slimScroll', 'IMRService'])
    .directive('dropDownDeviceSubnet', function() {
        return {
            scope: {},
            templateUrl: 'js/ng/directives/drop-down-device-subnet.html',
            replace: true,
            controller: 'DropDownDeviceSubnetCtrl',
            controllerAs: 'ctrl'
        };
    })
    .controller('DropDownDeviceSubnetCtrl', ['IMRService', function(IMRService) {
        this.chosenSubnet = IMRService.GetChosenSubnet();
        this.subnets = IMRService.GetSubnets();
        this.subnetChanged = function(subnet) {
            this.chosenSubnet = subnet;
            IMRService.SetChosenSubnet(subnet);
        };
    }]);
