/**
 *  This is the file that we're using to test the controller object.
 */
 
 describe('DataCollector App', function() {
    var helloWorldController, 
    scope;
    
    var $controller;
    
    beforeEach(module('iMotDataCollector'));

        
//    beforeEach(inject(function ($rootScope, $controller) {
//        scope = $rootScope.$new();
//        helloWorldController = $controller('iMotDataCont', {
//            $scope: scope
//        });
//    }));
    beforeEach(inject(function(_$controller_) {
      $controller = _$controller_;
    }))
    
    describe('simple test', function() {
        it('runs simple fnc test', function() {
            var $scope = {};
            var controller = $controller('iMotDataCont', { $scope: $scope });
            expect($scope.testFnc()).toBeDefined();
        })
        it('simple sum test', function() {
            var $scope = {};
            var controller = $controller('iMotDataCont', { $scope: $scope });
            var x = 1;
            var y = 2;
            var z = $scope.sum(x, y);
            expect(z).toBe(3);
        })
    });
    
    it ('should execute this.', function() {
        expect(true).toBe(true);
    })
    
    it ('displays simple text!', function() {
        expect(scope.test.txt).toEqual('');
    })
 })