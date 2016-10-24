Documents = new Meteor.Collection("docs");

console.log("doing something");

if(Documents.find().count() === 0){
	console.log("found nothing");
	Documents.insert({
	"_id": "01",
	"labels": ["test","sexy"],
	"image": "data/005.jpg",
	"text": "",
	"userId": "Co4joFJkhZgoBqRHR"
	});
}

Documents.featured = function(){
	var featuredDocIds = ["01"];
	return Documents.find({_id : {$in : featuredDocIds}});	
}

// file upload code

/*var Images = new FilesCollection({
  collectionName: 'docImages',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 5242880 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 5MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}

this.Images = new FilesCollection({collectionName: 'Images'}); */