import { throttle } from "./throttle-decorator";

describe("throttle decorator tests", () => {
  describe("one instance tests", () => {

    it("should call method instantly", () => {
      const obj = new TestObject();
      expect(obj.called).toBe(0);
      obj.nuu();
      expect(obj.called).toBe(1);
    });

    it ("Should only call method once due to throttle", () => {
      const obj = new TestObject();
      expect(obj.called).toBe(0);
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      obj.nuu();
      expect(obj.called).toBe(1);
    });

    it ("Should only call method once instantly and then later", (done) => {
      const obj = new TestObject();
      expect(obj.called).toBe(0);
      obj.nuu();
      obj.nuu();
      expect(obj.called).toBe(1);

      setTimeout(() => {
        expect(obj.called).toBe(2);
        done();
      }, 3);
    });

    it ("Should call instantly and consecutively 5 times later", (done) => {
      const obj = new TestObject();
      let events = 0;

      let expectedCalls: number[] = [1, 3, 5, 7, 9];
      // let intervals: number[] = [10, 10, 10, 10];

      expect(obj.called).toBe(0);
      const start = performance.now();
      repeatedTest();

      function repeatedTest(): void {
        obj.nuu();
        // Trigger the next cycle
        obj.nuu();

        expect(obj.called).toBe(expectedCalls[events]);
        events++;

        if (events < 5) {
          setTimeout(() => repeatedTest(), 10);
        } else {
          // Probably because of jasmine the setTimeout is unreliable and can give times between 2 and 35 milliseconds difference.
          const callTimeDeltas = obj.callTimes.map((c, index) => {
            const delta = c - (obj.callTimes[index - 1] ?? start);
            return delta;
          });

          for (let i = 1; i < callTimeDeltas.length; i++) {
            expect(callTimeDeltas[i]).toBeGreaterThan(2);
          }
          done();
        }
      }
    });
  });

  describe("three instance tests", () => {
    it("should call method instantly", () => {
      const objects = [new TestObject(), new TestObject(), new TestObject()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
        expect(obj.called).toBe(1);
      }
    });

    it ("Should only call method once due to throttle", () => {
      const objects = [new TestObject(), new TestObject(), new TestObject()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        expect(obj.called).toBe(1);
      }
    });

    it ("Should only call method once instantly and then later", (done) => {
      const objects = [new TestObject(), new TestObject(), new TestObject()];
      for (const obj of objects) {
        expect(obj.called).toBe(0);
        obj.nuu();
        obj.nuu();
        expect(obj.called).toBe(1);
      }

      setTimeout(() => {
        for (const obj of objects) {
          expect(obj.called).toBe(2);
        }
        done();
      }, 3);
    });

    it ("Should call instantly and consecutively 5 times later", (done) => {
      const objects = [new TestObject(), new TestObject(), new TestObject()];
      let events = 0;

      let expectedCalls: number[] = [1, 3, 5, 7, 9];

      for (const obj of objects) {
        expect(obj.called).toBe(0);
      }

      const start = performance.now();
      repeatedTest();

      function repeatedTest(): void {
        for (const obj of objects) {
          obj.nuu();
          // Trigger the next cycle
          obj.nuu();
          expect(obj.called).toBe(expectedCalls[events]);
        }
        events++;

        if (events < 5) {
          setTimeout(() => repeatedTest(), 10);
        } else {

          for (const obj of objects) {
            // Probably because of jasmine the setTimeout is unreliable and can give times between 2 and 35 milliseconds difference.
            const callTimeDeltas = obj.callTimes.map((c, index) => {
              const delta = c - (obj.callTimes[index - 1] ?? start);
              return delta;
            });

            for (let i = 1; i < callTimeDeltas.length; i++) {
              expect(callTimeDeltas[i]).toBeGreaterThanOrEqual(2);
            }
          }

          done();
        }
      }
    });
  });

  describe('Tests with mocked setTimeout', () => {
    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it ("Should call instantly and consecutively many times later", () => {
      const objects = [new TestObject(), new TestObject(), new TestObject()];

      let tests = 1000;
      // 1, 2, 4, 5, 7, 8, 10, 11 ...
      let count = 0;
      let expectedCalls: number[] = [];
      let intervals: number[] = [];
      for (let i = 0; i < tests; i++) {
        if (i === 0) {
          count++;
        } else {
          count += i % 2 === 1 ? 1 : 2;
        }

        expectedCalls.push(count);
        intervals.push(i % 2 === 0 ? 3 : 4);
      }

      for (const obj of objects) {
        expect(obj.called).toBe(0);
      }

      for (let i = 0; i < tests; i++) {
        for (const obj of objects) {
          obj.nuu();
          // Trigger the next cycle
          obj.nuu();
          expect(obj.called).toBe(expectedCalls[i]);
        }

        jasmine.clock().tick(intervals[i]);
      }
    });
  });

  describe('Testing potential recursion limit', () => {
    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it ('Should handle many consecutive method calls', () => {
      const obj = new TestObject();
      let tests = 1000000;

      for (let i = 0; i < tests; i++) {
        obj.nuu();
        // Trigger the next cycle
        obj.nuu();
        obj.nuu();
        obj.nuu();
        obj.nuu();
        jasmine.clock().tick(2);
      }

      expect (obj.called).toBe(tests + 1);
    });
  })

  class TestObject {
    called: number = 0;
    callTimes: DOMHighResTimeStamp[] = [];

    @throttle(2)
    nuu(): void {
      this.called++;
      this.callTimes.push(performance.now());
    }
  }
});
