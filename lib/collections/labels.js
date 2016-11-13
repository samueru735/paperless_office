Labels = new Meteor.Collection("labels");

console.log("labels");

if(Labels.find().count() === 0){
	console.log("found no labels");
	Labels.insert({
		name:"factuur"
	});
	console.log("label created");
}

Labels.labelsAvailable = function(){
	return Labels.find({});
}