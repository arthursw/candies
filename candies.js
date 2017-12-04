var canvas = document.getElementById('canvas');
paper.setup(canvas);

let parameters = {
	maxRadius: 50,
	minRadius: 10
};


var path = new paper.Path();
path.strokeWidth = 160;
path.strokeColor = '#ffe62d';
path.strokeCap = 'round';
// path.selected = true;

let nCycles = 2;
let radius = Math.min(paper.view.size.width, paper.view.size.height) / 2.5;
let angleStep = 3;
let radiusOffset = 1.5;
let offset = 50;
let circleRadius = 30;
let distanceBetweenCircles = 100;
let lastPoint = null;

let circles = [];

let n = 0;
let nPoints = 0;

for(let i=0 ; i < 360 * nCycles ; i += angleStep) {
    let angle = Math.PI * i / 180;
    let point = new paper.Point(radius * Math.cos(angle), radius * Math.sin(angle));
    point = point.add(paper.view.center);
    path.add(point);
    
    radius -= radiusOffset;
    
    if(lastPoint == null || lastPoint.getDistance(point) > distanceBetweenCircles) {
        let delta = point.subtract(paper.view.center).normalize();
        let alpha = n%2 ? 1 : -1;
        let circle = paper.Path.Circle(point.add(delta.multiply(alpha * offset * Math.random())), circleRadius);
        circle.fillColor = n%2 ? '#f47142' : '#41a0f4';
        circles.push(circle);
        n++;
        lastPoint = point;
    }
}


let circleIndex = 0;
circles[circleIndex].data.originalColor = circles[circleIndex].fillColor;
circles[circleIndex].fillColor = '#c3ff6b';
let state = 'playing';

paper.view.onClick = function(event) {
    if(state == 'playing') {
        circles[circleIndex].fillColor = circles[circleIndex].data.originalColor;
        
        if(circles[circleIndex].hitTest(event.point)) {
            circles[circleIndex].fillColor = '#cc1010';
            nPoints++;
        }
        circleIndex++;
        if(circleIndex == circles.length) {
            state = 'win';
            var text = new paper.PointText(paper.view.center);
            text.justification = 'center';
            text.fillColor = 'black';
            text.fontSize = 30;
            text.content = 'You win !\nScore : ' + nPoints + ' / ' + circles.length;
            let background = new paper.Path.Rectangle(text.bounds.expand(40), 10);
            background.fillColor = new paper.Color(1, 1, 1, 0.75);
            text.moveAbove(background);
            return;
        }
        
        circles[circleIndex].data.originalColor = circles[circleIndex].fillColor;
        circles[circleIndex].fillColor = '#c3ff6b';
    }
}

paper.view.onFrame = function(event) {
    if(state == 'win') {
        for(let i=0 ; i < circles.length ; i++) {
            circles[i].fillColor = new paper.Color(Math.random(), Math.random(), Math.random());
        }
    }
}

window.onresize = function (event) {
	paper.view.viewSize.width = window.innerWidth;
	paper.view.viewSize.height = window.innerHeight;
}
