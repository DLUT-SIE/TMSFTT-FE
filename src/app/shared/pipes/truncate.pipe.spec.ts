import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should not truncate if no length provided', () => {
    const pipe = new TruncatePipe();

    const value = pipe.transform('abccc');

    expect(value).toEqual('abccc');
  });

  it('should return value if value is null', () => {
    const pipe = new TruncatePipe();

    const value = pipe.transform(null);

    expect(value).toBeNull();
  });

  it('should not truncate if length does not exceed', () => {
    const pipe = new TruncatePipe();

    const value = pipe.transform('abccc', 5);

    expect(value).toEqual('abccc');
  });

  it('should truncate if length exceeds', () => {
    const pipe = new TruncatePipe();

    const value = pipe.transform('abccc', 2);

    expect(value).toEqual('ab..');
  });

});
