var canvas = document.getElementById('canvas');
paper.setup(canvas);

let goToSurvey = ()=> {
    window.location.pathname = 'candies/redirection.html'
}

setTimeout(goToSurvey, 10000)

let parameters = {
    spaceBetweenPoints: 165,
    randomOffset: 0,
    sideOffset: 120,
    marginX: 50,
    stepOnCurveLength: 30
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
path.strokeWidth = 60;
path.strokeColor = blue;
path.strokeCap = 'round';
// path.add(paper.view.bounds.leftCenter.add(-parameters.marginX, 0));
path.add(paper.view.bounds.leftCenter);

let nPoints = Math.floor(paper.view.bounds.width / parameters.spaceBetweenPoints)
let spaceBetweenPoints = paper.view.bounds.width / nPoints

for(let i=1 ; i < nPoints ; i++) {
    let direction = i % 2 == 0 ? 1 : -1;
    let alpha = i / (nPoints-1);
    let amplitude = 2 * (1 - Math.abs(alpha-0.5));
    path.add(new paper.Point(i * spaceBetweenPoints, paper.view.bounds.center.y + parameters.sideOffset * direction * amplitude).add(new paper.Point(1, amplitude * Math.random()).subtract(0.5).multiply(parameters.randomOffset)))
}

path.add(paper.view.bounds.rightCenter)
// path.add(paper.view.bounds.rightCenter.add(parameters.marginX, 0));
path.smooth({ type: 'geometric', factor: 0.5 })
path.firstSegment.handleOut = new paper.Point(2*parameters.marginX, 0)
path.lastSegment.handleIn = new paper.Point(-2*parameters.marginX, 0)
// path.fullySelected = true

for(let segment of path.segments) {
    segment.handleIn.y = 0
    segment.handleOut.y = 0
}

let circles = []
let offset = 0
let dragging = false
let circleIndex = 0

let donePath = new paper.Path()
donePath.strokeWidth = path.strokeWidth / 2
donePath.strokeColor = green
donePath.strokeCap = 'round'
// donePath.fullySelected = true
donePath.add(path.firstSegment)

let n = 0
while(offset < path.length) {
    let point = path.getPointAt(offset)
    let circle = new paper.Path.Circle(point, path.strokeWidth / 2 - 10)
    circle.fillColor = path.strokeColor
    circle.fillColor.alpha = 0.1
    let ci = n+1
    circle.onMouseEnter = function(event) {
        console.log(ci, circleIndex)
        if(dragging && ci > circleIndex) {
            let wrongPath = new paper.Path()
            wrongPath.strokeWidth = path.strokeWidth / 2
            wrongPath.strokeColor = pink
            for(let i = circleIndex ; i<ci ; i++) {
                // circles[i].fillColor = pink
                wrongPath.add(circles[i].position)
                donePath.add(circles[i].position)
            }
            // circle.fillColor = green
            circleIndex = ci
            donePath.add(circle.position)
            // donePath.smooth({ type: 'geometric', factor: 0.5 })
        }
    }
    circles.push(circle)
    offset += parameters.stepOnCurveLength
    n++
}

donePath.bringToFront()

circles[0].onMouseDown = function(event) {
    dragging = true
}
circles[0].fillColor = green
circles[0].bringToFront()

let background = new paper.Path.Rectangle(paper.view.bounds)
background.fillColor = 'white'
background.sendToBack()


paper.view.onMouseDown = function(event) {
    
}

paper.view.onMouseMove = function(event) {
    
}

paper.view.onFrame = function(event) {
    
}

window.onresize = function (event) {
	paper.view.viewSize.width = window.innerWidth;
	paper.view.viewSize.height = window.innerHeight;
}
