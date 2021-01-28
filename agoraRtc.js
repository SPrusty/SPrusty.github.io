let handlefail = function(err) {
    console.log(err)
}

let index = 0;

function addVideoStream(streamId, participantContainer) {
    let remoteContainer = document.getElementsByClassName("remoteStream")[index++];
    let streamDiv = document.createElement("div");
    
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "250px"
    
    remoteContainer.appendChild(streamDiv)

    let nameDiv = document.createElement("P")
    nameDiv.innerHTML = streamId;
    participantContainer.appendChild(nameDiv)
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "47d4a49aa428465e849ea0e8a031a09a";

    let client = AgoraRTC.createClient({
        mode: "live", 
        codec: "h264"
    })

    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
    )

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })
            
            localStream.init(function() {
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream")    
        client.subscribe(evt.stream, handlefail)
    })

    let participantContainer = document.getElementById("participants")
    let nameDiv = document.createElement("P")
    nameDiv.innerHTML = Username;
    participantContainer.appendChild(nameDiv)

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId(),participantContainer);
        stream.play(stream.getId());
    })
}