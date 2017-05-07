$(document).ready(function() {
	// Initialize Firebase
	var config = {
    apiKey: "AIzaSyBI4y1LITFGdSUn2mUX3ELcTW_kEzHCazE",
    authDomain: "kamand1-9cbc8.firebaseapp.com",
    databaseURL: "https://kamand1-9cbc8.firebaseio.com",
    projectId: "kamand1-9cbc8",
    storageBucket: "kamand1-9cbc8.appspot.com",
    messagingSenderId: "1013142909489"
  };
	firebase.initializeApp(config);
	
	var database = firebase.database();
	var interval = setInterval(updateTable, 60000);

	function postData(trainData, trainKey) {
		var name = trainData.name;
		var dest = trainData.dest;
		var first = trainData.first;
		var freq = trainData.freq;

		var firstConverted = moment(first, "hh:mm").subtract(1, "years");
		var currentTime = moment();
		var diffTime = moment().diff(moment(firstConverted), "minutes");
		var timeRemain = diffTime % freq;
		var minAway = freq - timeRemain;
		var nextTrain = moment().add(minAway, "minutes").format("hh:mm");

		$("#train-schedule > tbody").append("<tr id=" + trainKey + "><td>" + 
		name + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + nextTrain + 
		"</td><td>" + minAway + "</td><td><button class='btn btn-default delete' key=" + 
		trainKey + ">X</button></td>");
	}

	// checks each child on firebase and posts to table
	function updateTable() {
		$("#train-schedule > tbody").empty();
		console.log("update");
		database.ref().on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				postData(childSnapshot.val(), childSnapshot.key);
			});
		});
	}

	// pushes new data to firebase on click
	$("#add-train-btn").on("click", function(event) {
		event.preventDefault();

		var trainName = $("#name-input").val().trim();
		var trainDest = $("#destination-input").val().trim();
		var firstTrain = $("#first-train-input").val().trim();
		var trainFreq = $("#freq-input").val().trim();
		
		var newTrain = {
			name: trainName,
			dest: trainDest,
			first: firstTrain,
			freq: trainFreq
		};

		database.ref().push(newTrain);

		$("#name-input").val("");
		$("#destination-input").val("");
		$("#first-train-input").val("");
		$("#freq-input").val("");
	});

	// deletes current row of data locally and on firebase
	$(document).on("click", ".delete", function() {
		var key = $(this).attr("key");
		database.ref().child(key).remove();
		$("#" + key).empty();
	});

	// calls functions to update table when new train is added
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
		postData(childSnapshot.val(), childSnapshot.key);
	});
});