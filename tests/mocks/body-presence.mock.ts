let isPresent = true;

const setPresent = (should: boolean) => {
  isPresent = should;
};

class BodyPresenceSensor {
  start() {}

  stop() {}

  present = isPresent;
}

export { setPresent, BodyPresenceSensor };
