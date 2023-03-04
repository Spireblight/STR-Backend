var last_relics = "",
    last_relics_tips = "",
    last_potions = "",
    last_potion_tips = "",
    last_player_powers = "",
    last_player_power_tips = "",
    last_monster_powers_list = "",
    last_monster_powers_list_tips = "",
    last_custom_tips_list = "",
    last_custom_tips_list_tips = "";
const MAX_DISPLAY_RELICS = 25,
    MAX_RIGHT = 99,
    MAX_BOTTOM = 98,
    MIN_TOP = 2,
    CHARACTER_POWERS_OFFSET_R = 1.0416,
    CHARACTER_POWERS_OFFSET_L = -2.917,
    CHARACTER_HEALTHBAR_HEIGHT = 6.666,
    CATEGORY_RELICS = "relics",
    CATEGORY_POTIONS = "potions",
    CATEGORY_PLAYER_POWERS = "player_powers",
    CATEGORY_MONSTER_POWERS = "monster_powers",
    CATEGORY_CUSTOM_TIPS = "custom_tips";
function decompressPowerTips(a) {
    return splitSemicolonDelimited2DArray(decompress(a));
}
function setRelics(a, b, c) {
    if (a) {
        var d = [];
        for (let b = 1; b < a[1].length; b++) d = d.concat(a[1][b]);
        if (((power_tips_subset = arraySubset(b, d)), JSON.stringify(a) == last_relics && JSON.stringify(power_tips_subset) == last_relics_tips)) return;
    }
    (last_relics = JSON.stringify(a)),
        (last_relics_tips = JSON.stringify(power_tips_subset)),
        (is_relics_multipage = a[0]),
        current_tooltip_id && current_tooltip_category == CATEGORY_RELICS && ((current_tooltip_id = null), (current_tooltip_category = null)),
        clearCollection(CATEGORY_RELICS);
    for (let d = 0; d < a[1].length; d++) {
        const e = arraySubset(b, a[1][d]),
            f = { x: RELIC_HITBOX_LEFT + d * RELIC_HITBOX_WIDTH + is_relics_multipage * RELIC_HITBOX_MULTIPAGE_OFFSET + "%", y: "6.111%", z: 1, w: "3.75%", h: "8.666%" };
        (strip = new PowerTipStrip(items, f, e, CATEGORY_RELICS, c)), strip.hitboxElem.setMagnifyingGlassCursor();
    }
}
function setPotions(a, b, c) {
    if (a) {
        var d = [];
        for (let b = 1; b < a[1].length; b++) d = d.concat(a[1][b]);
        if (((power_tips_subset = arraySubset(b, d)), JSON.stringify(a) == last_potions && JSON.stringify(power_tips_subset) == last_potion_tips)) return;
    }
    current_tooltip_id && current_tooltip_category == CATEGORY_POTIONS && ((current_tooltip_id = null), (current_tooltip_category = null)),
        (last_potions = JSON.stringify(a)),
        (last_potion_tips = JSON.stringify(power_tips_subset)),
        clearCollection(CATEGORY_POTIONS);
    var e = 100 * (a[0] / 1920);
    for (let d = 0; d < a[1].length; d++) {
        let f = arraySubset(b, a[1][d]),
            g = { x: e - POTION_HITBOX_WIDTH / 2 + d * POTION_HITBOX_WIDTH + "%", y: "0%", z: 1, w: "2.916%", h: "5.556%" },
            h = new PowerTipStrip(items, g, f, CATEGORY_POTIONS, c);
        h.tipsElem.style.zIndex = 15;
    }
}
function setPlayerPowers(a, b, c) {
    if (
        !(a && ((power_tips_subset = arraySubset(b, a[4])), JSON.stringify(a) == last_player_powers && JSON.stringify(power_tips_subset) == last_player_power_tips)) &&
        (current_tooltip_id && current_tooltip_category == CATEGORY_PLAYER_POWERS && ((current_tooltip_id = null), (current_tooltip_category = null)),
        (last_player_powers = JSON.stringify(a)),
        (last_player_power_tips = JSON.stringify(power_tips_subset)),
        clearCollection(CATEGORY_PLAYER_POWERS),
        a)
    ) {
        let d = { x: a[0] + "%", y: a[1] + "%", z: 2, w: a[2] + "%", h: a[3] + "%" },
            e = arraySubset(b, a[4]),
            f = new PowerTipBlock(items, d, e, CATEGORY_PLAYER_POWERS, c);
        placePowerTipBlockTips(d, f, !0);
    }
}
function setMonsterPowers(a, b, c) {
    if (a) {
        var d = [];
        for (const b of a) d = d.concat(b[4]);
        if (((power_tips_subset = arraySubset(b, d)), JSON.stringify(a) == last_monster_powers_list && JSON.stringify(power_tips_subset) == last_monster_powers_list_tips)) return;
    }
    if (
        (current_tooltip_id && current_tooltip_category == CATEGORY_MONSTER_POWERS && ((current_tooltip_id = null), (current_tooltip_category = null)),
        (last_monster_powers_list = JSON.stringify(a)),
        (last_monster_powers_list_tips = JSON.stringify(power_tips_subset)),
        clearCollection(CATEGORY_MONSTER_POWERS),
        a)
    )
        for (let d = 0; d < a.length; d++) {
            const e = a[d];
            let f = { x: e[0] + "%", y: e[1] + "%", z: 2, w: e[2] + "%", h: e[3] + "%" },
                g = arraySubset(b, e[4]),
                h = new PowerTipBlock(items, f, g, CATEGORY_MONSTER_POWERS, c);
            placePowerTipBlockTips(f, h, !0);
        }
}
function setCustomTips(a, b, c) {
    if (a) {
        var d = [];
        for (const b of a) d = d.concat(b[4]);
        if (((power_tips_subset = arraySubset(b, d)), JSON.stringify(a) == last_custom_tips_list && JSON.stringify(power_tips_subset) == last_custom_tips_list_tips)) return;
    }
    if (
        (current_tooltip_id && current_tooltip_category == CATEGORY_MONSTER_POWERS && ((current_tooltip_id = null), (current_tooltip_category = null)),
        (last_custom_tips_list = JSON.stringify(a)),
        (last_custom_tips_list_tips = JSON.stringify(power_tips_subset)),
        clearCollection(CATEGORY_CUSTOM_TIPS),
        a)
    )
        for (let d = 0; d < a.length; d++) {
            const e = a[d];
            let f = { x: e[0] + "%", y: e[1] + "%", z: 3, w: e[2] + "%", h: e[3] + "%" },
                g = arraySubset(b, e[4]),
                h = new PowerTipBlock(items, f, g, CATEGORY_CUSTOM_TIPS, c);
            placePowerTipBlockTips(f, h, !1);
        }
}
function placePowerTipBlockTips(a, b, c) {
    var d = Math.abs,
        e = parsePercentage(a.x),
        f = parsePercentage(a.y),
        g = parsePercentage(a.w),
        i = parsePercentage(a.h),
        h = parsePercentage(b.tipsElem.style.height),
        j = parsePercentage(b.tipsElem.style.width),
        k = e + g + CHARACTER_POWERS_OFFSET_R,
        l = e + CHARACTER_POWERS_OFFSET_L - j,
        m = 0;
    if (!(k + j > MAX_RIGHT)) m = 80.416 > e + g ? k : l;
    else if (0 <= l) m = l;
    else {
        var n = d(l),
            o = d(k + j - 100);
        m = n > o ? k : l;
    }
    if (c) var p = f + (i - CHARACTER_HEALTHBAR_HEIGHT) / 2 - 0.98 * (((f + (i - CHARACTER_HEALTHBAR_HEIGHT)) / 100) * h) + 12 / 2.65;
    else var p = f + i / 2 - h / 2;
    p + h > MAX_BOTTOM && (p = MAX_BOTTOM - h), p < MIN_TOP && (p = MIN_TOP), (b.tipsElem.style.left = m + "%"), (b.tipsElem.style.top = p + "%");
}

