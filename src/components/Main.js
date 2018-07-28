require('normalize.css/normalize.css');
require('styles/App.scss');

let yeomanImage = require('../images/yeoman.png');
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



class ContentComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
};

ReactDOM.render(<ContentComponent />, document.getElementById('cont'));
module.exports = ContentComponent;
