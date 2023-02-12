
export class timer {
    duration: number;
    targetTime: number;
    skillsTime: number;
    skillsCount: number;
    usedSkills: Array<number>;
    target: boolean;
    targetPiece: Array<string>;
    skillPiece: Array<string>;

    constructor(duration: number, skillsTime: number = 5) {
        this.duration = duration;
        this.skillsTime = skillsTime;
        this.skillsCount = Math.ceil((duration/2) / this.skillsTime);
        this.targetTime = duration - (this.skillsCount*this.skillsTime);
        this.usedSkills = new Array();
        this.target = false;
        this.targetPiece = ['Seitz No. 3','Seitz No. 5','Concerto in G minor'];
        this.skillPiece = ['Arpeggios','Vibrato','scales'];
    };
    display(): string {
        var res : string = "Duration: " + this.duration.toString() + "<br>" +
        "Target Piece Time: " + this.targetTime.toString() +  "<br>" +
        "Skills Piece Time: " + this.skillsTime.toString() +  "<br>" +
        "Skills Count: " + this.skillsCount.toString();
        console.log(res);
        return res;
    };
    useSkill(piece: string): void{
        var index: number = this.skillPiece.indexOf(piece);
        this.usedSkills.push(index);
    };
    getTargetPiece() : string {
        var piece = this.targetPiece[Math.floor(Math.random()*this.targetPiece.length)];
        return piece;
    };
    getSkillPiece() : string{
        var piece = this.skillPiece[Math.floor(Math.random()*this.skillPiece.length)];
        return piece;
    };
};




