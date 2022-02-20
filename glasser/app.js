function key_handler(keyCode, isPressed) {

}

function update(dt, t) {

}

function app(pixi) {
    let scene = new PIXI.Container();
    pixi.stage = scene;
    scene.interactive = true;
    scene.cursor = 'pointer';

    let background = new PIXI.Graphics()
        .beginFill(0x444444)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

    scene.addChild(background);

    let message = new PIXI.Text("pivo robot example", DIALOG_STYLE_ANSWER);
    message.anchor.set(0.5);
    message.position.set(pixi.screen.width/2, pixi.screen.height/2);
    scene.addChild(message);

    // create World
    const world = scene.addChild(new PIXI.box2d.WorldContainer({
        listenPreSolve: false,
        listenPostSolve: false,
        listenBeginContact: false,
        listenEndContact: true,
        ticker: pixi.ticker
    }));

    // create component
    const a = world.addBox2d(PIXI.box2d.Circle.from(new PIXI.Graphics().beginFill(0xFF0000).drawCircle(100, 0, 20), {
        density: 0.1,
        restitution: 0.1,
        categoryBits: 2
    }));
    a.setX(120);

    const baseHeight = 100;
    const base = world.addBox2d(PIXI.box2d.Rectangle.from(new PIXI.Graphics().beginFill(0x0000FF).drawRect(0, 0, 450 / 2, baseHeight), { isStatic: true }));
    base.setX(450 / 2 - base.width / 2);
    base.setY(800 - baseHeight - 100);

    window.addEventListener(
        "keydown",
        (event) => {
            key_handler(event.keyCode, true);
            if( event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 /*event.keyCode !== 116 && event.keyCode !== 122 && event.keyCode !== 123*/) {
                event.preventDefault();
            }
        },
        false
    );

    window.addEventListener(
        "keyup",
        (event) => {
            key_handler(event.keyCode, false);
            event.preventDefault();
        },
        false
    );

    pixi.ticker.add(delta => update(delta, performance.now()));
}