Documents = new Meteor.Collection("docs");

console.log("doing something");

if(Meteor.isServer){
  if(!Documents.findOne()){
  console.log("found nothing");
  Documents.insert({
  "_id": "01",
  "labels": ["test","sexy"],
  "image": "data/005.jpg",
  "text": "",
  "userId": "Co4joFJkhZgoBqRHR"
  });
}
}


Documents.featured = function(){
	var featuredDocIds = ["01"];
	return Documents.find({_id : {$in : featuredDocIds}});	
}

// file upload code

this.Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true, // allow remove files from Client
  onBeforeUpload: function (file) {    
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 5242880 && /png|jpg|jpeg|pdf/i.test(file.extension)) {            
      return true;
    } else {
      return 'Please upload image, with size equal or less than 5MB';
    }
  }
});


if (Meteor.isServer) { 
  Meteor.publish('docs', function () {
    return Documents.find();
  });
}
if (Meteor.isServer) {  
  Meteor.publish('files.images', function (userId) {
    console.log('published again');
    console.log('userID: ', userId);
    return Images.find({userId:userId}).cursor;
  });
}



//this.Images = new FilesCollection({collectionName: 'Images'}); 

