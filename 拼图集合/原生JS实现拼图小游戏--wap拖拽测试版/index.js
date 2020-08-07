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
                            width:${this.cellW}px;
                            height: ${this.cellH}px;
                            top:${this.cellH * i}px;
                            left:${this.cellW * j}px;
                            background-position:${-this.cellW * j}px ${-this.cellH * i}px;
                            background-image: url(${this.puzzleImg});
                            background-size: ${this.puzzleWidth}px ${this.puzzleHeight}px;
                            border: 1px solid #fff;
                            z-index: 10;
                            transition-property: background-position;
                            transition-duration: 300ms;
                            transition-timing-function: ease-in-out;
                            "                       
                    ></div>  
                </div>          
                `  ;                         
            }       
        }
                this.imgArea.html(template);
                this.imgArea.css({
                    'width':this.puzzleWidth+ 'px',
                    'height':this.puzzleHeight+'px'
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
                imgCell.on('mousedown',function(e){
                    var index1  = $(this).index(); //获取在标准数组中的索引值           
                    var left =  e.pageX - imgCell.eq(index1).offset().left;
                    var top =e.pageY- imgCell.eq(index1).offset().top;
                    $(document).on('mousemove',function(e2){
                        imgCell.eq(index1).css({
                            'z-index':'40',
                            'left':e2.pageX - left - imgArea.offset().left ,
                            'top':e2.pageY - top - imgArea.offset().top ,
                        })
                    }).on('mouseup',function(e3){
                        var left = e3.pageX - imgArea.offset().left;
                        var top =e3.pageY - imgArea.offset().top
                        var index2 = that.changeIndex(left,top,index1) ;//可能将要改变的位置 
                        console.log(index1,index2,that.ranArr)
                        if (index1 == index2) {  //判断是否还在原来的位置上
                            that.cellReturn(index1) //索引一样
                        }else{
                            that.cellChange(index1,index2)
                        }
                        $(document).off('mousemove').off('mouseup');
        
                    })
                })
            }else{
                $(this).text('开始')
                that.flag = true;
                //复原               
                that.cellOrder(that.oriArr);
                $(document).off('mousemove').off('mouseup').off('mousedown');
            }
        })
    },
    changeIndex(x,y,index){  //与之交换的元素下标
        if (x < 0 || x > this.puzzleWidth || y < 0 || y > this.puzzleHeight) { //移动出去或者移动很小 
            return index;                               //返回当前的索引
        }
        //鼠标拖动碎片在大图范围内移动
            //判断第几行  第几列
            var row = Math.floor(y/this.cellH);  //拖拽了多少行
            var col = Math.floor(x/this.cellW); //拖拽了多少列
            var l = row * this.row +col;
            var i =0, len = this.ranArr.length;
            while((i < len ) && (this.ranArr[i] != l)){
                i++; 
            } 
            return i;     
    },
    cellReturn(index) { //飞回index的位置
        var j = this.ranArr[index] % this.col ;
        var i =Math.floor(this.ranArr[index] /this.row);
        this.cell[index].style.left = this.cellW * j  + 'px';
        this.cell[index].style.top = this.cellH * i + 'px';
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
    //i *3 + j    根据元素的下标除以3取整拿到行数i  乘3取余拿到 列数j  
    cellOrder(arr){  //将打乱后的数组进行排序   
        var len = arr.length;  
        var that = this;
        console.log(that.cell)
        for (var i = 0; i < len; i++) {
            that.cell.eq(i).animate({
               'left':arr[i] % that.row * that.cellW  + 'px',
               'top':Math.floor(arr[i] / that.col)  * that.cellH + 'px'
           },400) 
        }
    },
    /**
     * 
     * @param {被拖动的元素在标准数组中的下标} from 
     * @param {被交换的元素在标准数组中的下标} to 
     */
    cellChange(from,to){ 
        const { ranArr,cellW,cellH ,cell } = this;
        var that = this;
        //改变前的位置
        var fromj = ranArr[from] % that.col; 
        var fromi =Math.floor(ranArr[from] /that.row);
    
        //要到哪个位置
        var toj = ranArr[to] % that.col; 
        var toi =Math.floor(ranArr[to] /that.row);
        var temp = ranArr[from];
        cell.eq(from).animate({
            'left': cellW * toj + 'px',
            'top': cellH  * toi + 'px'
        },400,function(){
            $(this).css('z-index','10')
        });
        // console.log(from,to)
        cell.eq(to).animate({
            'left': cellW * fromj + 'px',
            'top': cellH  * fromi + 'px'
        },400,function(){
            //恢复样式,更新数组
            $(this).css('z-index','10');
            ranArr[from] = ranArr [to];
            ranArr[to] =temp;
            that.check()
        })
    },
    check(){  //判断是否完成游戏
        if(this.oriArr.toString() == this.ranArr.toString()){
            // alert('right');
            $('.start').text('开始');
            this.flag = true;
            this.callBack();
            this.cell.unbind('mousemove').unbind('mouseup').unbind('mousedown');
            // $(document).off('mousemove').off('mouseup').off('mousedown');
        }
    }
}
function Puzzle(options){
    this.init(options);
}



// var imgArea=$('.imgArea');
// var imgW = parseInt(imgArea.css('width'));
// var imgH = parseInt(imgArea.css('height'));
// var cellW=imgW/3;
// var cellH=imgH/3;
// var imgCell;
// //标准数组
// var oriArr=[];
// //随机数组
// var ranArr = [];
// var flag =true;
// // init()
function init(){
    imgSplit();
    gameState()
}
function imgSplit(){
    var cell;
    //行
    for (var i = 0; i < 3; i++) {
        //列
        for (var j = 0; j < 3; j++) {
            oriArr.push(i*3 +j)//[0,1,2,3,4,5,6,7,8]
            cell = $('<div class="imgCell"></div>')  
            $(cell).css({
                'width':cellW +'px',
                'height':cellH + 'px',
                'left':cellW*j+'px',
                'top':cellW * i+'px',
                'backgroundPosition':-cellW*j+'px '  + -cellW * i+'px'
            })          
            imgArea.append(cell);          
        }       
    }
    console.log(oriArr)
    imgCell =  $('.imgCell')
}
function gameState(){
$('.start').on('click',function(){
    if (flag) {
        $(this).text('复原')
        flag = false;
        randomArr();
        cellOrder(ranArr);
        imgCell.on('mousedown',function(e){
            var index1  = $(this).index();
           
            var left =  e.pageX - imgCell.eq(index1).offset().left;
            var top =e.pageY- imgCell.eq(index1).offset().top;
            $(document).on('mousemove',function(e2){
                imgCell.eq(index1).css({
                    'z-index':'40',
                    'left':e2.pageX - left - imgArea.offset().left ,
                    'top':e2.pageY - top - imgArea.offset().top ,
                })
            }).on('mouseup',function(e3){
                var left = e3.pageX - imgArea.offset().left;
                var top =e3.pageY - imgArea.offset().top
                var index2 = changeIndex(left,top,index1) ;//可能将要改变的位置 
                console.log(index2,index1)
                if (index1 == index2) {  //判断是否还在原来的位置上
                    cellReturn(index1) //索引一样
                }else{
                    cellChange(index1,index2)
                }
                $(document).off('mousemove').off('mouseup');

            })
        })
    }else{
        $(this).text('开始')
        flag = true;
        //复原
        cellOrder(oriArr);
        $(document).off('mousemove').off('mouseup').off('mousedown');
    }
})
}

function  randomArr(){
    //进来之前清空
    ranArr = [];
    var len = oriArr.length;
    for (var i = 0; i < len; i++) {
       order = Math.floor(Math.random()*len);
       if(ranArr.length>0){
            while($.inArray(order,ranArr)>-1){
                order = Math.floor(Math.random()*len);
            }
       }
        ranArr.push(order)
    }
    return;
}

//i *3 + j    除以3取整拿到i  乘3取余拿到 j  
function  cellOrder(arr){
    var len = arr.length;
    for (var i = 0; i < len; i++) {
       imgCell.eq(i).animate({
           'left':arr[i] % 3 *cellW  + 'px',
           'top':Math.floor(arr[i] / 3)  * cellH + 'px'
       },400) 
    }
}
function changeIndex(x,y,index){  
    if (x < 0 || x > imgW || y < 0 || y >imgH) { //移动出去或者移动很小 返回当前的索引
        return index;
    }
    //鼠标拖动碎片在大图范围内移动
        //判断第几行  第几列
        var row = Math.floor(y/cellH);  //行
        var col = Math.floor(x/cellW); //列
        var l = row * 3 +col;
        var i =0, len = ranArr.length;
        console.log(x,imgW,y, imgH)
        while((i < len ) && (ranArr[i] != l)){
            i++; 
        } 
        return i;     
}
function cellReturn(index) { //飞回原来的位置
    var j = ranArr[index] % 3 ;
    var i =Math.floor(ranArr[index] /3);
    console.log(j,i)
    imgCell.eq(index).animate({
        'left': cellW * j + 'px',
        'top': cellH  * i + 'px'
    },400,function(){
        $(this).css('z-index','10')
    })
}
//
function  cellChange(from,to){ //被拖动图片、被交换图片所在行、列
    //改变前的位置
    var fromj = ranArr[from] % 3; 
    var fromi =Math.floor(ranArr[from] /3);
  
    //要到哪个位置
    var toj = ranArr[to] % 3; 
    var toi =Math.floor(ranArr[to] /3);
    var temp = ranArr[from];
    imgCell.eq(from).animate({
        'left': cellW * toj + 'px',
        'top': cellH  * toi + 'px'
    },400,function(){
        $(this).css('z-index','10')
    });
    // console.log(from,to)
    imgCell.eq(to).animate({
        'left': cellW * fromj + 'px',
        'top': cellH  * fromi + 'px'
    },400,function(){
        $(this).css('z-index','10');
        ranArr[from] = ranArr [to];
        ranArr[to] =temp;
        check()
    })
    
}
function check(){
    if(oriArr.toString() == ranArr.toString()){
        alert('right');
        $('.start').text('开始');
        flag = true;
    }
}