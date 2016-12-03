Documents = new Meteor.Collection("docs");

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
var microsoftOcrCall = function (imageUrl, callback) {
  if(imageUrl === "" )
    var imageUrl = "http://www.slideteam.net/media/catalog/product/cache/1/thumbnail/543x403/0e7a751fc24f39b632cb88e6c5925d9b/m/o/mobile_internet_powerpoint_template_0810_text.jpg";
  console.log("image url: " + imageUrl);
  try {
    var response = Meteor.http.call(
      "POST", 
      "https://api.projectoxford.ai/vision/v1.0/ocr?language=unk&detectOrientation =true HTTP/1.1", 
      {headers: {
        "Content-Type":"application/json",
        "Ocp-Apim-Subscription-Key":"e089513770564acd9a7efc97f5b0abdb"},        
        data:{"url":imageUrl}});
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

if(Meteor.isServer){
  Meteor.methods({
        ocrImage: function (imageUrl) {
            this.unblock();
            var response = Meteor.wrapAsync(microsoftOcrCall)(imageUrl);
            return response;
      /*      Meteor.http.call(
      "POST", 
      "https://api.projectoxford.ai/vision/v1.0/ocr?language=unk&detectOrientation =true HTTP/1.1", 
      {headers: {
        "Content-Type":"application/json",
        "Ocp-Apim-Subscription-Key":"e089513770564acd9a7efc97f5b0abdb"},        
        data:{"url":"http://www.slideteam.net/media/catalog/product/cache/1/thumbnail/543x403/0e7a751fc24f39b632cb88e6c5925d9b/m/o/mobile_internet_powerpoint_template_0810_text.jpg"}});
        /*    function(error, result){
                console.log("In callback function");
              if(result){
                console.log("result?", result.content);
                return result;
              }
              else{
                console.log("You've got error");
                return error;
              }
            });  
            console.log("response returned");
            return response;                            */
      }
    });
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

/*if (Meteor.isServer) {  
  Meteor.publish("search", function(searchValue){
    if(searchValue){
      return Images.find(
       // {'userId': this.userId},{searchValue}
      )
    }
    console.log("Searching for: ", searchValue);
  }) */
  Meteor.publish('files.images', function (userId) {
    console.log(new Date());
    console.log('userID: ', userId);
    return Images.find({userId:userId}).cursor;
  });
}



//this.Images = new FilesCollection({collectionName: 'Images'}); 

