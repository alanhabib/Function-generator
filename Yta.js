async function main() {
  function* getPromises() {
    yield Promise.reject(new Error("fail"));
    yield Promise.resolve(1);
    yield Promise.reject(new Error("fail 2"));
    yield Promise.resolve(2);
    yield Promise.resolve(3);
  }

  function anyNPromises(nrOfPromises, promises) {
    let results = [];
    let errors = [];
    let amountResolved = 0;

    for (let promise of promises) {
      promise
        .then((result) => {
          if (results.length < nrOfPromises) {
            results.push(result);
            amountResolved++;
          }
        })
        .catch((e) => errors.push(e));
    }

    return Promise.allSettled(promises).then((settledPromises) => {
      if (amountResolved >= nrOfPromises) {
        return results;
      } else {
        return new AggregateError(errors);
      }
    });
  }

  const result = await anyNPromises(4, getPromises()); // result is now [1, 2]. Other combinations or 1, 2 and 3 would also be valid

  console.log(result);
}

main();
