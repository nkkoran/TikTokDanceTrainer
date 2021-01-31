var canvas;
var ctx;
var poseNet;
let camera;
let referenceVideo;
var camPoses;
var refPoses;
var threshold = 0.4;


function init() {
	canvas = document.getElementById("poseCanvas");
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
    //ctx.fillRect(0, 0, 300, 600);
    referenceVideo = document.querySelector("#videoElement");
    camera = document.querySelector("#liveCamera");


    poseNet1 = ml5.poseNet(camera, "single", () => {
        console.log('Model1 loaded');
    });

    poseNet2 = ml5.poseNet(referenceVideo, "single", () => {
        console.log('Model2 loaded');
    });

    poseNet1.on('pose', (results) => {
        camPoses = results;
    });

    poseNet2.on('pose', (results) => {
        refPoses = results;
    });

    ctx.fillStyle = '#FFFFFF';
    setInterval(draw, 10);
    setInterval(liveScore, 1500);
}

function startCamera() {
    
	let video = camera;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
}

function drawLine(x1, y1, x2, y2, offset) {
    ctx.beginPath();
    if (offset > 0) {
        ctx.moveTo(offset- x1,y1);
        ctx.lineTo(offset - x2,y2);
    } else {
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
    }

    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(typeof refPoses !== 'undefined') {
        drawKeypoints(refPoses, 0);
        drawSkeleton(refPoses,0 );
    }

	if(typeof camPoses !== 'undefined') {
		/*
		if (camPoses[0].pose.nose.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.nose.x, camPoses[0].pose.nose.y, 10, 10);
        }

        if (camPoses[0].pose.leftShoulder.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.leftShoulder.x, camPoses[0].pose.leftShoulder.y, 10, 10);
        }

        if (camPoses[0].pose.rightShoulder.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.rightShoulder.x, camPoses[0].pose.rightShoulder.y, 10, 10);
        }

        if (camPoses[0].pose.leftElbow.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.leftElbow.x, camPoses[0].pose.leftElbow.y, 10, 10);
        }

        if (camPoses[0].pose.rightElbow.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.rightElbow.x, camPoses[0].pose.rightElbow.y, 10, 10);
        }

        if (camPoses[0].pose.leftWrist.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.leftWrist.x, camPoses[0].pose.leftWrist.y, 10, 10);
        }

        if (camPoses[0].pose.rightWrist.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.rightWrist.x, camPoses[0].pose.rightWrist.y, 10, 10);
        }

        if (camPoses[0].pose.leftHip.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.leftHip.x, camPoses[0].pose.leftHip.y, 10, 10);
        }

        if (camPoses[0].pose.rightHip.confidence > confidenceLevel) {
            ctx.fillRect(500-camPoses[0].pose.rightHip.x, camPoses[0].pose.rightHip.y, 10, 10);
        }

        //Lines
        if (camPoses[0].pose.leftShoulder.confidence > confidenceLevel && camPoses[0].pose.rightShoulder.confidence > confidenceLevel) {
            var midShoulder = [(camPoses[0].pose.rightShoulder.x + camPoses[0].pose.leftShoulder.x)/2, (camPoses[0].pose.rightShoulder.y + camPoses[0].pose.leftShoulder.y)/2];
            drawLine(midShoulder[0],midShoulder[1],camPoses[0].pose.leftShoulder.x,camPoses[0].pose.leftShoulder.y);
            drawLine(midShoulder[0],midShoulder[1],camPoses[0].pose.rightShoulder.x,camPoses[0].pose.rightShoulder.y);
            if (camPoses[0].pose.nose.confidence > confidenceLevel) {
                drawLine(midShoulder[0],midShoulder[1],camPoses[0].pose.nose.x,camPoses[0].pose.nose.y);
            }
        }

        if (camPoses[0].pose.leftElbow.confidence > confidenceLevel && camPoses[0].pose.leftWrist.confidence > confidenceLevel) {
            drawLine(camPoses[0].pose.leftElbow.x, camPoses[0].pose.leftElbow.y, camPoses[0].pose.leftWrist.x, camPoses[0].pose.leftWrist.y);
        }

        if (camPoses[0].pose.rightElbow.confidence > confidenceLevel && camPoses[0].pose.rightWrist.confidence > confidenceLevel) {
            drawLine(camPoses[0].pose.rightElbow.x, camPoses[0].pose.rightElbow.y, camPoses[0].pose.rightWrist.x, camPoses[0].pose.rightWrist.y);
        }
        */
        drawKeypoints(camPoses, 500);
        drawSkeleton(camPoses, 500);
	}
}

function drawKeypoints(poses, offset) {
    for (let i = 0; i < poses.length; i += 1) {
        const pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j += 1) {
            const keypoint = pose.keypoints[j];
            if (keypoint.score > threshold) {
                if (offset > 0) {
                    ctx.fillRect(offset - keypoint.position.x-5, keypoint.position.y-5, 10, 10);
                } else {
                    ctx.fillRect(keypoint.position.x-5, keypoint.position.y-5, 10, 10);
                }

            }
        }
    }
}

function drawSkeleton(poses, offset) {
    for (let i = 0; i < poses.length; i += 1) {
        const skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j += 1) {
            const partA = skeleton[j][0];
            const partB = skeleton[j][1];
            drawLine(partA.position.x, partA.position.y, partB.position.x, partB.position.y, offset);
        }
    }
}

function stopCamera() {
      let video = camera;

      var stream = video.srcObject;
      var tracks = stream.getTracks();

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
      }

      video.srcObject = null;
}

function hoveringOnButton(name) {
    document.getElementById(name).classList.add("Hovering");
    document.getElementById(name).style.cursor = "pointer";

}

function leaveButton(name) {
    document.getElementById(name).classList.remove("Hovering");
    document.getElementById(name).style.cursor = "default";
}

function play() {

    document.getElementById('videoElement').play();
    document.getElementById('playButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block';
}

function pause() {
    document.getElementById('videoElement').pause();
    document.getElementById('playButton').style.display = 'block';
    document.getElementById('pauseButton').style.display = 'none';

    referenceVideo = document.querySelector("#videoElement");
}

function liveScore() {
    let score;
    if(typeof refPoses !== 'undefined' && typeof camPoses !== 'undefined') {
        if (typeof refPoses[0] !== 'undefined' && typeof camPoses[0] !== 'undefined') {
            score=compare3(poseToJW(refPoses[0]), poseToJW(camPoses[0]));
            document.getElementById('score').innerText = score;
        }
    }
}


function poseToJW(model) {
    let joints = [], weights = [];
    
    for (let i = 0; i < 17; ++i) {
        joints[2 * i] = model.pose.keypoints[i].position.x;
        joints[2 * i + 1] = model.pose.keypoints[i].position.y;
        weights[i] = model.pose.keypoints[i].score;
    }
    //console.log(model.pose.keypoints);
    return joints.concat(weights);
}