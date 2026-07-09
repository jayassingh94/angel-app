// Static Vastu Remedy content
// No API required — plain lookup by room + direction.
// Usage: import { vastuRemedies } from './vastuRemedies';
//        const result = vastuRemedies.mainDoor['South'];

export const vastuRemedies = {
  mainDoor: {
    North: {
      status: "favorable",
      note: "North-facing main doors are considered auspicious, associated with wealth and steady opportunity.",
      remedy: "No correction needed. Keep the entrance well-lit and clutter-free to support the natural energy of this direction."
    },
    Northeast: {
      status: "favorable",
      note: "Northeast is considered the most auspicious direction for a main entrance, linked to clarity and growth.",
      remedy: "No correction needed. Keep this area especially clean and avoid storing shoes, footwear racks, or waste bins directly at this entrance."
    },
    East: {
      status: "favorable",
      note: "East-facing doors are associated with new beginnings and vitality, welcoming the morning sun.",
      remedy: "No correction needed. A small plant or tulsi near the entrance is traditionally considered supportive here."
    },
    West: {
      status: "neutral",
      note: "West-facing doors are considered workable, generally linked to gains through effort and consistency.",
      remedy: "Keep the entrance well-lit, especially in the evening, and ensure the door opens smoothly without obstruction."
    },
    Northwest: {
      status: "neutral",
      note: "Northwest-facing doors are associated with support from others and networking, though considered slightly less stable than North or East.",
      remedy: "Hanging a small wind chime near the entrance is a traditional remedy said to keep energy moving through this direction."
    },
    South: {
      status: "needs attention",
      note: "South-facing doors are traditionally considered more challenging, associated with obstacles if left unaddressed.",
      remedy: "A common remedy is placing a small mirror facing outward on the door frame, and ensuring bright, warm lighting at the entrance. Some also recommend a threshold of a different, lighter color than the rest of the door."
    },
    Southwest: {
      status: "needs attention",
      note: "Southwest-facing main doors are traditionally considered one of the more difficult placements, linked to instability if unaddressed.",
      remedy: "A frequently suggested remedy is placing a heavy, sturdy object (like a stone planter) near the entrance to 'ground' the direction, along with keeping this area especially well-maintained and free of damage or leaks."
    },
    Southeast: {
      status: "needs attention",
      note: "Southeast is governed by the fire element, and a main door here is traditionally considered less settling for a household's overall energy.",
      remedy: "A small red or orange decorative element near the entrance (a lamp, a painted accent) is a traditional way to work with this direction's fire energy rather than against it."
    }
  },

  kitchen: {
    Southeast: {
      status: "favorable",
      note: "Southeast is considered the ideal kitchen placement, aligned with the fire element governing cooking.",
      remedy: "No correction needed. Cooking while facing east is traditionally considered an added benefit."
    },
    Northwest: {
      status: "favorable",
      note: "Northwest is considered a workable secondary placement for kitchens.",
      remedy: "No correction needed. Keep the stove positioned so the cook faces east while cooking, if possible."
    },
    East: {
      status: "neutral",
      note: "East-facing kitchens are generally considered acceptable, though not the traditional ideal.",
      remedy: "Good ventilation and natural light are especially recommended here to support this placement."
    },
    South: {
      status: "neutral",
      note: "A south-positioned kitchen is workable but not the classical preference.",
      remedy: "Keeping the stove away from the exact southwest corner within the kitchen is a common adjustment within this space."
    },
    North: {
      status: "needs attention",
      note: "North is traditionally considered a less ideal direction for a kitchen, as it's associated with the water element, which is thought to conflict with the kitchen's fire energy.",
      remedy: "A common remedy is placing a small yellow or citrine-colored object (a bowl, cloth, or tile accent) in the kitchen to balance the elemental mismatch, and ensuring the stove itself doesn't sit exactly on the north wall."
    },
    Northeast: {
      status: "needs attention",
      note: "Northeast is one of the most commonly flagged kitchen placements in Vastu, since this direction is considered spiritually sensitive and not well-suited to the fire element.",
      remedy: "If relocating isn't possible, a frequently suggested remedy is placing the stove as far from the exact northeast corner as the room allows, and keeping this corner of the kitchen especially clean, light, and clutter-free."
    },
    Southwest: {
      status: "needs attention",
      note: "Southwest is considered one of the more difficult kitchen placements, linked to the stability/earth element that traditionally sits at odds with the kitchen's fire energy.",
      remedy: "A common remedy is adding brighter lighting and warm colors (red, orange) within the kitchen to actively bring in fire energy that the direction otherwise lacks."
    },
    West: {
      status: "neutral",
      note: "West is generally considered workable for a kitchen, without strong traditional preference either way.",
      remedy: "Standard kitchen hygiene and ventilation practices are the main consideration here — no specific correction typically needed."
    }
  },

  bedroom: {
    Southwest: {
      status: "favorable",
      note: "Southwest is considered the most stable and grounding direction for a main bedroom, associated with restful sleep and steady relationships.",
      remedy: "No correction needed. Sleeping with the head toward the south or west is traditionally considered supportive in this placement."
    },
    South: {
      status: "favorable",
      note: "South-facing bedrooms are generally considered good for rest and stability.",
      remedy: "No correction needed."
    },
    West: {
      status: "neutral",
      note: "West is considered a workable bedroom placement, associated with gains and steady progress.",
      remedy: "No specific correction typically needed — standard good sleep hygiene applies."
    },
    Northwest: {
      status: "neutral",
      note: "Northwest bedrooms are traditionally linked to restlessness or a more transient feeling, though not considered strongly negative.",
      remedy: "If sleep feels unsettled, a heavier, more grounding color palette in the room's decor is a commonly suggested adjustment."
    },
    Northeast: {
      status: "needs attention",
      note: "Northeast is traditionally considered too spiritually 'active' a direction for restful sleep, and a main bedroom here is a commonly flagged placement.",
      remedy: "A frequently suggested remedy is positioning the bed away from the exact northeast corner of the room, and keeping this corner clutter-free and calm rather than used for storage."
    },
    Southeast: {
      status: "needs attention",
      note: "Southeast's fire-element association is traditionally considered less compatible with the calm energy needed for a bedroom, sometimes linked to increased tension between occupants.",
      remedy: "A commonly suggested remedy is using cooler, calming colors (blues, greens, soft whites) in this room's decor to offset the fire-element intensity of the direction."
    },
    East: {
      status: "neutral",
      note: "East is generally considered acceptable for a bedroom, associated with fresh starts and vitality.",
      remedy: "No specific correction typically needed."
    },
    North: {
      status: "neutral",
      note: "North is generally considered workable, sometimes associated with prosperity-related dreams and ambitions.",
      remedy: "No specific correction typically needed."
    }
  },

  bathroom: {
    West: {
      status: "favorable",
      note: "West is considered one of the better placements for a bathroom or toilet, associated with proper waste/energy flow.",
      remedy: "No correction needed."
    },
    Northwest: {
      status: "favorable",
      note: "Northwest is also considered a suitable, workable direction for a bathroom.",
      remedy: "No correction needed."
    },
    South: {
      status: "neutral",
      note: "South is generally considered acceptable for a bathroom placement.",
      remedy: "Good ventilation is especially recommended here."
    },
    East: {
      status: "neutral",
      note: "East is workable for a bathroom, though not the traditional first preference.",
      remedy: "Ensure the door can be kept closed when not in use, as is generally advised for any bathroom placement."
    },
    Northeast: {
      status: "needs attention",
      note: "Northeast is one of the most commonly flagged bathroom placements in Vastu, since this spiritually significant direction is considered incompatible with a space tied to waste.",
      remedy: "A frequently suggested remedy is keeping this bathroom impeccably clean, well-ventilated, and the door closed at all times, along with placing a small sea-salt bowl (changed weekly) to help absorb heavier energy."
    },
    Southwest: {
      status: "needs attention",
      note: "Southwest is traditionally considered a difficult placement for a bathroom, potentially undermining the stability associated with this direction.",
      remedy: "A common remedy is ensuring excellent drainage and waterproofing in this specific bathroom, along with keeping the door closed and using brighter lighting."
    },
    Southeast: {
      status: "needs attention",
      note: "Southeast's fire-element association makes it a less traditionally favored bathroom location.",
      remedy: "A commonly suggested remedy is adding a small plant (real or artificial) inside or just outside the bathroom to soften the elemental mismatch."
    },
    North: {
      status: "neutral",
      note: "North is generally considered workable for a bathroom.",
      remedy: "No specific correction typically needed."
    }
  }
}
