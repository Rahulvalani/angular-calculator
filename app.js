/*
                AngularJS application
                Author: Mukesh Vaghashiya
*/

// Define angular module
var app=angular.module("calculator",['ngMessages']);

/*
    Created service to get the data through AJAX call($http service).
*/

angular.module("calculator").service('getDataService', function($http,$q){
  	this.getData= function(){
          var defer= $q.defer();
      		   return $http.get('products.json').then(function(response){
                      defer.resolve(response.data);
                      return defer.promise;
      		          },
          		      function(error){
                			defer.reject(error);
                      return defer.promise;
                  	});
  	}
});

/*
    Calculator contorller to handle the busniess logic
*/
angular.module("calculator").controller("CalController", function($scope,getDataService,$timeout){
	$scope.user={};
  $scope.dataSelected={};
  $scope.user.showCal=false;
  $scope.user.showLaunch=true;
  var products=[];
  $scope.user.showType=false;
  getDataService.getData().then(function(response){
      products=response.products;
  }, function(error){

   // alert("Error");
  });  
  
  // To launch the calculator
  $scope.user.launchCal= function(){
    $scope.user.showCal=true;
    $scope.user.showType=false;
    $scope.user.dataSelected={};
    $scope.user.width="";
    $scope.user.length="";
    $scope.user.height="";
    $scope.user.weight="";
  };
	$scope.user.submitClick= function() {
       $scope.user.showType=true;   // Truthy for best match template
       $scope.user.noData=false;
		    var filter=[[],[],[],[],[],[],[],[],[],[],[]],count=0,sum=0,k=0;
        for(var i=0;i<products.length;i++){
           if(products[i].width >= $scope.user.width && products[i].height >= $scope.user.height &&
           products[i].length >= $scope.user.length && products[i].weight >= $scope.user.weight)
           {    k=0;
                sum=products[i].width+products[i].height+products[i].length;
                sum=sum- $scope.user.width+$scope.user.height+$scope.user.length; 
                filter[count][k]=products[i];
                k++;
                filter[count][k]=sum;
                count++; 
           }   
        }
        
        var index = 0;
        var value = filter[0];
        for (var i = 1; i < count; i++) {
          if (filter[i][1] < value) {
            value = filter[i][1];
            index = i;
          }
        }
        if (count==0){
          $scope.user.noData=true;
        }
        $scope.dataSelected=filter[index][0];

        // 5 Sec display for best match
        $timeout(function() {
            $scope.user.showCal=false;
        }, 5000);

	}
});

