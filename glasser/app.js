function key_handler(key, isPressed) {
    console.log(key);
}

let state = 0;
function update(world, dt, t) {
    if(t > 0 && state === 0) {
        // console.log("1");
        // world.joint_ab.SetMotorSpeed(-2);
        // world.aux_servo_joint.EnableMotor(false);
        // world.main_servo_joint.EnableMotor(false);
        state = 1;
    }
}

const PRIMARY_LEVER = cm(10);
const THICKNESS = cm(0.5);
const SERVO_SIZE = cm(2);

const AUX_SERVO_LEVER = cm(3);
const SERVO_DISTANCE = cm(5);

const AUX_ROD = cm(14);

const SECONDARY_LEVER = cm(10);
const SECONDARY_LEVER_OFFSET = cm(0);

const SECONDARY_ROD = cm(5);
const SECONDARY_BOTTOM_INTERVAL = cm(5.5);
const SECONDARY_TOP_INTERVAL = cm(5);

const PLATFORM = cm(10);

function setup() {
    let gravity = new b2Vec2(0, -0);
    let world = new b2World(gravity, true);

    let primary_lever = createBox(world, 0, 0, THICKNESS, PRIMARY_LEVER);

    // main servo
    {
        let joint_def = new b2RevoluteJointDef();

        let servo = createBox(world, 0, 0, SERVO_SIZE, SERVO_SIZE, {type : b2Body.b2_staticBody});
        joint_def.bodyA = servo;
        joint_def.localAnchorA = new b2Vec2(0, 0);

        joint_def.bodyB = primary_lever;
        joint_def.localAnchorB = new b2Vec2(0, -PRIMARY_LEVER/2 + THICKNESS/2);

        world.main_servo_joint = world.CreateJoint(joint_def);
        /*world.main_servo_joint.EnableMotor(true);
        world.main_servo_joint.SetMotorSpeed(0);
        world.main_servo_joint.SetMaxMotorTorque(1);*/
    }

    let aux_servo_lever = createBox(world, 0, 0, THICKNESS, AUX_SERVO_LEVER);

    // aux servo
    {
        let joint_def = new b2RevoluteJointDef();

        let servo = createBox(world, 0, -SERVO_DISTANCE, SERVO_SIZE, SERVO_SIZE, {type : b2Body.b2_staticBody});
        joint_def.bodyA = servo;
        joint_def.localAnchorA = new b2Vec2(0, 0);
        
        joint_def.bodyB = aux_servo_lever;
        joint_def.localAnchorB = new b2Vec2(0, -AUX_SERVO_LEVER/2 + THICKNESS/2);

        world.aux_servo_joint = world.CreateJoint(joint_def);
        world.aux_servo_joint.EnableMotor(false);
        world.aux_servo_joint.SetMotorSpeed(1);
        world.aux_servo_joint.SetMaxMotorTorque(1);
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
        joint_def.localAnchorA = new b2Vec2(0, -SECONDARY_LEVER/2 + THICKNESS/2);
        
        joint_def.bodyB = aux_rod;
        joint_def.localAnchorB = new b2Vec2(0, +AUX_ROD/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = secondary_lever;
        joint_def.localAnchorA = new b2Vec2(0, SECONDARY_LEVER_OFFSET);
        
        joint_def.bodyB = primary_lever;
        joint_def.localAnchorB = new b2Vec2(0, PRIMARY_LEVER/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    let platform = createBox(world, 0, 0, THICKNESS, PLATFORM);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = platform;
        joint_def.localAnchorA = new b2Vec2(0, SECONDARY_TOP_INTERVAL/2);
        
        joint_def.bodyB = secondary_lever;
        joint_def.localAnchorB = new b2Vec2(0, SECONDARY_LEVER/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }

    let secondary_rod = createBox(world, 0, 0, THICKNESS, SECONDARY_ROD);
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = platform;
        joint_def.localAnchorA = new b2Vec2(0, -SECONDARY_TOP_INTERVAL/2);
        
        joint_def.bodyB = secondary_rod;
        joint_def.localAnchorB = new b2Vec2(0, SECONDARY_ROD/2 - THICKNESS/2);

        world.CreateJoint(joint_def);
    }
    {
        let joint_def = new b2RevoluteJointDef();

        joint_def.bodyA = primary_lever;
        joint_def.localAnchorA = new b2Vec2(0, PRIMARY_LEVER/2 - SECONDARY_BOTTOM_INTERVAL/2);
        
        joint_def.bodyB = secondary_rod;
        joint_def.localAnchorB = new b2Vec2(0, -SECONDARY_ROD/2 + THICKNESS/2);

        world.CreateJoint(joint_def);
    }



    /*world.joint_ab.EnableMotor(true);
    world.joint_ab.SetMotorSpeed(1);
    world.joint_ab.SetMaxMotorTorque(100);*/

    return world;
}
