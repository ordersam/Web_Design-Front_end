// ============== 貓 ==============
function getMove(speed) {
    var cat = document.getElementById("cat");
    var catwidth = parseInt(cat.style.width);
    var disdance = parseInt(window.getComputedStyle(cat, null).left);
    var bodywidth = parseInt(window.getComputedStyle(document.querySelector("header"), null).width);
    // 右邊距離
    var a = parseInt(window.getComputedStyle(cat, null).right);
    if (a + speed <= bodywidth) {
        cat.style.right = a + speed + 'px';
    }
    else {
        cat.style.right = '-100px';
    };
    setTimeout(function(){
        getMove(speed);
    }, 100);
}

// ============== lazy load 延遲載入（圖片、影片） ==============
/*
    // tutorial：https://www.letswrite.tw/intersection-oserver-basic/
    1.建立觀察器
        var observer = new IntersectionObserver(callback, [option]);
        function callback(entry) {}
            注意callback代入的參數是陣列，代表觀察的獵物(無論一個或多個)
            陣列元素：entry[index] 取得 該index獵物
                {
                    // ReadOnly：目標元素的矩形區域的信息
                    boundingClientRect: {  },
                    // 獵物的可見比例(目前螢幕包含該元素多少比例)
                    intersectionRatio: 1,
                    // ReadOnly：獵物與root的交叉區域
                    intersectionRect: {  },
                    // 是否出現在鏡頭(root)中，獵物進入鏡頭為true，否則flase
                        // 會用來設定lazy load
                            // if (entry[0].isIntersecting) {
                            //     entry[0].target.src = entry[0].target.dataset.src;
                            //     observer.unobserve(entry[0].target);
                            // }
                    isIntersecting: true,
                    // ReadOnly：鏡頭(root)的資訊
                    rootBounds: {  },
                    // 獵物本身
                    target: 獵物的DOM節點
                }
        option 可選參數
            root: 可指定某元素,
                進入觀察、離開觀察都呼叫callback
            rootMargin: 預設"0px 0px 0px 0px",
                觀察的元素是否要移動邊界
                上下、左右要一起調整才會生效 e.g. -100px 0px 100px 0px
            threshold: [0-1數字代表百分比, 可多個百分比數值]
                指定元素出現多少百分比要觸發callback
                e.g. [0, 0.25, 0.5, 0.75, 1]
    2.指定觀察器要觀察的獵物（entry）
        觀察
            開始觀察某個獵物：observer.observe(el)
            取消觀察某個獵物：observer.unobserve(el)
            自爆，關掉這個觀察器：observer.disconnect()
        程式碼
            function callback(entry) {}
            var observer = new IntersectionObserver(callback);
            觀察一張圖片
                var img = document.getElementById('img');
                observer.observe(img);
            觀察所有圖片
                var all_img = document.querySelectorAll('img');
                Array.prototype.forEach.call(all_img, function(img) { observer.observe(img); });
*/
function callback_lazyload(entries) {
    Array.prototype.forEach.call(entries, entry => {
        if (entry.isIntersecting) {
            // 將 data-src 的值寫進 src 中
            entry.target.src = entry.target.dataset.src;
            // 停止觀察
            observerLazy.unobserve(entry.target);
        }
    })
};
let option_lazyload = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
};
let observerLazy = new IntersectionObserver(callback_lazyload, option_lazyload);

// ============== 進場效果 ==============
/*
    加入CDN套用 animate.css
    加上動畫 class加 animated 和 效果的class
        注意通常是套用在元素的外層div容器
        效果查詢官網(點效果有示範)：https://animate.style/
    動畫無限播放 class加 infinite
*/
function callback_animated(entries) {
    Array.prototype.forEach.call(entries, entry => {
        if (entry.isIntersecting) {
            // class 移除 .op-0(透明度0的style)，加入 data-animated 的值(進場特效class)
            entry.target.classList.remove('op-0');
            entry.target.classList.add(entry.target.dataset.animated);
            // 取消觀察
            observerAnimated.unobserve(entry.target);
        };
    });
}
let option_animated = {
    root: null,
    rootMargin: '0px',
    threshold: [1] // 目標100%進到視窗後才執行 animated
};
let observerAnimated = new IntersectionObserver(callback_animated, option_animated);

// ============== 無限捲動 ==============
/*
    只要觀察到最後的目標div，插入到包裹的div最後一個子元素

    ===== 字串解析成HTML，插入節點到DOM指定位置 =====
    element.insertAdjacentHTML(position, text);
        position
            'beforebegin' 元素前
            'afterend' 元素後
            'afterbegin' 第一個子元素前(元素內)
            'beforeend' 第一個子元素後(元素內)
        text 可用HTML
*/
let count = 1; 
let count_limit = 10; // 限定載入幾次
function callback_infinite(entries) {
    const infiniteWrap = document.getElementById('js_infinite');
    const infinite = document.getElementById('js_detective');
    Array.prototype.forEach.call(entries, entry => {
      if (entry.isIntersecting) {
        observerInfinite.unobserve(infinite);
        let item = `
            <div>
                <h5>無限捲動 ${count}</h5>
            </div>
            <div class="card-columns mt-3">
                <div class="card animated op-0" data-animated="zoomIn">
                    <div class="border">
                        <img class="card-img-top lazy" style="height: 300px;" data-src="https://i.imgur.com/battYyW.jpg">
                        <div class="card-body bg-secondary text-light text-center">
                            <h4 class="card-title">card1</h4>
                        </div>
                    </div>
                </div>
                <div class="card animated op-0" data-animated="zoomIn">
                    <div class="border">
                        <img class="card-img-top lazy" style="height: 300px;" data-src="https://i.imgur.com/2s0D6sW.png">
                        <div class="card-body bg-secondary text-light text-center">
                            <h4 class="card-title">card2</h4>
                        </div>
                    </div>
                </div>
                <div class="card animated op-0" data-animated="zoomIn">
                    <div class="border">
                        <img class="card-img-top lazy" style="height: 300px;" data-src="https://i.imgur.com/O5lQVyE.jpg">
                        <div class="card-body bg-secondary text-light text-center">
                            <h4 class="card-title">card3</h4>
                        </div>
                    </div>
                </div>
            </div>`;
        if (count <= count_limit) {
            infiniteWrap.insertAdjacentHTML('beforeend', item);
            
            // ============== lazy load 延遲載入（圖片、影片） ==============
            const lazyImg = document.querySelectorAll('.lazy');
            Array.prototype.forEach.call(lazyImg, lazy => observerLazy.observe(lazy));

            // ============== 進場效果 ==============
            const animatedIn = document.querySelectorAll('.animated');
            Array.prototype.forEach.call(animatedIn, animated => observerAnimated.observe(animated));

            count++;
            observerInfinite.observe(infinite);
        }
        else {
            observerInfinite.disconnect();
        }
        
        // fetch('API')
        //   .then(res => res.json())
        //   .then(res => {
        //     // 先取消觀察，以免又觸發下一個 request
        //     observerInfinite.unobserve(infinite);
  
        //     // append html
        //     let item = `想插入的HTML`;
        //     infiniteWrap.insertAdjacentHTML('beforeend', item);
  
        //     count++;
        //   })
        //   .then(() => {
        //     // 插入成功後 繼續觀察，加入載入次數限制
        //     if (count <= 幾次) {
        //       observerInfinite.observe(infinite);
        //     } else {
        //       const end = `想插入的HTML`;
        //       infiniteWrap.insertAdjacentHTML('beforeend', end);
        //       observerInfinite.disconnect(); // 關閉觀察器
        //     }
        //   })
      }
    })
  }
let option_infinite = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
};
let observerInfinite = new IntersectionObserver(callback_infinite, option_infinite);

// ============== body load 執行所有特效 ==============
function init() {
    // ============== 貓 ==============
    getMove(10);
    
    // ============== cursor ==============
    const cursor = document.querySelector('.cursor');
    // 滑鼠移動事件 要找到cursor在頁面的位置(pageX、pageY)
    document.addEventListener('mousemove', e => {
        cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;");
    })
    document.addEventListener('touchmove', e => {
        cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;");
    })
    document.addEventListener('click', () => {
        cursor.classList.add("expand");
        setTimeout(() => {
            cursor.classList.remove("expand");
        }, 500)
    })
    
    // ============== lazy load 延遲載入（圖片、影片） ==============
    const lazyImg = document.querySelectorAll('.lazy');
    Array.prototype.forEach.call(lazyImg, lazy => observerLazy.observe(lazy));

    // ============== 進場效果 ==============
    const animatedIn = document.querySelectorAll('.animated');
    Array.prototype.forEach.call(animatedIn, animated => observerAnimated.observe(animated));

    // ============== 無限捲動 ==============
    const infinite = document.getElementById('js_detective');
    observerInfinite.observe(infinite);
};