require('normalize.css/normalize.css');
require('styles/App.scss');

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr){
    for (var i = 0, j = imageDataArr.length; i<j; i++){
        var singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageDatas);

import React from 'react';
import ReactDOM from 'react-dom';



var ImgFigure = React.createClass({
  /*
   * imgFigure的点击处理函数
   *
   */
   handleClick: function(e){

      this.props.inverse();

      e.stopPropagation();
      e.preventDefault();
   },

  render: function() {

    var styleObj = {};
    // 如果props属性指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0， 添加旋转角度
    if(this.props.arrange.rotate){
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      });
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
      imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
        <figure className={imgFigureClassName} onClick={this.handleClick} style={styleObj}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
                <p>
                  {this.props.data.desc}
                </p>
            </div>
          </figcaption>
        </figure>
      );

  }
});


var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos: {
      left:0,
      right:0
    },
    hPosRange: { //水平方向的取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange: {  // 垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  },
  getRangeRandom: function (low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  },
  /*
   * 获取-30 ~ 30任意值
   */
  get30DegRandom: function(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
  },

  /*
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数， 其内return一个真正待被执行的函数
   *
   */
   inverse: function(index){
      return function() {
        var imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      }.bind(this);
   },

  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecx = hPosRange.leftSecX,
      hPosRangeRightSecx = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      // 取一个或者不取
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 居中centerIndex的图片
    imgsArrangeCenterArr[0] = {
      // 位置
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    // 取出要布局上册图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    
    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      value = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom()
        
      };
    });

    // 布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      // 前半部分布局左边，后半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecx;
      } else {
        hPosRangeLORX = hPosRangeRightSecx;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom()
      };
    }

    // 将上侧图片信息放回数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeArr[0]);
    }

    // 将中心区域图片信息放回数组
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },

  getInitialState: function(){
    return {
      imgsArrangeArr: [
        /*{
          pos:{
            left: '0',
            top: '0'
          },
          rotata: 0,  //旋转角度
          isInverse: false // 图片正反面
        }*/
      ]
    };
  },

  // 组件加载以后， 为每张图片计算其位置的范围
  componentDidMount: function(){

    // 拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到imageFigure大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左侧右侧区域图片排布位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    
    // 计算上侧区域图片排布位置取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);


  },
  render: function(){

    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}
       arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});


ReactDOM.render(<GalleryByReactApp />, document.getElementById('cont'));
module.exports = GalleryByReactApp;
