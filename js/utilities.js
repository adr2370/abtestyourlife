angular.module('myApp.services')
.service('util', function() {
  return {
    split: function split(array, sections, percent) {
      percent = percent || 1;
      array = array.splice(0,array.length*percent);
      var buckets = [], size = Math.ceil(array.length/sections);
      while (array.length > 0) {
        buckets.push(array.splice(0, size));
      }
      return buckets;
    },
    shuffle: function shuffle(array) {
      var counter = array.length, temp, index;
      
      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;
        
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    }
  }
});