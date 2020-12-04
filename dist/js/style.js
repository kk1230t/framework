$(document).on('click', '.style-toggle-btn', function(e){
    var wrap = $('#wrap');
    var $this = $(this);
    if(wrap.hasClass('custom-style')){
        wrap.removeClass('custom-style');
        $this.find('[data-text]').text('디자인 스타일 적용')
        $this.addClass('ui-active');
        UI.ui.modulesRefresh($('body'))
    }else{
        wrap.addClass('custom-style');
        $this.find('[data-text]').text('기본스타일만 적용')
        $this.removeClass('ui-active');
        UI.ui.modulesRefresh($('body'))
    }
})