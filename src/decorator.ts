export const errorDecorator = (fn: Function) => {
  return function (...args: any[]) {
    try {
      return fn(...args);
    } catch {
      console.log("Lox message");
    }
  };
};

let testFn = () => {
  let random = Math.random();
  if (random > 0.5) {
    throw new Error();
  } else {
    console.log("Vse norm");
  }
};

testFn = errorDecorator(testFn);

export { testFn };
