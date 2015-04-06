angular.module('slimScroll', [])
    .directive('slimScroll', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                angular.element(element).slimscroll({
                    height: "200px",
                    alwaysVisible: false,
                    size: "3px"
                });
            }
        };
    });