const SPEED = 0.2;

function key_handler(key, isPressed) {
    // console.log(key);

    if(!isPressed) {
        if(key === "q" || key === "w") {
            // stop main servo
            world.main_servo.SetMotorSpeed(0);
        } else if(key === "o" || key === "p") {
            // stop aux servo
            world.aux_servo.SetMotorSpeed(0);
        }
    } else {
        if(key === "q") {
            world.main_servo.SetMotorSpeed(SPEED);
        } else if(key === "w") {
            world.main_servo.SetMotorSpeed(-SPEED);
        } else if(key === "o") {
            world.aux_servo.SetMotorSpeed(SPEED);
        } else if(key === "p") {
            world.aux_servo.SetMotorSpeed(-SPEED);
        }
    }

    if(key === " ") {
        console.log(world.platform.GetPosition(), world.platform.GetAngle());
    }
}

let state = 0;
function update(world, dt, t) {
    if(t > 1 && state === 0) {
        world.platform.SetType(b2Body.b2_dynamicBody);

        world.main_servo.EnableMotor(true);
        world.aux_servo.EnableMotor(true);

        // console.log("1");
        // world.joint_ab.SetMotorSpeed(-2);
        // world.aux_servo_joint.EnableMotor(false);
        // world.main_servo_joint.EnableMotor(false);
        state = 1;
    }
}

const Y_OFFSET = -cm(10);

const PRIMARY_LEVER = cm(10);
const THICKNESS = cm(0.5);
const SERVO_SIZE = cm(2);

const AUX_SERVO_LEVER = cm(3);
const SERVO_DISTANCE = cm(-5);

const AUX_ROD = cm(10);
const AUX_ROD_MOUNT = cm(2);

const SECONDARY_LEVER = cm(13);

const SECONDARY_ROD = cm(11);
const SECONDARY_BOTTOM_INTERVAL = cm(6);
const SECONDARY_TOP_INTERVAL = cm(5);

const PLATFORM = cm(10);
const PLATFORM_X = 0.0625;
const PLATFORM_Y = 0.075 + Y_OFFSET;
const PLATFORM_A = -11;

const TAP_POS = [cm(5), cm(8)];
const TAP = [cm(1), cm(3)];

const GLASS = [cm(3), cm(6)];

function setup() {
    let gravity = new b2Vec2(0, -1);
    let world = new b2World(gravity, true);

    let tap = createBox(world, TAP_POS[0], TAP_POS[1], TAP[0], TAP[1], {type : b2Body.b2_staticBody});

    let glass = createBox(world, PLATFORM_X, PLATFORM_Y + GLASS[1], GLASS[0], GLASS[1], {collision: true});

    let platform = createBox(world, PLATFORM_X, PLATFORM_Y, THICKNESS, PLATFORM, {type : b2Body.b2_staticBody, collision: true});
    platform.SetAngle(PLATFORM_A);

    let primary_lever = createBox(world, 0, 0, THICKNESS, PRIMARY_LEVER);
    primary_lever.SetAngle(-Math.PI/2);

    // main servo
    {
        let joint_def = new b2RevoluteJointDef();

        let servo = createBox(world, 0, Y_OFFSET, SERVO_SIZE, SERVO_SIZE, {type : b2Body.b2_staticBody});
        joint_def.bodyA = servo;
        joint_def.localAnchorA = new b2Vec2(0, 0);

        joint_def.bodyB = primary_lever;
        joint_def.localAnchorB = new b2Vec2(0, -PRIMARY_LEVER/2 + THICKNESS/2);

        world.main_servo = world.CreateJoint(joint_def);

        world.main_servo.SetMotorSpeed(0);
        world.main_servo.SetMaxMotorTorque(1000);
    }

    let aux_servo_lever = createBox(world, 0, 0, THICKNESS, AUX_SERVO_LEVER);

    // aux servo
    {
        let joint_def = new b2RevoluteJointDef();

        let servo = createBox(world, 0, -SERVO_DISTANCE + Y_OFFSET, SERVO_SIZE, SERVO_SIZE, {type : b2Body.b2_staticBody});
        joint_def.bodyA = servo;
        joint_def.localAnchorA = new b2Vec2(0, 0);
        
        joint_def.bodyB = aux_servo_lever;
        joint_def.localAnchorB = new b2Vec2(0, -AUX_SERVO_LEVER/2 + THICKNESS/2);

        world.aux_servo = world.CreateJoint(joint_def);
        
        world.aux_servo.SetMotorSpeed(0);
        world.aux_servo.SetMaxMotorTorque(1000);
    }

    // aux rod
    let aux_rod = createBox(world, 0, 0, THICKNESS, AUX_ROD);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = aux_servo_lever;
        joint_def.localAnchorA = new b2Vec2(0, AUX_SERVO_LEVER/2 - THICKNESS/2);
        
        joint_def.bodyB = aux_rod;
        joint_def.localAnchorB = new b2Vec2(0, -AUX_ROD/2 + THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    // secondary lever
    let secondary_lever = createBox(world, 0, 0, THICKNESS, SECONDARY_LEVER);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = secondary_lever;
        joint_def.localAnchorA = new b2Vec2(0, AUX_ROD_MOUNT);
        
        joint_def.bodyB = aux_rod;
        joint_def.localAnchorB = new b2Vec2(0, +AUX_ROD/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = secondary_lever;
        joint_def.localAnchorA = new b2Vec2(0, -SECONDARY_LEVER/2 + THICKNESS/2);
        
        joint_def.bodyB = primary_lever;
        joint_def.localAnchorB = new b2Vec2(0, PRIMARY_LEVER/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = platform;
        joint_def.localAnchorA = new b2Vec2(0, -SECONDARY_TOP_INTERVAL/2);
        
        joint_def.bodyB = secondary_lever;
        joint_def.localAnchorB = new b2Vec2(0, SECONDARY_LEVER/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    let secondary_rod = createBox(world, 0, 0, THICKNESS, SECONDARY_ROD);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = platform;
        joint_def.localAnchorA = new b2Vec2(0, SECONDARY_TOP_INTERVAL/2);
        
        joint_def.bodyB = secondary_rod;
        joint_def.localAnchorB = new b2Vec2(0, SECONDARY_ROD/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = primary_lever;
        joint_def.localAnchorA = new b2Vec2(0, -PRIMARY_LEVER/2 + SECONDARY_BOTTOM_INTERVAL);
        
        joint_def.bodyB = secondary_rod;
        joint_def.localAnchorB = new b2Vec2(0, -SECONDARY_ROD/2 + THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    const bridge_size = (SECONDARY_BOTTOM_INTERVAL + SECONDARY_TOP_INTERVAL)/2;
    let secondary_bridge = createBox(world, 0, 0, THICKNESS, bridge_size);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = secondary_bridge;
        joint_def.localAnchorA = new b2Vec2(0, -bridge_size/2 + THICKNESS);
        
        joint_def.bodyB = secondary_rod;
        joint_def.localAnchorB = new b2Vec2(0, 0);

        world.CreateJoint(joint_def);
    }
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = secondary_bridge;
        joint_def.localAnchorA = new b2Vec2(0, bridge_size/2 - THICKNESS);
        
        joint_def.bodyB = secondary_lever;
        joint_def.localAnchorB = new b2Vec2(0, 0);

        world.CreateJoint(joint_def);
    }

    world.platform = platform;

    return world;
}
