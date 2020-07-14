# 1. 拼图小游戏介绍
- 游戏规则:将一张图片分为n个图片碎片将其打乱,玩家拖拽碎片进行拼图
- 游戏目标:将每个碎片复原到原图上的位置,则判定为赢
# 2. 拼图小游戏使用说明
## 2.1   html部分
- 需自定义节点作为拼图游戏的渲染插槽
- 自定义开始与结束按钮
- 需引入拼图js
- 举例:
```
<div id="app">
<!-- 插槽 （必须）-->
</div>
<!-- 按钮 （非必须）-->
<button class='reset1'>复原</button>
<!-- 引入拼图js（必须） -->
<script src="./index.js"></script>		
```
## 2.2   css部分
- 可全部自定义
## 2.3   js部分
- 通过`new Puzzle(option) ` 来实例化拼图游戏 ,option为配置对象
- 未开始或者已完成状态下 按钮的类名会增加`oPuzzle_start` , 
- 拼图随机排序(已开始) 按钮类名增加`oPuzzle_reset` 
- 拼图子元素类名为`block`
- 拼图父元素类名为`puzzle`
- 按钮默认文本为 `开始` 与  `复原` , 可在配置对象中 `mounted()`和`success`中个性化配置其他文本
### 具体参数配置如下:
| *参数名* | *含义*                | *说明*                                              |*参数类型*                                              |
| -------- | --------------------- | --------------------------------------------------- |  --------------------------------------------------- |   
| el      | 拼图插槽(必填)                |      拼图渲染的节点选择器                         |     string　　|
| data    | 具体渲染的相关配置对象(必填)        |   配置拼图整体的宽高,行列数,图片路径 ,按钮 , 是否初始化  |  object|
| width      | 拼图父级元素整体宽(必填)               | 拼图父级元素整体宽,单位rem                        |  number |
| hieght      | 拼图父级元素整体高(必填)               | 拼图父级元素整体高,单位rem                         |   number|
| row      | 拼图行数(必填)               | 拼图行数(必填)                          |  number|
| col      | 拼图列数(必填)               | 拼图列数(必填)                        |number|
| puzzleImg   | 图片路径（必填)            | 图片路径（必填)                       |  string|
| startBtn   |   绑定触发游戏开始结束按钮（选填）      |      按钮的节点选择器       |string|
| mounted   |   初始化完成后执行的回调（选填）      |      初始化完成后执行的回调,同步执行       |function|
| success   |   初始化完成后执行的回调（选填）      |      拼图成功后的回调 同步执行       |function|
- 举例:
```
/**
 * @param {绑定渲染节点插槽（必填）}  el
 * @param {整体宽 单位rem（必填）}   width
 * @param {整体高 单位rem（必填） }   hieght
 * @param {   行数（必填）       }   row
 * @param {   列数（必填）       }   col
 * @param {   图片路径（必填）   }   puzzleImg
 * @param {绑定触发游戏开始结束按钮（选填）}   startBtn
 * @param {   初次渲染是否为默认为未开始状态(选填)  }   isReset
 * @param {   初始化完成后执行的函数(同步执行)(选填)  }   mounted
 * @param {    游戏成功后执行的函数(同步执行)(选填)   }   success
 */
  var puzzle = new Puzzle({
        el:'#app',  //插槽
        data:{
            width:9,//宽
            height:9,//高
            row:3,         //行数
            col:3,          //列数
            puzzleImg:'https://img.hbhcdn.com/zhuanti/20881/pintu.jpg',
            startBtn:'.reset1',
            isReset:true//是否初始化为 待开始状态   判断游戏是否在进行中
        },
        mounted(){  //初始化完成后执行的回调 同步执行
        	var reset1 = document.querySelector('.reset1') ; 
        	var isStart = reset1.classList.contains('oPuzzle_start');
        	if(isStart){ 
    			  reset1.innerText ='自定义按钮--开始';
        	}else {
        		reset1.innerText ='自定义按钮--复原';
        	} 
        		//自定义初始化
        	reset1.addEventListener('click', function(){
        		 isStart = !isStart;
        		if(isStart){ 
        			reset1.innerText ='自定义按钮--开始';
	        	}else {
	        		reset1.innerText ='自定义按钮--复原';
	        	}
        	}, false)
        },
        success(){// 拼图成功后的回调 同步执行
            document.querySelector('.reset1').innerText='自定义按钮--开始'
            alert('拼图成功,你实在是太棒了  ≧◠◡◠≦✌!!!')
        }         
    })
   
```
