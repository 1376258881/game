Puzzle.prototype = {
  /**
   * 初始化函数
   * @param {Object} options  - 配置对象参数
   */
  init: function (options) {
    this.initData(options);
    this.render();
    this.handle();
  },
  /**
   * 初始化数据
   * @param {Object} options - 配置对象参数
   */
  initData: function (options) {
    var self = this;

    this.el = document.querySelector(options.el);
    this.oPuzzle = document.createElement('div');
    this.puzzleWidth = options.data.width;
    this.puzzleHeight = options.data.height;

    this.row = options.data.row;
    this.col = options.data.col;

    this.blockWidth = this.puzzleWidth / this.col;
    this.blockHeight = this.puzzleHeight / this.row;

    this.blockImgPosition = this.getBlockImgPosition();
    this.blockPosition = this.getBlockPosition();
    
    this.puzzleImg = options.data.img;

    setTimeout(function () {
      self.oEmptyBlock = self.oPuzzle.querySelector('div[ref=empty]');
      self.oBlockMap = self.oPuzzle.querySelectorAll('div[ref=block]');
    }, 0)
  },
  /**
   * 获取到每一个拼图元素的背景图片位置信息
   */
  getBlockImgPosition: function () {
    var arr = [];

    for(var i = 0; i < this.row; i ++) {
      for(var j = 0; j < this.col; j ++) {
        arr.push({
          x: j * this.blockWidth,
          y: i * this.blockHeight,
        })
      }
    }
    return arr;
  },
  /**
   * 获取到每一个拼图元素的位置信息
   */
  getBlockPosition: function () {
    var newArr = [];

    for(var i = 0; i < this.blockImgPosition.length; i ++) {
      newArr[i] = this.blockImgPosition[i];
    }

    var lastEle = newArr[newArr.length - 1];
    newArr.length = newArr.length - 1;
    newArr.sort(function () {
      return Math.random() - 0.5;
    })
    newArr.push(lastEle);

    return newArr;
  },
  /**
   * 渲染函数 - 渲染出整个拼图区域 
   */
  render: function () {
    // 声明模板(dom字符串)
    var template = '';
    for(var i = 0; i < this.blockImgPosition.length; i ++) {
      // 获取到背景的位置坐标信息
      var imgX = this.blockImgPosition[i].x;
      var imgY = this.blockImgPosition[i].y;
      // 获取到元素位置坐标信息
      var positionX = this.blockPosition[i].x;
      var positionY = this.blockPosition[i].y;
      // 判断当前生成的元素是否为最后一块元素
      var isLastBlock = i === this.blockImgPosition.length - 1;
      // 拼接模板
      template += `
        <div
          class="block"
          style="
            width: ${this.blockWidth}px; 
            height: ${this.blockHeight}px;
            top: ${positionY}px;
            left: ${positionX}px;
            background-image: url(${this.puzzleImg});
            background-position: ${-imgX}px ${-imgY}px;
            opacity: ${isLastBlock ? 0 : 1}
          "
          ref="${isLastBlock ? 'empty' : 'block'}"
        ></div>
      `
    }

    this.oPuzzle.innerHTML = template;
    this.oPuzzle.style.width = this.puzzleWidth + 'px';
    this.oPuzzle.style.height = this.puzzleHeight + 'px';
    this.oPuzzle.setAttribute('class', 'puzzle');
    this.el.appendChild(this.oPuzzle);
  },
  /**
   * 事件监听函数，监听puzzle元素(拼图父元素)的点击事件
   */
  handle: function () {
    var self = this;
    this.oPuzzle.onclick = function (e) {
      // 获取触发点击事件的那个元素
      var dom = e.target;
      // 通过判断class列表中是否包含'block'，以确定元素是否为block元素
      // 并且该元素不可以为空白元素
      // 若条件符合，则变量值为true，若不符合，则变量值为false
      var isBlock = dom.classList.contains('block') && dom.getAttribute('ref') === 'block';

      if(isBlock) {
        self.handleBlock(dom);
      }
    }
  },
  /**
   * 点击block(拼图小元素)时执行的函数
   * 1. 判断被点击的元素是否可以和空白元素交换位置
   * 2. 若第一步结果为ok，则被点击的元素需要和空白元素交换位置
   * 3. 判断拼图是否拼接成功
   * @param { Object } dom - 被点击的block元素
   */
  handleBlock: function (dom) {
    var canMove = this.checkMove(dom);
    if(!canMove) { return }
    // 交换位置
    this.moveBlock(dom);    
    // 判断是否胜利
    this.checkWin();
  },
  /**
   * 检查某一拼图元素是否可以和空白元素交换
   * 可交换的条件为：
   *  两元素的列相同，行相差为1
   *  两元素行相同，列相差为1
   * 两条件满足一个皆可
   * @param { Object } oBlock - 要被检查的元素
   * @return { Boolean }
   */
  checkMove: function (oBlock) {
    // 获取block元素当前的行和列
    var blockRow = this.getEleIndex(oBlock).row;
    var blockCol = this.getEleIndex(oBlock).col;

    // 获取empty元素当前的行和列
    var emptyRow = this.getEleIndex(this.oEmptyBlock).row;
    var emptyCol = this.getEleIndex(this.oEmptyBlock).col;

    return blockRow === emptyRow && Math.abs(blockCol - emptyCol) === 1 || blockCol === emptyCol && Math.abs(blockRow - emptyRow) === 1;
  },
  /**
   * 获取某一元素的行&列信息
   * @param { Object } dom
   * @return { Object } row: 行数(整数) col: 列数(正数)
   */
  getEleIndex: function (dom) {
    var left = dom.offsetLeft;
    var top = dom.offsetTop;

    var row = Math.round(top / this.blockHeight);
    var col = Math.round(left / this.blockWidth);

    return {
      row: row,
      col: col,
    }
  },
  /**
   * block元素与空白元素交换位置
   * @param { Object } oBlock - 需要移动的block元素
   */
  moveBlock: function (oBlock) {
    // 获取block元素的left值和top值
    var blockLeft = oBlock.style.left;
    var blockTop = oBlock.style.top;
    // 设置block元素的left和top为empty元素的left和top
    oBlock.style.left = this.oEmptyBlock.style.left;
    oBlock.style.top = this.oEmptyBlock.style.top;
    // 设置empty元素的left和top为block元素的left和top
    this.oEmptyBlock.style.left = blockLeft;
    this.oEmptyBlock.style.top = blockTop;
  },
  /**
   * 检查游戏是否胜利
   * 判断每一个block元素的位置信息的反值是否和背景图片位置信息一致
   * 若一致，则执行游戏胜利逻辑
   */
  checkWin: function () {
    // isWin变量存放是否胜利的状态，默认为true
    var isWin = true;

    for(var i = 0; i < this.oBlockMap.length; i ++) {
      var oBlock = this.oBlockMap[i];

      var blockLeft = parseInt('-' +oBlock.style.left);
      var blockTop = parseInt('-' + oBlock.style.top);

      var imgLeft = parseInt(oBlock.style.backgroundPositionX);
      var imgTop = parseInt(oBlock.style.backgroundPositionY);

      if(!(blockLeft === imgLeft && blockTop === imgTop)) {
        isWin = false;
        break;
      }
    }

    if(isWin) {
      this.winGame();
    }
  },
  /**
   * 拼图成功
   * 1. 弹出提示成功的对话框
   * 2. 空白元素显示出来
   * 3. 拼图区域不再能点击
   */
  winGame: function () {
    var self = this;
    setTimeout(function() {
      alert('恭喜你,拼图成功');
      self.oEmptyBlock.style.opacity = 1;
    }, 300)
    this.oPuzzle.onclick = null;
  },
}

function Puzzle (options) {
  this.init(options);
}