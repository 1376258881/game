// 总共获取的红包价值
var totalMoney = 0;
// 最慢的一个红包下落所需要的时间
var totalAnimateTime = 0;
// 最慢的动画元素 {dom:  最慢的元素标签, index 最慢的元素索引值}
var maxAnimateDom = null;
// 初始化函数
function init () {
    // 向页面中插入80个红包
    var box = document.getElementsByClassName('box')[0];
    box.appendChild(createDom(80));
    // 所有红包元素集合
    var imgList = document.getElementsByTagName('img');
    // 抢到红包要显示的弹窗元素
    var modal = document.getElementsByClassName('modal')[0];
    // 为每个红包元素添加点击事件 表明红包可以拆开
    box.onclick = function (e) {
        // 获取到当前红包里面的钱数
        var money = e.target.getAttribute('data-money');
        // 如果红包里面有钱  暂停红包动画   弹出弹窗告知红包内的钱数   并且让当前红包隐藏
        if (money) {
            e.target.style.opacity = 0;
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].style.animationPlayState = 'paused'
            }
            

            document.getElementById('text').innerText = '恭喜获得' + money + '元'
            // 将抽取到的红包金额加入总钱数中
            totalMoney += parseInt(money);
            // 显示弹窗
            modal.style.display = 'block';
        }
    }
    // 继续抢红包按钮
    var continueBtn = document.getElementById('continue-btn');
    // 点击“继续抢红包” 红包雨效果继续
    continueBtn.onclick = function (e) {
        modal.style.display = 'none';
        for (var i = 0; i < imgList.length; i++) {
            imgList[i].style.animationPlayState = 'running'
        }
    }
    // 动画结束时  弹出总计抢到的金额
    maxAnimateDom.dom.addEventListener('webkitAnimationEnd', function (e) {
        console.log('ending')
        document.getElementById('text').innerText = '共计获得' + totalMoney + '元'
        modal.style.display = 'block';
        document.getElementById('continue-btn').style.display = 'none'
    })
}
// 创建红包元素
function createDom(num) {
    // 创建文档碎片
    var frag = document.createDocumentFragment();
    for (var i = 0 ; i < num; i ++) {
        // 创建红包元素
        var itemImage = new Image();
        itemImage.src = "./images/hb/petal" + random(1, 10) + ".png";
        // 设置每个红包的金额  在0 - 10元之间
        itemImage.setAttribute('data-money', random(0, 100) / 10)
        // 红包降落的位置随机放置
        itemImage.style.left = random(0, window.innerWidth) + 'px';
        // 动画执行时长随机
        var durationTime = random(0, 100) / 10;
        // 动画延迟时长随机
        var delayShowTime = random(0, 100) / 10;

        // 确定最长动画的元素
        if (durationTime + delayShowTime > totalAnimateTime) {
            totalAnimateTime = durationTime + delayShowTime;
            maxAnimateDom = {
                dom: itemImage,
                index: i
            }
        }
        // 为每个红包添加动画执行时间
        itemImage.style.animationDuration = durationTime + 's ' ;
        // 为每个红包添加动画延迟时间
        itemImage.style.animationDelay  = delayShowTime + 's ' ;
        // 每个红包的大小不同 动画不同
        switch (random(1, 4)) {
            case 1:
                itemImage.style.animationName = 'normalRotate'
                break;
            case 2:
                itemImage.style.animationName = 'largeRotate'
                break;
            case 3:
                itemImage.style.animationName = 'smallRotate'
                break;
            default:
                break;
        }
        frag.appendChild(itemImage);
    }
    return frag
}
// 生成随机数
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

init()  