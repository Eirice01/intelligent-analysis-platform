


const defaultMark = (map) => {
  var size = 50;
  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    onAdd: function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    render: function () {
      var duration = 2000;
      var t = (performance.now() % duration) / duration;

      var radius = (size / 2) * 0.3;
      var outerRadius = (size / 2) * 0.7 * t + radius;
      var context = this.context;

      //外圆
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(42,255,244,' + (0.8 - t) + ')';
      context.fill();

      //内圆
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(42,255,244, 1)';
      // context.strokeStyle = 'rgba(42,255,244, 0)';
      // context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;
      map.triggerRepaint();
      return true;
    }
  };
}

const activeMark = (map) => {
  var size = 100;
  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    onAdd: function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    render: function () {
      var duration = 2000;
      var t = (performance.now() % duration) / duration;

      var radius = (size / 2) * 0.4;
      var outerRadius = (size / 2) * 0.7 * t + radius;
      var context = this.context;

      //外圆
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255,144,0,' + (0.8 - t) + ')';
      context.fill();

      //内圆
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255,144,0, 1)';
      context.strokeStyle = 'rgba(42,255,244, 0)';
      context.fill();

      // 内部五角星
      context.stroke();
      drawStar(50,50,15,context);
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;
      map.triggerRepaint();
      return true;
    }
  };
}

// 五角星
function drawStar(cx,cy,r,context){
  var dotArray=starDotArray(cx,cy,r);
  context.beginPath();
  context.strokeStyle='#fff';
  context.lineJoin='round';
  for(var i=0;i<dotArray.length;i++){
    if(i==0){
        context.moveTo(dotArray[i].x,dotArray[i].y);
    }else{
        context.lineTo(dotArray[i].x,dotArray[i].y);
    }
  }
  context.closePath();
  context.stroke();
  context.fillStyle='#fff';
  context.fill();
}

function starDotArray(cx,cy,r){
  //圆心坐标 以及圆半径
  var dotArray=[];
  var unitDeg=Math.PI * 4 / 5;
  var rotateDeg=unitDeg/8;
  for(var i=0;i<5;i++){
    var tempDit=unitDeg*i-rotateDeg;
    var y = Math.sin(tempDit) * r + cy;
    var x = Math.cos(tempDit) * r + cx;
    dotArray.push({x:x,y:y});
  }
  return dotArray;
}

export const iconMark = {
  default: defaultMark,
  active: activeMark
}
