var imgArea=$('.imgArea');
var imgW = parseInt(imgArea.css('width'));
var imgH = parseInt(imgArea.css('height'));
var cellW=imgW/3;
var cellH=imgH/3;
var imgCell;
//标准数组
var oriArr=[];
//随机数组
var ranArr = [];

var flag =true;
init()
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
            var left = e.pageX - imgCell.eq(index1).offset().left;
            var top = e.pageY - imgCell.eq(index1).offset().top;
            $(document).on('mousemove',function(e2){
                imgCell.eq(index1).css({
                    'z-index':'40',
                    'left':e2.pageX - left - imgArea.offset().left ,
                    'top':e2.pageY - top - imgArea.offset().top ,
                })
            }).on('mouseup',function(e3){
                var left = e3.pageX - imgArea.offset().left ;
                var top = e3.pageY - imgArea.offset().top;
                var index2 = changeIndex(left,top,index1) ;//可能将要改变的位置 
                if (index1 == index2) {
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
    return ranArr
}

//i *3 + j    除以3取整拿到i  乘3取余拿到 j  
function  cellOrder(arr){
    var len = arr.length;
    for (var i = 0; i < len; i++) {
       imgCell.eq(i).animate({
           'left':arr[i] % 3 *cellW  + 'px',
           'top':Math.floor(arr[i] /3)  *cellH + 'px'
       },400) 
    }
}
function changeIndex(x,y,index){
    
    if (x < 0 || x > imgW || y < 0 || y >imgH) { //移动出去或者移动很小 返回当前的索引
        return index;
    }else{
        //判断第几行  第几列
        var row = Math.floor(y/cellW);  //行
        var col = Math.floor(x/cellH); //列
        var l = row * 3 +col;
        var i =0, len = ranArr.length;
        while((i < len ) && (ranArr[i] !== l)){
            i++
        }
        console.log('row',row,'col',col,l,i,ranArr[i],ranArr)
        return i;
    }
    
   
}
function cellReturn(index) { //飞回原来的位置
    var j = ranArr[index] % 3 ;
    var i =Math.floor(ranArr[index] /3);
    imgCell.eq(index).animate({
        'left': cellW * j + 'px',
        'top': cellH  * i + 'px'
    },1000,function(){
        $(this).css('z-index','10')
    })
}
//
function  cellChange(from,to){
    console.log(from,to)
    //改变前的位置
    var fromj = ranArr[from] % 3; 
    var fromi =Math.floor(ranArr[from] /3);
    //要到哪个位置
    var toj = ranArr[to] % 3; 
    var toi =Math.floor(ranArr[to] /3);
    var temp = ranArr[from]
    imgCell.eq(from).animate({
        'left': cellW * toj + 'px',
        'top': cellH  * toi + 'px'
    },1,function(){
        $(this).css('z-index','10')
    })
    imgCell.eq(to).animate({
        'left': cellW * fromj + 'px',
        'top': cellH  * fromi + 'px'
    },1,function(){
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