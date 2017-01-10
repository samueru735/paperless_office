Labels = new Meteor.Collection("labels");

console.log("labels");

if(Meteor.isServer){
	if(Labels.find().count() === 0 || Labels.find() === null){	
		console.log("found no labels, inserting standard labels");		
		
			// type image
			Labels.insert({name:"factuur"});
			Labels.insert({name:"brief"});
			Labels.insert({name:"notitie"});
			Labels.insert({name:"meme"});
			Labels.insert({name:"betaald"});
			Labels.insert({name:"te betalen"});
			Labels.insert({name:"dringend"});
			Labels.insert({name:"belangrijk"});
			// veel voorkomende termen
			Labels.insert({name:"Telenet"});
			Labels.insert({name:"Scarlet"});
			Labels.insert({name:"Belgacom"});
			Labels.insert({name:"Touring"});
			// maand
			Labels.insert({name:"januari"});
			Labels.insert({name:"februari"});
			Labels.insert({name:"maart"});
			Labels.insert({name:"april"});
			Labels.insert({name:"mei"});
			Labels.insert({name:"juni"});
			Labels.insert({name:"juli"});
			Labels.insert({name:"augustus"});
			Labels.insert({name:"september"});
			Labels.insert({name:"oktober"});
			Labels.insert({name:"november"});
			Labels.insert({name:"december"});
	console.log("labels created");
	}
} 

Labels.labelsAvailable = function(){
	return Labels.find({});
}
if (Meteor.isServer) { 
  Meteor.publish('labels', function () {
    return Labels.find();
  });
}