let video;
let poseNet;
let pose;
let selectedColors = [];
rain=[]
let slider;
let colorArrayLength;


colors=["#75b9be","#696d7d","#d72638","#f49d37","#b4f3ed","#ebc560","#6ebdbf","#d6b775","#119190","#cee55e","#e9bda2","#fcb79f"]
colorss=["#f66e7c", "#edbfb2", "#bbf0e3", "#7ed3c0", "#F2E6D8", "#f6d293"]

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);
  frameRate(10)
 
  color1 = color(255, 0, 0); // 红色
  color2 = color(0, 0, 255); // 蓝色
}

function modelReady() {
  console.log("model ready");
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function draw() {
  background(255);
  image(video, 0, 0);
 
  if (pose) {
    // draw a noise circle at the nose position
    if (pose.keypoints[0].score > 0.2) {
      noStroke();
      fill(255, 0, 0);
      let radius = 50;
      let noiseVal = noise(frameCount * 0.0005) * radius;
      rain.push(new drip(pose.keypoints[0].position.x, pose.keypoints[0].position.y, random(5, 10)))
    }
  }
  for(let i=rain.length-1; i>=0; i--){
    
     if (rain[i]) {
    rain[i].move();
    rain[i].show();
       }
}
 
     
}
  
class pointer{
  constructor(rad, finalSize){//rad角度。 acc加速度  最终大小
    this.dist=0
    this.rad=rad
    this.speed=0
    this.pos=createVector(0, 0)
    this.finalSize=finalSize
  this.downSpeed=createVector(random(-3,3),random(-3,0.9) )
    this.downAcc=createVector(0, 0.05)
  }
  move(){
   if(this.dist<=this.finalSize){//当 pointer 对象的距离达到 finalSize 时，它将停止扩展并开始向下运动。
    this.speed+=this.acc
    this.dist+=this.speed
       this.pos=createVector(cos(this.rad), sin(this.rad))
    } else{
      this.downSpeed.add(this.downAcc);
      this.pos.add(this.downSpeed);  
    }
  }
}


class drip{//雨滴
  constructor(posx, posy, extent){//延伸程度
    this.splat=[]//存储pointer对象
     this.color= color(random(colors))
     this.col=color(random(colorss))
      if (random() > 0.7) {
     this.color= color(random(colors))
          } else {
            this.color = color(235, random(30,215), 96, 10)
          }
    this.x=posx
    this.y=posy
		this.death=20//运行的帧率
    this.extent=extent
    this.noiseStart=random(1000)
  for(let i=this.noiseStart;i<this.noiseStart+1; i+=1){
   
    this.splat.push(new pointer(i,extent))
  
  }  
    this.Count=0
  }
  
 move(){
     this.Count = this.Count + 1;
   for(let n of this.splat){
     n.move()
   }
   this.Count = this.Count + 1;
    if(this.Count>150){
     let index = rain.indexOf(this);
      rain.splice(index, 1);
   }
 } 
 show(){
 noStroke()    
	 this.color.setAlpha(110)
   push()
  translate(this.x, this.y)
  beginShape()
  for(let i=0; i<this.splat.length; i++){
 let a=  this.splat[i].pos.x
 let  b= this.splat[i].pos.y
 fill(this.color)
     ellipse(a,  b-16, 15, 15);
      ellipse(a-11.5,  b-5, 15, 15);
      ellipse(a+11.5,  b-5, 15, 15);
   ellipse(a+8.5,  b+11, 15, 15);
   ellipse(a-8.5,  b+11, 15, 15);
    fill(this.col)
          ellipse(a,b, 15, 15);
 ellipse(this.splat[i].pos.x+random(-20,20), this.splat[i].pos.y+random(-20,20),2)    
  }
  endShape(CLOSE)
pop() 
 }
  
}

