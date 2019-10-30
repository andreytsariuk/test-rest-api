//Require the dev-dependencies
const chai = require('chai');
const {
  AbstractRoutesController,
  RoleBaseInstructions
} = require('../../datatypes');
const should = chai.should();


module.exports = {
  AbstractRoutesControllerTests
};


/**
 * Main Function
 */
function AbstractRoutesControllerTests() {
  describe('ADMIN',
    () => {
      AbstractRoutesControllerBasic.bind(this)();
      RoleBaseInstructionsBasic.bind(this)();
      AbstractRoutesControllerExec.bind(this)();
      return;
    });
}

function AbstractRoutesControllerBasic() {
  describe('AbstractRoutesController()', function () {
    const abstractRoutesControllerTest = new AbstractRoutesController();
    it('should return a new instance of AbstractRoutesController', function () {
      abstractRoutesControllerTest.should.be.instanceOf(AbstractRoutesController);
    });

    it('instance should has all required methods  ', function () {
      (typeof (abstractRoutesControllerTest.list)).should.equals('function');
      (typeof (abstractRoutesControllerTest.post)).should.equals('function');
      (typeof (abstractRoutesControllerTest.get)).should.equals('function');
      (typeof (abstractRoutesControllerTest.put)).should.equals('function');
      (typeof (abstractRoutesControllerTest.delete)).should.equals('function');
    });

    it('instance should has constants property and it must match constants.js file', function () {
      abstractRoutesControllerTest.constants.should.instanceOf(Object);
      abstractRoutesControllerTest.constants.should.equals(require('../../constants'));
    });

    it('instance should has RoleBaseInstructions', function () {
      abstractRoutesControllerTest.instructions.should.instanceOf(Object);
      abstractRoutesControllerTest.instructions.should.instanceOf(RoleBaseInstructions);
    });

  });
}



function RoleBaseInstructionsBasic() {
  describe('RoleBaseInstructions()', function () {
    const roleBaseInstructionsTest = new RoleBaseInstructions();
    it('should return a new instance of RoleBaseInstructions', function () {

      roleBaseInstructionsTest.should.be.instanceOf(RoleBaseInstructions);
    });

    it('instance should has all required methods  ', function () {
      (typeof (roleBaseInstructionsTest.add)).should.equals('function');
      (typeof (roleBaseInstructionsTest.exec)).should.equals('function');
    });

    it('instance should has __privateInstructionsMap', function () {
      roleBaseInstructionsTest.__privateInstructionsMap.should.instanceOf(Map);
    });



    it('__getCombinations should retuns all combinations', function () {
      const combinations = roleBaseInstructionsTest.__getCombinations(['su', 'admin', 'user']);

      combinations.should.be.instanceOf(Array);
      combinations.length.should.be.equals(7);
    });

    it('methods add with incorrect parameters should return error', function () {
      try {
        roleBaseInstructionsTest.add('test', ['su'], () => 'test_passed');
      } catch (error) {
        error.message.should.be.equals('No any type of instructions has been provided for RolesSwitcher!');
      }
    });


    it('methods add and exec should works', function () {
      roleBaseInstructionsTest.add('test', {
        and: ['su']
      }, () => 'test_passed');
      const execFunction = roleBaseInstructionsTest.exec('test', ['su']);
      (typeof (execFunction)).should.equals('function');
      const test_result = execFunction();
      test_result.should.be.equals('test_passed');
    });

  });
}



function AbstractRoutesControllerExec() {

  describe('AbstractRoutesController.exec()', function () {
    const abstractRoutesControllerTest = new AbstractRoutesController();
    //mocked Data
    let req = {
      user: {
        roles_names: ['admin', 'su']
      }
    };
    const res = {};
    const next = () => {};

    it('should return an error about call each function', function () {
      try {
        abstractRoutesControllerTest.list(req, res, next);
      } catch (error) {
        error.message.should.be.equals('needs_permission');
      }

      try {
        abstractRoutesControllerTest.get(req, res, next);
      } catch (error) {
        error.message.should.be.equals('needs_permission');
      }
      try {
        abstractRoutesControllerTest.post(req, res, next);
      } catch (error) {
        error.message.should.be.equals('needs_permission');
      }
      try {
        abstractRoutesControllerTest.put(req, res, next);
      } catch (error) {
        error.message.should.be.equals('needs_permission');
      }
      try {
        abstractRoutesControllerTest.delete(req, res, next);
      } catch (error) {
        error.message.should.be.equals('needs_permission');
      }
    });

    it('formatResponse should convert under_score to camelCase', function () {
      const response = {};
      const first_key = 'first_key';
      const second_key = 'second_key';
      const firstKey = 'firstKey';
      const secondKey = 'secondKey';


      response[first_key] = 'first_key';
      response[second_key] = 'second_key';

      const formattedResponse = abstractRoutesControllerTest.formatResponse(response);
      (typeof (formattedResponse[first_key])).should.be.equals('undefined');
      (typeof (formattedResponse[second_key])).should.be.equals('undefined');

      formattedResponse[firstKey].should.be.equals(first_key);
      formattedResponse[secondKey].should.be.equals(second_key);
    });

    it('formatResponse should convert numbers to Number/Float type', function () {
      const response = {};
      const first_key = 'first_key';
      const second_key = 'second_key';
      const third_key = 'third_key';

      const firstKey = '10.01';
      const secondKey = '200';
      const thirdKey = '200.1231.1231';


      response[first_key] = firstKey;
      response[second_key] = secondKey;
      response[third_key] = thirdKey;

      const formattedResponse = abstractRoutesControllerTest.formatResponse(response);
      (typeof (formattedResponse[first_key])).should.be.equals('undefined');
      (typeof (formattedResponse[second_key])).should.be.equals('undefined');

      formattedResponse['firstKey'].should.be.a('number');
      formattedResponse['secondKey'].should.be.a('number');
      formattedResponse['thirdKey'].should.be.a('string');
    });

  });

}