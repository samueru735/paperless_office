
Template.file.helpers({
  imageFiles: function () {
    return Images.find({}, {sort: { 'meta.date': -1}});
  },
  isImage: function(id){    
    img = Images.findOne({'_id':id});
    if(img.type === "image/jpeg" || img.type === "image/png"){
      return true;
    }
  }
});

var options = { // resizer options
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};

var fields = ['name', 'meta.labels', 'meta.text'];

PackageSearch = new SearchSource('Images', fields, options);

console.log(PackageSearch.getMetadata());

Template.homeSearch.helpers({
  getPackages: function() {
		var result = PackageSearch.getData({
		      transform: function(matchText, regExp) {
		        return matchText.replace(regExp, "<b>$&</b>")
		      },
		      sort: {isoScore: -1},
          limit: 20
		    });
        if (result.length !== 0){          
          $("#searchResultsPanel").removeClass("hidden");
        }
        else {          
          $("#searchResultsPanel").addClass("hidden");
        }
				return result;
  },

	isLoading: function() {
    return PackageSearch.getStatus().loading;
  },
  textLimiter: function(index){
    var limiter = 5;
    //console.log("rowIndex: " + index)      ;
    if(index < limiter){

      return true;
    }
  }
});
Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    if(text.length !== 0){      
      $('.search-form .form-group').addClass("hover");
    }
    else{      
      $('.search-form .form-group').removeClass("hover"); 
    } 
    //(Session.get("newId")===(Session.get("oldId"))) ? PackageSearch.search(text) : break ;
    if (Session.get("newId")===(Session.get("oldId")))  PackageSearch.search(text);

  }, 200)
});

Template.homeUploader.events({
  "click #uploadButton": function(){
     $("#uploaderResultsPanel").toggleClass("hidden");
     $("#searchBox input").val("");
     $('.search-form .form-group').removeClass("hover");
     //$("#searchResultsPanel").addClass("hidden");
  }
})

Template.homeIndex.helpers({
	featured: function(){
		return Documents.featured();
	}
});
Template.labelSelector.helpers({
  labels: function(){
    return Labels.labelsAvailable();
  }
});
Template.search.events({
    "submit #search": function (e) {
      e.preventDefault();
      var searchValue = $("#searchValue").val();
      console.log("all images", Images);
      console.log("searchValue: ", searchValue);
      console.log("userId: ", Session.get("newId"));
      var foundImages = Images.find(
        {"meta.labels":searchValue});

      Session.set("searchValue", $("#searchValue").val());

    }
  });
Template.search.helpers({
  images: function() {
    Meteor.subscribe("search", Session.get("searchValue"));
    if (Session.get("searchValue")) {
      var searchValue = Session.get("searchValue");
      console.log("got session value" + searchValue);     
      return Images.find({"userId": Session.get("newId"),
        "meta.labels":searchValue});
      }
  }
});
Template.docShow.helpers({
  isImage: function(){
    var id = Session.get("sessionImage");
    console.log("id: " + id);
    var img = Images.findOne({'_id':id});
    if(img.type === "image/jpeg" || img.type === "image/png"){
      return true;
    }
  }
});
Template.docShow.events({
  'click #btnEdit': function(){
    console.log("editing");
  },
  'click #btnDeleteDoc': function(e){
    e.preventDefault();

    $('#deleteDocModal').modal('show');
  },
  "edited .editable"(e, instance, newValue){
    // pick up the field that was edited

    var dataKey = $(e.target).attr("data-key");
      var recordId = $(e.target).closest(".record-container").attr("data-record-id");
      //($(e.target).closest(".record-container").attr("data-record-id") === null)
      //? let recordId = "0" : recordId = $(e.target).closest(".record-container").attr("data-record-id"),
       let update = {};
    if (recordId === " " || recordId === "" )
        recordId = "0";
    else
      console.log("recordIddddd: " + recordId);
    var image = Images.findOne({'_id':dataKey});
    var labelToChange = image.meta.labels[recordId];
   //var labelToChange = label; //$(e.target).closest(".label label-default").attr("label-content");
    //console.log("dataKey: " + dataKey);
    //console.log("recordId: " + recordId);
    //console.log("new value:" + newValue );
    //console.log("Label to change:" + labelToChange );
    if(dataKey && recordId){
      update[dataKey] = newValue;
      //var id =
    var newLabels = image.meta.labels;
    newLabels[recordId] = newValue;
    Images.update({'_id':dataKey}, {$set:{"meta.labels":newLabels }});
     //image.update({'labels': labelToChange }, {$set:{"meta":{"labels.$":newValue }}});
    }
  }
})

Template.deleteDocModal.events({
  'click #btnConfirmDelete': function(e){
    //e.preventDefault();
    $('#deleteDocModal').modal('hide');
  }
})

Template.labelSelector.rendered = function(){
  $("#labelSelector").select2({
    placeholder:"add labels",
    width:"500px",
    allowClear:"true"
  });
}
Template.labelSelector.events({
  'click': function(){
    //console.log("selected labels: ", $("#labelSelector").val());
  }
})
Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find({}, {sort: { 'meta.date': -1}}) ;
  }
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected

      //console.log("url: " , e.currentTarget.files[0]);
      var options = {
        width: 1000,
        height: 1000,
        cropSquare: false
      };
      var label = [];
      var text = [];
      var upload;

      ($("#labelSelector").val() === null) ? label = [] : label = $("#labelSelector").val();

      startUpload = function(){
      upload.on('start', function () {
            template.currentUpload.set(this);
          });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
          //console.log("fileobject: ", fileObj.file);
          //console.log("encoded file: ",Base64.encodeBinary(fileObj.file));
          //var image = Images.findOne({'_id':fileObj._id});
          //console.log("fileobject: ", image);
          if(fileObj.type === "image/png" || fileObj.type === "image/jpeg"){

            Meteor.call("ocrImage", fileObj._id, function(error, result) {
              if(error){
                 console.log("error", error);
              }
              else{
                var imageData = result.content;
                imageData = JSON.parse(imageData);
                var regions = imageData.regions;

                //var length = lines.length;
                var sentences = [length];
                console.log("imagedata: ",imageData);
                console.log("length: " +  length);
                var counterRegions = 0;
                var counterLines = 0;
                var text = "";
                $.each(regions, function(h, region){
                  var lines = imageData.regions[counterRegions].lines;
                  $.each(lines, function(i,line){
                    sentences[counterLines] = "";
                    $.each(line.words, function(j, word){
                        sentences[counterLines] += (word.text) + " ";
                    })
                    counterLines++;
                  })
                  counterRegions++;
                });

                console.log("Sentences: ", sentences);
                Meteor.call("addOcrText", fileObj._id, sentences, function(error, result){
                  if(error){
                    console.log("error", error);
                  }
                  else{
                    console.log("updated image:", result);
                  }
                })
              }

            });
          }

          else if (fileObj.type === "application/pdf") {
            console.log('uploaded PDF');
            //OCR PDF
            Meteor.call("ocrPDF", fileObj._id, function(error, result) {
              if(error){
                 console.log("error", error);
              }
              else{
                console.log('result', result);                
                var pdfReturn = result;                
                console.log('imageReturn',pdfReturn.ParsedResults[0]);

                var filteredText = [];
                for (var i = 0; i < pdfReturn.ParsedResults.length; i++) {
                  filteredText[i] = pdfReturn.ParsedResults[i].ParsedText;
                }
                //filteredText[0]=pdfReturn.ParsedResults[0].ParsedText;

                console.log('results: '+ filteredText);
                Meteor.call("addOcrText", fileObj._id, filteredText, function(error, result){
                  if(error){
                    console.log("error", error);
                  }
                  else{
                    console.log("updated PDF:", result);
                  }
                })
              }

            });

          }
          else {
            alert("how the fuck did you get here??? Yer a wizard harry.");
          }         
        }
        template.currentUpload.set(false);
      });

      upload.start();           

      }
    }

      if(e.currentTarget.files[0].type === "image/png" || e.currentTarget.files[0].type === "image/jpeg"){
        Resizer.resize(e.currentTarget.files[0], options, function(err, resizedFile){
          upload = Images.insert({
          file: resizedFile,
          meta: {
            labels: label,
            date: new Date(),
            text: text
          },
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);
        startUpload();
        });
      }
      else{
        upload = Images.insert({
         file: e.currentTarget.files[0],
         meta: {
           labels: label,
           date: new Date(),
           text: text
         },
         streams: 'dynamic',
         chunkSize: 'dynamic'
       }, false);
        startUpload();
      }
  }
});
