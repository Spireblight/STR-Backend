var items,
    show_hints,
    twitch = window.Twitch.ext,
    current_tooltip_id = "",
    current_tooltip_category = null,
    last_broadcast_secs = new Date() / 1e3,
    latency = 0,
    show_keybinding_hints = !1;
const MSG_TYPE_SET_TIPS = 1,
    MSG_TYPE_SET_DECK = 4,
    SECS_NOBROADCAST_REMOVE_CONTENT = 5;

function processMessage(a) {
    var b = a[1],
        c = a[2];
    if (b == MSG_TYPE_SET_TIPS) {
        var d = sanitizeCharacter(c.c),
            e = decompressPowerTips(c.w);
        setRelics(c.r, e, d), setPotions(c.o, e, d), setPlayerPowers(c.p, e, d), setMonsterPowers(c.m, e, d), setCustomTips(c.u, e, d);
    } else if (b == MSG_TYPE_SET_DECK) {
        var d = sanitizeCharacter(c.c),
            f = decompressDeck(c.k);
        c.k != last_deck && ((last_deck = c.k), setDeck(f.deck, f.cards, f.tips, d), setCardView(f.deck, f.cards, f.tips, d));
    } else console.log("unrecognized msg_type: " + b);
}

function showPowerTipStrip(a, b, c) {
    (current_tooltip_id = b), (current_tooltip_category = c), movePowerTipStrip(a), (document.getElementById(b).style.display = "block");
}

function hidePowerTipStrip(a, b) {
    (current_tooltip_id = null), (current_tooltip_category = null), (document.getElementById(b).style.display = "none");
}

function showPowerTipMulticol(a, b, c) {
    (current_tooltip_id = b), (current_tooltip_category = c), (document.getElementById(b).style.display = "block");
}

function hidePowerTipMulticol(a, b) {
    (current_tooltip_id = null), (current_tooltip_category = null), (document.getElementById(b).style.display = "none");
}

function movePowerTipStrip(a) {
    if (null != current_tooltip_id && current_tooltip_category == CATEGORY_RELICS) {
        var b = items.offsetWidth,
            c = b / 1920,
            d = a.pageX + 52 * c,
            e = a.pageY + 7 * c,
            f = ((MAX_RIGHT - POWERTIP_WIDTH) / 100) * b;
        d > f && ((d = a.pageX - 36 * c - (POWERTIP_WIDTH / 100) * b), (e = a.pageY + 7 * c)), $("#" + current_tooltip_id).css({
            left: d + "px",
            top: e + "px"
        });
    } else if (null != current_tooltip_id && current_tooltip_category == CATEGORY_POTIONS) {
        var b = items.offsetWidth,
            c = b / 1920,
            d = a.pageX - ((POWERTIP_WIDTH_REM * REM_PX) / 2 - 17) * c,
            e = 89 * c;
        $("#" + current_tooltip_id).css({left: d + "px", top: e + "px"});
    }
}

function checkIfSourceActive() {
    var a = new Date() / 1e3;
    if (a - last_broadcast_secs > SECS_NOBROADCAST_REMOVE_CONTENT) {
        let a = [0, 1, {c: "", r: [0, []], o: [0, []], w: "||"}];
        processMessage(a), (a = [0, 4, {c: "", k: "||-;;;-;;;-"}]), processMessage(a);
    }
}

function testingMessage() {
    (msg = [0, 1, {
        c: "",
        r: [0, []],
        o: [0, []],
        u: [[20, 20, 20, 20, [0]]],
        w: "||This is a Tip;#yHey there how  are you? NL NL NL TAB this is a tab test NL TAB TAB double NL TAB a TAB a"
    }]), processMessage(msg);
}

(current_message_parts = []), (current_update_id = null);

function receiveBroadcast(a) {
    a = JSON.parse(a);
    let messagePartNum = a[0],
        messagePartCount = a[1],
        updateID = a[2],
        messagePart = a[3];

    0 == current_message_parts.length ? 0 == messagePartNum && pushContent(updateID, messagePart, messagePartCount) : updateID == current_update_id ? messagePartNum == current_message_parts.length && pushContent(updateID, messagePart, messagePartCount) : 0 == messagePartNum && ((current_message_parts = []), pushContent(updateID, messagePart, messagePartCount));

    // if (current_message_parts.length == 0 && messagePartNum == 0) {
    //     pushContent(updateID, messagePart, messagePartCount)
    // } else if (current_update_id == updateID && current_message_parts.length == messagePartNum) {
    //     pushContent(updateID, messagePart, messagePartCount)
    // } else if (messagePartNum == 0) {
    //     current_message_parts = []
    //     pushContent(updateID, messagePart, messagePartCount)
    // }
}

function pushContent(updateID, messagePart, messagePartCount) {
    var d = Math.ceil;
    if (
        (
            (current_update_id = updateID),
            current_message_parts.push(messagePart),
            messagePartCount == current_message_parts.length
        )
    ) {
        let a = "";
        for (var e of current_message_parts) a += e;



        // let b = LZString.decompressFromEncodedURIComponent(a);
        let b = a;



        b = JSON.parse(b);
        d(b[0] + 1e3 * latency);
        processMessage(b), (current_message_parts = []), (current_update_id = null);
    }
}

function preloadNextImageBunch() {
    let a = [],
        b = preload_workers_available;
    for (let c = image_preload_index; c < image_preload_index + b && c < PRELOAD_IMAGES.length; c++) a.push(PRELOAD_IMAGES[c]);
    (image_preload_index += b), preloadImages(a), image_preload_index < PRELOAD_IMAGES.length && window.setTimeout(preloadNextImageBunch, PRELOAD_INTERVAL);
}

$(function () {
    window.Twitch.ext.onContext((a) => {
        a.hlsLatencyBroadcaster && (latency = a.hlsLatencyBroadcaster);
    }),
        twitch.listen("broadcast", function (a, b, c) {
            receiveBroadcast(c), (last_broadcast_secs = new Date() / 1e3);
        }),
        (items = document.getElementById("items")),
        (body = document.getElementsByTagName("body")[0]),
        (btn = document.getElementById("deck_button")),
        (temp_card_title = document.getElementById("temp_card_title")),
        (temp_card_description = document.getElementById("temp_card_description")),
        (show_hints = document.getElementById("keybinding_hints_checkbox")),
        $("#items").on("mousemove", movePowerTipStrip),
        (body.onmouseenter = function () {
            btn.classList.add("button-border");
        }),
        (body.onmouseleave = function () {
            deck_view_open || btn.classList.remove("button-border");
        }),
        (show_hints.onclick = function () {
            if (((show_keybinding_hints = !show_keybinding_hints), show_keybinding_hints)) {
                (show_hints.style.backgroundImage = "url(img/ui/checkbox_checked.png)"), (tips = document.getElementsByClassName("keybinding-tip"));
                for (let a of tips) a.style.display = "block";
            } else {
                (show_hints.style.backgroundImage = "url(img/ui/checkbox_unchecked.png)"), (tips = document.getElementsByClassName("keybinding-tip"));
                for (let a of tips) a.style.display = "none";
            }
        }),
        window.setInterval(checkIfSourceActive, 2500),
        (imagePreloadQueue = new ImagePreloadQueue(MAX_CONCURRENT_PRELOADS)),
        imagePreloadQueue.extendPreloadQueue(PRELOAD_IMAGES),
        initializeDeck(),
        initializeCardView(),
        (document.body.onkeydown = function (a) {
            "KeyD" == a.code && 0 < deck_view_contents.length && openDeckView();
        }),
        window.Twitch.ext.onError(function (a) {
            console.log("error"), error(a);
        });
});

