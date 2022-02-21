function key_handler(key, isPressed) {
    console.log(key);
}

let state = 0;
function update(world, dt, t) {
    if(t > 2 && state === 0) {
        console.log("1");
        world.joint_ab.SetMotorSpeed(-2);
        state = 1;
    }
}

function setup() {
    let gravity = new b2Vec2(0, -10);
    let world = new b2World(gravity, true);

    // first servo
    // let up_servo_joint = new b2RevoluteJointDef();
    // let up_servo = createBox(world, 0, 0, 5, 1, {type : b2Body.b2_staticBody});

    let a = createBox(world, 0, 0, 5, 1, {type : b2Body.b2_staticBody});
    let b = createBox(world, 6, 6, 5, 1);

    let joint_def = new b2RevoluteJointDef();
    joint_def.bodyA = a;
    joint_def.bodyB = b;
    joint_def.localAnchorA = new b2Vec2(0, 0);
    joint_def.localAnchorB = new b2Vec2(-1, 0);
    world.joint_ab = world.CreateJoint(joint_def);
    world.joint_ab.EnableMotor(true);
    world.joint_ab.SetMotorSpeed(1);
    world.joint_ab.SetMaxMotorTorque(100);

    return world;
}
