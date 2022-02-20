const colors = {
    background_gray: 0x666650,
    light_yellow: 0xF5F592,
    gray: 0x393938,
    dark_gray: 0x292905,
    black: 0x000000,
    white: 0xFFFFFF,
};

const RED_STYLE_H1 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 56,
  fill: "#ff3b94",
  stroke: '#55ffe1',
  strokeThickness: 1,
  dropShadow: true,
  dropShadowColor: "#af3dff",
  dropShadowBlur: 15,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

const DIALOG_STYLE_ANSWER = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 50,
    fill: PIXI.utils.hex2string(colors.white),
    strokeThickness: 1
});

let DIALOG_STYLE_MAIN = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 30,
    fill: PIXI.utils.hex2string(colors.white),
    strokeThickness: 1,
    wordWrap: true,
    wordWrapWidth: 1000,
});

let DIALOG_STYLE_H1 = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 50,
    fill: "#4E4A36",
    stroke: PIXI.utils.hex2string(colors.gray),
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: PIXI.utils.hex2string(colors.light_yellow),
    dropShadowBlur: 15,
    dropShadowAngle: Math.PI / 7,
    dropShadowDistance: 3,
});

const my_fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main(void)
{
   gl_FragColor = vTextureCoord.x > 0.
       ? texture2D(uSampler, vTextureCoord)
       : vec4(1., 0., 0., 1.);
}
`;

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function set_anchor(self, value) {
    self.pivot.x = value * self.width / self.scale.x;
    self.pivot.y = value * self.height / self.scale.y;
}

function add_answer(self, label) {
    //  добавляем вариант ответа
    let text = new PIXI.Text(label, DIALOG_STYLE_ANSWER.clone());
    text.anchor.set(0.5);

    self.text_bounds = text.getBounds();

    const PADDING = 2;

    // рамка для текста ответа
    let cursor = new PIXI.Graphics()
        .beginFill(colors.white)
        .drawRect(
            -PADDING, -PADDING,
            self.text_bounds.width + PADDING * 2, self.text_bounds.height + PADDING * 2
        )
        .endFill();
    set_anchor(cursor, 0.5);
    self.addChild(cursor);
    self.cursor = cursor;

    self.addChild(text);
    self.text = text;
}