angular.module('IMRService', [])
    .service('IMRService', function() {
        var chosenSubnet = '169.254.4.';
        this.GetChosenSubnet = function() {
            return chosenSubnet;
        };
        this.SetChosenSubnet = function(subnet) {
            chosenSubnet = subnet;
            localStorage.device_subnet = subnet;
            //TODO: reload data
        };
        this.GetSubnets = function() {
            return [{
                subnetName: 'DHCP',
                subnet: '192.168.11.'
            }, {
                subnetName: 'Auto IP',
                subnet: '169.254.'
            }, {
                subnetName: 'Dev',
                subnet: '192.168.1.'
            }];
        };
    });