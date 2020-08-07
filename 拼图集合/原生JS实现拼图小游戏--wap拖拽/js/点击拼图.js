Puzzle.prototype = {
    init (options){  //初始化
        this.initData(options)
        this.render(this.isReset) ;
        console.log(this.isReset)
        this.handle()        
    },
    initData(options){ //数据初始化赋值

        var self = this;
        this.options = options;
        this.el = document.querySelector(options.el);
        this.oPuzzle = document.createElement('div');
        this.puzzleWidth = options.data.width;
        this.puzzleHeight = options.data.height;
        this.row = options.data.row;  //总行数
        this.col = options.data.col;  //总列数
        this.puzzleImg  = options.data.puzzleImg; //背景图片的路径
        this.callBack = options.success ; //拼图成功后的回调
        this.isReset = options.data.isReset  || false ; //是否不随机
        //每个块的宽高  = 总宽高 / 行列  
        this.blockWidth = this.puzzleWidth / this.col;
        this.blockHeiht = this.puzzleHeight / this.row;
        //包含每个拼图背景的位置信息对象的数组
        this.blockImgPosition = this.getBlockImgPosition();
        //随机排序的  元素位置信息对象的数组
        this.blockPosition = this.getBlockPosition();
        setTimeout(function(){
            self.oEmptyBlock = self.oPuzzle.querySelector('div[ref=empty]');
            self.oBlockMap = self.oPuzzle.querySelectorAll('div[ref=block]');
        },0)
    },
    getBlockImgPosition(){  //  return 数组  包含每个拼图背景的位置信息
        var arr= [];
        //通过行列与每块元素宽高的乘积获取背景图显示的位置在每块元素上显示的position对象
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                arr.push({
                    x : j*this.blockWidth,
                    y : i*this.blockHeiht
                })               
            }   
        }
        return arr ;
    },
    getBlockPosition:function(){ //打乱每个拼图元素的位置 并 空出一个没有背景的元素 
        var newArr = [];
        for (var i = 0; i < this.blockImgPosition.length; i++) {
            newArr[i] = this.blockImgPosition[i];          
        }
        var lastEle = newArr[newArr.length-1]; //最后一个元素的坐标;
        newArr.length = newArr.length - 1 ; //将最后一个元素清除  空出位置;
        newArr.sort(function(){            //将每个含有背景图位置的数组随机打乱
            return Math.random()-0.5
        })
        newArr.push(lastEle);
        return newArr;
    },
    render(isReset){ //渲染节点
        var template = '';
        for (var i = 0; i < this.blockPosition.length; i++) {
            if (isReset) {
                 //img位置
                var imgX = this.blockImgPosition[i].x;
                var imgY = this.blockImgPosition[i].y;
            }else{
                 //img位置
                var imgX = this.blockPosition[i].x;
                var imgY = this.blockPosition[i].y;
            }
           
            //元素位置
            var positionX = this.blockImgPosition[i].x;
            var positionY = this.blockImgPosition[i].y;
            //判断是否为最后一块元素
            var isLastBlock = i == this.blockImgPosition.length - 1;
            template += `
                <div
                    class='block'
                    style="
                        width:${this.blockWidth}rem;
                        height: ${this.blockHeiht}rem;
                        top:${positionY}rem;
                        left: ${positionX}rem;
                        background-image: url(${this.puzzleImg});
                        background-position:${-imgX}rem ${-imgY}rem;
                        opacity: ${isLastBlock ? 0 : 1}
                    "
                    ref="${isLastBlock ? 'empty': 'block'}"
                    ></div>  
            `
            //追加元素
            this.oPuzzle.innerHTML = template;
            this.oPuzzle.style.width = this.puzzleWidth;
            this.oPuzzle.style.height = this.puzzleHeight;
            this.oPuzzle.setAttribute('class','puzzle');
            this.el.appendChild(this.oPuzzle);

        }
    },
    handle(){ //行为
        var self = this;
        this.resetImg()
        this.oPuzzle.onclick = function(e){
           var dom = e.target;
            // 通过判断点击的元素是否含有 'block'  是否为空白元素
            var isBlock = dom.classList.contains('block') && dom.getAttribute('ref') === 'block';
             if (isBlock) {
                self.handleBlock(dom)
             }   
        }
    },
    handleBlock(dom){  //点击元素后执行      
        var canMove = this.checkMove(dom);  //是否满足交换条件
        if(!canMove) return;//    不满足交换条件
        //交换位置函数
        this.moveBlock(dom);
        // 判断是否胜利
        this.checkWin();
    },
    checkMove(dom){ 
        //获取当前元素的行和列
       var blockRow =  this.getEleIndex(dom).row;
       var blockCol =  this.getEleIndex(dom).col;
       //获取空白元素的行和列
       var emptyRow = this.getEleIndex(this.oEmptyBlock).row;
       var emptyCol = this.getEleIndex(this.oEmptyBlock).col;
       //检查是否可以和空白元素交换
            //行数与空白元素相差一行  且列相同  或者  列数相差一列  行相同   则满足与空白元素交换条件    
       return blockRow === emptyRow && Math.abs(blockCol - emptyCol) === 1 || blockCol === emptyCol && Math.abs(blockRow - emptyRow) === 1 
    },
    getEleIndex(dom){//获取点击元素的行和列
        var left = dom.offsetLeft/50;
        var top = dom.offsetTop/50;

        var row = Math.ceil(top / this.blockHeiht);
        var col = Math.ceil(left / this.blockWidth);
        return {
            row,
            col
        }
    },
    moveBlock(oBlock){ //交换位置逻辑 将点击元素与空白元素 top 和 left 互换
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
    checkWin(){ //将标准数组中的top 和 left 与  当前的backgroundPosition 的x y 进行对比
        var isWin = true;
        for (var i = 0; i < this.oBlockMap.length; i++) {
            var oBlock = this.oBlockMap[i];
            //top left
            var blockLeft = parseInt('-'+oBlock.style.left);
            var blockTop = parseInt('-'+oBlock.style.top);
            //  x y
            var imgLeft = parseInt(oBlock.style.backgroundPositionX);
            var imgTop = parseInt(oBlock.style.backgroundPositionY);
            if (!(imgLeft == blockLeft && imgTop == blockTop)) {
                isWin=false;
                break;
            }
        }
        if (isWin) {
            this.GameWin(this.callBack)
        }
    },
    GameWin(callBack){  //拼图成功后 拼图无法点击   空白区域显示  触发成功后的回调
        this.oPuzzle.onclick = null;
        this.oEmptyBlock.style.opacity = 1;
        callBack()
    },
    resetImg(){ //复原
        var self = this ;
        document.querySelector('.reset').onclick = function(){
            self.el.innerHTML='';
            self.options.data.isReset =true
            self.init(self.options)
        }

        
    }   

}
function Puzzle (options) {
    this.init(options);
}