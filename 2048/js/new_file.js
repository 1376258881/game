var game={
	date:null,      //二维数组初始化
	RN:4,          /*行数*/
	CN:4,          //每行的列数
	state:1,      //保存游戏中的状态
	RUNNING:1,    //正在运行中
	GAMEOVER:0,   //结束游戏
	Scoeraddtion:0, //保存的分数
	start(){		
		
		 //清空遮罩层
		 document.getElementById("gameoverid").style.display="none";
		//清空分数
		this.Scoeraddtion=0;
		//游戏状态设为运行中
		 this.state=this.RUNNING;
		 
		//新建空数组
		this.date=[];//初始状态
		//遍历数组
		for(var i=0;i<this.RN;i++){
			//将行数组变为空数组
			this.date[i]=[];
			for(var j=0;j<this.CN;j++){
				this.date[i][j]=0;
		  }			
		}
		
		this.randomnum()  		//调用方法，产生随机位置的2或4，生产两个随机数
		this.randomnum()
		game.updateView()          //更新视图
		
		 console.log(this.date)
		document.onkeydown=function(event){
				switch (event.keyCode){
					//左移动
					case 37:
					game.moveLeft();	
						break;
					//上移动
					case 38:
					game.moveTop()							
						break;
					//右移动
					case 39:
					game.moveRight()
						break;
					//下移动
					case 40:
					game.moveDown()	
						break;
				  }            
		          document.getElementById("scorespan1").innerHTML=game.Scoeraddtion;  //页面输出分数
		       }		       		          
            },   
            
            //判断是否结束游戏
		isgameOver(){			
		 	for(var r=0;r<this.date.length;r++){			   //遍历数组		
					for(var c=0;c<this.date[r].length;c++){
						if(this.date[r][c]==0){return false;}     // 当数组中有0是，输出 false   
						if((c<this.CN-1)&&(this.date[r][c]==this.date[r][c+1])){   //当0~2列与1~3列分别比较
							return false;
						}
						if((r<this.RN-1)&&(this.date[r][c]==this.date[r+1][c])){//当0~2行与1~3行分别比较，
							return false;
						  }
			       }	//如果全部不满足则输出ture，输出的结果用于判断结束弹框弹出
			  }
		 	return true;		 	
		},
		
		//获取一个随机位置的随机数
	  randomnum(){	  	   		   	 
	      while(true){	            
	      	var sjr=Math.floor( Math.random()*this.RN);  //产生随机数的行位置
	        var sjc=Math.floor( Math.random()*this.CN);  //产生随机数的列位置
	   		if(this.date[sjr][sjc]==0){	   			
	   			this.date[sjr][sjc]=Math.random()>0.2?2:4; //随机位置产生2和4的几率
	   			break;   		
	   	   }   		
	   	}	 	          	 		 	
	 },
	 
	 //更新运算过后的视图给出样式和结果
	 updateView(){	 
	 	//给数组中不同数字添加样式
	 	for(var i=0;i<this.CN;i++){
	 		for(var j=0;j<this.RN;j++){
				var	n=this.date[i][j];	
				var  div=document.getElementById("c"+i+j);
				if(n !=0 ){
					div.innerHTML= n;
					div.className="cell n"+n; //为出现在数组中的数字添加样式
				}else{
					div.innerHTML="";          //数字为0，样式不变
					div.className="cell";
				}
		      }					
	 	  }	 
	 	  
	 	  //根据运算过后的结果，输出分数，调用方法 this.isgameOver()给出的结果判断是否结束游戏，给出结束游戏的视图
	 	  document.getElementById("scorespan1").innerHTML= this.Scoeraddtion;  //运算过后的分数累加，页面输出分数，
	 	  this.isgameOver();
	 	  this.state=this.isgameOver()?this.GAMEOVER:this.RUNNING;    //判断当前的游戏状态，并赋值给this.state
	 	  var div=document.getElementById("gameoverid");              //绑定htmlID用于给出结束后的样式
	 	  if(this.state==this.GAMEOVER){                              //如果当前的游戏状态为结束状态，
	 	  	div.style.display="block";                               //调出游戏结束后的页面
	 	  	document.getElementById("scorespan2").innerHTML=game.Scoeraddtion;   //结束时的总分	 	  	
	 	  }else{
	 	  	div.style.display="none";               //否则结束页面隐藏
	 	  }	 	  
	 },
	   
	moveLeft(){//左移所有行		
		// 为数组拍照保存到before中，用于之后比较是否有过移动，为是否添加随机数做准备
		var befor=String(this.date);
		// r从0开始，到<RN结束 循环每一行
		for(var r=0;r<this.RN;r++){
		         this.moveLeftInRow(r);// 左移第r行  moveLeftInRow(r) ---- 可以单独完成一件事情  反复被使用     
		     }
		      var after=String(this.date); // 为数组拍照保存到after中
		      if(after!=befor) {        // 如果after!=before   表示data中的数据有变化
		         this.randomnum()                     // 生成随机数添加到data中去   randomNum()
		         this.updateView()         // 更新页面 updateView()		
		      }   		        			   
	      },
	      
	moveLeftInRow(r){//左移第r行
		// c从0开始，到<CN-1
		//console.log(this.date)//测试
		for(var c=0;c<this.CN-1;c++){    //循环遍历第r行中的c列，将r行中的c列的每个元素进行比较判断，
		var nextc=this.getNextInRow(r,c);  //c列中从下标0开始第一个不为0的数下标，用于判断和运算
		   //console.log(nextc)  //测试
			if(nextc==-1){                   //说明r行中从下标为0开始的所有都为0，所以不做运算
				break;
			}else if(this.date[r][c]==0){    //当r行下标为0的数也为0，则将这个r数组中不为0的数交换赋值，
				 this.date[r][c] = this.date[r][nextc];
			     this.date[r][nextc]=0;
			     		  c--;                      //赋值完成后将此时的赋值的数保留原位置，用于与下一位直接判断和运算，减少一次循环
			}else if(this.date[r][c]== this.date[r][nextc]){		//两数相等的时候做相加	       
			           this.date[r][c]*=2;
			           this.date[r][nextc]=0;	
			           this.Scoeraddtion+=this.date[r][c];//根据规则，将相加出来的分数进行存储，用于输出页面展示
 		 }		    			
		}		
	   },
	 
	getNextInRow(r,c) {//查找r行c列下一个不为0的位置
		   for(var i=c+1;i<this.CN;i++){	//r行下标为0 的数,左移动时并不需要与左边的数做比较运算，所以从下标为1开始遍历r行	   	
		     if(this.date[r][i]!=0){        //不为0数的下标
		      return  i;	   
		     }	
		    }return -1;                      //全部遍历结束了返回-1，则说明r行这一行都为0（下标为0的数不在遍历范围内所以除外）
		// i从c+1开始，到<CN结束	
			// 如果i位置的值不为0， return  i
		// 循环结束
		// 返回 -1 表示全部为0 的位置		
   },
   
   //右移
   moveRight(){                     //右移所有行
   	 // 移动之前拍照  before
   	var befor=String(this.date);
   	 //console.log(befor)//测试

		for(var r=0;r<this.RN;r++){                   // r从0开始，到RN结束
			this.moveRightInRow(r)		             // 每一行向右移动 调用函数moveRightInRow(r)
		                                             // 循环结束
		}
		var after=String(this.date);                  // 为数组结束后拍照保存到after中      
		//console.log(after)//测试
		if(after!=befor) {                                // 如果after!=before   表示data中的数据有变化
		         this.randomnum()                        // 生成随机数添加到data中去   randomNum()
		         this.updateView()                       // 更新页面 updateView()		
		        }   
	},
	moveRightInRow(r){//右移第r行
		//console.log(this.date)//测试
		for(var c=this.CN-1;c>0;c--){                      // c从倒数第二个开始，到>0结束    反向遍历r行每一列
			var prevc=this.getPrevcInRow(r,c); // 得到位置prevc  调用函数 getPrevcInRow(r,c)
			//console.log(prevc)//测试
			if(prevc==-1){                                  // 查询r行c列的前一个不为0的位置 那么此行就是全部为0 
				break;
		   }else{
			if(this.date[r][c]==0){
				 this.date[r][c] = this.date[r][prevc];
			     this.date[r][prevc]=0;
			     		  c++;   
			}else if(this.date[r][c]== this.date[r][prevc]){			      
			           this.date[r][c]*=2;
			           this.date[r][prevc]=0;
			           this.Scoeraddtion=this.date[r][c]+this.Scoeraddtion;
			}
		    			
		}
		}	
			
	},
	getPrevcInRow(r,c){//获取r行c列前一个不为0值的位置
		for(var i=c-1;i>=0;i--){  // i从CN-1开始，到>=0结束   反向遍历
			if(this.date[r][i]!=0){
			 return  i;	   
		     }	
		    }return -1;					
			// 如果r行i列位置的值不等于0   返回i
		// 循环结束
		// 返回-1表示全部为0 的位置
		},
				
		//上移所有，遍历所有列，并判断算法是否有改变数组，刷新做过算法之后的视图，给出随机数
		moveTop(){
		var befor=String(this.date);	
			for(var c=0;c<this.CN;c++){
				this.moveTopCol(c);								
			}
			var after=String(this.date); 
			if(after!=befor) {                                // 如果after!=before   表示data中的数据有变化
		         this.randomnum()                        // 生成随机数添加到data中去   randomNum()
		         this.updateView()                       // 更新页面 updateView()		
		 }   
	},
								
		//上移一列，根据不为0下标位置给出不同情况的算法
		  moveTopCol(c){		 
		    for(var r=0;r<this.RN-1;r++){
		      var Next=this.moveTopNextCol(r,c);	 // 将r行不为0 的数的下标调用赋值用于判断计算
		      //console.log(Next)
		          if(Next==-1){  //说明全部为0,不做计算调整
		       	 break;		       	
		       }else{
		       	if(this.date[r][c]==0){ //当c位置的数为0的时候，将第一个不为0的数赋值给c位置的数，c保持原位置，
		       		this.date[r][c]=this.date[Next][c]
		       		this.date[Next][c]=0;
		       		r--;
		       	}else if(this.date[r][c]==this.date[Next][c]){	 //	当第一个数字与c位置数相等则两数相加       				       		
		       		this.date[r][c]*=2;
		       		this.date[Next][c]=0;
		       		this.Scoeraddtion=this.date[r][c]+this.Scoeraddtion;
		       	}		       			       	
		       }
		    }				
		},	
		//输出从r开始，不为0的下标，用于判断情况作出算法  r行，c列
		moveTopNextCol(r,c){			
			for(var i=r+1;i<this.RN;i++){   
				if(this.date[i][c]!=0){
					 return  i;	   
		     }	
		    }return -1;	  //说明全部为0
		  },
		
		//下移，遍历每一列
		moveDown(){
			 var befor=String(this.date);
			 for(var c=0;c<this.CN;c++){
			 	this.moveDowninCol(c)
			   }
			var alter=String(this.date)
			if(alter!=befor){
				this.randomnum()                        // 生成随机数添加到data中去   randomNum()
		        this.updateView()                       // 更新页面 updateView()	
			}
			
		},
		//下移，上移的反向遍历，c列r行的排序计算
		moveDowninCol(c){
			for(var r=this.RN-1;r>=0;r--){
				var  Down= this.moveDownNextCols(r,c);	  
				if(Down==-1){
					break;
				}else{
					if(this.date[r][c]==0){
						this.date[r][c]=this.date[Down][c]
						this.date[Down][c]=0;
						r++
						
					}else if(this.date[r][c]==this.date[Down][c]){
						this.date[r][c]*=2
						this.date[Down][c]=0;
						this.Scoeraddtion=this.date[r][c]+this.Scoeraddtion;
					}
				}			
			  }
			
			},			
			//下移，从RN-1开始反向查找不为0的下标
		moveDownNextCols(r,c){
			for(var i=r-1;i>=0;i--){
				if(this.date[i][c]!=0){
					return  i;	   
		     }	
		    }return -1;				
			}
		}
 
game.start()



