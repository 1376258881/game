 // 游戏控制类 
 var Game = {
 	// 游戏背景 
 	gamePanel: null,
 	// 分数 
 	score: 0,
 	// 时间 
 	time: 0,
 	// 图片映射表 
 	pieceMap: null,
 	// 图片列表 
 	pieceList: [],
 	// 图片列表不包含图片 
 	pieceImgList: [],
 	// 图片随机数列表 
 	randomList: [],
 	// 轨迹列表 
 	trackList: [],
 	// 游戏是否开始 
 	isGameBigin: false,
 	// 游戏是否结束 
 	isGameOver: false,
 	// 游戏是否重置 
 	isGameReset: false,
 	// 图片元素是否第一次点击 
 	isFirstClick: true,
 	// 开始游戏 
 	start: function () {
 		document.getElementById("start").disabled = true;
 		document.getElementById("reset").disabled = false;
 		if (this.isGameReset) {
 			this.isGameOver = false;
 			this.startTime();
 			return;
 		} else if (this.isGameBegin) {
 			return;
 		} else {
 			this.init();
 			return;
 		}
 	},
 	reset: function () {
 		document.getElementById("start").disabled = false;
 		document.getElementById("reset").disabled = true;
 		this.clear();
 		this.initPieces();
 		this.initImgPieces();
 		this.time = 0;
 		document.getElementById("time").innerHTML = 0;
 		this.score = 0;
 		document.getElementById("score").innerHTML = 0;
 		this.isGameReset = true;
 		this.isGameBegin = true;
 	},
 	// 初始化 
 	init: function () {
 		if (this.isGameBegin) {
 			return;
 		}
 		this.pieceMap = new Map();
 		var _this = this;
 		this.time = 0;
 		this.startTime();
 		this.gamePanel = document.getElementById("pieces");
 		this.initPieces();
 		this.initImgPieces();
 		this.isGameBegin = true;
 	},
 	// 将随机生成的150张图片添加进画布 
 	initPieces: function () {
 		var _this = this;
 		this.initRandomList();
 		// 打乱随机列表排序 
 		this.messRandomList();
 		for (var i = 0; i < 204; i++) {
 			var piece = new Piece(this);
 			this.pieceList.push(piece);
 			var x = (i % 17);
 			var y = Math.floor(i / 17);
 			this.pieceMap.put(x + "," + y, piece);
 			piece.setPosition(x, y);
 			this.gamePanel.appendChild(piece.dom);
 			if (x == 0 || x == 16 || y == 0 || y == 11) {
 				piece.track = document.createElement("div");
 				piece.track.className = "track";
 				piece.dom.appendChild(piece.track);
 				piece.isTracked = true;
 				continue;
 			} else {
 				if (x == 1 || x == 15 || y == 1 || y == 10) {
 					piece.setAtEdge(true);
 				}
 				this.pieceImgList.push(piece);
 			}
 		}
 	},
 	// 初始化图片 
 	initImgPieces: function () {
 		for (var i = 0; i < this.pieceImgList.length; i++) {
 			this.pieceImgList[i].initImg();
 			this.pieceImgList[i].img.src = "img/pieces/" + this.randomList[i] + ".gif"
 			this.pieceImgList[i].setImgSrc(this.pieceImgList[i].img.src);
 			// 执行图片点击事件 
 			this.pieceImgList[i].onClick();
 		}
 	},
 	// 初始化随机表 
 	initRandomList: function () {
 		// 获取随机数列，成双出现 
 		for (var i = 0; i < 75; i++) {
 			var random = parseInt(Math.random() * 22 * 10000, 10);
 			var number = random % 23;
 			this.randomList.push(number);
 			this.randomList.push(number);
 		}
 	},
 	// 打乱随机表 
 	messRandomList: function () {
 		for (var i = 0; i < this.randomList.length; i++) {
 			var random = parseInt(Math.random() * 15 * 10000, 10);
 			var number = random % 150;
 			var temp;
 			temp = this.randomList[i];
 			this.randomList[i] = this.randomList[number];
 			this.randomList[number] = temp;
 		}
 	},
 	// 开始计时 
 	startTime: function () {
 		var _this = this;
 		if (this.isGameOver) {
 			return;
 		} else {
 			this.time++;
 			document.getElementById("time").innerHTML = this.time;
 			this.isGameBegin = true;
 			setTimeout(function () {
 				_this.startTime();
 			}, 1000);
 		}
 	},
 	// 清除 
 	clear: function () {
 		for (var i = 0; i < this.pieceList.length; i++) {
 			this.gamePanel.removeChild(this.pieceList[i].dom);
 		}
 		this.pieceList = [];
 		this.randomList = [];
 		this.pieceImgList = [];
 		this.isGameOver = true;
 		this.isGameBegin = false;
 	}
 }
 window.onload = function () {
 	document.getElementById("start").disabled = false;
 	document.getElementById("reset").disabled = true;
 }
 // 游戏开始入口 
 function Start() {
 	Game.start();
 }
 // 游戏重置入口 
 function Reset() {
 	Game.reset();
 }