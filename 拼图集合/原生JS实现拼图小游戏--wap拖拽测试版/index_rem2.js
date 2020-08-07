Puzzle.prototype  = {
    init(options){
        this.initData(options)
        this.render()
        this.handle()
    },
    initData(options){    //初始化数据
        this.options = options;
        this.el = $(options.el);
        this.imgArea =  $('<div class="imgArea" style="position:relative;"></div>');
        this.puzzleWidth = options.data.width;   //拼图总宽度
        this.puzzleHeight = options.data.height;  //拼图总高度
        this.startBtn = $(options.data.startBtn);  // 绑定触发拼图的按钮
        this.row = options.data.row;  //总行数
        this.col = options.data.col;  //总列数
        this.puzzleImg  = options.data.puzzleImg; //背景图片的路径
        this.callBack = options.success ; //拼图成功后的回调
        //每个块的宽高  = 总宽高 / 行列  
        this.cellW = this.puzzleWidth / this.col;
        this.cellH = this.puzzleHeight / this.row;
        this.oriArr = [];  //标准数组
        this.ranArr = [];  //随机数组
        this.flag = true;  //标准数组与随机数组之间的切换锁
        this.htmlFontSize = $("html").css("font-size") && parseFloat($("html").css("font-size")); //获取1rem对应的px
    },
    handle(){             //功能
        this.gameState()
    },
    render(){               //渲染
        var cell,template=''    
        //行
        for(var i = 0; i < this.row; i++) {
            //列
            for (var j = 0; j <this.col; j++) {
                this.oriArr.push(i*this.col +j)//[0,1,2,3,4,5,6,7,8]
                 template += 
                `<div
                        class='cell'
                        style="
                            position: absolute;
                            width:${this.cellW}rem;
                            height: ${this.cellH}rem;
                            top:${this.cellH * i}rem;
                            left:${this.cellW * j}rem;
                            background-position:${-this.cellW * j}rem ${-this.cellH * i}rem;
                            background-image: url(${this.puzzleImg});
                            background-size: ${this.puzzleWidth}rem ${this.puzzleHeight}rem;
                            border: 1px solid #fff;
                            z-index: 10;
                           
                            "                       
                    ></div>  
                </div>          
                `  ;                         
            }       
        }
                this.imgArea.html(template);
                this.imgArea.css({
                    'width':this.puzzleWidth+ 'rem',
                    'height':this.puzzleHeight+'rem'
                })             
                this.el.append(this.imgArea);
                this.cell = $('.cell') 
    },
    gameState(){
        var that = this;
        var imgCell = this.cell,
            imgArea = this.imgArea
        this.startBtn.on('click',function(){
            if (that.flag) {
                $(this).text('复原')
                that.flag = false;
                that.randomArr(); //打乱数组
                that.cellOrder(that.ranArr);//对数组进行样式排序
                
                imgCell.on('touchstart',function(e){
                    var index1  = $(this).index(); //获取在标准数组中的索引值           
                    var left =  e.originalEvent.touches[0].pageX- imgCell.eq(index1).offset().left;
                    var top =e.originalEvent.touches[0].pageY- imgCell.eq(index1).offset().top;
                  
                    console.log(1)
                    $(document).on('touchmove',function(e2){
                        imgCell.eq(index1).css({
                            'z-index':'40',
                            'left':e2.originalEvent.touches[0].pageX - left - imgArea.offset().left ,
                            'top':e2.originalEvent.touches[0].pageY - top - imgArea.offset().top ,
                        })
                    }).on('touchend',function(e3){                      
                        var left = e3.originalEvent.changedTouches[0].pageX - imgArea.offset().left;
                        var top =e3.originalEvent.changedTouches[0].pageY - imgArea.offset().top
                        var index2 = that.changeIndex(left,top,index1) ;//可能将要改变的位置 
                        if (index1 == index2) {  //判断是否还在原来的位置上
                            that.cellReturn(index1) //索引一样
                        }else{                         
                                //标准数组中的第几张图片与标准数组中的第几张图片进行交换
                                that.cellChange(index1,index2)                          
                        }
                        $(document).off('touchmove').off('touchend').off('touchstart');       
                    })
                })
            }else{
                $(this).text('开始')
                that.flag = true;
                //复原               
                that.cellOrder(that.oriArr);
                $(document).off('touchmove').off('touchend').off('touchstart');
            }
        })
    },
    changeIndex(x,y,index){ //被交换节点在节点列表中的下标
        //判断拖拽位置是否在大图片内 
        if (x < 0 || x > this.puzzleWidth*this.htmlFontSize || y < 0 || y > this.puzzleHeight*this.htmlFontSize) { //移动出去或者移动很小             
            return index;                               //返回当前的索引
        }
        //鼠标拖动碎片在大图范围内移动
        //判断第几行  第几列
        var row = Math.floor((y/this.htmlFontSize)/this.cellH);  //拖拽了多少行
        var col = Math.floor((x/this.htmlFontSize)/this.cellW); //拖拽了多少列
        // 例如：[2,5,1,4,3,0,6,7,8]  第0张图片2放在九宫格中 0 的位置上 ， 第一张1放在5的位置上
        var l = row * this.row +col;
        var i =0, len = this.ranArr.length;
        while((i < len ) && (this.ranArr[i] != l)){
            i++; 
        }  
        return i;      //获取乱序数组中from值的索引
    },
    cellReturn(index) { //飞回原来的位置
        var j = this.ranArr[index] % this.col ;
        var i =Math.floor(this.ranArr[index] /this.row);
        this.cell[index].style.left = this.cellW * j  + 'rem';
        this.cell[index].style.top = this.cellH * i + 'rem';
        this.cell[index].style.zIndex = '10';       
    },
    randomArr(){  //获取打乱后的随机数组
        //进来之前清空
        this.ranArr = [];
        var len = this.oriArr.length;
        for (var i = 0; i < len; i++) {
           order = Math.floor(Math.random()*len);
           if(this.ranArr.length>0){
                while($.inArray(order,this.ranArr)>-1){
                    order = Math.floor(Math.random()*len);
                }
           }
           this.ranArr.push(order)
        }      
        return;
    },
    /**
     * 
     * 乱序数组的索引代表的是标准数组中的第几张图片 ，乱序数组中的元素代表的是位置
     * 例如：[2,5,1,4,3,0,6,7,8] 理解为 [[2,0],[5,1],[1,2]...] [[所放位置 ， 第几张图片]]  
     *  
     * 算法逻辑： i *3 + j    根据元素的下标除以3取整拿到行数i  乘3取余拿到 列数j  
     *///
    //
    cellOrder(arr){  //将打乱后的数组进行排序    记录图片所放的位置                          
    var len = arr.length;         
    var that = this;
        for (var i = 0; i < len; i++) {
            that.cell.eq(i).animate({
               'left':arr[i] % that.row * that.cellW  + 'rem',
               'top':Math.floor(arr[i] / that.col)  * that.cellH + 'rem'
           },400) 
        }
    },
    /**
     * 通过索引 ，获取到两个图片的位置 , 再进行运算得出行和列后，进行交换位置
     * @param {被拖动的元素在标准数组中的下标} from 
     * @param {被交换的元素在标准数组中的下标} to 
     */
    cellChange(from,to){        
        const { ranArr,cellW,cellH ,cell ,col,row} = this;
        console.log(ranArr,from,to)
        var that = this;
        //改变前的位置
        var fromj = ranArr[from] % col; 
        var fromi =Math.floor(ranArr[from] / row);
      
        //要到哪个位置
        var toj = ranArr[to] % that.col; 
        var toi =Math.floor(ranArr[to] / row);
        var temp = ranArr[to];
        cell.eq(from).animate({
            'left': cellW * toj + 'rem',
            'top': cellH  * toi + 'rem'
        },400,function(){
            $(this).css('z-index','10')
        });
        cell.eq(to).animate({
            'left': cellW * fromj + 'rem',
            'top': cellH  * fromi + 'rem'
        },400,function(){
            //恢复样式,更新数组          
                $(this).css('z-index','10');          
                ranArr[to] = ranArr [from];
                ranArr[from] =temp;
                that.check() //判断是否完成
                flag=false;                        
        })
    },
    check(){  //判断是否完成游戏
        if(this.oriArr.toString() == this.ranArr.toString()){
            $('.start').text('开始');
            this.flag = true;
            this.callBack();
            this.cell.unbind('touchmove').unbind('touchend').unbind('touchstart');
        }
    }
}
function Puzzle(options){
    this.init(options);
}