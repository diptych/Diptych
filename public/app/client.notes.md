```javascript
/*

    diptychSync.directive    // soley responsible for what is displayed or not
        $rootScope.on('keep', $scope)
            .call('/keep', $scope.id, )

    image.directive
        keep.directive
            $emit('keep')
        //.on('keep')        // doesn't listen, passes on
            //$emit('keep')
        swipe.directive
            $emit('swipe', left)
        .on('swipe')
            if left, $emit('toss', $scope)
            if right, $emit('keep', $scope)

    swipe.directive
        swipe:left -> $emit('image:toss', element? ) // goes up $scope chain

    pinch.directive
        on(pinch:in)
        -> $scope.emit('open:gallery')
            -> $scope.parent hears open:gallery
                -> $rootScope hears open:gallery
                -> images.directive
                   -> $rootScope.on('open:gallery')
                        -> fetch images?

 */
```
