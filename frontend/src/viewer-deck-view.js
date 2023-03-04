var deck_view,
    deck_view_content,
    deck_button,
    deck_button_keybinding_tip,
    last_deck = "",
    deck_view_open = !1,
    deck_view_contents = [],
    deck_view_current_hover_index = null;
const CATEGORY_CARDS = "cards",
    DECK_VIEW_CARD_SCALE = 0.97,
    DECK_VIEW_CARD_WIDTH = CARD_BASE_WIDTH * DECK_VIEW_CARD_SCALE,
    DECK_VIEW_CARD_HEIGHT = CARD_BASE_HEIGHT * DECK_VIEW_CARD_SCALE,
    DECK_VIEW_Y_MARGIN = 0.55,
    DECK_VIEW_X_OFFSET = 13.541,
    DECK_VIEW_Y_OFFSET = 3,
    CARD_HOVER_SCALE = 1.32,
    CARD_TIPS_X_OFFSET = -0.15,
    CARD_TIPS_Y_OFFSET = 0.71,
    DECK_VIEW_SHOW_TIP_STRIP_DELAY = 200,
    DECK_VIEW_CARD_PREVIEW_SCALE = 0.95,
    DECK_VIEW_CARD_PREVIEW_WIDTH = CARD_BASE_WIDTH * DECK_VIEW_CARD_PREVIEW_SCALE,
    DECK_VIEW_CARD_PREVIEW_X_OFFSET = -0.8,
    DECK_VIEW_CARD_PREVIEW_Y_OFFSET = 0.15;
function parseCards(a) {
    array = [];
    for (let b of a) array.push(Card.parseCard(b));
    return array;
}
function decompressDeck(a) {
    return (
        (a = decompress(a)),
        (parts = a.split(";;;")),
        (a = parseCommaDelimitedIntegerArray(parts[0])),
        (cards = parseCards(splitSemicolonDelimited2DArray(parts[1]))),
        (tips = splitSemicolonDelimited2DArray(parts[2])),
        { deck: a, cards: cards, tips: tips }
    );
}
function clickDeck() {
    deck_view_open ? closeDeckView() : openDeckView();
}
function openDeckView() {
    $("#deck_view").css("display", "block"),
        (deck_view_open = !0),
        setTimeout(function () {
            deck_view.focus();
        }, 0);
}
function closeDeckView() {
    $("#deck_view").css("display", "none"), (deck_view_open = !1), deck_view.blur();
}
function initializeDeck() {
    (deck_view = document.getElementById("deck_view")),
        (deck_view.onkeydown = deckViewKeyDown),
        (deck_view_content = document.getElementById("deck_view_content")),
        (deck_button_keybinding_tip = document.getElementById("deck_button_keybinding_tip")),
        (deck_button = document.getElementById("deck_button")),
        (deck_button.onmousedown = clickDeck),
        $("#deck_view_left_bar").mousedown(closeDeckView),
        $("#deck_view_right_bar").mousedown(closeDeckView),
        $("#deck_view_return_btn").click(closeDeckView);
}
function deckViewKeyDown(a) {
    ("KeyQ" == a.code || "KeyD" == a.code) && deck_view_open && (closeDeckView(), a.stopImmediatePropagation());
}
function setDeck(a, b, c, d) {
    if (0 == a.length)
        return (
            clearCollection(CATEGORY_CARDS),
            closeDeckView(),
            (deck_view_current_hover_index = null),
            (deck_view_contents = []),
            (deck_button.style.display = "none"),
            void (show_keybinding_hints && (document.getElementById("deck_button_keybinding_tip").style.display = "none"))
        );
    (deck_button.style.display = "block"), show_keybinding_hints && (document.getElementById("deck_button_keybinding_tip").style.display = "block");
    let e = null;
    deck_view_open && (e = deck_view_content.scrollTop), (deck_view_current_hover_index = null), clearCollection(CATEGORY_CARDS), (deck_view_contents = []);
    for (let e = 0; e < a.length; e++) deck_view_contents.push(null);
    const f = document.getElementById("deck_view_content_wrap");
    (xoffset = (DECK_VIEW_CARD_WIDTH * (1 - DECK_VIEW_CARD_SCALE)) / 2),
        (yoffset = (CARD_BASE_HEIGHT * (1 - DECK_VIEW_CARD_SCALE)) / 2),
        (ncards_row = 5),
        (x = xoffset + DECK_VIEW_X_OFFSET),
        (y = yoffset + DECK_VIEW_Y_OFFSET),
        (bunch_size = 5),
        (bunch = []);
    new Date().getMilliseconds();
    for (let e = 0; e < a.length; e++)
        bunch.push([e, x, y]),
            (bunch.length == bunch_size || e == a.length - 1) &&
                (setTimeout(
                    function (a, b, c, d, e, f) {
                        for (let g = 0; g < a.length; g++) {
                            const h = a[g];
                            createCard(h[0], h[1], h[2], b, c, d, e, f);
                        }
                    },
                    0,
                    bunch,
                    a,
                    b,
                    c,
                    d,
                    f
                ),
                (bunch = [])),
            (x += CARD_BASE_WIDTH),
            e % ncards_row == ncards_row - 1 && e < a.length - 1 && ((x = xoffset + DECK_VIEW_X_OFFSET), (y += CARD_BASE_HEIGHT + DECK_VIEW_Y_MARGIN));
    f.style.height = y + 1.7 * CARD_BASE_HEIGHT + "rem";
    new Date().getMilliseconds();
    null != e && (deck_view_content.scrollTop = e);
}
function createCard(a, b, c, d, e, f, g, h) {
    const i = e[d[a]],
        j = new CardElement(i, g, DECK_VIEW_CARD_WIDTH);
    let k = arraySubset(f, i.keyword_ids);
    (hitbox = { x: b - xoffset + "rem", y: c - yoffset - DECK_VIEW_Y_MARGIN / 2 + "rem", z: 5, w: CARD_BASE_WIDTH + "rem", h: CARD_BASE_HEIGHT + DECK_VIEW_Y_MARGIN + "rem" }), appendChild(h, j), addToCollection(CATEGORY_CARDS, j);
    const l = new PowerTipStrip(h, hitbox, k, CATEGORY_CARDS, g);
    (j.root.style.left = b + "rem"),
        (j.root.style.top = c + "rem"),
        (j.root.id = l.tipsElem.id + "_card"),
        (l.tipsElem.style.zIndex = 5),
        l.hitboxElem.setMagnifyingGlassCursor(),
        (l.hitboxElem.root.onmouseenter = function (b) {
            cardMouseEnter(b, a);
        }),
        (l.hitboxElem.root.onmouseleave = function (b) {
            cardMouseExit(b, a);
        }),
        (l.hitboxElem.root.onclick = function (b) {
            cardClick(b, a);
        });
    for (powertip of l.tipsElem.childNodes) powertip.classList.add("powertip-shadow");
    placeDeckViewTipStrip(j, l);
    let m = null;
    if (-1 != i.card_to_preview) {
        const a = e[i.card_to_preview];
        (m = new CardElement(a, g, DECK_VIEW_CARD_PREVIEW_WIDTH)), (m.root.style.display = "none"), (m.root.style.zIndex = 5), m.setShadowDrop(!0), placeCardPreview(j, m), appendChild(h, m), addToCollection(CATEGORY_CARDS, m);
    }
    deck_view_contents[a] = { cardElem: j, tipsElem: l.tipsElem, cardPreviewElem: m, cardPos: { x: b, y: c } };
}
function cardClick(a, b) {
    openCardView(b), a.stopPropagation();
}
function cardMouseEnter(a, b) {
    deck_view_current_hover_index = b;
    const c = deck_view_contents[b].cardElem,
        d = deck_view_contents[b].cardPos;
    (c.root.style.left = d.x - (DECK_VIEW_CARD_WIDTH * (CARD_HOVER_SCALE - 1)) / 2 + "rem"),
        (c.root.style.top = d.y - (DECK_VIEW_CARD_HEIGHT * (CARD_HOVER_SCALE - 1)) / 2 + "rem"),
        (c.root.style.zIndex = 4),
        c.setShadowDrop(!0),
        c.setShadowBlur(!0),
        c.setWidth(DECK_VIEW_CARD_WIDTH * CARD_HOVER_SCALE),
        setTimeout(showCardTipStripAndPreview, DECK_VIEW_SHOW_TIP_STRIP_DELAY, b);
}
function showCardTipStripAndPreview(a) {
    if (deck_view_current_hover_index == a) {
        const b = deck_view_contents[a].tipsElem;
        b.style.display = "block";
        const c = deck_view_contents[a].cardPreviewElem;
        c && (c.root.style.display = "block");
    }
}
function cardMouseExit(a, b) {
    deck_view_current_hover_index == b && (deck_view_current_hover_index = null);
    const c = deck_view_contents[b].tipsElem,
        d = deck_view_contents[b].cardElem,
        e = deck_view_contents[b].cardPos,
        f = deck_view_contents[b].cardPreviewElem;
    (d.root.style.left = e.x + "rem"),
        (d.root.style.top = e.y + "rem"),
        (d.root.style.zIndex = 1),
        d.setShadowDrop(!1),
        d.setShadowBlur(!1),
        d.setWidth(DECK_VIEW_CARD_WIDTH),
        (c.style.display = "none"),
        f && (f.root.style.display = "none");
}
function placeDeckViewTipStrip(a, b) {
    let c = parseRem(a.root.style.left),
        d = parseRem(a.root.style.top),
        e = (DECK_VIEW_CARD_WIDTH * (CARD_HOVER_SCALE - 1)) / 2;
    (b.tipsElem.style.top = d - (DECK_VIEW_CARD_HEIGHT * (CARD_HOVER_SCALE - 1)) / 2 + CARD_TIPS_Y_OFFSET + "rem"),
        (b.tipsElem.style.left = 55 > c ? c + DECK_VIEW_CARD_WIDTH + e + CARD_TIPS_X_OFFSET + "rem" : c - e - CARD_TIPS_X_OFFSET - POWERTIP_WIDTH_REM + "rem");
}
function placeCardPreview(a, b) {
    let c = parseRem(a.root.style.left),
        d = parseRem(a.root.style.top),
        e = (DECK_VIEW_CARD_WIDTH * (CARD_HOVER_SCALE - 1)) / 2;
    (b.root.style.top = d - (DECK_VIEW_CARD_HEIGHT * (CARD_HOVER_SCALE - 1)) / 2 + DECK_VIEW_CARD_PREVIEW_Y_OFFSET + "rem"),
        (b.root.style.left = 55 < c ? c + DECK_VIEW_CARD_WIDTH + e + DECK_VIEW_CARD_PREVIEW_X_OFFSET + "rem" : c - e - DECK_VIEW_CARD_PREVIEW_X_OFFSET - DECK_VIEW_CARD_PREVIEW_WIDTH + "rem");
}

