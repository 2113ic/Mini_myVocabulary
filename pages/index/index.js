const util = require('../../utils/util.js');
const app = getApp();// 获取应用实例

Page({
    data: {
        headerStyle: "",// 导航
        wordData: [],// wordData
        reviewData: [],// reviewData
        pageData: [],// pageData
        dateTitle: "",// 时间线日期标题

        // showStatus: true,// .icon-down_container 是否隐藏
        // 记录表单
        record_word: "",
        record_expression: "",

        // 分页器
        pagination: {
            prev: 0,
            next: 2,
            count: 0,
            pages: 0,
            curr: 1,
            limit: 10,
            currNum: 10
        },
    },
    onLoad() {
        initWordData.call(this);
        initReviewData.call(this);
        initPaginationData.call(this, this.data.wordData);
        setPageData.call(this);
    },
    onPageScroll: function(obj) {
        const scrollTop = obj.scrollTop;
        if (scrollTop === 0) this.setData({ "headerStyle": "" });
        if (scrollTop > 40 && this.data.headerStyle == "") {
            this.setData({
                "headerStyle": "background-color:#fff;box-shadow: 0 2px 5px 0 rgb(0 0 0 / 10%)"
            });
        }
    },
    onPullDownRefresh() {
        initWordData.call(this);
        initReviewData.call(this);
        initPaginationData.call(this, this.data.wordData);
        setPageData.call(this);
        wx.stopPullDownRefresh();
    },

    /**
     * 导出单词数据的相关函数
     */
    // toggleShowStatus,
    // downVocabularyData,
    // downWordData,
    // downExprData,
    addWordHandler,
    setRecordValue,
    showExpression,
    markWordGroup,
    onPrev,
    onNext,
});

// 设置分页显示所需的数据
function setPageData(){
    const pagination = this.data.pagination;
    const start = pagination.limit * (pagination.curr - 1);
    const currNum = pagination.currNum;
    const begin = -(start + currNum);
    const end = (-start== -0) ? undefined : -start;
    const pageData = this.data.wordData.slice(begin, end);
    this.setData({pageData: pageData.reverse()});
}

/**
 * 初始化分页器的数据
 * @param {object} data 要进行操作的数据
 */
function initPaginationData(data) {
    const curr = 1;
    const limit = 10;
    const count = data.length;
    const pages = Math.ceil(count / limit);
    const currNum = (curr != pages) ? limit : count - (pages - 1) * limit;

    this.setData({
        pagination:{
            prev: 0,
            next: 2,
            curr: curr,
            limit: limit,
            count: count,
            pages: pages,
            currNum: currNum
        }
    });
}

function onPrev(e) {
    const pagination = this.data.pagination;
    const prev = pagination.prev;
    const curr = pagination.curr;

    if (pagination.curr == 1) return;
    Object.assign(pagination, {
        prev: prev - 1,
        next: curr,
        curr: prev
    });
    this.setData({pagination: pagination});
    setPageData.call(this);
}

function onNext(e) {
    const pagination = this.data.pagination;
    const next = pagination.next;
    const curr = pagination.curr;

    if (pagination.curr == pagination.pages) return;
    Object.assign(pagination, {
        prev: curr,
        next: next + 1,
        curr: curr + 1,
    });
    this.setData({pagination: pagination});
    setPageData.call(this);
}

/**
 * 标记单词组
 */
function markWordGroup(e){
    setDateTitle.call(this,e);
    const date = this.data.dateTitle;
    const wordData = this.data.wordData;
    const reviewData = this.data.reviewData;
    if (wordData.length == 0) return;
    const wordIndex = wordData.findIndex(item => item.d === date);
    const reivewIndex = reviewData.findIndex(item => item.d === date);
    const isMark = !wordData[wordIndex].r;
    wordData[wordIndex].r = isMark;
    
    if (isMark) reviewData.push(wordData[wordIndex]);
    else reviewData.splice(reivewIndex, 1);
    this.setData({
        wordData: wordData,
        reviewData: reviewData
    });
    setPageData.call(this);
    util.setStorage("wordData", wordData);
    util.setStorage("reviewData", reviewData);
}

/**
 * 设置时间线日期标题的数据
 */
function setDateTitle(e){
    const date = e.target.dataset.date;
    if (date == null) return;
    this.setData({"dateTitle": date});
}

/**
 * 显示单词的解释
 */
function showExpression(e){
    util.showTip(e.target.dataset.expr);
}

// 输入框失去焦点后添加其值到page对象中
function setRecordValue(e) {
    const key = e.currentTarget.id;
    this.setData({
        [key]: e.detail.value
    });
}

/**
 * 获得当前记录的单词数据
 * @returns [word, expr]
 */
function getCurrentRecordData() {
    const word = this.data["record_word"];
    const expr = this.data["record_expression"];
    return [word, expr];
}

function clearCurrentRecordData() {
    this.setData({
        record_word: "",
        record_expression: ""
    });
}

/**
 * 添加单词
 */
function addWordHandler(e){
    const [word, expr] = getCurrentRecordData.call(this);
    if (word == "" || expr == "") {
        util.showTip("输入不能为空");
        return;
    }

    const wordData = this.data.wordData;
    const nowDate = util.getNowDate("/");
    const recordStatus = wordData.findIndex(item=> item.d === nowDate);
    if (new RegExp("=").test(word)){
        reviseWord(wordData, recordStatus, word, expr);
    }else{
        addWord(wordData, recordStatus, word, expr, nowDate);
    }
    clearCurrentRecordData.call(this);
    this.setData({"wordData": wordData});
    setPageData.call(this);
    updateReviewData.call(this);
    util.setStorage("wordData", wordData);
}

function updateReviewData() {
    const reviewData = this.data.reviewData;

    util.setStorage("reviewData", reviewData);
}

function addWord(data, recordStatus, word, expr, nowDate){
    if (recordStatus !== -1){
        data[recordStatus].ws++;
        data[recordStatus].wl.push({ "w": word, "e": expr });
    } else{
        data.push({
            "d": nowDate,
            "ws": 1,
            "r": false,
            "wl": [{
                "w": word,
                "e": expr
            }]
        });
    }
}

/**
 * 修改单词
 * @param {object} data 要进行操作的数据
 * @param {number} index 今天所添加的单词数据的data的索引
 * @param {String} word 需要修改的单词
 * @param {String} newExpr 需要修改的单词的解释
 */
function reviseWord(data, index, word, newExpr) {
    const flag = !(index === -1);
    const [originalValue, newValue] = word.split("=").map(item => item.trim());
    let result = false;

    if (flag) {
        result = reviseValue(data, index, originalValue, newValue, newExpr);
    }
    if (!result) {
        for (let i = 0; i < data.length; i++) {
            if (result) break; //修改成功就不再循环
            result = reviseValue(data, i, originalValue, newValue, newExpr);
        }
    }
    if (result) util.showTip("修改成功");
    else util.showTip("单词不存在");
}

/**
 * 修改的单词的值。这是reviseWord()的辅助函数
 * @param {object} data 要进行操作的数据
 * @param {number} index 要修改的数据的索引
 * @param {String} originalValue 原来的单词的值
 * @param {String} newValue 新单词的值
 * @param {String} newExpr 新单词的解释
 * @returns 是否修改成功
 */
function reviseValue(data, index, originalValue, newValue, newExpr) {
    return data[index].wl.some((item, i, array) => {
        const flag = item.w == originalValue;

        if (flag && newValue != "") {
            item.w = newValue;
            item.e = newExpr;
            return true;
        }
        if (flag && newValue == "") {
            if (array.length === 1) {
                data.splice(index, 1);
                return true;
            }
            array.splice(i, 1);
            data[index].ws--;
            return true;
        }
    });
}

// 下载词汇量数据
function downVocabularyData(){
    const data = util.getStorage("wordData");
    downloadFile(data, "myVocabulary.json");
}

// 下载单词数据
function downWordData(){
    const data = util.getStorage("wordData");
    const wordData = JSON.parse(data);

    const saveData = [];
    wordData.forEach((item) => {
        saveData.push(`记录时间：${item.d}\r\n`);
        saveData.push(item.wl.map((obj, i) => `${i + 1}.${obj.w}：\r\n`).join("#"));
    });
    downloadFile(JSON.stringify(saveData), "myWord.txt");
}

// 下载解释数据
function downExprData(){
    const data = util.getStorage("wordData");
    const wordData = JSON.parse(data);

    const saveData = [];
    wordData.forEach((item) => {
        saveData.push(`记录时间：${item.d}\r\n`);
        saveData.push(item.wl.map((obj, i) => `${i + 1}.${obj.e}：\r\n`).join("#"));
    });
    downloadFile(JSON.stringify(saveData), "myExpression.txt");
}

/**
 * 下载文件
 * @param {string} data 要下载的文件数据
 * @param {string} fileName 要下载的文件名
 */
function downloadFile(data, fileName){
    const fs = wx.getFileSystemManager();
    fs.writeFile({
        filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
        data: data,
        encoding: 'utf-8',
        success(res) {
            console.log("成功：");
            console.log(res);
        },
        fail(res) {
            console.error("失败："+res);
        }
    });
}

/**
 * 初始化wordData的储存数据
 */
function initWordData() {
    const currentData = util.getStorage("wordData");
    if (currentData == "") util.setStorage("wordData", []);

    const wordData = util.getStorage("wordData");
    this.setData({wordData: wordData});
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

/**
 * .icon-down_container显隐切换
 */
function toggleShowStatus() {
    const flag = !this.data.showStatus;
    this.setData({"showStatus": flag});
}