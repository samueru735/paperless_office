
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
        
      //return foundImages;
      Session.set("searchValue", $("#searchValue").val());  
      Meteor.call("ocrImage", "", function(error, result) {
            if(error){
               console.log("error", error);
            }
            else{
              console.log("result:  ", result.content); //results.data should be a JSON object      console.log("error", error);
            }
        
          });    
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

    let dataKey = $(e.target).attr("data-key"),
      recordId = $(e.target).closest(".record-container").attr("data-record-id"),            
      update = {};
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
     Images.update({'_id':dataKey}, {$set:{"meta":{"labels":newLabels }}});      
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
      console.log("url: " , e.currentTarget.files[0]);
      var upload = Images.insert({
        file: e.currentTarget.files[0],
        meta: {
          labels: $("#labelSelector").val(),
          date: new Date()
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
          Meteor.call("ocrImage", function(error, result) {
            if(error){
               console.log("error", error);
            }
            else{
              console.log("result:  ", result.content); //results.data should be a JSON object      console.log("error", error);
            }
        
          });
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
}); 