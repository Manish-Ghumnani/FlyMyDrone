/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);	
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
		/*document.getElementById("clickToConnect").addEventListener("click",connectToQuad,false);
		function connectToQuad() {
			window.location = "test.html";
			//alert('Volume Up Button is pressed!');
		};*/
		
		//var WebSocket = require('websocket').w3cwebsocket;
		// var proto = "ws://";
		// var port = ":8080/";
		// var ip = $('#ip').val();
		// var address = proto.concat(ip);
		// var url = address.concat(port);
		// console.log(url);
		function blink(selector){
			$(selector).fadeOut('slow', function(){
				$(this).fadeIn('slow', function(){
					blink(this);
				});
			});
		}
			
		blink('.blink');

		var ws = new WebSocket('ws://172.17.249.88:8080/','echo-protocol');

		document.addEventListener("backbutton", onBackKeyDown, false);  
		function onBackKeyDown(e) { 
		   //e.preventDefault();
		   ws.close();
		} 
		$('#clickToConnect').click(function() {
			//window.location = "test.html";
			
			ws.onopen = function()
			{
				alert("connected to your drone");
				
			}
			ws.send("connected!");
			window.location = "test.html";

			ws.onerror = function(){
				console.log("error connecting!");
				var message = "Could not connect! Please ensure you are connected to Wi-Fi/Cellular Data";
				var title = "Oops!";
				var buttonName = "Ok";
			 
				navigator.notification.alert(message, alertCallback, title, buttonName);

				function alertCallback() {
					console.log("Alert is Dismissed!");
				 }
			  
			}
			
			ws.onmessage = function(msg)
			{
				console.log(msg.data);
			}
		});
		
		$('#stream').click(function() {
			var url = 'https://cordova.apache.org';
			var target = '_blank';
			var options = "location = yes"
			var ref = cordova.InAppBrowser.open(url, target, options);
		 
		});

		$('#up').click(function() {
			ws.send("up");
		});
		
		$('#down').click(function() {
			ws.send("down");
		});
		
		$('#take-off').click(function() {
			ws.send("takeoff");
		});
		
		$('#land').click(function() {
			ws.send("land");
		});

		$('#left').click(function() {
			ws.send("left");
		});

		$('#right').click(function() {
			ws.send("right");
		});

		$('#arm').click(function() {
			ws.send("arm");
		});

		$('#disarm').click(function() {
			ws.send("disarm");
		});

		$('#record').click(function() {
			// Handle results
			function startRecognition(){
				window.plugins.speechRecognition.startListening(function(result){
					// Show results in the console
					console.log(result);
					var drone_commands = ['up','down','left','right','takeoff','land','arm','disarm'];
					for(i=0;i<drone_commands.length;i++){
						var command = $.inArray(drone_commands[i],result);
						if(command != -1){
							ws.send(drone_commands[i]);
						}
					}
					ws.send(result);
				}, function(err){
					console.error(err);
				}, {
					language: "en-US",
					showPopup: true
				});
			}

			// Verify if recognition is available
			window.plugins.speechRecognition.isRecognitionAvailable(function(available){
				if(!available){
					console.log("Sorry, not available");
				}

				// Check if has permission to use the microphone
				window.plugins.speechRecognition.hasPermission(function (isGranted){
					if(isGranted){
						startRecognition();
					}else{
						// Request the permission
						window.plugins.speechRecognition.requestPermission(function (){
							// Request accepted, start recognition
							startRecognition();
						}, function (err){
							console.log(err);
						});
					}
				}, function(err){
					console.log(err);
				});
			}, function(err){
				console.log(err);
			});

		});
		
    },
	
	

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();