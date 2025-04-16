import mongoose from 'mongoose';
import User from '../User';

describe('User Model', () => {
  it('should require name, email, and password', async () => {
    const user = new User();
    let err;
    try {
      await user.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect((err as any).errors.name).toBeDefined();
    expect((err as any).errors.email).toBeDefined();
    expect((err as any).errors.password).toBeDefined();
  });
}); 