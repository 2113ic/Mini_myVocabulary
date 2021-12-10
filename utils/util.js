const setStorage = (key, value) => wx.setStorageSync(key,value);
const getStorage = (key) => wx.getStorageSync(key); 

/**
 * 异步读取文件
 * @param {object} file 文件对象
 * @returns file的promise
 */
function readFileAsync(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = evt => resolve(evt.target.result);
        reader.readAsText(file);
    });
}

/**
 * 获取json文件的数据。
 * @param {String} url url
 * @returns p
 */
 async function getJsonData(url) {
    return await (await fetch(url)).json();
}

/**
 * 轻提示
 * @param {String} text 需要显示的文本。
 */
function showTip(text, icon){
    wx.showToast({title: text,icon: icon||"none"});
}

/**
 * 调用百度语音api播放指定的文字。
 * @param {String} str 要播放的语言的文字。
 */
function stringToAudio(str) {
    const url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text='" + encodeURI(str);
    wx.playBackgroundAudio({
        dataUrl: url,
    })
}

/**
 * 获取年月日。 
 * @param {string} format 可选。日期分割符。默认"-"
 * @param {object} unixTime 可选。时间戳。默认Date.now()
 * @returns 日期字符串
 */
function getNowDate(format, unixTime) {
    const date = new Date(unixTime || Date.now());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [year, month, day].join(format || "-");
}

/**
 * 获取两个数之间的随机整数，不含最大值，含最小值。
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns 随机的整数。
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

module.exports.setStorage = setStorage;
module.exports.getStorage = getStorage;
module.exports.showTip= showTip;
module.exports.getNowDate= getNowDate;
module.exports.getRandomInt= getRandomInt;
module.exports.stringToAudio= stringToAudio;