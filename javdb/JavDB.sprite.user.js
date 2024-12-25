// ==UserScript==
// @name            JavDB.sprite
// @namespace       JavDB.sprite@blc
// @version         0.0.1
// @author          blc
// @description     雪碧图
// @match           https://javdb.com/v/*
// @icon            https://javdb.com/favicon.ico
// @require         https://github.com/bolin-dev/JavPack/raw/main/libs/JavPack.Req.lib.js
// @require         https://github.com/bolin-dev/JavPack/raw/main/libs/JavPack.ReqSprite.lib.js
// @require         https://github.com/bolin-dev/JavPack/raw/main/libs/JavPack.Util.lib.js
// @connect         javstore.net
// @connect         javbee.me
// @connect         *
// @run-at          document-end
// @grant           GM_xmlhttpRequest
// @grant           GM_deleteValues
// @grant           GM_listValues
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

Util.upStore();

(function () {
  const mid = unsafeWindow.appData?.split("/").at(-1);
  if (!mid) return;

  const setSprite = (source) => {
    const TARGET = "x-sprite";
    const ALT = "雪碧图";

    const imgHTML = `<img src="${source}" alt="${ALT}" loading="lazy" referrerpolicy="no-referrer">`;
    document.body.insertAdjacentHTML("beforeend", `<div style="display: none;" id="${TARGET}">${imgHTML}</div>`);

    const insertHTML = `
    <a
      class="tile-item"
      href="javascript:void(0);"
      data-fancybox="gallery"
      data-caption="${ALT}"
      data-src="#${TARGET}"
    >
      ${imgHTML}
    </a>
    `;

    const container = document.querySelector(".tile-images.preview-images");
    if (!container) {
      return document.querySelector(".video-meta-panel").insertAdjacentHTML(
        "afterend",
        `<div class="columns">
          <div class="column">
            <article class="message video-panel">
              <div class="message-body">
                <div class="tile-images preview-images">${insertHTML}</div>
              </div>
            </article>
          </div>
        </div>`,
      );
    }

    const tileItem = container.querySelector(".tile-item");
    if (tileItem) return tileItem.insertAdjacentHTML("beforebegin", insertHTML);
    container.insertAdjacentHTML("beforeend", insertHTML);
  };

  const sprite = GM_getValue(mid);
  if (sprite) return setSprite(sprite);

  const code = document.querySelector(".first-block .value").textContent;
  const codeDetails = Util.codeParse(code);

  ReqSprite.getSprite(codeDetails)
    .then((source) => {
      GM_setValue(mid, source);
      setSprite(source);
    })
    .catch((err) => console.warn(err?.message));
})();
