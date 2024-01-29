var buttonProcess = document.getElementById("buttonProcess");
var buttonClear = document.getElementById("buttonClear");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var host = window.location.protocol + "//" + window.location.host;

// instantiate Network
const n = new NNetwork(0, 0);
n.loadModel(host+'/nnjs/js/model.json');

var drag = false;
var colorDrawDefault = "white";

// Initialize the temp canvas and it's size
var tempCanvas = null;
var ctxTemp = null

function createDrawingCanvas() {
    tempCanvas = document.createElement("canvas");
    tempCanvas.id = "tempCanvas";
    // Set width and height
    tempCanvas.width = 28;
    tempCanvas.height = 28;

    ctxTemp = tempCanvas.getContext("2d");
}

window.addEventListener('load', function() {
    createDrawingCanvas();
});

function drawRect(dx, dy) {
    var bounding = canvas.getBoundingClientRect();
    ctx.fillStyle = colorDrawDefault;
    ctx.fillRect(dx-bounding.left, dy-bounding.top, 4, 4);
}

function drawCircle(dx, dy) {
    var bounding = canvas.getBoundingClientRect();
    ctx.fillStyle = colorDrawDefault;
    ctx.beginPath();
    ctx.arc(dx-bounding.left, dy-bounding.top, 20, 0, 2 * Math.PI);
    ctx.fill();
}

canvas.addEventListener('mousedown', function(event) {
    drag = true;
});

canvas.addEventListener('mouseup', function(event) {
    drag = false;
});

canvas.addEventListener('mousemove', function(event) {
    var x = event.clientX;
    var y = event.clientY;

    if (drag) {
        drawCircle(x, y);
    }
});

// mobile device
canvas.addEventListener('touchstart', function(event) {
    if (event.target == canvas) {
        event.preventDefault();
    }

    drag = true;
}, false);

canvas.addEventListener('touchend', function(event) {
    if (event.target == canvas) {
        event.preventDefault();
    }

    drag = false;
}, false);

canvas.addEventListener('touchmove', function(event) {
    if (event.target == canvas) {
        event.preventDefault();
    }

    var touch = event.touches[0];

    var x = touch.clientX;
    var y = touch.clientY;

    if (drag) {
        drawCircle(x, y);
    }
}, false);

function predict() {
    ctxTemp.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    var imageData = ctxTemp.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    var pixelData = imageData.data;

    var color = new Float32Array(tempCanvas.width * tempCanvas.height);

    var j = 0;
    for(let i = 0; i < pixelData.length; i = i + 4) {
        color[j] = Math.max(pixelData[i], pixelData[i+1], pixelData[i+2])/255.0;
        j++;
    }

    var r = n.forward(Array.from(color));
    console.log(r);
    console.log(argmax(r));

    var labels = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh'];

    document.getElementById('textResult').innerText = labels[argmax(r)];
    document.getElementById('resultAcc').innerText = 'akurasi: ' + (r[argmax(r)].h * 100).toFixed(2) + '%';
}

buttonProcess.addEventListener('click', function(event) {
    predict();
});

buttonClear.addEventListener('click', function(event) {
    console.log('clear canvas');

    document.getElementById('textResult').innerText = '';
    document.getElementById('resultAcc').innerText = '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
