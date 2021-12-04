class LocalStorage {
    constructor(key) {
        this.key = key;
        this._data = JSON.parse(window.localStorage.getItem(this.key));
        this._stack = [];
        this.init();
    }

    set stack(stack) {
        this._stack = stack;
    }

    get stack() {
        return this._stack;
    }

    get data() {
        return this._data;
    }

    get length() {
        return this._stack.length;
    }

    //初始化
    init() {
        if (!Array.isArray(this._data)) return;
        if (this._data.length == 0) return;

        this._stack = [...this.data];
        this.save();
    }

    /**
     * 获得指定日期的索引
     * @param {string} date 日期
     * @returns 索引
     */
    getIndex(date) {
        return this._stack.findIndex(item => item.d === date);
    }

    /**
     * 根据键获取数据中所有的值。
     * @param {string} key 键
     * @returns 数组
     */
    getValue(key) {
        return this._stack.filter(item => item[key]);
    }

    /**
     * 添加数据
     * @param {object} data 数据
     */
    add(data) {
        this._stack.push(data);
    }

    /**
     * 根据日期删除数据
     * @param {string} date 日期
     */
    remove(date) {
        this._stack.splice(this.getIndex(date), 1);
    }

    /**
     * 根据键更新值
     * @param {string} key 键
     * @param {string} value 值
     */
    update(key, value) {
        if (!isExist(key)) return;
        const index = this.getIndex(key);
        this._stack[index][key] = value;
    }

    //保存数据
    save() {
        const data = JSON.stringify(this._stack);
        window.localStorage.setItem(this.key, data);
    }

    //清空数据
    clear() {
        this._stack.length = 0;
    }

    /**
     * 判断数据项是否存在
     * @param {string} date 日期
     * @returns boolean
     */
    isExist(date) {
        return this._stack.every(item => item.d === date);
    }

    /**
     * 判断数据是否为空
     * @returns boolean
     */
    isEmpty() {
        return this._stack.length === 0;
    }
}

const a = window.localStorage.getItem("wordData");
const b = window.localStorage.getItem("reviewData");
if (!a) window.localStorage.setItem("wordData","[]");
if (!b) window.localStorage.setItem("reviewData","[]");
// 单例模式-导出
const wordData = new LocalStorage("wordData");
const reviewData = new LocalStorage("reviewData");
export { wordData, reviewData };