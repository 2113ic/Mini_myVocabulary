const util = require('../../utils/util.js');
const app = getApp();// 获取应用实例

Page({
    data: {},
    onLoad() {
    },
    openFile,
});


/**
 * 打开系统文件管理器，选择文件。
 * @return 文件数据。
 */
 function openFile() {
    wx.chooseMessageFile({
        type: "file",
        count: 10,
        extends: ["json"],
        success(res) {
            mergeData(res); // 数据处理
            util.showTip("导入成功");
        },
        fail(e) {
            util.showTip("导入失败"+e.errMsg);
        }
    });
}

// 合并数据。数据处理并储存。
function mergeData(res) {
    let data = [];
    let file_conent = [];

    res.tempFiles.forEach(item => {
        const path = item.path;

        if (!path.endsWith(".json")) {
            wx.showToast({ title: "请选择.json格式的文件", icon: "none" });
            return;
        };
        file_conent.push(JSON.parse(getFileData(path)));
    });

    const nowData = wx.getStorageSync('wordData');
    if (nowData.length !== 0) file_conent.push(nowData);
    data = file_conent.reduce((pre, cur) => pre.concat(cur));
    wx.setStorage({ key: "wordData", data: data });
}

/**
 * 获取文件数据。
 * @param {String} filePath 要读取数据的文件路径。
 * @return 文件数据。
 */
function getFileData(filePath) {
    const file = wx.getFileSystemManager();
    return file.readFileSync(filePath, "utf-8");
}