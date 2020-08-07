 var Piece = function (game) {
 	// 游戏对象 
 	this.game = game;
 	// 是否为边缘元素 
 	this.isEdge = false;
 	// 是否挨着边缘元素 
 	this.atEdge = false;
 	// 图片dom元素 
 	this.dom = null;
 	// 图片元素 
 	this.img = null;
 	// 图片元素来源 
 	this.src = null;
 	// 轨迹元素 
 	this.track = null;
 	// 是否可以作为轨迹 
 	this.isTracked = false;
 	// 选中标记元素 
 	this.selected = null;
 	// 图片横向排列 
 	this.x = 0;
 	// 图片纵向排列 
 	this.y = 0;
 	// 图片闪烁Id 
 	this.flashId = null;
 	// 图片是否点击 
 	this.onClicked = false;
 	// 闪烁次数 
 	this.flashCount = 0;
 	this.init();
 }
 Piece.prototype = {
 	// 初始化 
 	init: function () {
 		this.dom = document.createElement("div");
 		this.dom.className = "piece";
 		this.selected = document.createElement("img");
 	},
 	// 初始化图片 
 	initImg: function () {
 		this.img = document.createElement("img");
 		this.dom.appendChild(this.img);
 	},
 	// 满足算法后初始化track元素 
 	initTrack: function () {
 		if (this.flashId != null) {
 			// 停止闪烁 
 			this.stopFlash();
 		}
 		//alert("initTrack middle"); 
 		if (this.track != null) {
 			return;
 		}
 		this.onClicked = false;
 		this.dom.removeChild(this.img);
 		this.track = document.createElement("div");
 		this.track.className = "track";
 		this.dom.appendChild(this.track);
 	},
 	// 位图片设置来源 
 	setImgSrc: function (src) {
 		this.src = src;
 	},
 	// 为图片设置二维排列位置 
 	setPosition: function (x, y) {
 		this.x = x;
 		this.y = y;
 	},
 	// 为图片设置选中元素 
 	setSelected: function () {
 		if (this.flashCount++ % 2 == 0) {
 			//this.dom.removeChild(this.img); 
 			//this.selected.src = "img/selected.gif"; 
 			//this.dom.appendChild(this.selected); 
 			this.img.src = "img/pieces/flash.gif";
 		} else {
 			//if (this.selected != null) { 
 			// this.dom.removeChild(this.selected); 
 			//} 
 			this.img.src = this.src;
 			//this.dom.appendChild(this.img); 
 		}
 	},
 	// 设置是否为边缘元素 
 	setEdge: function (isEdge) {
 		this.isEdge = isEdge;
 	},
 	// 设置是否挨着边缘元素 
 	setAtEdge: function (atEdge) {
 		this.atEdge = atEdge;
 	},
 	// 开始闪烁 
 	flash: function () {
 		var _this = this;
 		this.flashId = setInterval(function () {
 			_this.setSelected();
 		}, 500);
 	},
 	// 停止闪烁 
 	stopFlash: function () {
 		clearInterval(this.flashId);
 		if (this.flashCount % 2 == 1) {
 			//if (this.selected != null) { 
 			// this.dom.removeChild(this.selected); 
 			//} 
 			this.img.src = this.src;
 			//this.dom.appendChild(this.img); 
 		}
 	},
 	// 对象被选择的内部函数 
 	onClick: function () {
 		if (this.onClicked) {
 			return;
 		}
 		var _this = this;
 		this.img.onclick = function () {
 			if (!document.getElementById("start").disabled) {
 				return;
 			}
 			if (_this.onClicked) {
 				return;
 			}
 			if (_this.checkPiece()) {
 				return;
 			}
 			_this.flash();
 			_this.onClicked = true;
 		};
 	},
 	// 检查是否有被点击的图片 
 	checkPiece: function () {
 		for (var i = 0; i < this.game.pieceList.length; i++) {
 			if (this.game.pieceList[i].onClicked && !this.game.pieceList[i].equal(this)) {
 				if (this.game.pieceList[i].equalImage(this)) {
 					//alert("The same Image"); 
 					this.searchTrack(this.game.pieceList[i]);
 				} else {
 					this.game.pieceList[i].stopFlash();
 					this.game.pieceList[i].onClicked = false;
 					this.onClicked = false;
 					return false;
 				}
 				return true;
 			} else {
 				continue;
 			}
 		}
 		return false;
 	},
 	// 是否为同一个对象 
 	equal: function (piece) {
 		return (this.x == piece.x && this.y == piece.y);
 	},
 	// 是否为同一个图片 
 	equalImage: function (piece) {
 		return this.src == piece.src;
 	},
 	// 搜寻路径 
 	searchTrack: function (piece) {
 		if (this.isNear(piece)) {
 			this.linkTrack(piece);
 			return;
 		}
 		if (this.isReach(piece) || this.isReach2(piece)) {
 			this.linkTrack(piece);
 			return;
 		}
 	},
 	// 是否相邻 
 	isNear: function (piece) {
 		var a = (Math.abs(piece.x - this.x) == 1) && (piece.y == this.y) ||
 			(Math.abs(piece.y - this.y) == 1) && (piece.x == this.x);
 		return a;
 	},
 	// 直线 
 	isStraightReach: function (piece) {
 		//alert("isStraightReach"); 
 		if (this.isNear(piece)) {
 			return true;
 		}
 		var a = false;
 		var b = false;
 		// 沿y轴方向搜索 
 		if (this.x == piece.x) {
 			//alert("!!!!!!!!!!!"); 
 			for (var i = this.min(this.y, piece.y) + 1; i < this.max(this.y, piece.y); i++) {
 				//alert("this.x == piece.x: " + piece.x + "," + i); 
 				if (this.game.pieceMap.get(piece.x + "," + i).isPass()) {
 					a = true;
 					this.game.trackList.push(this.game.pieceMap.get(piece.x + "," + i));
 					continue;
 				} else {
 					a = false;
 					this.game.trackList = [];
 					return a;
 				}
 			}
 		}
 		// 沿x轴方向搜索 
 		if (this.y == piece.y) {
 			//alert("!!!!!!!!!!!"); 
 			for (var i = this.min(this.x, piece.x) + 1; i < this.max(this.x, piece.x); i++) {
 				//alert("this.y == piece.y: " + i + "," + piece.y); 
 				if (this.game.pieceMap.get(i + "," + piece.y).isPass()) {
 					b = true;
 					this.game.trackList.push(this.game.pieceMap.get(i + "," + piece.y));
 					continue;
 				} else {
 					b = false
 					this.game.trackList = [];
 					return b;
 				}
 			}
 		}
 		return a || b;
 	},
 	// 拐一次弯搜索 
 	isReach1: function (piece) {
 		//alert("isReach1"); 
 		var corner_1 = this.game.pieceMap.get(this.x + "," + piece.y);
 		var corner_2 = this.game.pieceMap.get(piece.x + "," + this.y);
 		var _this = this;
 		if ((_this.isStraightReach(corner_1)) &&
 			(corner_1.isStraightReach(piece)) &&
 			corner_1.isPass()) {
 			//alert("corner_1: " + this.x + "," + piece.y); 
 			this.game.trackList.push(corner_1);
 			return true;
 		}
 		if ((_this.isStraightReach(corner_2)) &&
 			(corner_2.isStraightReach(piece)) &&
 			corner_2.isPass()) {
 			//alert("corner_2: " + piece.x + "," + this.y); 
 			this.game.trackList.push(corner_2);
 			return true;
 		}
 		return false;
 	},
 	// 直接或拐一次弯搜索 
 	isReach: function (piece) {
 		var a = this.isStraightReach(piece);
 		var b = this.isReach1(piece);
 		return a || b;
 	},
 	// 拐两次弯搜索    在拐一次弯搜索的函数中调用了直接搜索的函数，同样最复杂的拐两次弯搜索也会调用拐一次弯搜索的函数。
 	isReach2: function (piece) {
 		// 沿x轴正向搜索 
 		for (var i = this.x + 1; i < 17; i++) {
 			if (!this.game.pieceMap.get(i + "," + this.y).isPass()) {
 				this.game.trackList = [];
 				break;
 			} else if (this.game.pieceMap.get(i + "," + this.y).isReach(piece) &&
 				this.game.pieceMap.get(i + "," + this.y).isPass()) {
 				this.game.trackList.push(this.game.pieceMap.get(i + "," + this.y));
 				return true;
 			}
 		}
 		// 沿x轴搜索 
 		for (var i = this.x - 1; i >= 0; i--) {
 			if (!this.game.pieceMap.get(i + "," + this.y).isPass()) {
 				this.game.trackList = [];
 				break;
 			} else if (this.game.pieceMap.get(i + "," + this.y).isReach(piece) &&
 				this.game.pieceMap.get(i + "," + this.y).isPass()) {
 				this.game.trackList.push(this.game.pieceMap.get(i + "," + this.y));
 				return true;
 			}
 		}
 		// 沿y轴搜索 
 		for (var i = this.y - 1; i >= 0; i--) {
 			if (!this.game.pieceMap.get(this.x + "," + i).isPass()) {
 				this.game.trackList = [];
 				break;
 			} else if (this.game.pieceMap.get(this.x + "," + i).isReach(piece) &&
 				this.game.pieceMap.get(this.x + "," + i).isPass()) {
 				this.game.trackList.push(this.game.pieceMap.get(this.x + "," + i));
 				return true;
 			}
 		}
 		// 沿y轴正向搜索 
 		for (var i = this.y + 1; i < 12; i++) {
 			if (!this.game.pieceMap.get(this.x + "," + i).isPass()) {
 				this.game.trackList = [];
 				break;
 			} else if (this.game.pieceMap.get(this.x + "," + i).isReach(piece) &&
 				this.game.pieceMap.get(this.x + "," + i).isPass()) {
 				this.game.trackList.push(this.game.pieceMap.get(this.x + "," + i));
 				return true;
 			}
 		}
 		return false;
 	},
 	// 路径连接 
 	linkTrack: function (piece) {
 		this.initTrack();
 		piece.initTrack();
 		this.changeScore();
 		this.showTrack(piece);
 	},
 	// 显示足迹 
 	showTrack: function (piece) {
 		this.game.trackList.push(piece);
 		this.track.className = "track2";
 		for (var i = 0; i < this.game.trackList.length; i++) {
 			//alert(i); 
 			this.game.trackList[i].track.className = "track2";
 		}
 		var _this = this;
 		setTimeout(function () {
 			_this.hideTrack()
 		}, 500);
 	},
 	// 隐匿足迹 
 	hideTrack: function () {
 		for (var i = 0; i < this.game.trackList.length; i++) {
 			this.game.trackList[i].track.className = "track";
 		}
 		this.game.trackList = [];
 		this.track.className = "track";
 		this.isTracked = true;
 	},
 	// 分数增加 
 	changeScore: function () {
 		this.game.score += 100;
 		document.getElementById("score").innerHTML = this.game.score;
 	},
 	min: function (a, b) {
 		if (a < b) {
 			return a;
 		} else {
 			return b;
 		}
 	},
 	max: function (a, b) {
 		if (a > b) {
 			return a;
 		} else {
 			return b;
 		}
 	},
 	// 判断是否通过 
 	isPass: function () {
 		return this.track != null;
 	}
 }


