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

  /* try {    
    var res = request.getSync(" http://localhost:3000/cdn/storage/Images/XtKRkWDhfDTwytd8T/original/XtKRkWDhfDTwytd8T.jpg",
      {
        encoding: null
      });
    if (res.response.statusCode == 200) {
        console.log(res.body);
    }
    } catch (error) {
  console.log("error: ", error);
    // See below for info on errors
  }  */
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

 // if(imageUrl === "" )

    var imageUrl = Images.findOne({'_id':imageId}).link();
    var imageBinary ;
   // var result = request.getSync(imageUrl);
   // console.log("response: ",result.response);
    //console.log("body: ", result.body);
   // imageBinary = result.body;  
  //var blob = new Blob([result.body], {type: 'application/octet-stream'});
  //console.log(blob);  
  
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

if(Meteor.isServer){
  Meteor.methods({
        ocrImage: function (imageId) {
            this.unblock();
            var response = Meteor.wrapAsync(microsoftOcrCall)(imageId);
            return response;                        
      }
    });
}

if(Meteor.isServer){
  Meteor.methods({
    addOcrText: function(id, text){
      Images.update({'_id':id}, {$set:{"meta":{"text":text }}});
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

