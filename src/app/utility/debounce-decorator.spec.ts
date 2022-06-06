import { debounce } from "./debounce-decorator";

describe("debounce decorator tests", () => {
  const delay = 5;

  describe("single instance tests", () => {
    it("should not call until after timeout", (done) => {
      const obj = new TestDebounce();
      expect(obj.called).toBe(0);
      obj.nuu();
      expect(obj.called).toBe(0);
      setTimeout(() => {
        expect(obj.called).toBe(1);
        done();
      }, delay + 1);
    });

    it("should not call method until after timeout multiple times.", (done) => {
      const obj = new TestDebounce();
      expect(obj.called).toBe(0);
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      expect(obj.called).toBe(0);
      setTimeout(() => {
        expect(obj.called).toBe(1);
        done();
      }, delay + 1);
    });

    it("should keep extending the debounce", (done) => {
      const obj = new TestDebounce();
      expect(obj.called).toBe(0);
      obj.nuu();

      // ....... ^.^
      // A christmas tree written around christmas! 🎄
      setTimeout(() => {
        obj.nuu();
        expect(obj.called).toBe(0);
        setTimeout(() => {
          obj.nuu();
          expect(obj.called).toBe(0);
          setTimeout(() => {
            obj.nuu();
            expect(obj.called).toBe(0);
            setTimeout(() => {
              obj.nuu();
              expect(obj.called).toBe(0);
              setTimeout(() => {
                expect(obj.called).toBe(1);
                done();
              }, delay + 1);
            }, 2);
          }, 2);
        }, 2);
      }, 2);
    });

    it("should call multiple times", (done) => {
      const obj = new TestDebounce();
      const next = delay + 1;
      const expected: number[] = [0, 1, 1, 1, 1, 2];
      const timers: number[] = [0, next, 2, 2, 2, next];
      let test: number = 0;

      callDebounce();

      function callDebounce(): void {
        if (test >= expected.length) {
          expect(obj.called).toBe(2);
          done();
          return;
        }

        setTimeout(() => {
          obj.nuu();
          obj.nuu();
          expect(obj.called).toBe(expected[test]);
          test++;
          callDebounce();
        }, timers[test]);
      }
    });
  });

  describe("multiple instances tests", () => {
    it("should not call until after timeout", (done) => {
      const objects = [new TestDebounce(), new TestDebounce(), new TestDebounce()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
        expect(obj.called).toBe(0);
      }
      setTimeout(() => {
        for (const obj of objects) {
          expect(obj.called).toBe(1);
        }
        done();
      }, delay + 1);
    });

    it("should not call method until after timeout multiple times.", (done) => {
      const objects = [new TestDebounce(), new TestDebounce(), new TestDebounce()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        expect(obj.called).toBe(0);
      }
      setTimeout(() => {
        for (const obj of objects) {
          expect(obj.called).toBe(1);
        }
        done();
      }, delay + 1);
    });

    it("should keep extending the debounce", (done) => {
      const objects = [new TestDebounce(), new TestDebounce(), new TestDebounce()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
      }

      // ....... ^.^
      setTimeout(() => {
        for (const obj of objects) {
          expect(obj.called).toBe(0);
          obj.nuu();
        }
        setTimeout(() => {
          for (const obj of objects) {
            expect(obj.called).toBe(0);
            obj.nuu();
          }
          setTimeout(() => {
            for (const obj of objects) {
              expect(obj.called).toBe(0);
              obj.nuu();
            }
            setTimeout(() => {
              for (const obj of objects) {
                expect(obj.called).toBe(0);
                obj.nuu();
              }
              setTimeout(() => {
                for (const obj of objects) {
                  expect(obj.called).toBe(1);
                  obj.nuu();
                }
                done();
              }, delay + 1);
            }, 2);
          }, 2);
        }, 2);
      }, 2);
    });

    it("should call multiple times", (done) => {
      const objects = [new TestDebounce(), new TestDebounce(), new TestDebounce()];
      const next = delay + 1;
      const expected: number[] = [0, 1, 1, 1, 1, 2];
      const timers: number[] = [0, next, 2, 2, 2, next];
      let test: number = 0;

      callDebounce();

      function callDebounce(): void {
        if (test >= expected.length) {
          for (const obj of objects) {
            expect(obj.called).toBe(2);
          }
          done();
          return;
        }

        setTimeout(() => {
          for (const obj of objects) {
            obj.nuu();
            obj.nuu();
            expect(obj.called).toBe(expected[test]);
          }
          test++;
          callDebounce();
        }, timers[test]);
      }
    });
  });

  describe("multiple instances using mocked setTimeout", () => {
    beforeEach(function () {
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it ("should debounce multiple times.", () => {
      const objects = [new TestDebounce(), new TestDebounce(), new TestDebounce()];
      const next = delay + 1;
      const tests = 1000;
      const expected: number[] = [];
      const timers: number[] = [];

      let expectedCalled = 0;

      for (let i = 0; i < tests; i++) {
        if (i % 2 === 1) { expectedCalled++; }

        const interval = i % 2 === 0 ? 1 : next;
        expected.push(expectedCalled);
        timers.push(interval);
      }

      for (let i = 0; i < tests; i++) {
        jasmine.clock().tick(timers[i]);

        for (const obj of objects) {
          obj.nuu();
          obj.nuu();
          expect(obj.called).toBe(expected[i]);
        }
      }
    });
  });

  describe("call stack overflow tests", () => {
    beforeEach(function () {
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it ("tests 1 000 000 methods", () => {
      const obj = new TestDebounce();
      const tests = 1000000;

      for (let i = 0; i < tests; i++) {
        obj.nuu();
        // Trigger the next cycle
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        jasmine.clock().tick(delay + 1);
      }

      expect (obj.called).toBe(tests);
    });
  });

  class TestDebounce {
    called: number = 0;

    @debounce(delay)
    nuu(): void {
      this.called++;
    }
  }
});
