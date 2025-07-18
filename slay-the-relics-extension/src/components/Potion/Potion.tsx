import { PowerTipStrip, Tip } from "../Tip/Tip";
import { LocalizationContext, Potions } from "../Localization/Localization";
import { useContext } from "react";

const potionX = 33.3; // should come from the game PotionX / Settings.Width * 100
const POTION_HITBOX_WIDTH = 2.916; // %

function getPotionTips(
  potion: string,
  hasBark: boolean,
  potionsLoc: Potions,
): Tip[] {
  const potionLoc = potionsLoc[potion || "Potion Slot"];
  if (!potionLoc) {
    return [new Tip(potion, "unknown potion", null)];
  }

  let description = potionLoc.DESCRIPTIONS[0];
  if (hasBark && potionLoc.DESCRIPTIONS.length > 1) {
    description = potionLoc.DESCRIPTIONS[1];
  }

  return [new Tip(potionLoc.NAME, description, null)];
}

export default function PotionBar(props: {
  character: string;
  potions: string[];
  relics: string[];
}) {
  const hasBark =
    props.relics.includes("Sacred Bark") || props.relics.includes("SacredBark");
  const potionsLoc = useContext(LocalizationContext).potions;
  return (
    <div>
      {props.potions.map((potion, i) => {
        return (
          <PowerTipStrip
            place={"bottom-start"}
            character={props.character}
            key={"potion-" + i}
            magGlass={false}
            hitbox={{
              x: `${potionX - POTION_HITBOX_WIDTH / 2 + i * POTION_HITBOX_WIDTH}%`,
              y: "0%",
              z: 1,
              w: "2.916%",
              h: "5.556%",
            }}
            tips={getPotionTips(potion, hasBark, potionsLoc)}
          />
        );
      })}
    </div>
  );
}
