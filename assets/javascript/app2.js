
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCOWHmwgvVFvGlyH_ZPEhJiNNFSNYpMNaI",
    authDomain: "train-scheduler-51996.firebaseapp.com",
    databaseURL: "https://train-scheduler-51996.firebaseio.com",
    projectId: "train-scheduler-51996",
    storageBucket: "train-scheduler-51996.appspot.com",
    messagingSenderId: "415040081161"
  };
  firebase.initializeApp(config);


var database = firebase.database();

let trainName = "";
let destination = "";
let firstTrainTime = "";
let frequency = "";

//Click handler to take the values entered into the form and write them to the database.  Clears input form once finished
$("#addTrain").on("click", function() {
    event.preventDefault();

    trainName = $("#trainNameInput").val().trim();
    destination = $("#destinationInput").val().trim();
    firstTrainTime = $("#firstTrainTimeInput").val().trim();
    frequency = $("#frequencyInput").val().trim();

    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainTimeInput").val("");
    $("#frequencyInput").val("");

});

//Takes the train array from the database and puts it onto the DOM
database.ref().on("child_added", function(childSnapshot) {

    var dbName = childSnapshot.val().trainName;
    var dbDestination = childSnapshot.val().destination;
    var dbFrequency = childSnapshot.val().frequency;
    var dbFirstTrainTime = childSnapshot.val().firstTrainTime;

    //Using moment.js to set the next arrival and minutes away variables

    var dbFirstTimeConverted = moment(dbFirstTrainTime, "HH:mm");

    var difference = moment().diff(moment(dbFirstTimeConverted, "m"))
    console.log("Difference: " + difference);

    var differenceConverted = moment(difference).format("mm");

    var remainder = differenceConverted % dbFrequency;
    console.log("-------");
    console.log("diff " + differenceConverted);
    console.log("Freq " + dbFrequency);
    console.log("Remainder: " + remainder);
    console.log("-------");

    var minutesAway = dbFrequency - remainder;
    console.log("Minutes Away: "+ minutesAway);

    var nextArrival = moment().add(minutesAway, "m").format("hh:mm A");

    console.log(nextArrival)




    var newTrainRow = $("<tr>").append(
        $("<td>").text(dbName),
        $("<td>").text(dbDestination),
        $("<td>").text(dbFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    )

    $("#trainTable").append(newTrainRow);

});
