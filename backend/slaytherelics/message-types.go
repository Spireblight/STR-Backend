package slaytherelics

// RequestMessage message format for incoming messages from the Java mod. Tags are used for JSON encoding, not decoding
// Mod ref - https://github.com/Spireblight/STR-Spire-Mod/blob/main/src/main/java/str_exporter/builders/JSONMessageBuilder.java
type PubSubMessage struct {
	MessageType    MessageType    `json:"msg_type"`
	Metadata       map[string]any `json:"meta"` // keeping as map as this can include stuff other than version that we would want to forward
	Delay          int            `json:"delay"`
	MessageContent interface{}    `json:"message"` // keep interface so that we can still pass through the message as is without having to implement type for it
}

// MessageType type of message being received from the Java mod (as JSON).
// Mod ref - https://github.com/Spireblight/STR-Spire-Mod/blob/17f3cc9fa79c01444f62201bd7901861c913ff9e/src/main/java/str_exporter/builders/JSONMessageBuilder.java#L18
type MessageType int

const (
	_               MessageType = iota
	MessageTypeTips             // 1 - tooltips for relics, potions, cards, etc. Mod ref - https://github.com/Spireblight/STR-Spire-Mod/blob/17f3cc9fa79c01444f62201bd7901861c913ff9e/src/main/java/str_exporter/builders/TipsJSONBuilder.java#L42
	_
	_
	MessageTypeDeck // 4 - deck card info for the overlay. Mod ref - https://github.com/Spireblight/STR-Spire-Mod/blob/17f3cc9fa79c01444f62201bd7901861c913ff9e/src/main/java/str_exporter/builders/DeckJSONBuilder.java#L33
	MessageTypeOK   // 5 - basically our keep-alive message. Mod ref - https://github.com/Spireblight/STR-Spire-Mod/blob/17f3cc9fa79c01444f62201bd7901861c913ff9e/src/main/java/str_exporter/SlayTheRelicsExporter.java#L114
)

// MessageContentUnknown placeholder for unknown message content type
type MessageContentUnknown interface{}

// MessageContentDeck message content structure for MessageTypeDeck
type MessageContentDeck struct {
}
