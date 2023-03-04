var card_view,
    card_view_tips_box,
    card_upgrade_checkbox,
    card_view_prev_btn,
    card_view_next_btn,
    placeholder,
    card_view_open = !1,
    card_upgrade_checked = !1,
    view_cards = [],
    view_cards_upgraded = [],
    current_card_view_id = null,
    current_card_index = null;
const CATEGORY_CARD_VIEW = "card_view",
    CARD_VIEW_CARD_WIDTH = 31.388;
function initializeCardView() {
    (card_view = document.getElementById("card_view")),
        (card_view_tips_box = document.getElementById("card_view_tips_box")),
        (card_upgrade_checkbox = document.getElementById("card_view_checkbox")),
        (card_view_prev_btn = document.getElementById("card_view_prev_btn")),
        (card_view_next_btn = document.getElementById("card_view_next_btn")),
        (placeholder = new PlaceholderElement()),
        (card_view.onclick = closeCardView),
        (card_view.onkeydown = cardViewKeyDown),
        (card_view_prev_btn.onclick = previousCard),
        (card_view_next_btn.onclick = nextCard),
        (card_upgrade_checkbox.onclick = clickUpgradeCheckbox),
        (card_view_prev_btn.onkeydown = cardViewKeyDown),
        (card_view_next_btn.onkeydown = cardViewKeyDown),
        (card_upgrade_checkbox.onkeydown = cardViewKeyDown);
}
function cardViewKeyDown(a) {
    a.stopImmediatePropagation(),
        ("ArrowLeft" == a.code || "KeyA" == a.code) && 0 < current_card_index && previousCard(a),
        ("ArrowRight" == a.code || "KeyD" == a.code) && current_card_index < view_cards.length - 1 && nextCard(a),
        "KeyQ" == a.code && closeCardView(),
        "KeyU" == a.code && clickUpgradeCheckbox(a);
}
function clickUpgradeCheckbox(a) {
    a.stopImmediatePropagation(), (card_upgrade_checked = !card_upgrade_checked), updateUpgradeCheckbox(), showCard(current_card_index);
}
function updateUpgradeCheckbox() {
    card_upgrade_checked
        ? (card_upgrade_checkbox.classList.remove("card-view-checkbox-unchecked"), card_upgrade_checkbox.classList.add("card-view-checkbox-checked"))
        : (card_upgrade_checkbox.classList.remove("card-view-checkbox-checked"), card_upgrade_checkbox.classList.add("card-view-checkbox-unchecked"));
}
function resetCards(a) {
    (view_cards = []), (view_cards_upgraded = []);
    for (let b = 0; b < a; b++) view_cards.push(null), view_cards_upgraded.push(null);
}
function printCollection(a) {
    if (a in collections) {
        console.log("category " + a);
        for (let b = 0; b < collections[a].length; b++) {
            const c = collections[a][b];
            console.log("element ", c), console.log("parent ", c.parentNode);
        }
    } else console.log("category " + a + " not in collections");
}
function setCardView(a, b, c, d) {
    clearCollection(CATEGORY_CARD_VIEW), resetCards();
    let e = [];
    for (let f = 0; f < a.length; f++)
        e.push([f]),
            (e.length == 5 || f == a.length - 1) &&
                (setTimeout(
                    function (a, b, c, d, e) {
                        for (let f = 0; f < a.length; f++) {
                            const g = a[f];
                            addCard(g[0], b, c, d, e);
                        }
                    },
                    0,
                    e,
                    a,
                    b,
                    c,
                    d
                ),
                (e = []));
    displayAfterUpdate();
}
function addCard(a, b, c, d, e) {
    let f = c[b[a]];
    (view_cards[a] = createCardView(f, c, d, e)), (view_cards_upgraded[a] = null == f.upgraded_version ? null : createCardView(f.upgraded_version, c, d, e));
}
function createCardView(a, b, c, d) {
    const e = new CardElement(a, d, CARD_VIEW_CARD_WIDTH, !0, !0, !1, !0);
    (hitbox = { x: "0.1rem", y: "0.1rem", z: 0, w: "0.1rem", h: "0.1rem" }), appendChild(card_view, e), addToCollection(CATEGORY_CARD_VIEW, e);
    let f = arraySubset(c, a.keyword_ids);
    const g = new PowerTipStrip(card_view_tips_box, hitbox, f, CATEGORY_CARD_VIEW, d);
    (e.root.style.left = "32.343%"),
        (e.root.style.top = "7.537%"),
        (e.root.style.display = "none"),
        (e.root.onclick = function (a) {
            a.stopPropagation();
        }),
        (g.tipsElem.style.zIndex = 5),
        (g.tipsElem.style.left = "0%"),
        (g.tipsElem.style.top = "0%");
    let h;
    if (-1 != a.card_to_preview) {
        const c = b[a.card_to_preview];
        (h = new CardElement(c, d, DECK_VIEW_CARD_PREVIEW_WIDTH)),
            (h.root.style.display = "none"),
            (h.root.style.zIndex = 5),
            (h.root.style.left = "19.029%"),
            (h.root.style.top = "9.122%"),
            appendChild(card_view, h),
            addToCollection(CATEGORY_CARD_VIEW, h);
    } else h = placeholder;
    let i;
    return (
        null == a.mod_name
            ? (i = placeholder)
            : ((i = new PowerTipElement("What mod is this from?", a.mod_name)),
              (i.root.style.display = "none"),
              (i.root.style.zIndex = 5),
              i.root.classList.add("card-view-what-mod-tip"),
              appendChild(card_view, i),
              addToCollection(CATEGORY_CARD_VIEW, i)),
        { cardElem: e, tipsElem: g.tipsElem, cardPreviewElem: h, modNameTipElem: i }
    );
}
function displayAfterUpdate() {
    card_view_open && (current_card_index < view_cards.length ? showCard(current_card_index) : 0 < view_cards.length ? showCard(view_cards.length - 1) : closeCardView());
}
const BTN_ANIMATION_TIMEOUT = 50;
function previousCardBtnAnimation() {
    card_view_prev_btn.classList.remove("card-view-prev-btn-pressed1"),
        card_view_prev_btn.classList.remove("card-view-prev-btn-pressed2"),
        card_view_prev_btn.classList.add("card-view-prev-btn-pressed1"),
        setTimeout(function () {
            card_view_prev_btn.classList.remove("card-view-prev-btn-pressed1"),
                card_view_prev_btn.classList.add("card-view-prev-btn-pressed2"),
                setTimeout(function () {
                    card_view_prev_btn.classList.remove("card-view-prev-btn-pressed2");
                }, BTN_ANIMATION_TIMEOUT);
        }, BTN_ANIMATION_TIMEOUT);
}
function nextCardBtnAnimation() {
    card_view_next_btn.classList.remove("card-view-next-btn-pressed1"),
        card_view_next_btn.classList.remove("card-view-next-btn-pressed2"),
        card_view_next_btn.classList.add("card-view-next-btn-pressed1"),
        setTimeout(function () {
            card_view_next_btn.classList.remove("card-view-next-btn-pressed1"),
                card_view_next_btn.classList.add("card-view-next-btn-pressed2"),
                setTimeout(function () {
                    card_view_next_btn.classList.remove("card-view-next-btn-pressed2");
                }, BTN_ANIMATION_TIMEOUT);
        }, BTN_ANIMATION_TIMEOUT);
}
function previousCard(a) {
    a.stopImmediatePropagation(), showCard(current_card_index - 1), previousCardBtnAnimation();
}
function nextCard(a) {
    a.stopImmediatePropagation(), showCard(current_card_index + 1), nextCardBtnAnimation();
}
function openCardView(a) {
    setTimeout(function () {
        card_view.focus();
    }, 0),
        (card_upgrade_checked = !1),
        (card_view_open = !0),
        (card_view.style.display = "block"),
        updateUpgradeCheckbox(),
        showCard(a);
}
function showCard(a) {
    let b;
    (b = card_upgrade_checked && null != view_cards_upgraded[a] ? view_cards_upgraded[a] : view_cards[a]),
        hideCurrentCard(),
        (b.cardElem.root.style.display = "block"),
        (b.tipsElem.style.display = "block"),
        (b.cardPreviewElem.root.style.display = "block"),
        (b.modNameTipElem.root.style.display = "block"),
        (card_upgrade_checkbox.style.display = null == view_cards_upgraded[a] ? "none" : "block"),
        (card_view_prev_btn.style.display = 0 == a ? "none" : "block"),
        (card_view_next_btn.style.display = a == view_cards.length - 1 ? "none" : "block"),
        (current_card_index = a);
}
function hideCurrentCard() {
    if (null == current_card_index || current_card_index >= view_cards.length) return;
    let a = view_cards[current_card_index];
    (a.cardElem.root.style.display = "none"),
        (a.tipsElem.style.display = "none"),
        (a.cardPreviewElem.root.style.display = "none"),
        (a.modNameTipElem.root.style.display = "none"),
        (a = view_cards_upgraded[current_card_index]),
        null != a && ((a.cardElem.root.style.display = "none"), (a.tipsElem.style.display = "none"), (a.cardPreviewElem.root.style.display = "none"), (a.modNameTipElem.root.style.display = "none")),
        (current_card_index = null);
}
function closeCardView() {
    (card_view.style.display = "none"),
        (card_view_open = !0),
        card_view.blur(),
        setTimeout(function () {
            deck_view.focus();
        }, 0);
}
