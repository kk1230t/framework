"use strict";$(document).on("click",".style-toggle-btn",function(t){var s=$("#wrap"),e=$(this);s.hasClass("custom-style")?(s.removeClass("custom-style"),e.find("[data-text]").text("디자인 스타일 적용"),e.addClass("ui-active")):(s.addClass("custom-style"),e.find("[data-text]").text("기본스타일만 적용"),e.removeClass("ui-active")),UI.ui.modulesRefresh($("body"))});
//# sourceMappingURL=style.js.map
