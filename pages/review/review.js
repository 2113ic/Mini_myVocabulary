const util = require('../../utils/util.js');
const app = getApp();// 获取应用实例

Page({
    data: {
        // 导航栏
        nbTitle: '我的词汇量',
        nbLoading: false,
        nbFrontColor: '#fff',
        nbBackgroundColor: '#4c5161',

        // 单词显示模式
        modelIndex: 0,
        modelValue: ["默认模式","单词模式","解释模式"],
        randomShowSvg: "randomShow_off",

        reviewInputValue: "",
        reviewData: [],
        show: "空空如也",
        answer: "",
        cursor: [0, 0],
    },
    onLoad() {
        initReviewData.call(this);
        loopShow.call(this);
    },
    onPullDownRefresh() {
        initReviewData.call(this);
        loopShow.call(this);
        wx.stopPullDownRefresh();
    },
    show,
    reviewInputHandle,
    showModelChange,
    togglesIconShow,
    playWord,
});

function show() {
    const flag = this.data.randomShowSvg == "randomShow_off";
    if (flag) {
        loopShow.call(this);
    }else{
        randomShow.call(this);
    }
}

// 随机显示需要复习的单词
function randomShow() {
    const reviewData = this.data.reviewData;
    if (reviewData.length == 0) return;

    const index = util.getRandomInt(0, reviewData.length);
    const wordList = reviewData[index].wl;
    const randNum = util.getRandomInt(0, wordList.length);
    const wordItem = wordList[randNum];

    setModelShow.call(this, wordItem);
}

function togglesIconShow() {
    const flag = this.data.randomShowSvg == "randomShow_off";
    const icon = flag ? "randomShow_on" : "randomShow_off";
    this.setData({ randomShowSvg: icon });
}

/**
 * 播放单词
 */
function playWord(){
    util.stringToAudio(this.data.show);
}

// 顺序显示需要复习的单词
function loopShow() {
    const reviewData = this.data.reviewData;
    if (reviewData.length == 0) return;
    let cursor = this.data.cursor;
    const isLastWord = (cursor[1] == reviewData[cursor[0]].wl.length);
    
    if (isLastWord) {
        cursor[0]++;
        cursor[1] = 0;
    }
    if (reviewData.length == 1 && isLastWord) {
        cursor = [0, 0];
    }
    if (reviewData.length == cursor[0] && isLastWord) {
        cursor = [0, 0];
    }

    const wordItem = reviewData[cursor[0]].wl[cursor[1]++];
    setModelShow.call(this, wordItem);
    this.setData({cursor: cursor});
}

function setModelShow(data){
    let show = this.data.show;
    let answer = this.data.answer;
    const model = this.data.modelIndex;
    const num = util.getRandomInt(0, 2);

    if (model === 0) {
        show = data[num == 0 ? "w" : "e"];
        answer = data[num == 0 ? "e" : "w"];
    }else if (model === 1) {
        show = data.w;
        answer = data.e;
    }else {
        show = data.e;
        answer = data.w;
    }
    this.setData({
        show: show,
        answer: answer
    });
}

/**
 * 拼写复习框事件
 * @param {object} e 事件对象
 */
function reviewInputHandle(e) {
    const value = e.detail.value;
    if (value.trim() == "") return;
    if (!value.endsWith("\n")) return;

    if (!new RegExp(value.trim()).test(this.data.answer)) {
        util.showTip("错误");
        return;
    }
    this.setData({reviewInputValue: ""});
    loopShow.call(this);
}

function showModelChange(e) {
    this.setData({modelIndex: +e.detail.value});
}

/**
 * 初始化reviewData的储存数据
 */
 function initReviewData(){
    const currentData = util.getStorage("reviewData");
    if (currentData == "") util.setStorage("reviewData", []);

    const reviewData = util.getStorage("reviewData");
    this.setData({reviewData: reviewData});
}