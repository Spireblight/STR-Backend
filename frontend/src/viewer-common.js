const CHARACTERS = ["Ironclad", "TheSilent", "Defect", "Watcher"],
    WILDCARDS = "0123456789abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ_`[]/^%?@><=-+*:;,.()#$!'{}~",
    REM_PX = 21.6,
    RELIC_HITBOX_WIDTH = 3.75,
    RELIC_HITBOX_LEFT = 1.458,
    RELIC_HITBOX_MULTIPAGE_OFFSET = 1.875,
    POTION_HITBOX_WIDTH = 2.916,
    POWERTIP_WIDTH = 16.406,
    POWERTIP_WIDTH_REM = 14.583,
    MAX_POWERTIP_MULTICOL_HEIGHT = 70,
    POWERTIP_BOTTOM_MARGIN = 0.365,
    MULTICOL_COLUMN_RIGHT_MARGIN = 0.469;
var collections = {};
const MAX_CONCURRENT_PRELOADS = 3,
    PRELOAD_INTERVAL = 250;
var imagePreloadQueue, temp_card_title, temp_card_description;
class CustomElement {
    constructor(a = null) {
        this.root = a;
    }
}
class PlaceholderElement extends CustomElement {
    constructor() {
        const a = document.createElement("div");
        (a.display = "none"), super(a);
    }
}
function appendChild(a, b) {
    b instanceof Element ? a.appendChild(b) : b instanceof CustomElement ? a.appendChild(b.root) : error("invalid child type: " + typeof b);
}
function escapeRegex(a) {
    return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function decompress(a) {
    (parts = a.split("||")), (compression_dict = parts[0].split("|"));
    var b = parts[1];
    for (let c = compression_dict.length - 1; 0 <= c; c--) {
        const a = compression_dict[c],
            d = "&" + WILDCARDS[c];
        b = b.replace(new RegExp(escapeRegex(d), "g"), a);
    }
    return b;
}
function splitSemicolonDelimited2DArray(a) {
    if ("-" == a) return [];
    (array = []), (split = a.split(";;"));
    for (let b = 0; b < split.length; b++) {
        const a = split[b];
        array.push(a.split(";"));
    }
    return array;
}
function parseCommaDelimitedIntegerArray(a) {
    return "-" == a ? [] : JSON.parse("[" + a + "]");
}
function sanitizeCharacter(a) {
    for (const b of CHARACTERS) if (a == b) return a;
    return CHARACTERS[2];
}
function arraySubset(a, b) {
    var c = [];
    for (let d = 0; d < b.length; d++) {
        const e = b[d];
        c.push(a[e]);
    }
    return c;
}
function arraySlice(a, b, c) {
    var d = [];
    c || (c = a.length);
    for (let e = b; e < c; e++) d.push(a[e]);
    return d;
}
function getNextId() {
    return null == getNextId.uid && (getNextId.uid = 0), (getNextId.uid = (getNextId.uid + 1) % 1e3), "id" + getNextId.uid;
}
function clearCollection(a) {
    if (a in collections) {
        for (let b = 0; b < collections[a].length; b++) {
            const c = collections[a][b];
            c instanceof CustomElement ? c.root.parentNode.removeChild(c.root) : c.parentNode.removeChild(c);
        }
        collections[a] = [];
    }
}
function addToCollection(a, b) {
    b instanceof Element || b instanceof CustomElement || error("element is neither the instance of Element nor CustomElement but " + typeof b), a in collections ? collections[a].push(b) : (collections[a] = [b]);
}
class PowerTip {
    constructor() {
        (name = power_tip[0]), (description = power_tip[1]), (img = 3 == power_tip.length ? power_tip[2] : void 0);
    }
}
class PowerTipElement extends CustomElement {
    constructor(a, b, c, d) {
        (a = sanitizeHtmlText(a)), (b = sanitizeHtmlText(b)), (c = sanitizeHtmlText(c));
        let e = document.createElement("div");
        e.className = "powertip";
        let f = document.createElement("div");
        f.classList.add("powertip-header"), f.classList.add("outline"), (f.innerHTML = replaceManaSymbols(a, d));
        let g;
        c
            ? ((g = document.createElement("img")),
              (g.src = "img/" + c + ".png"),
              (g.alt = " "),
              g.classList.add("powertip-img"),
              (g.onerror = function () {
                  this.src = "img/placeholder.png";
              }),
              f.appendChild(g),
              f.classList.add("powertip-header-wimg"))
            : f.classList.add("powertip-header-noimg");
        let h = document.createElement("div");
        (h.innerHTML = replaceNewLines(replaceManaSymbols(replaceColorCodes(b), d))), e.appendChild(f), e.appendChild(h), super(e);
    }
}
class HitboxElement extends CustomElement {
    constructor(a) {
        let b = document.createElement("div");
        (b.className = "hitbox"), (b.style = "left: " + a.x + "; top: " + a.y + "; width: " + a.w + "; height: " + a.h + "; z-index: " + a.z + ";"), super(b);
    }
    setMagnifyingGlassCursor() {
        this.root.classList.add("mag-glass");
    }
}
class PowerTipBlock {
    constructor(a, b, c, d, e, f) {
        f || (f = "");
        let g = f + getNextId(),
            h = new HitboxElement(b);
        (h.root.onmouseenter = function (a) {
            showPowerTipMulticol(a, g, d);
        }),
            (h.root.onmouseout = function (a) {
                hidePowerTipMulticol(a, g, d);
            });
        let i = this.createPowertipMulticol(g, c, e);
        addToCollection(d, h), addToCollection(d, i), appendChild(a, h), appendChild(a, i), (this.tipsElem = i), (this.hitboxElem = h);
    }
    createPowertipMulticol(a, b, c) {
        let d = document.createElement("div");
        (d.className = "powertip-multicol"), (d.id = a);
        let e = document.body.offsetHeight,
            f = document.createElement("div");
        (f.className = "powertip-multicol-column"), d.appendChild(f);
        let g = 1,
            h = document.getElementById("temp"),
            j = 0,
            k = 0,
            l = [];
        for (let m = 0; m < b.length; m++) {
            const a = b[m];
            let i = a[0],
                n = a[1],
                o = 3 == a.length ? a[2] : void 0,
                p = new PowerTipElement(i, n, o, c);
            h.appendChild(p.root);
            let q = 100 * (p.root.offsetHeight / e) + POWERTIP_BOTTOM_MARGIN;
            h.removeChild(p.root),
                l.push(q),
                j + q > MAX_POWERTIP_MULTICOL_HEIGHT ? (j > k && (k = j), (f = document.createElement("div")), (f.className = "powertip-multicol-column"), d.appendChild(f), (g += 1), (j = q)) : (j += q),
                f.appendChild(p.root);
        }
        j > k && (k = j);
        let m = k,
            n = g * (POWERTIP_WIDTH + MULTICOL_COLUMN_RIGHT_MARGIN);
        return (d.style = "width: " + n + "%; height: " + m + "%;"), d;
    }
}
class PowerTipStrip {
    constructor(a, b, c, d, e) {
        let f = getNextId(),
            g = new HitboxElement(b);
        (g.root.onmouseenter = function (a) {
            showPowerTipStrip(a, f, d);
        }),
            (g.root.onmouseout = function (a) {
                hidePowerTipStrip(a, f, d);
            });
        let h = this.createStrip(f, c, e);
        addToCollection(d, g), addToCollection(d, h), appendChild(a, g), appendChild(a, h), (this.hitboxElem = g), (this.tipsElem = h);
    }
    createStrip(a, b, c) {
        let d = document.createElement("div");
        (d.className = "powertip-strip"), (d.id = a);
        for (let e of b) {
            let a = e[0],
                b = e[1],
                f = 3 == e.length ? e[2] : void 0;
            appendChild(d, new PowerTipElement(a, b, f, c));
        }
        return d;
    }
}
function replaceColorCodes(a) {
    var b = a.split(" ");
    for (let d = 0; d < b.length; d++) {
        const e = b[d];
        if ("#" == e.charAt(0)) {
            var c = "";
            switch (e.charAt(1)) {
                case "y":
                    c = "text-yellow";
                    break;
                case "b":
                    c = "text-blue";
                    break;
                case "r":
                    c = "text-red";
                    break;
                case "g":
                    c = "text-green";
                    break;
                case "p":
                    c = "text-pink";
                    break;
                default:
                    c = "text-other";
            }
            var a = e.substring(2);
            b[d] = '<span class="' + c + '">' + a + "</span>";
        }
    }
    return b.join(" ");
}
function replaceManaSymbols(a, b, c = !1) {
    var d = a.split(" ");
    for (let e = 0; e < d.length; e++) {
        const a = d[e];
        if (0 < a.length && "[" == a.charAt(0) && a.includes("[E]")) {
            let f = "energy-orb-img";
            c && (f = "energy-orb-img-scalable"), (d[e] = a.replace("[E]", '<img src="' + ("img/orbs/orb" + b + ".png") + '" alt="[E]" class="' + f + '">'));
        }
    }
    return d.join(" ");
}
function replaceNewLines(a) {
    (parts = a.split(" ")), (new_text = ""), (previous_special = !0);
    for (let b = 0; b < parts.length; b++) {
        const a = parts[b];
        "NL" == a
            ? ((new_text += "<br>"), (previous_special = !0))
            : "TAB" == a
            ? ((new_text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"), (previous_special = !0))
            : (!previous_special && (new_text += " "), (new_text += a), (previous_special = !1));
    }
    return new_text;
}
function sanitizeHtmlText(a) {
    return a ? a.replace(/</g, "&lt;").replace(/>/g, "&gt;") : a;
}
function parseRem(a) {
    return (a = a.substring(0, a.length - 3)), parseFloat(a);
}
function parsePercentage(a) {
    return (a = a.substring(0, a.length - 1)), parseFloat(a);
}
(CARD_TYPE = ["ATTACK", "SKILL", "POWER", "STATUS", "CURSE"]), (CARD_RARITY = ["BASIC", "SPECIAL", "COMMON", "UNCOMMON", "RARE", "CURSE"]), (CARD_COLOR = ["RED", "GREEN", "BLUE", "PURPLE", "COLORLESS", "CURSE"]);
class Card {
    constructor(a, b, c, d, e, f, g, h, i, j, k) {
        (this.name = a),
            (this.cost = b),
            (this.type = c),
            (this.rarity = d),
            (this.color = e),
            (this.description = f),
            (this.keyword_ids = g),
            (this.card_to_preview = h),
            (this.upgrades = i),
            (this.bottle_status = j),
            (this.mod_name = k),
            (this.upgraded_version = null);
    }
    equals(a) {
        let b =
            this.name == a.name &&
            this.cost == a.cost &&
            this.type == a.type &&
            this.rarity == a.rarity &&
            this.color == a.color &&
            this.description == a.description &&
            JSON.stringify(this.keyword_ids) == JSON.stringify(a.keyword_ids) &&
            this.card_to_preview == a.card_to_preview &&
            this.upgrades == a.upgrades &&
            this.bottle_status == a.bottle_status &&
            this.mod_name == a.mod_name;
        if (null != this.upgraded_version) {
            if (null == a.upgraded_version) return !1;
            b = b && this.upgraded_version.equals(a.upgraded_version);
        }
        return b;
    }
    static parseCard(a) {
        let b = a[0],
            c = parseInt(a[3]),
            d = parseInt(a[4]),
            e = this.parseUpgradedName(b, a[5]),
            f = parseInt(a[6]),
            g = this.parseUpgradedKeywords(a[9], a[7]),
            h = this.parseUpgradedDesc(a[15], a[8]),
            i = this.parseKeywords(a[9]),
            j = this.parseCost(a[10]),
            k = this.parseCost(a[11]),
            l = this.parseCardType(a[12]),
            m = this.parseCardRarity(a[13]),
            n = this.parseCardColor(a[14]),
            o = a[15],
            p = parseInt(a[1]),
            q = this.parseModName(a[2]),
            r = new Card(b, j, l, m, n, o, i, c, f, p, q);
        return null != e && (r.upgraded_version = new Card(e, k, l, m, n, h, g, d, f + 1, 0, q)), r;
    }
    static parseUpgradedName(a, b) {
        return "-" == b ? null : "_" == b ? a : "+" == b ? a + "+" : b;
    }
    static parseUpgradedDesc(a, b) {
        return "-" == b ? null : "_" == b ? a : b;
    }
    static parseUpgradedKeywords(a, b) {
        return "_" == b ? this.parseKeywords(a) : this.parseKeywords(b);
    }
    static parseCardType(a) {
        let b = parseInt(a);
        return isNaN(b) ? a : CARD_TYPE[b];
    }
    static parseCardRarity(a) {
        let b = parseInt(a);
        return isNaN(b) ? a : CARD_RARITY[b];
    }
    static parseCardColor(a) {
        let b = parseInt(a);
        return isNaN(b) ? a : CARD_COLOR[b];
    }
    static parseCost(a) {
        return -2 == a ? null : -1 == a ? "X" : parseInt(a);
    }
    static parseKeywords(a) {
        return "-" == a ? [] : JSON.parse("[" + a + "]");
    }
    static parseModName(a) {
        return "-" == a ? null : a;
    }
}
const CARD_BASE_WIDTH = 12.361,
    CARD_BASE_HEIGHT = 15.926,
    CARD_BASE_FONT_SIZE = 1,
    BOTTLE_RELICS = ["bottled_flame", "bottled_lightning", "bottled_tornado"],
    CARD_MIN_FONT_SCALING = 0.69,
    CARD_FONT_SCALING_STEP = 0.05,
    CARD_TITLE_FONT_SIZE = 0.984,
    CARD_TITLE_FONT_SIZE_SMALL = 0.839,
    CARD_DESCRIPTION_FONT_SIZE = 0.875;
class CardElement extends CustomElement {
    constructor(a, b, c = 12.361, d = !0, e = !1, f = !0, g = !1) {
        null == c && (c = CARD_BASE_WIDTH);
        const h = document.createElement("div");
        h.classList.add("card"),
            super(h),
            this.setWidth(c),
            (this.shadow_blur = document.createElement("div")),
            (this.shadow_blur.className = "card-shadow-blur"),
            h.appendChild(this.shadow_blur),
            (this.shadow_drop = document.createElement("div")),
            (this.shadow_drop.className = "card-shadow-drop"),
            h.appendChild(this.shadow_drop);
        const i = document.createElement("div");
        (i.className = "card-img"),
            (i.style.zIndex = -4),
            imagePreloadQueue.highPriorityLoadImg(this.getBackgroundPath(a), this.getBackgroundPath(a, !0), imagePreloadQueue.loadBackgroundCallback, i, this.getBackgroundPath(a)),
            h.appendChild(i);
        const j = document.createElement("div");
        (j.className = "card-portrait"), (j.style.zIndex = -3), imagePreloadQueue.lowPriorityLoadImg(this.getPortraitPath(a), null, imagePreloadQueue.loadBackgroundCallback, j, this.getPortraitPath(a)), h.appendChild(j);
        const k = document.createElement("div");
        if (
            ((k.className = "card-img"),
            (k.style.zIndex = -2),
            imagePreloadQueue.highPriorityLoadImg(this.getFramePath(a), this.getFramePath(a, !0), imagePreloadQueue.loadBackgroundCallback, k, this.getFramePath(a)),
            h.appendChild(k),
            null != a.cost)
        ) {
            const b = document.createElement("div");
            (b.className = "card-img"),
                (b.style.backgroundImage = this.getEnergyOrbPath(a)),
                (b.style.zIndex = -1),
                imagePreloadQueue.highPriorityLoadImg(this.getEnergyOrbPath(a), this.getEnergyOrbPath(a, !0), imagePreloadQueue.loadBackgroundCallback, b, this.getEnergyOrbPath(a)),
                h.appendChild(b);
            const c = document.createElement("div");
            (c.className = "card-cost outline-black"), (c.innerHTML = a.cost), (c.zIndex = 1), h.appendChild(c);
        }
        const l = document.createElement("div");
        l.className = "card-title";
        let m = a.name;
        0 < a.upgrades && d && 0 <= a.name.indexOf("+") && (m = colorizeString(m, "#g"));
        let n = replaceColorCodes(sanitizeHtmlText(m)),
            o = e ? CARD_TITLE_FONT_SIZE_SMALL : CARD_TITLE_FONT_SIZE,
            p = this.computeFontScaling(n, o, temp_card_title, 1.3, 0.5);
        (l.style.fontSize = o * p + "em"), (l.innerHTML = n), h.appendChild(l);
        const q = document.createElement("div");
        (q.className = "card-bottle"), h.appendChild(q), f && 0 < a.bottle_status && imagePreloadQueue.lowPriorityLoadImg(this.getBottlePath(a), null, imagePreloadQueue.loadBackgroundCallback, q, this.getBottlePath(a));
        const r = document.createElement("div");
        r.className = "card-description";
        const s = document.createElement("span");
        let t = replaceNewLines(replaceManaSymbols(replaceColorCodes(sanitizeHtmlText(a.description)), b, !0));
        (s.innerHTML = t), (s.className = "card-description-text"), g && s.classList.add("card-description-text-shadow");
        let u = this.computeFontScaling(t, CARD_DESCRIPTION_FONT_SIZE, temp_card_description, 4.873, 0.5);
        (s.style.fontSize = CARD_DESCRIPTION_FONT_SIZE * u + "em"), r.appendChild(s), h.appendChild(r);
    }
    getBackgroundPath(a, b = !1) {
        return b ? "img/cards/basegame/COLORLESS/background_" + a.type + ".png" : this.getBaseCardPath(a) + a.color + "/background_" + a.type + ".png";
    }
    getFramePath(a, b = !1) {
        return b ? "img/cards/basegame/COLORLESS/frame_" + a.type + "_" + a.rarity + ".png" : this.getBaseCardPath(a) + a.color + "/frame_" + a.type + "_" + a.rarity + ".png";
    }
    getEnergyOrbPath(a, b = !1) {
        return b ? "img/cards/basegame/COLORLESS/energy_orb.png" : this.getBaseCardPath(a) + a.color + "/energy_orb.png";
    }
    sanitizeFilename(a) {
        return a.replace(/[\\/:*?"<>|\s]/g, "_");
    }
    getModName(a) {
        return null == a.mod_name ? "basegame" : a.mod_name;
    }
    getPortraitPath(a) {
        let b = a.name;
        0 < a.upgrades && -1 != b.lastIndexOf("+") && (b = b.substring(0, b.lastIndexOf("+"))), (b = this.sanitizeFilename(b));
        let c = "";
        return "CURSE" == a.color && null != a.mod_name && (c = a.mod_name + "/"), this.getBaseCardPath(a) + a.color + "/portraits/" + c + b + ".png";
    }
    getBottlePath(a) {
        return "img/relics/" + BOTTLE_RELICS[a.bottle_status - 1] + ".png";
    }
    getBaseCardPath(a) {
        return a.mod_name ? "https://slay-the-relics-assets.s3.eu-west-2.amazonaws.com/cards/" + this.sanitizeFilename(this.getModName(a)) + "/" : "img/cards/basegame/";
    }
    setWidth(a) {
        this.scale = a / CARD_BASE_WIDTH;
        const b = CARD_BASE_WIDTH * this.scale + "rem",
            c = CARD_BASE_HEIGHT * this.scale + "rem",
            d = CARD_BASE_FONT_SIZE * this.scale + "rem";
        (this.root.style.width = b), (this.root.style.height = c), (this.root.style.fontSize = d);
    }
    setShadowDrop(a) {
        this.shadow_drop.style.visibility = a ? "visible" : "hidden";
    }
    setShadowBlur(a) {
        this.shadow_blur.style.visibility = a ? "visible" : "hidden";
    }
    computeFontScaling(a, b, c, d, e, f) {
        let g,
            h,
            i = document.body.offsetWidth / 1920,
            j = 1 + CARD_FONT_SCALING_STEP,
            k = d * REM_PX * i,
            l = c.offsetWidth;
        f && console.log("stream scale", i);
        do (j -= CARD_FONT_SCALING_STEP), (c.innerHTML = a), (c.style.fontSize = b * j + "rem"), (g = c.offsetHeight), (h = c.scrollWidth), f && console.log("height", g, "max height", k, "max height em", d);
        while ((g > k || h > l) && j - CARD_FONT_SCALING_STEP > e);
        return (c.innerHTML = ""), j;
    }
}
function colorizeString(a, b) {
    let c = a.split(" ");
    a = "";
    for (let d = 0; d < c.length; d++) {
        const e = c[d];
        (a += b + e), d < c.length - 1 && (a += " ");
    }
    return a;
}
const PRELOAD_IMAGES = [
    "img/magGlass2.png",
    "img/orbs/orb.png",
    "img/orbs/orbDefect.png",
    "img/orbs/orbIronclad.png",
    "img/orbs/orbTheSilent.png",
    "img/orbs/orbWatcher.png",
    "img/placeholder.png",
    "img/ui/deck.png",
    "img/ui/checkbox_upgrade_checked_hover.png",
    "img/ui/checkbox_upgrade_hover.png",
    "img/ui/btn_next_base.png",
    "img/ui/btn_next_hover.png",
    "img/ui/btn_prev_base.png",
    "img/ui/btn_prev_hover.png",
    "img/ui/btn_return_base.png",
    "img/ui/btn_return_hover.png",
    "img/ui/checkbox_checked.png",
    "img/ui/checkbox_unchecked.png",
    "img/ui/checkbox_upgrade.png",
    "img/ui/checkbox_upgrade_checked.png",
    "img/intents/attackBuff.png",
    "img/intents/attackDebuff.png",
    "img/intents/attackDefend.png",
    "img/intents/buff1.png",
    "img/intents/debuff1.png",
    "img/intents/debuff2.png",
    "img/intents/defend.png",
    "img/intents/defendBuff.png",
    "img/intents/escape.png",
    "img/intents/magic.png",
    "img/intents/sleep.png",
    "img/intents/special.png",
    "img/intents/stun.png",
    "img/intents/tip/1.png",
    "img/intents/tip/2.png",
    "img/intents/tip/3.png",
    "img/intents/tip/4.png",
    "img/intents/tip/5.png",
    "img/intents/tip/6.png",
    "img/intents/tip/7.png",
    "img/intents/unknown.png",
    "img/powers/48/accuracy.png",
    "img/powers/48/afterImage.png",
    "img/powers/48/ai.png",
    "img/powers/48/amplify.png",
    "img/powers/48/anger.png",
    "img/powers/48/armor.png",
    "img/powers/48/artifact.png",
    "img/powers/48/attackBurn.png",
    "img/powers/48/backAttack.png",
    "img/powers/48/backAttack2.png",
    "img/powers/48/barricade.png",
    "img/powers/48/beat.png",
    "img/powers/48/berserk.png",
    "img/powers/48/bias.png",
    "img/powers/48/blur.png",
    "img/powers/48/book.png",
    "img/powers/48/brutality.png",
    "img/powers/48/buffer.png",
    "img/powers/48/burst.png",
    "img/powers/48/carddraw.png",
    "img/powers/48/cExplosion.png",
    "img/powers/48/channel.png",
    "img/powers/48/choke.png",
    "img/powers/48/closeUp.png",
    "img/powers/48/combust.png",
    "img/powers/48/confusion.png",
    "img/powers/48/conserve.png",
    "img/powers/48/constricted.png",
    "img/powers/48/controlled_change.png",
    "img/powers/48/corruption.png",
    "img/powers/48/curiosity.png",
    "img/powers/48/darkembrace.png",
    "img/powers/48/defenseNext.png",
    "img/powers/48/demonForm.png",
    "img/powers/48/deva.png",
    "img/powers/48/deva2.png",
    "img/powers/48/devotion.png",
    "img/powers/48/dexterity.png",
    "img/powers/48/doubleDamage.png",
    "img/powers/48/doubleTap.png",
    "img/powers/48/draw.png",
    "img/powers/48/draw2.png",
    "img/powers/48/echo.png",
    "img/powers/48/end_turn_death.png",
    "img/powers/48/energized_blue.png",
    "img/powers/48/energized_green.png",
    "img/powers/48/entangle.png",
    "img/powers/48/envenom.png",
    "img/powers/48/establishment.png",
    "img/powers/48/evolve.png",
    "img/powers/48/explosive.png",
    "img/powers/48/fading.png",
    "img/powers/48/fasting.png",
    "img/powers/48/firebreathing.png",
    "img/powers/48/flameBarrier.png",
    "img/powers/48/flex.png",
    "img/powers/48/flight.png",
    "img/powers/48/focus.png",
    "img/powers/48/forcefield.png",
    "img/powers/48/frail.png",
    "img/powers/48/fumes.png",
    "img/powers/48/heartDef.png",
    "img/powers/48/heatsink.png",
    "img/powers/48/hello.png",
    "img/powers/48/hex.png",
    "img/powers/48/hymn.png",
    "img/powers/48/infiniteBlades.png",
    "img/powers/48/infinitegreen.png",
    "img/powers/48/int.png",
    "img/powers/48/intangible.png",
    "img/powers/48/juggernaut.png",
    "img/powers/48/lessdraw.png",
    "img/powers/48/like_water.png",
    "img/powers/48/lockon.png",
    "img/powers/48/loop.png",
    "img/powers/48/magnet.png",
    "img/powers/48/malleable.png",
    "img/powers/48/mantra.png",
    "img/powers/48/mastery.png",
    "img/powers/48/master_protect.png",
    "img/powers/48/master_reality.png",
    "img/powers/48/master_smite.png",
    "img/powers/48/mayhem.png",
    "img/powers/48/mental_fortress.png",
    "img/powers/48/minion.png",
    "img/powers/48/modeShift.png",
    "img/powers/48/nightmare.png",
    "img/powers/48/nirvana.png",
    "img/powers/48/noattack.png",
    "img/powers/48/noBlock.png",
    "img/powers/48/noDraw.png",
    "img/powers/48/noPain.png",
    "img/powers/48/no_skill.png",
    "img/powers/48/no_stance.png",
    "img/powers/48/omega.png",
    "img/powers/48/painfulStabs.png",
    "img/powers/48/panache.png",
    "img/powers/48/path_to_victory.png",
    "img/powers/48/penNib.png",
    "img/powers/48/phantasmal.png",
    "img/powers/48/platedarmor.png",
    "img/powers/48/poison.png",
    "img/powers/48/pressure_points.png",
    "img/powers/48/reactive.png",
    "img/powers/48/rebound.png",
    "img/powers/48/regen.png",
    "img/powers/48/regrow.png",
    "img/powers/48/repair.png",
    "img/powers/48/retain.png",
    "img/powers/48/ritual.png",
    "img/powers/48/rupture.png",
    "img/powers/48/rushdown.png",
    "img/powers/48/sadistic.png",
    "img/powers/48/shackle.png",
    "img/powers/48/sharpHide.png",
    "img/powers/48/shift.png",
    "img/powers/48/skillBurn.png",
    "img/powers/48/slow.png",
    "img/powers/48/split.png",
    "img/powers/48/sporeCloud.png",
    "img/powers/48/stasis.png",
    "img/powers/48/static_discharge.png",
    "img/powers/48/storm.png",
    "img/powers/48/strength.png",
    "img/powers/48/surrounded.png",
    "img/powers/48/swivel.png",
    "img/powers/48/talk_to_hand.png",
    "img/powers/48/the_bomb.png",
    "img/powers/48/thievery.png",
    "img/powers/48/thorns.png",
    "img/powers/48/thousandCuts.png",
    "img/powers/48/time.png",
    "img/powers/48/tools.png",
    "img/powers/48/unawakened.png",
    "img/powers/48/vigor.png",
    "img/powers/48/vulnerable.png",
    "img/powers/48/wave_of_the_hand.png",
    "img/powers/48/weak.png",
    "img/powers/48/wireheading.png",
    "img/powers/48/wraithForm.png",
    "img/relics/bottled_flame.png",
    "img/relics/bottled_lightning.png",
    "img/relics/bottled_tornado.png",
];
class ImagePreloadQueue {
    constructor(a = 3) {
        (this.nworkers = a), (this.avaliable_workers = a), (this.load_queue = []), (this.preload_queue = []), (this.img_list = []), (this.loaded = []), (this.not_available = []);
    }
    extendPreloadQueue(a) {
        (this.preload_queue = this.preload_queue.concat(a)), this.preloadNext();
    }
    highPriorityLoadImg(a, b, c, ...d) {
        this.load_queue.includes(a) || (this.load_queue.unshift({ url: a, default_url: b, callback: c, args: d }), this.preloadNext());
    }
    lowPriorityLoadImg(a, b, c, ...d) {
        this.load_queue.includes(a) || (this.load_queue.push({ url: a, default_url: b, callback: c, args: d }), this.preloadNext());
    }
    preloadNext() {
        for (let a = this; 0 < this.avaliable_workers; ) {
            let b, c, d, e;
            if (0 < this.load_queue.length) {
                let a = this.load_queue.shift();
                (b = a.url), (e = a.default_url), (c = a.callback), (d = a.args);
            } else 0 < this.preload_queue.length && (b = this.preload_queue.shift());
            if ((b && this.not_available.includes(b) && (e && this.not_available.includes(e) ? (b = null) : ((b = e), (e = null))), !b)) break;
            else if (this.loaded.includes(b)) c && c(b, ...d);
            else {
                this.avaliable_workers -= 1;
                let f = new Image();
                (f.onload = function () {
                    a.avaliable_workers += 1;
                    let e = a.img_list.indexOf(this);
                    -1 !== e && a.img_list.splice(e, 1), c && c(b, ...d), a.loaded.push(b), a.preloadNext();
                }),
                    (f.onerror = function () {
                        a.avaliable_workers += 1;
                        let f = a.img_list.indexOf(this);
                        -1 !== f && a.img_list.splice(f, 1), a.not_available.push(b), a.lowPriorityLoadImg(e, null, c, ...d), a.preloadNext();
                    }),
                    a.img_list.push(f),
                    (f.src = b);
            }
        }
    }
    loadBackgroundCallback(a, b) {
        b.style.backgroundImage = 'url("' + a + '")';
    }
}
