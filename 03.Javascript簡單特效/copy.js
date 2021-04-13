function copy(id) {
    var element = document.getElementById(id);
    // === 法1 有實際可編輯區域 input、textarea 才可複製 ===
    // element.select();
    // document.execCommand('Copy');

    // === 法2 創建input複製完再刪掉 ===
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', element.innerHTML);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        //console.log('複製成功');
    }
    document.body.removeChild(input);

    // 使用者訊息
    var msg = document.getElementById('copymsg');
    msg.hidden = false;
    setTimeout(function(){
        msg.hidden = true;
    }, 1000)
}