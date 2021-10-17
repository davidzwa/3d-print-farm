function getExpectExtensions() {
  return {
    toHaveErrors(received, keys) {
      expect(received.errors).toMatchObject(keys);

      return {
        pass: true
      };
    }
  };
}

function expectEmptyResponse(response) {
  expect(response.statusCode).toEqual(204);
  expect(response.body).toBeFalsy();
}

function expectOkResponse(response, matchedBody) {
  expect(response.statusCode).toEqual(200);
  if (!matchedBody) {
    return;
  }

  expect(response.body).toMatchObject(matchedBody);

  return response.body;
}

function expectValidationError(object, keys, exact = false) {
  const objectErrors = Object.keys(object.errors);
  if (!exact) {
    keys.forEach((key) => expect(objectErrors).toContain(key));
  } else {
    expect(keys).toMatchObject(objectErrors);
  }
}

function expectRedirectResponse(response) {
  expect(response.statusCode).toEqual(302);
}

function expectInvalidResponse(response, keys, exact = false) {
  expect(response.statusCode).toEqual(400);

  if (!keys) return;

  expectValidationError(response.body, keys, exact);
}

module.exports = {
  expectEmptyResponse,
  expectRedirectResponse,
  expectOkResponse,
  expectValidationError,
  expectInvalidResponse,
  getExpectExtensions
};
