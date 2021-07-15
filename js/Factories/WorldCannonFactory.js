

export class WorldCannonFactory{
    static TYPE_GROUND = "groundMaterial"
    static TYPE_SLIPPERY = "slipperyMaterial"

    constructor(split = true, type = WorldCannonFactory.TYPE_GROUND){
        this.world = new CANNON.World();
        this.world.quatNormalizeSkip = 0;
        this.world.quatNormalizeFast = false;

        var solver = new CANNON.GSSolver();
        solver.iterations = 7;
        solver.tolerance = 0.1;
        if(split)
            this.world.solver = new CANNON.SplitSolver(solver);
        else
            this.world.solver = solver;

        this.world.gravity.set(0, 0, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        switch (type){
            case WorldCannonFactory.TYPE_SLIPPERY:
                var physicsMaterial = new CANNON.Material(WorldCannonFactory.TYPE_SLIPPERY);
                var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
                    friction: 0.0,
                    restitution: 0.0,
                    contactEquationStiffness: 1e9,
                    contactEquationRelaxation: 4,
                    frictionEquationStiffness: 1e9,
                    frictionEquationRegularizationTime: 4,
                });
                this.world.addContactMaterial(physicsContactMaterial);
                break;
            
            case WorldCannonFactory.TYPE_GROUND:
            default:
                var groundMaterial = new CANNON.Material(WorldCannonFactory.TYPE_GROUND);
                var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
                    friction: 0.0,
                    restitution: 0.0,
                    contactEquationStiffness: 1e8,
                    contactEquationRelaxation: 3,
                    frictionEquationStiffness: 1e8,
                    frictionEquationRegularizationTime: 3,
                });
                this.world.addContactMaterial(ground_ground_cm);
                break;
        }

        return this.world;
    }
}