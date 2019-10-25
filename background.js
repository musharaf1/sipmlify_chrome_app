
createWindow = function () {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }

  });
}


chrome.app.runtime.onLaunched.addListener(createWindow);

var clearMsg;

  chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      if(msg.getSelectedContent >= 0){
        console.log("------------------------------- Got msg", msg);
        
        var str2ab = function (str) {
          var encodedString = unescape(encodeURIComponent(str));
          var bytes = new Uint8Array(encodedString.length);
          for (var i = 0; i < encodedString.length; ++i) {
            bytes[i] = encodedString.charCodeAt(i);
          }
          return bytes.buffer;
        };


        var listOfSerialDevices = function (ports) {
          for (var i = 0; i < ports.length; i++) {
            console.log(ports[i].path + ' ' + ports[i].vendorId + ' ' + ports[i].productId + ' ' + ports[i].displayName);
            chrome.serial.connect(ports[i].path, function (ConnectionInfo) {
              if (ConnectionInfo) {
                console.log('id:' + ConnectionInfo.connectionId)
                clearMsg = String.fromCharCode(0x0C);
                 msg = "Total price " + msg['getSelectedContent'];
  
                 chrome.serial.send(ConnectionInfo.connectionId, str2ab(clearMsg), function () { console.log('Message cleared!') 
              
                })
  
                chrome.serial.send(ConnectionInfo.connectionId, str2ab(msg), function () { console.log('Message sent!') ;

                var onDisconnect = function(result) {
                  if (result) {
                    console.log("Disconnected from the serial port");
                  } else {
                    console.log("Disconnect failed");
                  }
                }
                chrome.serial.disconnect(ConnectionInfo.connectionId, onDisconnect);
              
              })

              }
            });
          }
        }

        chrome.serial.getDevices(listOfSerialDevices);



      }
     
    });
  });
  
  
  