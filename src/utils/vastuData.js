export const VASTU_RULES = {
  door: {
    N:  { status: 'favorable',       remedy: 'Keep the entrance well-lit with warm light and place a small potted plant near the door. A brass or copper nameplate reinforces the positive energy here.' },
    NE: { status: 'favorable',       remedy: 'The most auspicious entry direction. Keep the area clean and clutter-free; a small crystal or deity figure just inside amplifies the energy beautifully.' },
    E:  { status: 'favorable',       remedy: 'An excellent direction for the main entrance. A copper sun motif above the door and a clean, welcoming threshold enhance the energy here.' },
    SE: { status: 'needs attention', remedy: 'Hang a five-rod wind chime just inside the entrance and keep the entryway very well-lit. Placing a small mirror on the north interior wall helps redirect the energy.' },
    S:  { status: 'needs attention', remedy: 'Affix a brass Swastik or Om symbol on the door, and keep a bright light above the entrance. A copper nameplate at eye level also helps stabilise the directional energy.' },
    SW: { status: 'needs attention', remedy: 'Flank the entrance with two heavy potted plants to add grounding energy. Use a warm terracotta or red welcome mat and avoid leaving the area dim or cluttered.' },
    W:  { status: 'neutral',         remedy: 'Enhance with silver or metallic décor near the entrance and keep it well-ventilated. A small wind chime inside the door supports a smooth flow of energy from this direction.' },
    NW: { status: 'neutral',         remedy: 'Place a small bowl of rock salt near the door and replace it monthly. Keeping the entryway light, uncluttered, and fresh-smelling supports the energy from this direction well.' },
  },
  kitchen: {
    SE: { status: 'favorable',       remedy: 'The ideal kitchen placement. Keep the stove clean and ensure the cook faces east while cooking. Avoid storing water vessels directly next to the flame.' },
    NW: { status: 'favorable',       remedy: 'A good kitchen placement. Position the stove so the cook faces east or south, and keep fire elements away from the north wall.' },
    E:  { status: 'neutral',         remedy: 'A generally acceptable placement. Face east or south while cooking and keep the space well-ventilated and clutter-free.' },
    S:  { status: 'neutral',         remedy: 'Place a yellow cloth or small yellow plant on the counter to balance the fire energy, and ensure the cook faces east.' },
    W:  { status: 'neutral',         remedy: 'A workable placement. Ensure the cook faces east or south, and avoid placing the refrigerator directly south of the stove.' },
    N:  { status: 'neutral',         remedy: 'Keep the stove positioned so the cook faces east or south, and place a green plant near the north wall to support the directional energy.' },
    NE: { status: 'needs attention', remedy: 'Move the stove as close to the SE corner of the kitchen space as possible. Place a bowl of rock salt in the NE corner of the kitchen, replacing it each month.' },
    SW: { status: 'needs attention', remedy: 'Keep the kitchen very clean, especially under the sink. Place a bright yellow item — a cloth, bowl, or plant — in the SE corner to redirect fire energy.' },
  },
  bedroom: {
    SW: { status: 'favorable',       remedy: 'The ideal master bedroom placement. Sleep with your head pointing south or west for restful sleep. Keep the heaviest furniture in the SW corner of the room.' },
    S:  { status: 'favorable',       remedy: 'A good placement for the main bedroom. Sleep with your head pointing south or east, and keep the centre of the room clear of furniture.' },
    W:  { status: 'neutral',         remedy: 'A reasonable bedroom placement. Sleep with your head toward south or west. Avoid positioning the bed directly opposite the bedroom door.' },
    NW: { status: 'neutral',         remedy: 'Keep the room calm and minimise electronic devices. Warm, earthy tones in the décor add a sense of stability to this direction.' },
    N:  { status: 'neutral',         remedy: 'Works well as a secondary bedroom. Sleep with head pointing east; avoid a north-facing head placement in this position.' },
    E:  { status: 'neutral',         remedy: 'A reasonable placement for a secondary bedroom. Sleep with head toward east or south and keep the room airy and uncluttered.' },
    NE: { status: 'needs attention', remedy: 'The NE corner is spiritually active and better suited to a prayer or meditation space than sleep. Place a large, leafy plant here and use soft, earthy tones to calm the energy.' },
    SE: { status: 'needs attention', remedy: 'Place a blue or green item — a painting, rug, or cushion — in the room to moderate the fire-direction energy. Avoid positioning the bed in the SE corner of the room itself.' },
  },
  bathroom: {
    W:  { status: 'favorable',       remedy: 'A well-placed bathroom. Keep the floor dry, drains clear, and add a small potted plant outside the door to reinforce freshness.' },
    NW: { status: 'favorable',       remedy: 'A good bathroom placement. Keep the door closed when not in use, and place a small bowl of rock salt inside, replacing it monthly.' },
    S:  { status: 'neutral',         remedy: 'Keep the bathroom well-ventilated and very clean. A small exhaust fan and a rock salt bowl help manage the directional energy here effectively.' },
    E:  { status: 'neutral',         remedy: 'Maintain good ventilation and keep the door closed. A plant on the windowsill or near the entry freshens the directional energy.' },
    N:  { status: 'neutral',         remedy: 'Keep drains clear and the room well-lit. A bowl of rock salt replaced monthly, and keeping the toilet lid closed, help balance this placement.' },
    SE: { status: 'neutral',         remedy: 'Ensure the door stays closed, add ventilation where possible, and place a rock salt bowl inside. Avoid red tones in the décor here.' },
    NE: { status: 'needs attention', remedy: 'Keep the toilet lid always closed, the door shut, and the room spotlessly clean. Place a small bowl of rock salt in the corner and replace it every month without fail.' },
    SW: { status: 'needs attention', remedy: 'Keep the bathroom extremely clean and ensure the door remains closed when not in use. Hanging a landscape painting with mountains on the outer wall adds grounding energy.' },
  },
}

export const QUESTIONS = [
  { roomKey: 'door',     label: 'Main Door',    question: 'Which direction does your main door face?' },
  { roomKey: 'kitchen',  label: 'Kitchen',      question: 'Which direction is your kitchen from the centre of your home?' },
  { roomKey: 'bedroom',  label: 'Main Bedroom', question: 'Which direction is your main bedroom from the centre of your home?' },
  { roomKey: 'bathroom', label: 'Bathroom',     question: 'Which direction is your main bathroom from the centre of your home?' },
]
