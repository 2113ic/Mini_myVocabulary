const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const setLocalStorage = (key, value) => window.localStorage.setItem(key, value);
const getLocalStorage = (key) => window.localStorage.getItem(key); 

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
 * 克隆节点
 * @param {element} node 需要克隆的节点
 * @param {number} num 克隆数量
 * @param {Boolean} deep 可选。克隆深度。默认为false
 * @param {element} parentNode 可选。需要克隆到的节点。默认值为父节点。
 * @param {pattern} pattern 可选。插入方式。默认为添加到末尾。
 */
function cloneNode(node, num, deep, parentNode, pattern) {
    const container = parentNode || node.parentNode;
    const pat = pattern || "append";
    deep = deep || false;
    for (let i = 0; i < num; i++) {
        const cloneNode = node.cloneNode(deep);
        container[pat](cloneNode);
    }
}

/**
 * 轻提示
 * @param {String} text 需要显示的文本。
 */
function showTip(text) {
    layui.use('layer', () => layui.layer.msg(text));
}

/**
 * 为元素设置样式
 * @param {element} ele 元素
 * @param {Object} obj 包含键值对的对象。
 */
function elementStyle(ele, obj) {
    Object.entries(obj).forEach((item) => {
        const [key, value] = item;
        ele.style[key] = value;
    });
}

/**
 * 调用百度语音api播放指定的文字。
 * @param {String} str 要播放的语言的文字。
 */
function stringToAudio(str) {
    const url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text='" + encodeURI(str);
    new Audio(url).play();
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

/**
 * 获取json文件的数据。
 * @param {String} url url
 * @returns p
 */
async function getJsonData(url) {
    return await (await fetch(url)).json();
}