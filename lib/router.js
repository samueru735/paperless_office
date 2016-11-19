Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.route("/", {
	name: "homeIndex",
	data: function(){
		return {
			message : "Paperless Office"
		}
	}
});

Router.route("/admin", {
	name: "homeAdmin",
});

Router.route("/about", {
  name : "homeAbout"
});

Router.route("/contact", {
  name : "homeContact"
});

Router.route("/login", {
  name : "homeLogin"
});

Router.route("/register", {
  name : "homeRegister"
});

Router.route("/detail", {
  name : "docShow",

  data: function(){
  var image = Images.findOne({
      '_id':this.params.query.id});
  var remove ;
  var action = this.params.query.action;
  console.log("params: " + action);
  if(this.params.query.action === "remove"){
    console.log("remove!");
    remove = true;
  }
  else {
    remove = false;
  }
  if (remove === false){
    
    console.log("show image: " + image.name);
    var currentImage = this.params.query.id;    
  }
   else {    // removing
    console.log("removing");
    var labelIndex = this.params.query.labelIndex;
    var newLabels = image.meta.labels;
    
    newLabels[labelIndex] = "";
    Images.update({'_id':this.params.query.id}, {$set:{"meta":{"labels":newLabels }}}); 
  }
  return {
      image:image
    }
  }  
});

Router.route("/remove", {
  name: "remove",

  data: function(){
    var image = Images.findOne({
      '_id':this.params.query.id});
    var labelIndex = this.params.query.labelIndex;
    var newLabels = image.meta.labels;

    newLabels[labelIndex] = "";

    Images.update({'_id':this.params.query.id}, {$set:{"meta":{"labels":newLabels }}}); 
    return {image:image}

  }
})
