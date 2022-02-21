function key_handler(keyCode, isPressed) {

}

function update(dt, t) {

}

function setup() {
    let gravity = new b2Vec2(0, -10);
    let world = new b2World(gravity, true);

    let a = createBox(world, 0, 0, 5, 1, {type : b2Body.b2_staticBody});
    let b = createBox(world, 6, 6, 5, 1);

    let joint_def = new b2RevoluteJointDef();
    joint_def.bodyA = a;
    joint_def.bodyB = b;
    joint_def.localAnchorA = new b2Vec2(0, 0);
    joint_def.localAnchorB = new b2Vec2(-1, 0);
    world.CreateJoint(joint_def);

    return world;
}
