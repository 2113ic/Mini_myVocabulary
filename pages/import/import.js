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
    },
});