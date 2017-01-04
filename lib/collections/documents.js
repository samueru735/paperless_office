Documents = new Meteor.Collection("docs");

this.Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true, // allow remove files from Client
  // debug: true,
  //storagePath: 'public/images',
  // storagePath: '/public/',
  // downloadRoute: '/public/',
  // public: true,
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 5242880 && /png|jpg|jpeg|pdf/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 5MB';
    }
  },
  downloadCallback: function (fileObj) {

    // Must return true to continue download
    return true;
  },
  onAfterUpload: function(file){
    // ocr
    console.log("file: " + file.path);
  }
});


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
var microsoftOcrCall = function (imageId, callback) {
    // testing env
    var imageUrl = "http://www.slideteam.net/media/catalog/product/cache/1/thumbnail/543x403/0e7a751fc24f39b632cb88e6c5925d9b/f/r/friendly_doctor_medical_powerpoint_backgrounds_and_templates_0111_text.jpg" ;
    // production env
    //var imageUrl = Images.findOne({'_id':imageId}).link();
    //console.log("IMage link"+Images.findOne({'_id':imageId}).link());
   //var imagePath = Images.findOne({'_id':imageId}).path;

  console.log("image url: " + imageUrl);
  try {
    var response = Meteor.http.call(
      "POST",
      "https://api.projectoxford.ai/vision/v1.0/ocr?language=unk&detectOrientation =true HTTP/1.1",
      {headers: {
        "Content-Type":"application/json",
        "Ocp-Apim-Subscription-Key":"e089513770564acd9a7efc97f5b0abdb"},
        data:{'url':imageUrl}} );
    // A successful API call returns no error
    // but the contents from the JSON response
    callback(null, response);
  } catch (error) {
    // If the API responded with an error message and a payload
    if (error.response) {
      var errorCode = error.response.data.code;
      var errorMessage = error.response.data.message;
    // Otherwise use a generic error message
    } else {
      var errorCode = 500;
      var errorMessage = 'Cannot access the API';
    }
    // Create an Error object and return it via callback
    var myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
}

var freeOcrAPICall = function (pdfId, callback) {
    // testing env
    //var pdfUrl = "http://www.orimi.com/pdf-test.pdf" ;
    // production env
    var pdfUrl = Images.findOne({'_id':pdfId}).link();

  console.log("image url: " + pdfUrl);
  try {
    var response = Meteor.http.call(
      "POST",
      "https://api.ocr.space/parse/image",
      {
        params: {'apikey': 'e29bf4329488957',
                 'url':pdfUrl,
                 'isOverlayRequired': true}
      });
    // A successful API call returns no error
    // but the contents from the JSON response
    console.log(response.data);
    callback(null, response.data);
  } catch (error) {
    // // If the API responded with an error message and a payload
    // if (error.response) {
    //   var errorCode = error.response.data.code;
    //   var errorMessage = error.response.data.message;
    // // Otherwise use a generic error message
    // } else {
    //   var errorCode = 500;
    //   var errorMessage = 'Cannot access the API';
    // }
    // // Create an Error object and return it via callback
    // var myError = new Meteor.Error(errorCode, errorMessage);
    // callback(myError, null);
    console.log(error);
    return;
  }
}

if(Meteor.isServer){
  Meteor.methods({
      ocrImage: function (imageId) {
            this.unblock();
            var response = Meteor.wrapAsync(microsoftOcrCall)(imageId);
            return response;
      },
      ocrPDF: function (pdfId) {
          this.unblock();
          var response = Meteor.wrapAsync(freeOcrAPICall)(pdfId);
          return response;
    }
    });
}

if(Meteor.isServer){
  Meteor.methods({
    addOcrText: function(id, text){
      Images.update({'_id':id}, {$set:{"meta.text": text }});
      return Images.findOne({'_id':id});
    }
  })
}


Documents.featured = function(){
	var featuredDocLabels = ["test"];
	return Images.find({label : {$in : featuredDocLabels}});
}

Images.searchLabels = function(label){
  var featuredDocLabels = ["test"];
  return Images.find({label : {$in : featuredDocLabels}});
}
// file upload code


if (Meteor.isServer) {
  Meteor.publish('docs', function () {
    return Documents.find();
  });


  Meteor.publish('files.images', function (userId) {
    console.log(new Date());
    console.log('userID: ', userId);
    return Images.find({userId:userId}).cursor;
  });

}
