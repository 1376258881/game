Puzzle.prototype = {
    init (options){  //初始化
        this.initData(options)
        this.render(this.isReset) ;
        this.handle()        
    },
    initData(options){ //数据初始化赋值
        var self = this;
        this.options = options;
        this.el = document.querySelector(options.el);
        this.oPuzzle = document.createElement('div');
        this.startBtn = document.querySelector(options.data.startBtn);  // 绑定触发拼图的按钮
        this.puzzleWidth = options.data.width;
        this.puzzleHeight = options.data.height;
        this.row = options.data.row;  //总行数
        this.col = options.data.col;  //总列数
        this.puzzleImg  = options.data.puzzleImg; //背景图片的路径
        this.callBack = options.success ; //拼图成功后的回调
        this.beforeHandle = options.beforeHandle;
        this.isReset = options.data.isReset  || false ; //是否不随机
        //每个块的宽高  = 总宽高 / 行列  
        this.blockWidth = this.puzzleWidth / this.col;
        this.blockHeiht = this.puzzleHeight / this.row;
        //包含每个拼图背景的位置信息对象的数组
        this.blockImgPosition = this.getBlockImgPosition();
        //随机排序的  元素位置信息对象的数组
        this.blockPosition = this.getBlockPosition();
        setTimeout(function(){
            self.blockPrantS=document.querySelectorAll('.block');
            self.oBlockMap = self.oPuzzle.getElementsByClassName('block');
        },0)
        this.htmlFontSize = document.querySelector("html").style.fontSize  //获取1rem对应的px换算
        if ( this.htmlFontSize) {this.htmlFontSize = parseFloat(this.htmlFontSize)}               
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
        newArr.sort(function(){            //将每个含有背景图位置的数组随机打乱
            return Math.random()-0.5
        })
        return newArr;
    },
    render(isReset){ //渲染节点
        var template = '';
        for (var i = 0; i < this.blockPosition.length; i++) {
            if (isReset) {  //根据配置项，决定是否为乱序
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
            template += `   
                <div
                    class='block'
                    style="
                        width:${this.blockWidth}rem;
                        height: ${this.blockHeiht}rem;
                        background-image: url(${this.puzzleImg});
                        background-position:${-imgX}rem ${-imgY}rem;
                        background-size:${this.puzzleWidth}rem ${this.puzzleHeight}rem;
                        position: absolute;
                        box-sizing: border-box;
                        top:${positionY}rem;
                        left: ${positionX}rem;
                    "                  
                ></div>            
            `
            //追加元素
            this.oPuzzle.innerHTML = template;
            this.oPuzzle.style.width = this.puzzleWidth + 'rem';
            this.oPuzzle.style.height = this.puzzleHeight + 'rem';
            this.oPuzzle.style.position = 'relative';
            this.oPuzzle.setAttribute('class','puzzle');
            this.el.appendChild(this.oPuzzle);
           
        }
        
    },
    cellOrder(arr){  //将打乱后的数组进行排序    记录图片所放的位置                          
        var len = arr.length;         
        var that = this;
        var lis = document.querySelectorAll(".block");
        for (var i = 0; i < len; i++) {
            //console.log(that.block)
            $(lis).eq(i).animate({
                'left':arr[i].x + 'rem',
                'top':arr[i].y+ 'rem'
            },400) 
        }
    },
    handle(){ //行为
        var self = this;
        this.resetImg();
        var startx, starty,x,y,endx,endy;
        var lis = document.querySelectorAll(".block");
        var from,to;    
        for(var i = 0; i < lis.length;i++){       
            lis[i].addEventListener('touchstart',function(e){
                this.style.zIndex = 100; //设置拖拽元素的z-index值，使其在最上面。
                from = event.target || event.srcElement;  //起点元素
                startx = from.style.left; //记录起点位置，以left和top来标记更为准确，避免用this.offsetLeft计算有图片重叠的bug
                starty =from.style.top;
                if(self.isReset){
                    x =  e.changedTouches[0].pageX/self.htmlFontSize  - startx;
                    y = e.changedTouches[0].pageY/self.htmlFontSize  -  starty;
                }else{
                    x =  e.changedTouches[0].pageX/self.htmlFontSize  - parseFloat(startx);
                    y = e.changedTouches[0].pageY/self.htmlFontSize  - parseFloat(starty);
                }
               
                this.style.transition = 'none';
                self.oneFlag = false ;  //添加成功后的执行函数只执行一次的开关
            })   
            lis[i].addEventListener("touchmove", function(e){
                newLeft = e.targetTouches[0].pageX/self.htmlFontSize - x; //记录拖拽的水平状态发生改变时的位置
                newtop = e.targetTouches[0].pageY/self.htmlFontSize - y;
                if (newLeft <= -self.blockWidth / 2) { //限制边界代码块，拖拽区域不能超出边界的一半
                    newLeft = -self.blockWidth / 2;
                } else if (newLeft >= (self.puzzleWidth - self.blockWidth / 2)) {
                    newLeft = (self.puzzleWidth - self.blockWidth / 2);
                }
                
                if (newtop <= -self.blockHeiht / 2) {
                    newtop = -self.blockHeiht / 2;
                } else if (newtop >= (self.puzzleHeight - self.blockHeiht / 2)) {
                    newtop = (self.puzzleHeight  - self.blockHeiht / 2);
                }
                this.style.left = newLeft + 'rem';
                this.style.top = newtop + 'rem'; //设置目标元素的left,top
            });
            lis[i].addEventListener('touchend',function(e3){
                this.style.zIndex = 0;
                this.style.transition = 'all 0.5s ease 0s'; //添加css3动画效果
                endx = e3.changedTouches[0].pageX /self.htmlFontSize-  x;
                endy = e3.changedTouches[0].pageY /self.htmlFontSize  - y;
                to = self.change(from,endx,endy)
                if (to == from) {  //所去的位置还是原来
                    to.style.left = startx;
                    to.style.top = starty;
                } else {
                    to.style.transition = 'all 0.5s ease 0s'; //添加css3动画效果
                    var toLeft,toTop;
                    toLeft = to.style.left; //交换坐标
                    toTop = to.style.top;

                    from.style.left=toLeft
                    from.style.top=toTop
                    
                    to.style.left = startx;
                    to.style.top = starty;                    
                }    
            })             
            lis[i].addEventListener('transitionend', function () {             
                self.checkWin() //动画结束，判断是否为赢
            })                
        }
    },
    change(from, x, y){  //获取交换元素
        var lis = document.querySelectorAll(".block");
        for (var i = 0; i < lis.length; i++) { //还必须判断是不是当前原素本身。将自己排除在外
            if (Math.abs(lis[i].offsetLeft/this.htmlFontSize - x) <= this.blockWidth / 2 && Math.abs(lis[i].offsetTop/this.htmlFontSize - y) <= this.blockHeiht / 2 && lis[i] != from)
                return lis[i];
        }
        return from; //返回当前
    },
    checkWin(){ //将标准数组中的top 和 left 与  当前的backgroundPosition 的x y 进行对比
        var isWin = true;    
        for (var i = 0; i < this.oBlockMap.length; i++) {           
            var oBlock = this.oBlockMap[i];
            var blockPrantS = this.blockPrantS[i]
            //top left  //当background-position 与 position坐标相同 则为赢
            var blockLeft = parseInt('-'+blockPrantS.style.left);
            var blockTop = parseInt('-'+blockPrantS.style.top);
            //  x y
            var imgLeft = parseInt(oBlock.style.backgroundPositionX);
            var imgTop = parseInt(oBlock.style.backgroundPositionY);
            if (!(imgLeft == blockLeft && imgTop == blockTop)) {
                isWin=false;
                break;
            }
        }
      //isWin  ==true 则判断为赢  this.oneFlag==false 只执行一次的开关，避免重复执行  this.isReset == false 避免复原成功状态下点击继续执行
        if (isWin && this.oneFlag==false && this.isReset == false) {
            this.oneFlag = true
            this.GameWin(this.callBack)
            console.log(isWin,this.oneFlag,this.isReset)
        }
    },
    GameWin(callBack){  //拼图成功后 
        this.isReset = true;
        this.options.data.isReset =true  
        if(this.startBtn){
            this.startBtn.innerText = '开始' 
            this.startBtn.className += ' oPuzzle_start'
        }  
        callBack()
    },
    resetImg(){ //复原
        if(this.startBtn){
            var self = this;    
            if (self.isReset) {
                this.startBtn.innerText = '开始'  ;
                this.startBtn.className += ' oPuzzle_start'
                this.startBtn.classList.remove('oPuzzle_reset')
            }else{               
                this.startBtn.innerText = '复原';
                this.startBtn.className += ' oPuzzle_reset' 
                this.startBtn.classList.remove('oPuzzle_start') 
            }
            this.startBtn.onclick = function(){
                if (self.isReset ) {
                    self.isReset =false ; 
                   // self.el.innerHTML='';
                   // self.init(self.options)
                    self.blockPosition= self.getBlockPosition();        
                    self.cellOrder(self.blockPosition)    
                } else {               
                    self.isReset  =true;
                  //  self.el.innerHTML='';
                  //  self.init(self.options);
                    self.blockImgPosition = self.getBlockImgPosition();
                    // self.blockPosition= self.getBlockPosition();        
                    self.cellOrder(self.blockImgPosition)    

                }  
                if (self.isReset) {
                    self.startBtn.innerText = '开始'  ;
                    self.startBtn.className += ' oPuzzle_start'
                    self.startBtn.classList.remove('oPuzzle_reset')
                }else{               
                    self.startBtn.innerText = '复原';
                    self.startBtn.className += ' oPuzzle_reset' 
                    self.startBtn.classList.remove('oPuzzle_start') 
                }
              console.log(self.blockPosition)
                
                // this.oPuzzle.style.transition = 'all 0.5s ease 0s';  
               
            }      
        }          
    }, 
}
function Puzzle (options) {
    this.init(options);
}


