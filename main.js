var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

let canvas = document.getElementById("output");
let ctx = canvas.getContext('2d');

let analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
let data = new Uint8Array(analyser.frequencyBinCount);

document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.onplay = () => {
        audioCtx.resume()
    };

    var audioStr = audioCtx.createMediaElementSource(audio);
    audioStr.connect(analyser);
    audioStr.connect(audioCtx.destination);

    audio.play();
});

requestAnimationFrame(loopingFunction);

function loopingFunction() {
    requestAnimationFrame(loopingFunction);
    analyser.getByteFrequencyData(data);
    draw(data);
}

function draw(data) {
    data = [...data];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let space = canvas.width / data.length;
    data.forEach((value, i) => {
        ctx.beginPath();
        ctx.moveTo(space * i, 0);
        ctx.lineTo(space * i, canvas.height * (value / 512));
        ctx.strokeStyle = "white";
        ctx.stroke();
    })
}

function change() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.playbackRate = Math.random() * (.10) + 0.95;
    });
}

change()
setInterval(change, 10000);