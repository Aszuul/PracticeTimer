import * as User from '../src/models/user';
import { expect } from 'chai';
import { describe } from 'mocha'

describe('user', function(){
    it('should create a user', function() {
        var user: User.user = new User.user('TestUser');
        expect(user.username).to.eq('testuser');
    });
});
// getUser() and newUser() need to be tested via API tests