const b2Vec2 = Box2D.Common.Math.b2Vec2;
const b2AABB = Box2D.Collision.b2AABB;
const b2BodyDef = Box2D.Dynamics.b2BodyDef;
const b2Body = Box2D.Dynamics.b2Body;
const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
const b2Fixture = Box2D.Dynamics.b2Fixture;
const b2World = Box2D.Dynamics.b2World;
const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
const b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
const b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef;
const b2Shape = Box2D.Collision.Shapes.b2Shape;

//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options) {
     //default setting
    options = {
        'density' : 1.0 ,
        'friction' : 1.0 ,
        'restitution' : 0.5 ,
        'type' : b2Body.b2_dynamicBody,
        ...options
    };
      
    let body_def = new b2BodyDef();
    let fix_def = new b2FixtureDef();
    
    fix_def.density = options.density;
    fix_def.friction = options.friction;
    fix_def.restitution = options.restitution;
    
    fix_def.shape = new b2PolygonShape();
        
    fix_def.shape.SetAsBox( width/2 , height/2 );
    
    body_def.position.Set(x , y);
    body_def.linearDamping = 0.5;
    body_def.angularDamping = 0.5;
    
    body_def.type = options.type;
    body_def.userData = options.user_data;
    
    let b = world.CreateBody( body_def );
    let f = b.CreateFixture(fix_def);
    
    return b;
}