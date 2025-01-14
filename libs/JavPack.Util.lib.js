class Util {
    static upLocal() {
        const date = new Date().getDate();
        if (localStorage.getItem("CD") === date.toString()) return;
        localStorage.clear();
        localStorage.setItem("CD", date);
    }

    static upStore() {
        const date = new Date().getDate();
        if (GM_getValue("CD") === date) return;
        GM_listValues().forEach((key) => GM_deleteValue(key));
        GM_setValue("CD", date);
    }

    static codeParse(code) {
        //const codes = code.split(/-|_/);
        //const sep = "\\s?(0|-|_){0,2}\\s?";

        const codes = code.split(/-|_|\./);//欧美番号的分隔符是.
        const sep = "\\s?(0|-|_|\\.){0,2}\\s?";
        //const sep = "\\s?(-|_|\\.){0,2}\\s?";

        //const sep = "\\s?(0{2})?(-|_|\\.){0,2}\\s?";


        //let pattern = codes.join(sep);

        let pattern = `${codes[0]}(?![a-z])${sep}${codes.slice(1).join(sep)}`;//确保codes[0]后不能有字母,防止出现code为STAR-380时,匹配上“STARS-380.mp4”的情况

        if (/^fc2/i.test(code)) pattern = `${codes[0]}${sep}(ppv)?${sep}${codes.at(-1)}`;
        if (/^heyzo/i.test(code)) pattern = `${codes[0]}${sep}(\\w){0,2}${sep}${codes.at(-1)}`;

        return {
            codes,
            prefix: codes[0],
            //regex: new RegExp(`(?<![a-z])${pattern}(?!\\d)`, "i"),
            regex: new RegExp(`(?<![a-z])${pattern}(?!\\d)(?!.*-(v|t))`, "i"),//修改的目的是区别   STARS-859和STARS-859-V    STARS-757和STARS-757-T  这样的番号匹配问题，后续还可能增加
        };
    }


    static setTabBar({ text, icon }) {
        if (text) document.title = text;
        if (!icon) return;

        const href = GM_getResourceURL(icon);
        document.querySelectorAll("link[rel*='icon']").forEach((item) => item.setAttribute("href", href));
    }
}
