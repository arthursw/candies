var canvas = document.getElementById('canvas');
paper.setup(canvas);

let goToSurvey = ()=> {
    window.location.pathname = 'candies/redirection.html'
}

setTimeout(goToSurvey, 10000)

let parameters = {
	maxRadius: 50,
	minRadius: 10,
    spaceBetweenPoints: 125,
    circleRadius: 30,
    randomOffset: 25,
    sideOffset: 50,
    highlightWidth: 7,
    marginX: 75
};

let blue = new paper.Color('#3c91e6')
let yellow = new paper.Color('#ffe74c')
let pink = new paper.Color('#ff5964')
let purple = new paper.Color('#8e5eed')
let green = new paper.Color('#44af69')
let gray = new paper.Color('#cccccc')

let lightGreen = green.clone()
lightGreen.lightness += 0.1
let lightPink = pink.clone()
lightPink.lightness += 0.1
let lightPurple = purple.clone()
lightPurple.lightness += 0.1

let highlightColor = pink.clone();
highlightColor.lightness -= 0.1;

var path = new paper.Path();
path.strokeWidth = 1;
path.strokeColor = '#ccccc';
// path.strokeCap = 'round';
// path.selected = true;
path.add(paper.view.bounds.leftCenter);
path.add(paper.view.bounds.rightCenter);


let circles = [];

let width = paper.view.bounds.width - 2 * parameters.marginX
let nCircles = Math.floor(width / parameters.spaceBetweenPoints)
let spaceBetweenPoints = width / nCircles

let firstCircle = paper.Path.Circle(new paper.Point(parameters.marginX, paper.view.bounds.center.y - parameters.sideOffset).add(paper.Point.random().subtract(0.5).multiply(parameters.randomOffset)), parameters.circleRadius);
firstCircle.fillColor = lightGreen;
circles.push(firstCircle);

for(let i=0 ; i < nCircles ; i++) {
    let direction = i % 2 == 0 ? 1 : -1;
    let circle = paper.Path.Circle(new paper.Point(parameters.marginX + i * spaceBetweenPoints, paper.view.bounds.center.y + parameters.sideOffset * direction).add(paper.Point.random().subtract(0.5).multiply(parameters.randomOffset)), parameters.circleRadius);
    circle.fillColor = i==0 ? lightGreen : i==nCircles-1 ? lightPink : i%2 ? blue : yellow;
    circles.push(circle);
}

let direction = nCircles % 2 == 0 ? 1 : -1;
let lastCircle = paper.Path.Circle(new paper.Point(parameters.marginX + (nCircles - 1)  * spaceBetweenPoints, paper.view.bounds.center.y + parameters.sideOffset * direction).add(paper.Point.random().subtract(0.5).multiply(parameters.randomOffset)), parameters.circleRadius);
lastCircle.fillColor = lightPink;
circles.push(lastCircle);

let nPoints = 0;

let circleIndex = 0;
circles[circleIndex].strokeColor = highlightColor;
circles[circleIndex].strokeWidth = parameters.highlightWidth;
circleIndex = 1;
circles[circleIndex].strokeColor = highlightColor;
circles[circleIndex].strokeWidth = parameters.highlightWidth;
let state = 'playing';

paper.view.onClick = function(event) {
    if(state == 'playing') {
        if(circleIndex == 1) {
            circles[0].strokeColor = null;
            circles[0].strokeWidth = 0;
        }
        circles[circleIndex].strokeColor = null;
        circles[circleIndex].strokeWidth = 0;
        
        if(circles[circleIndex].hitTest(event.point) || 
            circleIndex == 1 && circles[0].hitTest(event.point) || 
            circleIndex == nCircles && circles[circles.length - 1].hitTest(event.point) ) {
            circles[circleIndex].fillColor = green;
            nPoints++;
        } else {
            circles[circleIndex].fillColor = pink;
        }

        circleIndex++;
        if(circleIndex == circles.length - 1) {
            circles[circles.length - 1].strokeColor = null;
            circles[circles.length - 1].strokeWidth = 0;
            state = 'win';
            var text = new paper.PointText(paper.view.center);
            text.justification = 'center';
            text.fillColor = 'black';
            text.fontSize = 30;
            text.content = 'You win !\nScore : ' + nPoints + ' / ' + nCircles;
            let background = new paper.Path.Rectangle(text.bounds.expand(40), 10);
            background.fillColor = new paper.Color(1, 1, 1, 0.75);
            text.moveAbove(background);
            return;
        }
        
        circles[circleIndex].strokeColor = highlightColor;
        circles[circleIndex].strokeWidth = parameters.highlightWidth;
        
        if(circleIndex == nCircles) {
            circles[circles.length - 1].strokeColor = highlightColor;
            circles[circles.length - 1].strokeWidth = parameters.highlightWidth;
        }
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
