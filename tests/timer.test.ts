import * as Timer from "../src/timer";
import { expect } from 'chai'

describe('timer', function() {
    describe('targetPiece', function() {
      it('should return a string', function() {
        var timer: Timer.timer = new Timer.timer(10)
        expect(timer.getTargetPiece()).to.be.a('string');
      });
    });
    describe('skillsPiece', function(){
      it('Should return a string', function(){
        var timer: Timer.timer = new Timer.timer(10)
        expect(timer.getSkillPiece()).to.be.a('string');
      });
    });
    describe('display', function() {
      it('should return a string of timer data', function(){
        var timer: Timer.timer = new Timer.timer(10);
        expect(timer.display()).to.be.a('string');
        expect(timer.display()).to.equal('Duration: 10<br>Target Piece Time: 5<br>Skills Piece Time: 5<br>Skills Count: 1');
      });
    });
    describe('timer', function(){
      it('Given odd numbers, should have an appropriate duration and count', function(){
        var timer: Timer.timer = new Timer.timer(9);
        expect(timer.skillsCount).to.equal(1);
        expect(timer.targetTime).to.equal(4);
      });
    });
    describe('useSkill', function(){
      var timer: Timer.timer = new Timer.timer(10);
      var piece = timer.getSkillPiece();
      timer.useSkill(piece);
      expect(timer.usedSkills.length).to.equal(1);
    })
});