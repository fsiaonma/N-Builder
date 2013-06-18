var smushit = require('../../libs/node-smushit/smushit');

//smash a single file
smushit.smushit('./img/');

// //smash files
// smushit.smushit(['file1', 'fiel2', ..]);

// //smash images in directory
// smushit.smushit('images-folder-path');

// //smash images in directory or the child-directories with recursive
// smushit.smushit('./img/', {recursive: true});

// //smash images and register callbacks
// smushit.smushit('images-folder-path', {
//     onItemStart: function(item){

//     },
//     onItemComplete: function(e, item, response){

//     },
//     onComplete: function(reports){

//     },
//     service: 'http://my-custom-domain-service/'
// });