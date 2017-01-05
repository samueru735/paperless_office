var options = {
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
				return result;
  },

	isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});
Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    //(Session.get("newId")===(Session.get("oldId"))) ? PackageSearch.search(text) : break ;
    if (Session.get("newId")===(Session.get("oldId")))  PackageSearch.search(text);

  }, 200)
});

// Template.searchBox.helpers({
//     document.getElementById("search-box").focus();

// });



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



       /*  Meteor.call("ocrImage", "", function(error, result) {
            if(error){
               console.log("error", error);
            }
            else{
              var imageData = result.content;
              imageData = JSON.parse(imageData);
              var lines = imageData.regions[0].lines;
              var length = lines.length;
              var sentences = [length];
              console.log(imageData);
              console.log("length: " +  length);
              var counter = 0;
              var text = "";
              $.each(lines, function(i,line){
                sentences[counter] = "";
                $.each(line.words, function(j, word){
                    sentences[counter] += (word.text) + " ";
                })
                counter++;
              });
              console.log(sentences);
            }
          }); */
      //return foundImages;
      Session.set("searchValue", $("#searchValue").val());

      //Session.set("foundImages", foundImages);
    }
  });
Template.search.helpers({
  images: function() {
    Meteor.subscribe("search", Session.get("searchValue"));
    if (Session.get("searchValue")) {
      var searchValue = Session.get("searchValue");
      console.log("got session value" + searchValue);
     // $(".searchResults").css('visibility', 'visible');
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
    console.log("dataKey: " + dataKey);
    console.log("recordId: " + recordId);
    console.log("new value:" + newValue );
    console.log("Label to change:" + labelToChange );
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
    placeholder:"select some labels",
    allowClear:"true"
  });
}
Template.labelSelector.events({
  'click': function(){
    console.log("selected labels: ", $("#labelSelector").val());
  }
})
Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find({}, {sort: { 'meta.date': -1}}) ;
  }
});
Template.file.helpers({
  imageFiles: function () {
    return Images.find({}, {sort: { 'meta.date': -1}});
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


      ($("#labelSelector").val() === null) ? label = [] : label = $("#labelSelector").val();

      Resizer.resize(e.currentTarget.files[0], options, function(err, resizedFile){
        var upload = Images.insert({
          file: resizedFile,
          meta: {
            labels: label,
            date: new Date(),
            text: text
          },
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

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
                console.log('resilt', result);
                //console.log(JSON.parse(result.content));
                var pdfReturn = result;
                //imageReturn = JSON.parse(pdfReturn);
                console.log('imageReturn',pdfReturn.ParsedResults[0]);
                // var pdfTexts = pdfReturn.ParsedResults[0].TextOverlay.Lines;
                // console.log('pdfTexts',pdfTexts);
                // console.log('pdfTexts',pdfTexts.filter(function (el) {return el.WordText}));
                // console.log('pdfTexts',JSON.stringify(pdfTexts));
                //
                // filteredText = [];
                // var index = 0;
                // console.log('filtering data');
                // $.each(pdfTexts, function (x,Line) {
                //   console.log('lines', Line);
                //   //filteredText.push(Line.Words[0]);
                //   $.each(Line, function (z, words) {
                //     console.log('wordText',words);
                //     $.each(words, function (y, word) {
                //       console.log('wordText',word.WordText);
                //       console.log('word',word.WordText);
                //       //filteredText.push(words.WordText);
                //       filteredText[index] += word.WordText;
                //       index ++;
                //     })
                //   })
                //});
                var filteredText = [pdfReturn.ParsedResults[0].ParsedText];
                filteredText[0]=pdfReturn.ParsedResults[0].ParsedText;

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
         /* Meteor.call("ocrImage", function(error, result) {
            if(error){
               console.log("error", error);
            }
            else{
              console.log("result:  ", result.content); //results.data should be a JSON object      console.log("error", error);
            }

          }); */
        }
        template.currentUpload.set(false);
      });

      upload.start();

      });
     

         }
  }
});
