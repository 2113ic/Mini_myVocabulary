const app = getApp();// 获取应用实例

Page({
    data: {
        // 导航栏
        nbTitle: '我的词汇量',
        nbLoading: true,
        nbFrontColor: '#fff',
        nbBackgroundColor: '#4c5161',
    },
    onLoad() {
        console.log(this);
        
        const data = wx.getStorageSync("wordData");
        if (data == "") wx.setStorageSync("wordData", "[]");
        this.setData({wordData: JSON.parse(data)});
    },
    openFile
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
            let data = [];
            res.tempFiles.forEach(item => {
                const path = item.path;

                if (!path.endsWith(".json")) {
                    wx.showToast({ title: "请选择.json格式的文件", icon: "none" });
                    return;
                };
                data.push(getFileData(path));
            });
            const nowData = wx.getStorageSync('key');
            if (nowData != null) data.push(nowData);
            wx.setStorage({ key: "wordData", data: data });
        },
        fail(e) {
            wx.showToast({ title: "导入失败", icon: "none" });
            console.log(e.errMsg);
        },
    });
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

/**
 * 清除缓存
 */
function remove_svae() {
    wx.getSavedFileList({
        success(res) {
            if (!res.fileList.length > 0) return;

            wx.removeSavedFile({
                filePath: res.fileList[0].filePath,
                complete(res) {
                    console.log(res);
                }
            })
        }
    });
}